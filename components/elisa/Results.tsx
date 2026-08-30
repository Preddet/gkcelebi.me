"use client";

import type { ProcessResult } from "@/lib/elisa-plate";

export interface ResultsProps {
  result: ProcessResult;
  onToggleExcluded: (groupId: string, wellKey: string) => void;
}

export default function Results({ result, onToggleExcluded }: ResultsProps) {
  const { groups } = result;

  if (groups.length === 0) {
    return (
      <p className="text-sm text-muted">
        Add a group (select wells on the grid, then &ldquo;+ group from selection&rdquo;) to see
        results.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-xs text-muted">
        Click a replicate value to drop it from that point&rsquo;s average (it stays in the group,
        just excluded).
      </p>

      {groups.map((g) => (
        <div key={g.id} className="rounded-md border border-border p-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="font-[family-name:var(--font-label)] text-sm font-medium">{g.name}</span>
            <span className="font-[family-name:var(--font-mono)] text-xs text-muted">
              blank {g.blankMean === null ? "none" : `${g.blankMean.toFixed(4)} (n=${g.blankN})`}
            </span>
          </div>

          {g.points.length > 0 && (
            <div className="mt-2 overflow-x-auto">
              <table className="border-collapse font-[family-name:var(--font-mono)] text-xs">
                <thead>
                  <tr className="text-left text-muted">
                    <th className="py-1 pr-4 font-normal">{g.xLabel}</th>
                    <th className="py-1 pr-4 font-normal">replicates (corrected)</th>
                    <th className="py-1 pr-4 font-normal">mean</th>
                    <th className="py-1 pr-4 font-normal">± sd</th>
                    <th className="py-1 pr-4 font-normal">n</th>
                    <th className="py-1 pr-4 font-normal">CV</th>
                  </tr>
                </thead>
                <tbody>
                  {g.points.map((p, i) => (
                    <tr key={i} className="border-t border-border/50">
                      <td className="py-1 pr-4">{p.xIsFallback ? `#${p.x}` : p.x}</td>
                      <td className="py-1 pr-4">
                        <span className="flex flex-wrap gap-1">
                          {p.wellKeys.map((k, j) => {
                            const v = p.corrected[j];
                            const isExcluded = p.excluded[j];
                            if (v === null) {
                              return (
                                <span key={k} className="rounded border border-border px-1 text-muted" title={`${k}: no value`}>
                                  {k}·—
                                </span>
                              );
                            }
                            return (
                              <button
                                key={k}
                                onClick={() => onToggleExcluded(g.id, k)}
                                title={`${k} — click to ${isExcluded ? "restore" : "exclude"}`}
                                className={`rounded border px-1 transition-colors ${
                                  isExcluded
                                    ? "border-border text-muted line-through"
                                    : "border-border hover:border-red-400 hover:text-red-700"
                                }`}
                              >
                                {v.toFixed(4)}
                              </button>
                            );
                          })}
                        </span>
                      </td>
                      <td className={`py-1 pr-4 ${p.cv !== null && p.cv > 0.2 ? "text-red-700" : ""}`}>
                        {p.mean === null ? "—" : p.mean.toFixed(4)}
                      </td>
                      <td className="py-1 pr-4 text-muted">{p.sd === null ? "" : p.sd.toFixed(4)}</td>
                      <td className="py-1 pr-4 text-muted">{p.n}</td>
                      <td className={`py-1 pr-4 ${p.cv !== null && p.cv > 0.2 ? "text-red-700" : ""}`}>
                        {p.cv === null ? "" : `${(p.cv * 100).toFixed(0)}%`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {g.insights.length > 0 && (
            <ul className="mt-2 space-y-0.5 text-sm text-foreground/90">
              {g.insights.map((s, i) => (
                <li key={i}>— {s}</li>
              ))}
            </ul>
          )}

          {g.warnings.length > 0 && (
            <ul className="mt-2 space-y-0.5 text-xs text-amber-700">
              {g.warnings.map((s, i) => (
                <li key={i}>⚠ {s}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
