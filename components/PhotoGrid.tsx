"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export type Photo = {
  src: string;
  title?: string;
  width: number;
  height: number;
};

type ColumnBreakpoints = { base: number; sm?: number; lg?: number };

function useColumnCount({ base, sm, lg }: ColumnBreakpoints) {
  const [count, setCount] = useState(base);
  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      if (lg && w >= 1024) setCount(lg);
      else if (sm && w >= 640) setCount(sm);
      else setCount(base);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [base, sm, lg]);
  return count;
}

/** Splits photos into `columnCount` contiguous runs (preserving order, so
 * adjacent photos stay adjacent) while keeping each column's total height as
 * close to equal as possible. This is the "minimize the maximum partition
 * sum" problem: binary-search the smallest per-column height budget that
 * still lets every photo fit into `columnCount` runs, then build the runs
 * against that budget. Using this instead of relying on CSS multi-column
 * balancing (or a naive "always add to the shortest column" greedy, which
 * can strand a late oversized photo in one column) is what keeps columns
 * flush at the bottom. */
function countRunsNeeded(heights: number[], budget: number) {
  let runs = 1;
  let current = 0;
  for (const h of heights) {
    if (current > 0 && current + h > budget) {
      runs++;
      current = 0;
    }
    current += h;
  }
  return runs;
}

function buildRuns(heights: number[], budget: number, columnCount: number) {
  const runs: number[][] = [[]];
  let current = 0;
  heights.forEach((h, i) => {
    if (current > 0 && current + h > budget && runs.length < columnCount) {
      runs.push([]);
      current = 0;
    }
    runs[runs.length - 1].push(i);
    current += h;
  });
  return runs;
}

function layoutColumns(photos: Photo[], columnCount: number) {
  const heights = photos.map((p) => p.height / p.width);

  // Binary-search the smallest per-column height budget that still needs no
  // more than `columnCount` runs — this must count runs *without* a column
  // cap, otherwise forcing overflow into the last column would make an
  // infeasible (unbalanced) budget look artificially feasible.
  let lo = Math.max(...heights, 0);
  let hi = heights.reduce((a, b) => a + b, 0);
  for (let iter = 0; iter < 50 && hi - lo > 1e-6; iter++) {
    const mid = (lo + hi) / 2;
    if (countRunsNeeded(heights, mid) <= columnCount) hi = mid;
    else lo = mid;
  }

  const runs = buildRuns(heights, hi, columnCount);
  while (runs.length < columnCount) runs.push([]);
  return runs.map((run) => run.map((index) => ({ photo: photos[index], index })));
}

export default function PhotoGrid({
  photos,
  priorityCount = 0,
  columnBreakpoints = { base: 2, sm: 3, lg: 4 },
}: {
  photos: Photo[];
  priorityCount?: number;
  columnBreakpoints?: ColumnBreakpoints;
}) {
  const columnCount = useColumnCount(columnBreakpoints);
  const columns = layoutColumns(photos, columnCount);

  return (
    <div className="flex gap-3">
      {columns.map((column, colIndex) => (
        <div key={colIndex} className="flex flex-1 flex-col gap-3">
          {column.map(({ photo, index }) => (
            <motion.div
              key={photo.src}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: (index % 6) * 0.05 }}
              className="group relative overflow-hidden rounded-md bg-border"
            >
              <Image
                src={photo.src}
                alt={photo.title ?? ""}
                width={photo.width}
                height={photo.height}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                priority={index < priorityCount}
                className="block h-auto w-full transition-transform duration-500 group-hover:scale-[1.02]"
              />
              {photo.title && (
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="p-3 font-[family-name:var(--font-label)] text-sm text-white">
                    {photo.title}
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
}
