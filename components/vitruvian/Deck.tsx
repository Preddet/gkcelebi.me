"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

const IMG = "/images/vitruvian";
const ALL_IMAGES = ["vitruvian-man", "accademia", "italy", "cesariano", "codex", "anatomy", "hip-implant", "heart-valve", "euro"].map((n) => `${IMG}/${n}.jpg`);

// Venice on italy.jpg (1034x1299), read off the map's own lat/lon grid lines.
const VENICE_PIN = { left: "47.8%", top: "16.3%" };

// Geometry of the drawing, in the 1471x2000 space of vitruvian-man.jpg.
const SQUARE = { x: 214, y: 430, w: 1042, h: 1032 };
const CIRCLE = { cx: 733, cy: 822, r: 631.5 };
const GROIN = { x: 735, y: 946 };

type Frame = { slide: number; sub: number };

// Slide 4 (the geometry) is stepped through with three sub-frames.
const FRAMES: Frame[] = [
  { slide: 0, sub: 0 },
  { slide: 1, sub: 0 },
  { slide: 2, sub: 0 },
  { slide: 3, sub: 0 },
  { slide: 4, sub: 0 },
  { slide: 4, sub: 1 },
  { slide: 4, sub: 2 },
  { slide: 4, sub: 3 },
  { slide: 5, sub: 0 },
  { slide: 6, sub: 0 },
  { slide: 7, sub: 0 },
];

function Footnote({ children }: { children: ReactNode }) {
  return (
    <p className="font-[family-name:var(--font-mono)] text-[11px] leading-relaxed text-muted sm:text-xs">
      {children}
    </p>
  );
}

function Label({ children }: { children: ReactNode }) {
  return (
    <span className="font-[family-name:var(--font-label)] text-xs font-semibold uppercase tracking-wide text-accent">
      {children}
    </span>
  );
}

function Caption({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
      {children}
    </h2>
  );
}

function Picture({
  src,
  alt,
  aspect,
  height = "h-[52vh] lg:h-[74vh]",
  priority,
  children,
}: {
  src: string;
  alt: string;
  aspect: string;
  height?: string;
  priority?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className={`relative ${height}`} style={{ aspectRatio: aspect }}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 1024px) 90vw, 60vw"
        unoptimized
        className="object-contain"
      />
      {children}
    </div>
  );
}

function Geometry({ sub }: { sub: number }) {
  const draw = { duration: 1.1, ease: "easeInOut" as const };
  const perimeter = (SQUARE.w + SQUARE.h) * 2;
  return (
    <svg viewBox="0 0 1471 2000" className="absolute inset-0 h-full w-full" aria-hidden>
      <motion.rect
        x={SQUARE.x}
        y={SQUARE.y}
        width={SQUARE.w}
        height={SQUARE.h}
        fill="none"
        stroke="#e0301e"
        strokeWidth={6}
        strokeDasharray={perimeter}
        initial={{ strokeDashoffset: perimeter }}
        animate={{ strokeDashoffset: sub >= 1 ? 0 : perimeter }}
        transition={draw}
      />
      <motion.circle
        cx={CIRCLE.cx}
        cy={CIRCLE.cy}
        r={CIRCLE.r}
        fill="none"
        stroke="#1f5fbf"
        strokeWidth={6}
        strokeDasharray={2 * Math.PI * CIRCLE.r}
        initial={{ strokeDashoffset: 2 * Math.PI * CIRCLE.r }}
        animate={{ strokeDashoffset: sub >= 2 ? 0 : 2 * Math.PI * CIRCLE.r }}
        transition={draw}
      />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: sub >= 3 ? 1 : 0 }} transition={{ duration: 0.5 }}>
        <circle cx={CIRCLE.cx} cy={CIRCLE.cy} r={16} fill="#1f5fbf" />
        <circle cx={GROIN.x} cy={GROIN.y} r={16} fill="#e0301e" />
      </motion.g>
    </svg>
  );
}

const GEOMETRY_NOTES = [
  { title: "The drawing", note: "Two poses, one body." },
  { title: "Square", note: "Arm span equals height." },
  { title: "Circle", note: "Centered on the navel." },
  { title: "Two centers", note: "Navel for the circle, groin for the square." },
];

function SlideBody({ slide, sub }: Frame) {
  switch (slide) {
    case 0:
      return (
        <div className="grid h-full items-center gap-8 lg:grid-cols-[1fr_auto] lg:gap-16">
          <div>
            <Label>Leonardo da Vinci &middot; c. 1490</Label>
            <h1 className="mt-4 font-[family-name:var(--font-display)] text-5xl font-semibold tracking-tight sm:text-6xl lg:text-8xl">
              Vitruvian Man
            </h1>
            <p className="mt-4 font-[family-name:var(--font-quote)] text-lg italic text-muted sm:text-xl">
              Le proporzioni del corpo umano
            </p>
            <div className="mt-10 max-w-sm">
              <Footnote>Pen and ink on paper, about 34 &times; 25 cm. Photo: Luc Viatour, CC BY-SA.</Footnote>
            </div>
          </div>
          <Picture src={`${IMG}/vitruvian-man.jpg`} alt="Vitruvian Man by Leonardo da Vinci" aspect="1471/2000" priority />
        </div>
      );
    case 1:
      return (
        <div className="grid h-full items-center gap-8 lg:grid-cols-2 lg:gap-14">
          <div>
            <Label>Where</Label>
            <Caption>Venice, Italy</Caption>
            <div className="mt-6">
              <Picture
                src={`${IMG}/italy.jpg`}
                alt="Relief map of Italy with Venice marked"
                aspect="1034/1299"
                height="h-[40vh] lg:h-[54vh]"
              >
                <span
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: VENICE_PIN.left, top: VENICE_PIN.top }}
                >
                  <span className="absolute inset-0 animate-ping rounded-full bg-[#e0301e] opacity-50" />
                  <span className="relative block h-3.5 w-3.5 rounded-full border-2 border-white bg-[#e0301e]" />
                </span>
              </Picture>
            </div>
            <div className="mt-4 max-w-md">
              <Footnote>
                Gallerie dell&rsquo;Accademia. The drawing is light-sensitive and rarely on display. Map: Eric Gaba &amp;
                NordNordWest, CC BY-SA 3.0.
              </Footnote>
            </div>
          </div>
          <div className="space-y-3">
            <Picture
              src={`${IMG}/accademia.jpg`}
              alt="Gallerie dell'Accademia, Venice"
              aspect="1920/1337"
              height="h-auto w-full"
            />
            <Footnote>Photo: M0tty, CC BY-SA 3.0</Footnote>
          </div>
        </div>
      );
    case 2:
      return (
        <div className="grid h-full items-center gap-8 lg:grid-cols-[1fr_auto] lg:gap-16">
          <div>
            <Label>Why</Label>
            <Caption>An ancient rule for the ideal body</Caption>
            <div className="mt-8 max-w-md">
              <Footnote>
                Vitruvius, <em>De architectura</em>, Book III (1st c. BC): a well-formed man fits a circle and a
                square. Shown: Cesariano&rsquo;s 1521 edition, public domain.
              </Footnote>
            </div>
          </div>
          <Picture
            src={`${IMG}/cesariano.jpg`}
            alt="Cesariano's 1521 illustration of Vitruvian proportions"
            aspect="3286/4096"
          />
        </div>
      );
    case 3:
      return (
        <div className="grid h-full items-center gap-8 lg:grid-cols-[1fr_auto] lg:gap-16">
          <div>
            <Label>Background</Label>
            <Caption>A notebook kept in mirror writing</Caption>
            <div className="mt-8 max-w-md">
              <Footnote>
                Codex Atlanticus, f. 307v, Biblioteca Ambrosiana, Milan. Leonardo was in Milan in the service of
                Ludovico Sforza when he drew the Vitruvian Man.
              </Footnote>
            </div>
          </div>
          <Picture src={`${IMG}/codex.jpg`} alt="Page of Leonardo's Codex Atlanticus" aspect="2000/2916" />
        </div>
      );
    case 4: {
      const g = GEOMETRY_NOTES[sub];
      return (
        <div className="grid h-full items-center gap-8 lg:grid-cols-[1fr_auto] lg:gap-16">
          <div>
            <Label>The geometry</Label>
            <AnimatePresence mode="wait">
              <motion.div
                key={sub}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <Caption>{g.title}</Caption>
                <p className="mt-4 max-w-md font-[family-name:var(--font-quote)] text-lg italic text-muted sm:text-xl">
                  {g.note}
                </p>
              </motion.div>
            </AnimatePresence>
            <div className="mt-10 max-w-sm">
              <Footnote>
                Leonardo&rsquo;s fix: a square and a circle cannot share a center, so the man stands in both.
              </Footnote>
            </div>
          </div>
          <Picture src={`${IMG}/vitruvian-man.jpg`} alt="Vitruvian Man with square and circle overlay" aspect="1471/2000">
            <Geometry sub={sub} />
          </Picture>
        </div>
      );
    }
    case 5:
      return (
        <div className="grid h-full items-center gap-8 lg:grid-cols-[1fr_auto] lg:gap-16">
          <div>
            <Label>Anatomy</Label>
            <Caption>From proportion to what lies beneath</Caption>
            <div className="mt-8 max-w-md">
              <Footnote>
                Proportion was the start. Leonardo went on to dissect human bodies and draw bones, muscles and vessels
                from observation, in notebooks that went unpublished for centuries. Shown: the cardiovascular system and
                organs, c. 1509&ndash;10, Royal Collection.
              </Footnote>
            </div>
          </div>
          <Picture
            src={`${IMG}/anatomy.jpg`}
            alt="Leonardo's anatomical drawing of the cardiovascular system and organs"
            aspect="1280/1797"
          />
        </div>
      );
    case 6:
      return (
        <div className="flex h-full flex-col justify-center gap-6">
          <div>
            <Label>Biomaterials</Label>
            <Caption>Materials built to fit the body</Caption>
          </div>
          <div className="flex items-end gap-4 lg:gap-6">
            <Picture
              src={`${IMG}/hip-implant.jpg`}
              alt="X-ray of a hip replacement implant"
              aspect="1280/1029"
              height="h-[26vh] lg:h-[40vh]"
            />
            <Picture
              src={`${IMG}/heart-valve.jpg`}
              alt="Ball-and-cage artificial heart valve"
              aspect="1280/1477"
              height="h-[26vh] lg:h-[40vh]"
            />
          </div>
          <div className="max-w-2xl">
            <Footnote>
              Every implant starts from anatomy: real sizes, angles and loads. Left: a hip stem in an X-ray (NIH).
              Right: an early ball-and-cage heart valve with a metal cage, polymer ball and fabric sewing ring
              (Stif Komar, CC BY-SA 3.0).
            </Footnote>
          </div>
        </div>
      );
    default:
      return (
        <div className="grid h-full items-center gap-8 lg:grid-cols-[1fr_auto] lg:gap-16">
          <div>
            <Label>Legacy</Label>
            <Caption>Still in your pocket</Caption>
            <div className="mt-8 max-w-md">
              <Footnote>
                The drawing appears on the Italian 1 euro coin. It remains a symbol of proportion, anatomy and
                science. Photo: Wikimedia Commons, CC BY 4.0.
              </Footnote>
            </div>
          </div>
          <Picture
            src={`${IMG}/euro.jpg`}
            alt="Italian 1 euro coin showing the Vitruvian Man"
            aspect="1/1"
            height="h-[44vh] lg:h-[62vh]"
          />
        </div>
      );
  }
}

export default function Deck() {
  const router = useRouter();
  const [i, setI] = useState(0);
  const last = FRAMES.length - 1;

  const next = useCallback(() => setI((n) => Math.min(n + 1, last)), [last]);
  const prev = useCallback(() => setI((n) => Math.max(n - 1, 0)), []);

  // Warm the cache so no slide waits on an image mid-presentation.
  useEffect(() => {
    ALL_IMAGES.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        prev();
      } else if (e.key === "Home") {
        setI(0);
      } else if (e.key === "End") {
        setI(last);
      } else if (e.key === "Escape") {
        router.push("/projects");
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [next, prev, last, router]);

  const frame = FRAMES[i];

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-background">
      <div className="flex items-center justify-between px-6 py-4 sm:px-10">
        <Link
          href="/projects"
          className="font-[family-name:var(--font-label)] text-xs text-muted transition-colors hover:text-foreground"
        >
          &larr; Exit
        </Link>
        <span className="font-[family-name:var(--font-mono)] text-xs text-muted">
          {i + 1} / {FRAMES.length}
        </span>
      </div>

      <div className="relative min-h-0 flex-1 overflow-y-auto px-6 pb-6 sm:px-10 lg:px-16 lg:pb-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={frame.slide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="mx-auto h-full max-w-6xl"
          >
            <SlideBody slide={frame.slide} sub={frame.sub} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between px-6 py-4 sm:px-10">
        <button
          type="button"
          onClick={prev}
          disabled={i === 0}
          className="font-[family-name:var(--font-label)] text-sm text-muted transition-colors hover:text-foreground disabled:opacity-30"
        >
          &larr; Back
        </button>
        <div className="flex items-center gap-2">
          {FRAMES.map((_, n) => (
            <button
              key={n}
              type="button"
              aria-label={`Go to step ${n + 1}`}
              onClick={() => setI(n)}
              className={`h-1.5 rounded-full transition-all ${
                n === i ? "w-6 bg-foreground" : "w-1.5 bg-border hover:bg-muted"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={next}
          disabled={i === last}
          className="font-[family-name:var(--font-label)] text-sm text-muted transition-colors hover:text-foreground disabled:opacity-30"
        >
          Next &rarr;
        </button>
      </div>
    </div>
  );
}
