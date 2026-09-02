"use client";

/**
 * ELISAProcessor
 * ----------------
 * Paste an 8x12 grid of OD readings, draw groups of wells on the grid, pick
 * each group's blank wells, and get back blank-subtracted dose-response data
 * in GraphPad Prism format plus a few plain-language insights.
 *
 * Everything runs in the browser. Nothing is uploaded; the pasted values,
 * groups and settings are kept only in this browser's localStorage.
 */

import { useEffect, useMemo, useState } from "react";
import {
  Group,
  PlateGrid as Grid,
  ProcessResult,
  emptyGrid,
  newGroup,
  orderKeys,
  parseODPaste,
  parseRangeSpec,
  processGroups,
  rangeSpecFromKeys,
  toGraphPadClipboard,
  toSubtractedPlateText,
  toTidyCsv,
} from "@/lib/elisa-plate";
import PlateGrid from "@/components/elisa/PlateGrid";
import Results from "@/components/elisa/Results";
import { LINK_BTN, PRIMARY_BTN, SECONDARY_BTN, SMALL_BTN } from "@/components/elisa/ui";

const LS_KEY = "elisa-v3";
const GROUP_COLORS = [
  "#3b82f6",
  "#ef4444",
  "#22c55e",
  "#a855f7",
  "#f59e0b",
  "#14b8a6",
  "#ec4899",
  "#64748b",
];

export default function ELISAProcessor() {
  const [grid, setGrid] = useState<Grid | null>(null);
  const [gridText, setGridText] = useState("");
  const [parseError, setParseError] = useState<string | null>(null);
  const [parseNote, setParseNote] = useState<string | null>(null);

  const [groups, setGroups] = useState<Group[]>([]);
  const [selection, setSelection] = useState<Set<string>>(new Set());
  const [rangeInput, setRangeInput] = useState("");
  const [focusGroupId, setFocusGroupId] = useState<string | null>(null);
  const [cvThreshold, setCvThreshold] = useState(0.2);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [plateCopyStatus, setPlateCopyStatus] = useState<string | null>(null);

  const [loaded, setLoaded] = useState(false);

  // Restore once, after mount. `loaded` is state (not a ref) so that under
  // StrictMode's double-invoke the persist effect below stays disabled until
  // the restored values have actually committed - otherwise the second
  // invocation would write empty initial state over the saved data.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as {
          grid?: Grid | null;
          groups?: Group[];
          cvThreshold?: number;
        };
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage
        if (Array.isArray(saved.grid)) setGrid(saved.grid);
        if (Array.isArray(saved.groups))
          setGroups(saved.groups.map((g) => ({ ...g, excludedWells: g.excludedWells ?? [] })));
        if (typeof saved.cvThreshold === "number") setCvThreshold(saved.cvThreshold);
      }
    } catch {
      /* ignore malformed storage */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ grid, groups, cvThreshold }));
    } catch {
      /* storage disabled - ignore */
    }
  }, [loaded, grid, groups, cvThreshold]);

  const result: ProcessResult = useMemo(
    () => processGroups(grid ?? emptyGrid(), groups, { cvThreshold }),
    [grid, groups, cvThreshold]
  );

  const selectionKeys = useMemo(() => orderKeys([...selection]), [selection]);
  const selectionSpec = rangeSpecFromKeys(selectionKeys);

  function groupColor(id: string) {
    const i = groups.findIndex((g) => g.id === id);
    return GROUP_COLORS[(i < 0 ? 0 : i) % GROUP_COLORS.length];
  }

  /* ---- OD values ---- */

  function parseGrid() {
    setParseError(null);
    setParseNote(null);
    try {
      const { grid: g, warnings } = parseODPaste(gridText);
      setGrid(g);
      if (warnings.length) setParseNote(warnings.join(" "));
    } catch (e) {
      setParseError(e instanceof Error ? e.message : String(e));
    }
  }

  /* ---- groups ---- */

  function updateGroup(id: string, patch: Partial<Group>) {
    setGroups((prev) => prev.map((g) => (g.id === id ? { ...g, ...patch } : g)));
  }

  function toggleExcludedWell(groupId: string, wellKey: string) {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        const set = new Set(g.excludedWells);
        if (set.has(wellKey)) set.delete(wellKey);
        else set.add(wellKey);
        return { ...g, excludedWells: [...set] };
      })
    );
  }

  function addGroupFromSelection() {
    const g = newGroup({
      name: `Group ${groups.length + 1}`,
      wells: selectionKeys,
    });
    setGroups((prev) => [...prev, g]);
    setFocusGroupId(g.id);
  }

  function parseXValues(text: string): number[] {
    let s = text.trim();
    // European decimals ("0,5") when no "." decimals are present
    if (/\d,\d/.test(s) && !/\d\.\d/.test(s)) s = s.replace(/(\d),(\d)/g, "$1.$2");
    return s
      .split(/[\s,;]+/)
      .filter((t) => t !== "")
      .map((t) => Number(t))
      .filter((n) => Number.isFinite(n));
  }

  /* ---- exports ---- */

  const maxRepLabel = Math.max(
    1,
    ...result.groups.flatMap((g) => g.points.map((p) => p.values.length))
  );

  async function copyPrism() {
    const text = toGraphPadClipboard(result);
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus(
        `Copied ${result.groups.length} group(s). In Prism, make an XY or Grouped table with "${maxRepLabel}" side-by-side replicate subcolumns, click the top-left data cell, and paste.`
      );
    } catch {
      setCopyStatus("Clipboard blocked - use Download CSV.");
    }
    setTimeout(() => setCopyStatus(null), 6000);
  }

  async function copySubtractedPlate() {
    if (!grid) return;
    try {
      await navigator.clipboard.writeText(toSubtractedPlateText(grid, groups));
      setPlateCopyStatus(
        "Copied the full 8x12 plate with each group's blank subtracted. Wells outside any group are unchanged."
      );
    } catch {
      setPlateCopyStatus("Clipboard blocked.");
    }
    setTimeout(() => setPlateCopyStatus(null), 6000);
  }

  function download(name: string, text: string, type: string) {
    const blob = new Blob([text], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  }

  const hasData = result.groups.some((g) => g.points.length > 0);

  return (
    <div className="max-w-3xl">
      <span className="font-[family-name:var(--font-label)] text-xs font-semibold uppercase tracking-wide text-accent">
        Lab tool
      </span>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight">
        ELISA Analysis Tool
      </h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-foreground/90">
        Paste an 8&times;12 grid of OD450 values, draw groups of wells, mark each group&rsquo;s blank,
        and get GraphPad-ready dose-response data. Everything stays in your browser.
      </p>

      {/* 1. OD values */}
      <section className="mt-8">
        <h2 className="font-[family-name:var(--font-label)] text-xs font-semibold uppercase tracking-wide text-muted">
          1 &middot; OD values
        </h2>

        {!grid ? (
          <div className="mt-2 rounded-md border border-dashed border-border p-4">
            <p className="text-xs text-muted">
              Paste the A&ndash;H &times; 12 block straight from Excel (tab- or comma-separated). A
              leading row-label column and header row are ignored.
            </p>
            <textarea
              value={gridText}
              onChange={(e) => setGridText(e.target.value)}
              rows={9}
              className="mt-2 w-full rounded-md border border-border bg-background p-2 font-[family-name:var(--font-mono)] text-xs outline-none focus:border-foreground"
              placeholder={"0.05\t0.051\t0.052\t...\n0.09\t0.10\t0.05\t...\n..."}
            />
            <button
              onClick={parseGrid}
              disabled={!gridText.trim()}
              className={`mt-2 ${PRIMARY_BTN}`}
            >
              Load values
            </button>
            {parseError && <p className="mt-2 text-sm text-red-700">{parseError}</p>}
          </div>
        ) : (
          <>
            <div className="mt-2 flex items-center justify-between text-xs text-muted">
              <span>
                Drag on the grid to select wells. Click a row / column header to select it. Hold
                &#8679; to add.
              </span>
              <button
                className={LINK_BTN}
                onClick={() => {
                  setGrid(null);
                  setGridText("");
                  setParseNote(null);
                }}
              >
                replace values
              </button>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <button className={SMALL_BTN} onClick={copySubtractedPlate}>
                copy subtracted values
              </button>
              {plateCopyStatus && <span className="text-xs text-muted">{plateCopyStatus}</span>}
            </div>
            {parseNote && <p className="mt-1 text-xs text-amber-700">{parseNote}</p>}
            <div className="mt-2">
              <PlateGrid
                grid={grid}
                selection={selection}
                setSelection={setSelection}
                groups={groups}
                groupColor={groupColor}
                focusGroupId={focusGroupId}
              />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-muted">
                selection: <span className="font-[family-name:var(--font-mono)]">{selectionSpec || "none"}</span>{" "}
                ({selection.size})
              </span>
              <span className="text-border">|</span>
              <input
                value={rangeInput}
                onChange={(e) => setRangeInput(e.target.value)}
                placeholder="type a range e.g. B1:E2"
                className="w-40 rounded border border-border bg-background px-1.5 py-0.5 font-[family-name:var(--font-mono)] outline-none focus:border-foreground"
              />
              <button
                className={SMALL_BTN}
                onClick={() => {
                  const keys = parseRangeSpec(rangeInput);
                  if (keys.length) setSelection(new Set(keys));
                }}
              >
                select
              </button>
              <button className={SMALL_BTN} onClick={() => setSelection(new Set())}>
                clear
              </button>
            </div>
          </>
        )}
      </section>

      {/* 2. Groups */}
      {grid && (
        <section className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="font-[family-name:var(--font-label)] text-xs font-semibold uppercase tracking-wide text-muted">
              2 &middot; Groups
            </h2>
            <button
              className={SMALL_BTN}
              disabled={selection.size === 0}
              onClick={addGroupFromSelection}
            >
              + group from selection
            </button>
          </div>

          {groups.length === 0 && (
            <p className="mt-2 text-sm text-muted">
              Select the wells of one dose-response series on the grid, then &ldquo;+ group from
              selection&rdquo;. Add its blank wells afterwards.
            </p>
          )}

          <div className="mt-3 space-y-3">
            {groups.map((g, i) => (
              <div
                key={g.id}
                className="rounded-md border p-3"
                style={{ borderColor: focusGroupId === g.id ? groupColor(g.id) : "var(--border)" }}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="inline-block h-3 w-3 shrink-0 rounded-sm"
                    style={{ background: groupColor(g.id) }}
                  />
                  <span className="text-xs text-muted">{i + 1}</span>
                  <input
                    value={g.name}
                    onChange={(e) => updateGroup(g.id, { name: e.target.value })}
                    className="min-w-0 flex-1 rounded border border-border bg-background px-2 py-1 text-sm outline-none focus:border-foreground"
                  />
                  <button
                    className={SMALL_BTN}
                    onClick={() => setFocusGroupId(focusGroupId === g.id ? null : g.id)}
                  >
                    {focusGroupId === g.id ? "unfocus" : "focus"}
                  </button>
                  <button
                    className={SMALL_BTN}
                    onClick={() => {
                      setGroups((prev) => prev.filter((x) => x.id !== g.id));
                      if (focusGroupId === g.id) setFocusGroupId(null);
                    }}
                  >
                    delete
                  </button>
                </div>

                <div className="mt-2 grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <span className="w-12 text-muted">wells</span>
                    <span className="flex-1 font-[family-name:var(--font-mono)]">
                      {rangeSpecFromKeys(g.wells) || "—"} ({g.wells.length})
                    </span>
                    <button
                      className={SMALL_BTN}
                      disabled={selection.size === 0}
                      onClick={() => updateGroup(g.id, { wells: selectionKeys })}
                    >
                      set from selection
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-12 text-muted">blank</span>
                    <span className="flex-1 font-[family-name:var(--font-mono)]">
                      {rangeSpecFromKeys(g.blankWells) || "none"} ({g.blankWells.length})
                    </span>
                    <button
                      className={SMALL_BTN}
                      disabled={selection.size === 0}
                      onClick={() => updateGroup(g.id, { blankWells: selectionKeys })}
                    >
                      set
                    </button>
                    <button
                      className={SMALL_BTN}
                      onClick={() => updateGroup(g.id, { blankWells: [] })}
                    >
                      clear
                    </button>
                  </div>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-muted">dose axis</span>
                    <button
                      className={`${SMALL_BTN} ${g.axis === "rows" ? "border-foreground bg-foreground text-background" : ""}`}
                      onClick={() => updateGroup(g.id, { axis: "rows" })}
                    >
                      down rows
                    </button>
                    <button
                      className={`${SMALL_BTN} ${g.axis === "cols" ? "border-foreground bg-foreground text-background" : ""}`}
                      onClick={() => updateGroup(g.id, { axis: "cols" })}
                    >
                      across cols
                    </button>
                  </div>
                  <label className="flex items-center gap-1.5">
                    <span className="text-muted">X label</span>
                    <input
                      value={g.xLabel}
                      onChange={(e) => updateGroup(g.id, { xLabel: e.target.value })}
                      className="w-40 rounded border border-border bg-background px-1.5 py-0.5 outline-none focus:border-foreground"
                    />
                  </label>
                  <label className="flex flex-1 items-center gap-1.5">
                    <span className="whitespace-nowrap text-muted">X values</span>
                    <input
                      defaultValue={g.xValues.join(", ")}
                      onChange={(e) => updateGroup(g.id, { xValues: parseXValues(e.target.value) })}
                      placeholder="0.0625, 0.125, 0.25, 0.5, 1, 2, 4"
                      className="min-w-0 flex-1 rounded border border-border bg-background px-1.5 py-0.5 font-[family-name:var(--font-mono)] outline-none focus:border-foreground"
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Results */}
      {grid && groups.length > 0 && (
        <section className="mt-8">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-[family-name:var(--font-label)] text-xs font-semibold uppercase tracking-wide text-muted">
              3 &middot; Results
            </h2>
            <label className="flex items-center gap-1.5 text-xs text-muted">
              flag CV over
              <input
                type="number"
                value={Math.round(cvThreshold * 100)}
                onChange={(e) => setCvThreshold(Math.max(0, Number(e.target.value)) / 100)}
                className="w-12 rounded border border-border bg-background px-1 py-0.5 outline-none focus:border-foreground"
              />
              %
            </label>
          </div>

          <div className="mt-3">
            <Results result={result} onToggleExcluded={toggleExcludedWell} />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button onClick={copyPrism} className={PRIMARY_BTN} disabled={!hasData}>
              Copy for GraphPad Prism
            </button>
            <button
              onClick={() => download("elisa_tidy.csv", toTidyCsv(result), "text/csv")}
              className={SECONDARY_BTN}
              disabled={!hasData}
            >
              Download CSV
            </button>
            {copyStatus && <span className="text-xs text-muted">{copyStatus}</span>}
          </div>
        </section>
      )}
    </div>
  );
}
