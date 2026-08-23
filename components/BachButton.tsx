"use client";

import { useRef, useState } from "react";
import Image from "next/image";

type PlaybackState = "stopped" | "playing" | "paused";

export default function BachButton() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<PlaybackState>("stopped");

  function handleClick() {
    const audio = audioRef.current;
    if (!audio) return;

    if (state === "stopped") {
      audio.currentTime = 0;
      audio.play();
      setState("playing");
    } else if (state === "playing") {
      audio.pause();
      setState("paused");
    } else {
      audio.pause();
      audio.currentTime = 0;
      setState("stopped");
    }
  }

  return (
    <div>
      <audio
        ref={audioRef}
        src="/audio/goldberg-variations.mp3"
        onEnded={() => setState("stopped")}
        preload="none"
      />
      <button
        type="button"
        onClick={handleClick}
        aria-label={
          state === "playing"
            ? "Pause Goldberg Variations"
            : state === "paused"
              ? "Reset Goldberg Variations"
              : "Play Goldberg Variations"
        }
        aria-pressed={state === "playing"}
        title="Goldberg Variations, BWV 988 — Aria"
        className={`inline-flex transition-transform hover:scale-105 ${state === "playing" ? "animate-bounce" : ""}`}
      >
        <Image
          src="/images/bach.png"
          alt="Johann Sebastian Bach"
          width={60}
          height={60}
          unoptimized
          style={{ imageRendering: "pixelated" }}
        />
      </button>
    </div>
  );
}
