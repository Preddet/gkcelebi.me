import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import FadeIn from "@/components/FadeIn";
import { getJournalPost, getJournalPosts, formatDate } from "@/lib/content";

export function generateStaticParams() {
  return getJournalPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getJournalPost(slug);
  return { title: post?.title ?? "Journal" };
}

export default async function JournalPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getJournalPost(slug);
  if (!post) notFound();

  const recent = getJournalPosts()
    .filter((p) => p.slug !== slug)
    .slice(0, 2);

  return (
    <div className="max-w-2xl">
      <FadeIn>
        <span className="font-[family-name:var(--font-label)] text-xs font-semibold uppercase tracking-wide text-accent">
          {post.category}
        </span>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight">
          {post.title}
        </h1>
        <div className="mt-2 font-[family-name:var(--font-mono)] text-xs text-muted">
          {formatDate(post.date)}
        </div>
        {post.subtitle && (
          <p className="mt-4 font-[family-name:var(--font-quote)] italic text-foreground/80">
            {post.subtitle}
          </p>
        )}

        {post.cover && (
          <figure className="mt-6">
            <div className="relative aspect-video overflow-hidden rounded-md bg-border">
              <Image
                src={post.cover}
                alt={post.coverCredit ?? post.title}
                fill
                sizes="(max-width: 768px) 100vw, 640px"
                className="object-cover"
              />
            </div>
            {post.coverCredit && (
              <figcaption className="mt-2 text-xs text-muted">{post.coverCredit}</figcaption>
            )}
          </figure>
        )}

        <div className="prose-journal mt-8 space-y-5 font-[family-name:var(--font-serif)] leading-relaxed text-foreground/90">
          <MDXRemote source={post.content} />
        </div>

        {post.youtube && (
          <div className="relative mt-8 aspect-video overflow-hidden rounded-md">
            <iframe
              src={`https://www.youtube.com/embed/${post.youtube}`}
              className="absolute inset-0 h-full w-full"
              title={post.title}
              allowFullScreen
            />
          </div>
        )}
      </FadeIn>

      {recent.length > 0 && (
        <FadeIn delay={0.15} className="mt-16 border-t border-border pt-8">
          <div className="flex items-baseline justify-between">
            <h2 className="font-[family-name:var(--font-label)] text-xs font-semibold uppercase tracking-wide text-muted">
              Recent Posts
            </h2>
            <Link
              href="/journal"
              className="font-[family-name:var(--font-label)] text-xs text-muted transition-colors hover:text-foreground"
            >
              View all posts
            </Link>
          </div>
          <div className="mt-4 divide-y divide-border">
            {recent.map((p) => (
              <Link
                key={p.slug}
                href={`/journal/${p.slug}`}
                className="group flex items-baseline justify-between gap-4 py-4"
              >
                <span className="font-[family-name:var(--font-display)] transition-colors group-hover:text-accent">
                  {p.title}
                </span>
                <span className="shrink-0 font-[family-name:var(--font-mono)] text-xs text-muted">
                  {formatDate(p.date)}
                </span>
              </Link>
            ))}
          </div>
        </FadeIn>
      )}
    </div>
  );
}
