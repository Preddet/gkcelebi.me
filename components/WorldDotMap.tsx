import { DOT_MAP_COLS, DOT_MAP_ROWS, DOT_MAP_LAND, IZMIR_DOT } from "@/lib/dotmap-data";

export default function WorldDotMap() {
  return (
    <svg
      viewBox={`0 0 ${DOT_MAP_COLS} ${DOT_MAP_ROWS}`}
      className="h-full w-full"
      aria-hidden="true"
    >
      {DOT_MAP_LAND.map(([col, row]) => (
        <circle key={`${col}-${row}`} cx={col + 0.5} cy={row + 0.5} r={0.24} className="fill-[#bcbcbc]" />
      ))}
      <circle
        cx={IZMIR_DOT.col}
        cy={IZMIR_DOT.row}
        r={0.9}
        className="animate-ping fill-[#39ff14] opacity-50"
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
      <circle cx={IZMIR_DOT.col} cy={IZMIR_DOT.row} r={0.45} className="fill-[#39ff14]" />
    </svg>
  );
}
