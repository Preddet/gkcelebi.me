/**
 * A little 96-well plate mascot: a plate body with a face, waving arm, and
 * dangling legs. Strokes follow `currentColor` so the parent link controls
 * color and hover state. Used as an easter egg tucked behind the "Projects"
 * sidebar link.
 */
export default function PlateCharacter({ size = 46 }: { size?: number }) {
  const wells = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 5; col++) {
      wells.push(
        <circle
          key={`${row}-${col}`}
          cx={11 + col * 4.5}
          cy={9 + row * 4.5}
          r={0.9}
          fill="currentColor"
          stroke="none"
          fillOpacity={0.3}
        />
      );
    }
  }

  return (
    <svg
      viewBox="0 0 42 40"
      width={size}
      height={(size * 40) / 42}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      shapeRendering="geometricPrecision"
      aria-hidden="true"
    >
      {/* limbs (drawn first so the body covers where they attach) */}
      <path d="M8 17 Q3 19 4 23" />
      <circle cx={4} cy={23} r={1.7} fill="currentColor" stroke="none" />
      <path d="M34 16 Q40 13 39 7" />
      <circle cx={39} cy={7} r={1.7} fill="currentColor" stroke="none" />
      <path d="M16 25 L15 34" />
      <path d="M26 25 L27 34" />
      <ellipse cx={13} cy={35} rx={2.7} ry={1.3} fill="currentColor" stroke="none" />
      <ellipse cx={29} cy={35} rx={2.7} ry={1.3} fill="currentColor" stroke="none" />

      {/* plate body */}
      <rect x={7} y={6} width={28} height={19} rx={3} fill="var(--background)" />
      <rect x={7} y={6} width={28} height={19} rx={3} />
      {wells}

      {/* face */}
      <circle cx={16} cy={13} r={1.5} fill="currentColor" stroke="none" />
      <circle cx={26} cy={13} r={1.5} fill="currentColor" stroke="none" />
      <path d="M16 18 Q21 22 26 18" strokeWidth={1.6} />
    </svg>
  );
}
