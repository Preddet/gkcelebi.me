import type { Metadata } from "next";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import { getJournalPosts, formatDate } from "@/lib/content";

export const metadata: Metadata = {
  title: "Journal",
  description: "Gökberk Çelebi's journal — writing on classical music, art, and life in İzmir.",
};

export default function JournalPage() {
  const posts = getJournalPosts();

  return (
    <div className="max-w-2xl">
      <FadeIn>
        <span className="font-[family-name:var(--font-label)] text-xs font-semibold uppercase tracking-wide text-accent">
          Journal
        </span>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight">
          A bit about myself
        </h1>
      </FadeIn>

      <div className="mt-10 divide-y divide-border">
        {posts.map((post, i) => (
          <FadeIn key={post.slug} delay={i * 0.05}>
            <Link
              href={`/journal/${post.slug}`}
              className="group flex items-baseline justify-between gap-4 py-5"
            >
              <div>
                <div className="font-[family-name:var(--font-mono)] text-xs text-muted">
                  {formatDate(post.date)}
                </div>
                <div className="mt-1 font-[family-name:var(--font-display)] text-lg transition-colors group-hover:text-accent">
                  {post.title}
                </div>
              </div>
              <span className="shrink-0 font-[family-name:var(--font-label)] text-xs text-muted">
                {post.category}
              </span>
            </Link>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
