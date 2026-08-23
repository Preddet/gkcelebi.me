import type { Metadata } from "next";
import FadeIn from "@/components/FadeIn";
import PhotoGrid from "@/components/PhotoGrid";
import { photos } from "@/lib/photos";

export const metadata: Metadata = { title: "Photos" };

export default function PhotosPage() {
  return (
    <div>
      <FadeIn>
        <span className="font-[family-name:var(--font-label)] text-xs font-semibold uppercase tracking-wide text-accent">
          Photos
        </span>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight">
          A collection of frames
        </h1>
      </FadeIn>
      <div className="mt-8">
        <PhotoGrid photos={photos} priorityCount={4} />
      </div>
    </div>
  );
}
