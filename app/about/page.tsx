import type { Metadata } from "next";
import Image from "next/image";
import FadeIn from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Gökberk Çelebi — a Bioengineering student at IZTECH (Izmir Institute of Technology), İzmir, Türkiye.",
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl">
      <FadeIn>
        <div className="relative aspect-video w-full overflow-hidden rounded-md bg-border">
          <Image
            src="/images/gokberk.jpeg"
            alt="Gökberk Çelebi"
            fill
            sizes="(max-width: 768px) 100vw, 640px"
            className="object-cover object-[50%_82%]"
            priority
          />
        </div>
        <span className="mt-8 block font-[family-name:var(--font-label)] text-xs font-semibold uppercase tracking-wide text-accent">
          About
        </span>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight">
          Gökberk Çelebi
        </h1>
        <div className="mt-6 space-y-5 leading-relaxed text-foreground/90">
          <p>Hello,</p>
          <p>
            I&rsquo;m Gökberk. I&rsquo;m a Bioengineering student at IZTECH
            and I built this space to document the things I&rsquo;m working
            on and the curiosities I pick up along the way. It&rsquo;s a bit
            of a living project—I&rsquo;ll be updating it as I go, alongside a
            small journal where I share the music, art, and random moments
            that stick with me.
          </p>
          <p>
            I&rsquo;d love to meet more people who are curious about the same
            things I am. If anything on this site sparks an interest, please
            reach out; I&rsquo;m always up for a conversation.
          </p>
        </div>
      </FadeIn>
    </div>
  );
}
