/**
 * Core logic for a group-based ELISA plate reader.
 *
 * Framework-agnostic (no React / DOM). The model is deliberately small:
 *
 *  - `PlateGrid`  - the raw OD readings, one number (or null) per well of a
 *    fixed 8 x 12 plate (rows A-H, columns 1-12).
 *  - `Group`      - a user-drawn selection of wells that belong to one
 *    dose-response series, plus the wells to use as its blank, plus which
 *    way the dose axis runs and the concentration values along it.
 *
 * `processGroups` blank-subtracts each group, lays it out as X / replicate
 * points, and adds a few plain-language insights. Exporters turn the result
 * into a GraphPad Prism XY block or a tidy CSV.
 */

export const N_ROWS = 8;
export const N_COLS = 12;
export const ROW_LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;

export type PlateGrid = (number | null)[][]; // [rowIndex][colIndex]

export function emptyGrid(): PlateGrid {
  return Array.from({ length: N_ROWS }, () =>
    Array.from({ length: N_COLS }, (): number | null => null)
  );
}

export function wellKey(row: number, col: number): string {
  return `${ROW_LETTERS[row]}${col + 1}`;
}

export function parseWellKey(key: string): { row: number; col: number } | null {
  const m = /^\s*([A-Ha-h])\s*(\d{1,2})\s*$/.exec(key);
  if (!m) return null;
  const row = ROW_LETTERS.indexOf(m[1].toUpperCase() as (typeof ROW_LETTERS)[number]);
  const col = parseInt(m[2], 10) - 1;
  if (row < 0 || col < 0 || col >= N_COLS) return null;
  return { row, col };
}

export function getWell(grid: PlateGrid, key: string): number | null {
  const p = parseWellKey(key);
  if (!p) return null;
  const v = grid[p.row]?.[p.col];
  return v === undefined || v === null || !Number.isFinite(v) ? null : v;
}

/** All well keys in the rectangle spanned by two corner keys. */
export function cellsInRange(a: string, b: string): string[] {
  const pa = parseWellKey(a);
  const pb = parseWellKey(b);
  if (!pa || !pb) return [];
  const keys: string[] = [];
  for (let r = Math.min(pa.row, pb.row); r <= Math.max(pa.row, pb.row); r++) {
    for (let c = Math.min(pa.col, pb.col); c <= Math.max(pa.col, pb.col); c++) {
      keys.push(wellKey(r, c));
    }
  }
  return keys;
}

/** Parse "B1:E2, A1:A2, H12" into a de-duplicated, ordered list of well keys. */
export function parseRangeSpec(spec: string): string[] {
  const set = new Set<string>();
  for (const part of spec.split(/[,;]+/)) {
    const t = part.trim();
    if (!t) continue;
    const range = t.split(/[:\-]/).map((s) => s.trim());
    if (range.length === 2) {
      for (const k of cellsInRange(range[0], range[1])) set.add(k);
    } else {
      const p = parseWellKey(t);
      if (p) set.add(wellKey(p.row, p.col));
    }
  }
  return orderKeys([...set]);
}

export function orderKeys(keys: string[]): string[] {
  return keys
    .map((k) => parseWellKey(k))
    .filter((p): p is { row: number; col: number } => !!p)
    .sort((a, b) => a.row - b.row || a.col - b.col)
    .map((p) => wellKey(p.row, p.col));
}

/** Compact "B1:E2" if the keys form a full rectangle, otherwise a short list. */
export function rangeSpecFromKeys(keys: string[]): string {
  if (keys.length === 0) return "";
  const pts = keys
    .map((k) => parseWellKey(k))
    .filter((p): p is { row: number; col: number } => !!p);
  const rows = [...new Set(pts.map((p) => p.row))].sort((a, b) => a - b);
  const cols = [...new Set(pts.map((p) => p.col))].sort((a, b) => a - b);
  const isRect =
    pts.length === rows.length * cols.length &&
    rows[rows.length - 1] - rows[0] === rows.length - 1 &&
    cols[cols.length - 1] - cols[0] === cols.length - 1;
  if (isRect) {
    const a = wellKey(rows[0], cols[0]);
    const b = wellKey(rows[rows.length - 1], cols[cols.length - 1]);
    return a === b ? a : `${a}:${b}`;
  }
  const ordered = orderKeys(keys);
  return ordered.length > 8 ? `${ordered.slice(0, 8).join(" ")} +${ordered.length - 8}` : ordered.join(" ");
}

/* --------------------------------------------------------------- OD paste */

/**
 * Parse a pasted block of OD values into an 8 x 12 grid. Accepts tab- or
 * comma-separated text, with or without a leading A-H row-label column and
 * a leading column-number / header row. Non-numeric cells become null.
 */
export function parseODPaste(text: string): { grid: PlateGrid; warnings: string[] } {
  const warnings: string[] = [];
  const rawRows = text
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.split(/\t|,/).map((c) => c.trim()))
    .filter((cells) => cells.some((c) => c !== ""));

  const numericCount = (cells: string[]) =>
    cells.filter((c) => c !== "" && Number.isFinite(Number(c))).length;

  let dataRows = rawRows.filter((cells) => numericCount(cells) >= 6);
  if (dataRows.length < N_ROWS) {
    // fall back to any row with a couple of numbers
    dataRows = rawRows.filter((cells) => numericCount(cells) >= 2);
  }
  if (dataRows.length < N_ROWS) {
    throw new Error(
      `Found ${dataRows.length} rows of numbers; need 8 (A-H). Paste the 8-row x 12-column OD block.`
    );
  }
  if (dataRows.length > N_ROWS) {
    dataRows = dataRows.slice(0, N_ROWS);
    warnings.push("More than 8 numeric rows found - used the first 8.");
  }

  const grid = emptyGrid();
  for (let r = 0; r < N_ROWS; r++) {
    let cells = dataRows[r];
    // drop a leading row-label cell ("A", "A(Blank Row)", ...)
    if (cells.length > N_COLS && !Number.isFinite(Number(cells[0]))) cells = cells.slice(1);
    // otherwise take the last 12 numeric-ish cells
    if (cells.length > N_COLS) cells = cells.slice(-N_COLS);
    for (let c = 0; c < N_COLS; c++) {
      const n = Number(cells[c]);
      grid[r][c] = cells[c] !== undefined && cells[c] !== "" && Number.isFinite(n) ? n : null;
    }
  }
  return { grid, warnings };
}

/* ------------------------------------------------------------------ groups */

export interface Group {
  id: string;
  name: string;
  wells: string[];
  blankWells: string[];
  /** Individual wells kept in the group but dropped from its averages. */
  excludedWells: string[];
  /** Which way the dose axis runs across the selection. */
  axis: "rows" | "cols";
  /** Concentrations along the dose axis. Falls back to 1..n where missing. */
  xValues: number[];
  xLabel: string;
}

export function newGroup(partial: Partial<Group> = {}): Group {
  return {
    id: Math.random().toString(36).slice(2, 9),
    name: "Group",
    wells: [],
    blankWells: [],
    excludedWells: [],
    axis: "rows",
    xValues: [],
    xLabel: "Concentration",
    ...partial,
  };
}

export interface GroupPoint {
  x: number;
  xIsFallback: boolean;
  /** replicate wells at this X, in column/row order */
  wellKeys: string[];
  raw: (number | null)[];
  corrected: (number | null)[];
  /** aligned to wellKeys: this replicate was manually dropped */
  excluded: boolean[];
  /** corrected values that actually count (not null, not excluded) */
  values: number[];
  mean: number | null;
  sd: number | null;
  /** coefficient of variation on the raw replicates (sd / |mean|) */
  cv: number | null;
  n: number;
  outlierWell?: string;
}

export interface GroupResult {
  id: string;
  name: string;
  xLabel: string;
  blankMean: number | null;
  blankN: number;
  points: GroupPoint[];
  insights: string[];
  warnings: string[];
}

export interface ProcessResult {
  groups: GroupResult[];
  warnings: string[];
}

export interface ProcessOptions {
  /** Replicate CV above which a point is flagged. 0.2 = 20%. */
  cvThreshold?: number;
}

function mean(xs: number[]): number | null {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null;
}
function sd(xs: number[]): number | null {
  if (xs.length < 2) return xs.length ? 0 : null;
  const m = mean(xs)!;
  return Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / (xs.length - 1));
}

function fmt(n: number, d = 4): string {
  return n.toFixed(d);
}

function median(xs: number[]): number {
  if (xs.length === 0) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

function buildInsights(points: GroupPoint[], blankMean: number | null, cvThreshold: number): {
  insights: string[];
  warnings: string[];
} {
  const insights: string[] = [];
  const warnings: string[] = [];
  const means = points.map((p) => p.mean).filter((m): m is number => m !== null);
  if (means.length < 2) return { insights, warnings };

  const lo = Math.min(...means);
  const hi = Math.max(...means);
  const firstMean = points.find((p) => p.mean !== null)?.mean ?? 0;
  const lastMean = [...points].reverse().find((p) => p.mean !== null)?.mean ?? 0;
  const noise = median(points.map((p) => p.sd ?? 0).filter((s) => s > 0));

  let ups = 0;
  let downs = 0;
  for (let i = 1; i < means.length; i++) {
    if (means[i] > means[i - 1] + 0.5 * noise) ups++;
    else if (means[i] < means[i - 1] - 0.5 * noise) downs++;
  }

  const flat = hi - lo < Math.max(2.5 * noise, 0.015);
  const windowText = lo > 1e-6 ? ` (${(hi / lo).toFixed(1)}x window)` : "";
  if (flat) {
    insights.push(`Flat: means stay within ${fmt(lo, 3)}-${fmt(hi, 3)}. No dose response detected.`);
  } else if (downs === 0) {
    insights.push(`Dose-dependent increase: ${fmt(firstMean, 3)} to ${fmt(lastMean, 3)}${windowText}.`);
  } else if (ups === 0) {
    insights.push(`Monotonic decrease: ${fmt(firstMean, 3)} to ${fmt(lastMean, 3)}.`);
  } else {
    insights.push(`Non-monotonic: signal rises then falls across the series (${fmt(lo, 3)}-${fmt(hi, 3)}).`);
  }

  const negs = points.filter((p) => p.mean !== null && p.mean < -Math.max(2 * (p.sd ?? 0), 0.005));
  if (negs.length && blankMean !== null) {
    warnings.push(
      `${negs.length} point(s) negative after subtraction - blank ${fmt(blankMean)} may be too high.`
    );
  }

  const bad = points.filter((p) => p.cv !== null && p.cv > cvThreshold);
  for (const p of bad) {
    const severe = p.cv! > 2 * cvThreshold ? " - likely a bad well" : "";
    warnings.push(
      `x=${p.xIsFallback ? `#${p.x}` : p.x}: replicates ${(p.cv! * 100).toFixed(0)}% apart` +
        (p.outlierWell ? ` (check ${p.outlierWell})` : "") +
        severe
    );
  }
  if (!flat && ups > 0 && downs > 0 && bad.length) {
    insights.push("The non-monotonic step coincides with a high-spread point - excluding the odd well may clean up the curve.");
  }

  return { insights, warnings };
}

export function processGroups(
  grid: PlateGrid,
  groups: Group[],
  options: ProcessOptions = {}
): ProcessResult {
  const cvThreshold = options.cvThreshold ?? 0.2;
  const warnings: string[] = [];

  const results: GroupResult[] = groups.map((g) => {
    const blankRaw = g.blankWells
      .map((k) => getWell(grid, k))
      .filter((v): v is number => v !== null);
    const blankMean = blankRaw.length ? mean(blankRaw) : null;
    const excludedSet = new Set(g.excludedWells);
    const gWarnings: string[] = [];
    if (g.wells.length === 0) gWarnings.push("No wells selected.");
    if (g.blankWells.length > 0 && blankRaw.length === 0)
      gWarnings.push("Blank wells have no numeric values.");

    // group wells by step along the chosen axis
    const pts = g.wells
      .map((k) => ({ k, p: parseWellKey(k)! }))
      .filter((x) => x.p);
    const stepOf = (p: { row: number; col: number }) => (g.axis === "rows" ? p.row : p.col);
    const repOf = (p: { row: number; col: number }) => (g.axis === "rows" ? p.col : p.row);
    const steps = [...new Set(pts.map((x) => stepOf(x.p)))].sort((a, b) => a - b);

    if (g.wells.length > 0 && g.xValues.length > 0 && g.xValues.length < steps.length) {
      gWarnings.push(
        `${g.xValues.length} X value(s) entered for ${steps.length} dose ${
          g.axis === "rows" ? "rows" : "columns"
        } - the last ${steps.length - g.xValues.length} use position numbers. Add the missing concentrations.`
      );
    }

    const points: GroupPoint[] = steps.map((step, i) => {
      const wellsHere = pts
        .filter((x) => stepOf(x.p) === step)
        .sort((a, b) => repOf(a.p) - repOf(b.p))
        .map((x) => x.k);
      const raw = wellsHere.map((k) => getWell(grid, k));
      const excluded = wellsHere.map((k) => excludedSet.has(k));
      const corrected = raw.map((v) => (v === null ? null : v - (blankMean ?? 0)));
      const keep = (v: number | null, idx: number): v is number => v !== null && !excluded[idx];
      const rawIncl = raw.filter(keep);
      const corrIncl = corrected.filter(keep);
      const m = mean(corrIncl);
      const s = sd(corrIncl);
      const rawMean = mean(rawIncl);
      const cv = rawIncl.length > 1 && rawMean ? (sd(rawIncl)! / Math.abs(rawMean)) : rawIncl.length > 1 ? 0 : null;

      // furthest still-included replicate from the median
      let outlierWell: string | undefined;
      if (rawIncl.length > 2) {
        const med = [...rawIncl].sort((a, b) => a - b)[Math.floor(rawIncl.length / 2)];
        let worst = -1;
        wellsHere.forEach((k, idx) => {
          const v = raw[idx];
          if (v === null || excluded[idx]) return;
          const d = Math.abs(v - med);
          if (d > worst) {
            worst = d;
            outlierWell = k;
          }
        });
      } else if (rawIncl.length === 2 && cv !== null && cv > cvThreshold) {
        outlierWell = wellsHere.filter((_, idx) => !excluded[idx]).join(" vs ");
      }

      const xVal = g.xValues[i];
      const xIsFallback = xVal === undefined || !Number.isFinite(xVal);
      return {
        x: xIsFallback ? i + 1 : xVal,
        xIsFallback,
        wellKeys: wellsHere,
        raw,
        corrected,
        excluded,
        values: corrIncl,
        mean: m,
        sd: s,
        cv,
        n: corrIncl.length,
        outlierWell,
      };
    });

    const built = buildInsights(points, blankMean, cvThreshold);

    return {
      id: g.id,
      name: g.name || "Group",
      xLabel: g.xLabel || "Concentration",
      blankMean,
      blankN: blankRaw.length,
      points,
      insights: built.insights,
      warnings: [...gWarnings, ...built.warnings],
    };
  });

  return { groups: results, warnings };
}

/* --------------------------------------------------------------- exporters */

function maxReps(g: GroupResult): number {
  return Math.max(1, ...g.points.map((p) => p.values.length));
}

/**
 * Wide, tab-delimited block for GraphPad Prism. The first column holds the X /
 * row-title values; then one data set per group with side-by-side replicate
 * subcolumns of blank-subtracted values. The header row carries each group's
 * name above its first subcolumn (others blank), so the same block pastes into
 * both an **XY** table (first column read as X) and a **Grouped** table (first
 * column read as row titles). Set the number of replicate subcolumns in Prism
 * to the widest group.
 *
 * One row per dose point, in the same order the Results table shows them. When
 * groups have different numbers of points, shorter groups are padded with blank
 * cells; the X column is taken from the first group that has a point at that
 * position.
 */
export function toGraphPadClipboard(res: ProcessResult): string {
  const groups = res.groups.filter((g) => g.points.length > 0);
  if (groups.length === 0) return "";

  const header = [""];
  for (const g of groups) {
    const k = maxReps(g);
    header.push(g.name, ...Array(Math.max(0, k - 1)).fill(""));
  }
  const lines = [header.join("\t")];

  const rowCount = Math.max(...groups.map((g) => g.points.length));
  for (let r = 0; r < rowCount; r++) {
    const xPoint = groups.map((g) => g.points[r]).find((p) => p !== undefined);
    const cells = [xPoint ? String(xPoint.x) : String(r + 1)];
    for (const g of groups) {
      const k = maxReps(g);
      const p = g.points[r];
      for (let i = 0; i < k; i++) {
        cells.push(p && p.values[i] !== undefined ? p.values[i].toFixed(4) : "");
      }
    }
    lines.push(cells.join("\t"));
  }
  return lines.join("\n");
}

function groupBlankMean(grid: PlateGrid, g: Group): number | null {
  const vals = g.blankWells.map((k) => getWell(grid, k)).filter((v): v is number => v !== null);
  return vals.length ? mean(vals) : null;
}

/**
 * The whole 8 x 12 plate as tab-separated text, with each well's group blank
 * subtracted. A well takes the blank of the first group that lists it as a
 * sample well, otherwise the first group that lists it as a blank well. Wells
 * that belong to no group pass through unchanged. Empty cells stay empty.
 */
export function toSubtractedPlateText(grid: PlateGrid, groups: Group[]): string {
  const blankFor = new Map<string, number>();
  for (const g of groups) {
    const m = groupBlankMean(grid, g);
    if (m === null) continue;
    for (const k of g.wells) if (!blankFor.has(k)) blankFor.set(k, m);
  }
  for (const g of groups) {
    const m = groupBlankMean(grid, g);
    if (m === null) continue;
    for (const k of g.blankWells) if (!blankFor.has(k)) blankFor.set(k, m);
  }

  const lines: string[] = [];
  for (let r = 0; r < N_ROWS; r++) {
    const cells: string[] = [];
    for (let c = 0; c < N_COLS; c++) {
      const v = grid[r]?.[c];
      if (v === null || v === undefined || !Number.isFinite(v)) {
        cells.push("");
      } else {
        cells.push((v - (blankFor.get(wellKey(r, c)) ?? 0)).toFixed(4));
      }
    }
    lines.push(cells.join("\t"));
  }
  return lines.join("\n");
}

/** Tidy long-format CSV: one row per well. */
export function toTidyCsv(res: ProcessResult): string {
  const header = ["group", "x", "well", "raw_od", "blank_mean", "corrected_od", "excluded"];
  const esc = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  const lines = [header.join(",")];
  for (const g of res.groups) {
    for (const p of g.points) {
      p.wellKeys.forEach((k, i) => {
        lines.push(
          [
            g.name,
            p.xIsFallback ? `#${p.x}` : String(p.x),
            k,
            p.raw[i] ?? "",
            g.blankMean === null ? "" : g.blankMean.toFixed(4),
            p.corrected[i] === null || p.corrected[i] === undefined ? "" : p.corrected[i]!.toFixed(4),
            p.excluded[i] ? "yes" : "no",
          ]
            .map((v) => esc(String(v)))
            .join(",")
        );
      });
    }
  }
  return lines.join("\n");
}
