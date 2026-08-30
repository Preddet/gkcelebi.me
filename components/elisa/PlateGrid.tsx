"use client";

import { useEffect, useRef, useState } from "react";
import { Group, N_COLS, N_ROWS, PlateGrid as Grid, ROW_LETTERS, wellKey } from "@/lib/elisa-plate";

interface Rect {
  r1: number;
  c1: number;
  r2: number;
  c2: number;
}

function bounds(rect: Rect) {
  return {
    rlo: Math.min(rect.r1, rect.r2),
    rhi: Math.max(rect.r1, rect.r2),
    clo: Math.min(rect.c1, rect.c2),
    chi: Math.max(rect.c1, rect.c2),
  };
}

function rectKeys(rect: Rect): string[] {
  const { rlo, rhi, clo, chi } = bounds(rect);
  const keys: string[] = [];
  for (let r = rlo; r <= rhi; r++) for (let c = clo; c <= chi; c++) keys.push(wellKey(r, c));
  return keys;
}

export interface PlateGridProps {
  grid: Grid;
  selection: Set<string>;
  setSelection: (s: Set<string>) => void;
  groups: Group[];
  groupColor: (id: string) => string;
  focusGroupId?: string | null;
}

export default function PlateGrid({
  grid,
  selection,
  setSelection,
  groups,
  groupColor,
  focusGroupId,
}: PlateGridProps) {
  const dragRef = useRef<{ anchor: [number, number]; additive: boolean; rect: Rect } | null>(null);
  const [rectView, setRectView] = useState<Rect | null>(null);

  useEffect(() => {
    function up() {
      const d = dragRef.current;
      dragRef.current = null;
      setRectView(null);
      if (!d) return;
      const keys = rectKeys(d.rect);
      const next = new Set(d.additive ? selection : []);
      if (d.additive && keys.length === 1 && selection.has(keys[0])) next.delete(keys[0]);
      else for (const k of keys) next.add(k);
      setSelection(next);
    }
    window.addEventListener("pointerup", up);
    return () => window.removeEventListener("pointerup", up);
  }, [selection, setSelection]);

  function applySelect(keys: string[], additive: boolean) {
    const next = new Set(additive ? selection : []);
    for (const k of keys) next.add(k);
    setSelection(next);
  }

  // well key -> {wells: groupIds, blank: groupIds, excluded: groupIds}
  const membership = new Map<string, { wells: string[]; blank: string[]; excluded: string[] }>();
  const touch = (k: string) => {
    let m = membership.get(k);
    if (!m) {
      m = { wells: [], blank: [], excluded: [] };
      membership.set(k, m);
    }
    return m;
  };
  for (const g of groups) {
    for (const k of g.wells) touch(k).wells.push(g.id);
    for (const k of g.blankWells) touch(k).blank.push(g.id);
    for (const k of g.excludedWells) touch(k).excluded.push(g.id);
  }
  const groupIndex = new Map(groups.map((g, i) => [g.id, i + 1]));

  const inPreview = (r: number, c: number) => {
    if (!rectView) return false;
    const { rlo, rhi, clo, chi } = bounds(rectView);
    return r >= rlo && r <= rhi && c >= clo && c <= chi;
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="border-collapse font-[family-name:var(--font-mono)] text-xs">
          <thead>
            <tr>
              <th className="w-7" />
              {Array.from({ length: N_COLS }, (_, c) => (
                <th
                  key={c}
                  onClick={(e) =>
                    applySelect(
                      Array.from({ length: N_ROWS }, (_, r) => wellKey(r, c)),
                      e.shiftKey || e.metaKey || e.ctrlKey
                    )
                  }
                  className="min-w-[42px] cursor-pointer px-1 py-0.5 text-muted hover:text-foreground"
                >
                  {c + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROW_LETTERS.map((letter, r) => (
              <tr key={letter}>
                <th
                  onClick={(e) =>
                    applySelect(
                      Array.from({ length: N_COLS }, (_, c) => wellKey(r, c)),
                      e.shiftKey || e.metaKey || e.ctrlKey
                    )
                  }
                  className="cursor-pointer px-1 py-0.5 text-right font-semibold hover:text-accent"
                >
                  {letter}
                </th>
                {Array.from({ length: N_COLS }, (_, c) => {
                  const key = wellKey(r, c);
                  const v = grid[r]?.[c];
                  const m = membership.get(key);
                  const selected = selection.has(key);
                  const preview = inPreview(r, c);

                  const owningGroup =
                    m?.wells.find((id) => id === focusGroupId) ?? m?.wells[0] ?? null;
                  const isBlankHere =
                    (focusGroupId && m?.blank.includes(focusGroupId)) || (!focusGroupId && (m?.blank.length ?? 0) > 0);
                  const dim =
                    focusGroupId != null &&
                    !(m?.wells.includes(focusGroupId) || m?.blank.includes(focusGroupId));
                  const isExcludedHere =
                    (focusGroupId && m?.excluded.includes(focusGroupId)) ||
                    (!focusGroupId && (m?.excluded.length ?? 0) > 0);

                  const bg = owningGroup ? `${groupColor(owningGroup)}${dim ? "14" : "33"}` : "transparent";

                  return (
                    <td
                      key={c}
                      onPointerDown={(e) => {
                        dragRef.current = {
                          anchor: [r, c],
                          additive: e.shiftKey || e.metaKey || e.ctrlKey,
                          rect: { r1: r, c1: c, r2: r, c2: c },
                        };
                        setRectView(dragRef.current.rect);
                      }}
                      onPointerOver={() => {
                        if (!dragRef.current) return;
                        const [ar, ac] = dragRef.current.anchor;
                        dragRef.current.rect = { r1: ar, c1: ac, r2: r, c2: c };
                        setRectView(dragRef.current.rect);
                      }}
                      className={`relative border border-border px-1 py-1 text-center tabular-nums select-none ${
                        dim ? "text-muted" : ""
                      }`}
                      style={{
                        background: bg,
                        minWidth: 42,
                        boxShadow: selected
                          ? "inset 0 0 0 2px var(--accent)"
                          : preview
                            ? "inset 0 0 0 2px rgba(128,143,126,0.5)"
                            : isBlankHere
                              ? "inset 0 0 0 2px #d97706"
                              : undefined,
                      }}
                    >
                      {m && m.wells.length > 0 && (
                        <span className="absolute left-0.5 top-0 text-[8px] leading-none text-muted">
                          {m.wells.map((id) => groupIndex.get(id)).join(",")}
                        </span>
                      )}
                      {isBlankHere && (
                        <span className="absolute right-0.5 top-0 text-[8px] leading-none text-amber-600">
                          b
                        </span>
                      )}
                      <span className={isExcludedHere ? "text-red-500 line-through" : ""}>
                        {v === null || v === undefined ? "" : v}
                      </span>
                      {isExcludedHere && (
                        <span className="absolute bottom-0 right-0.5 text-[8px] leading-none text-red-500">
                          ✕
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {groups.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
          {groups.map((g, i) => (
            <span key={g.id} className="flex items-center gap-1.5">
              <span
                className="inline-block h-2.5 w-2.5 rounded-sm"
                style={{ background: groupColor(g.id) }}
              />
              {i + 1}. {g.name || "Group"} ({g.wells.length}w
              {g.blankWells.length ? ` · ${g.blankWells.length} blank` : ""})
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
