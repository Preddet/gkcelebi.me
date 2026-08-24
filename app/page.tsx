import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import PhotoGrid from "@/components/PhotoGrid";
import WorldDotMap from "@/components/WorldDotMap";
import { glimpsePhotos } from "@/lib/photos";

export default function Home() {
  return (
    <div className="max-w-5xl">
      <FadeIn className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight sm:text-4xl">
            Hello! I&rsquo;m Gökberk
          </h1>
          <p className="mt-1 font-[family-name:var(--font-display)] text-3xl font-semibold text-muted sm:text-4xl">
            Bioengineering Student
          </p>
          <p className="mt-3 flex items-center gap-2 font-[family-name:var(--font-label)] text-xl text-muted">
            <svg
              viewBox="0 0 24 24"
              width={24}
              height={24}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Türkiye
          </p>
          <p className="mt-6 leading-relaxed text-foreground/90">
            I&rsquo;m a bioengineering student at IZTECH with a few obsessions
            I can&rsquo;t quite shake — diving, photography and music. This
            site is where those things live. I made it for the small details
            that deserve a bit more attention, whether that&rsquo;s thirty
            meters underwater, in a frame I almost didn&rsquo;t take, or a
            song I&rsquo;ve had on repeat for weeks.
          </p>
        </div>
        <div className="hidden w-48 shrink-0 self-center sm:block sm:w-56 lg:w-64 lg:self-start">
          <div className="aspect-[3/4] rounded-md border-2 border-border p-3">
            <WorldDotMap />
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.15} className="mt-14">
        <div className="flex items-baseline justify-between">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-medium">
            Here is a short glimpse into my photos.
          </h2>
          <Link
            href="/photos"
            className="shrink-0 font-[family-name:var(--font-label)] text-xs text-muted transition-colors hover:text-foreground"
          >
            View all &rarr;
          </Link>
        </div>
        <p className="mt-1 text-sm text-muted">
          To learn more about me, please use the sidebar to take you to the
          desired page.
        </p>
        <div className="mt-6">
          <PhotoGrid
            photos={glimpsePhotos}
            priorityCount={3}
            columnBreakpoints={{ base: 2, sm: 2, lg: 2 }}
          />
        </div>
      </FadeIn>
    </div>
  );
}
