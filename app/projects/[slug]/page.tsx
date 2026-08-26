import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import FadeIn from "@/components/FadeIn";
import PhotoGrid from "@/components/PhotoGrid";
import { getProjects, getProject } from "@/lib/content";

export function generateStaticParams() {
  return getProjects()
    .filter((project) => !project.inline)
    .map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Projects" };
  return {
    title: project.title,
    description: `${project.title} — a project by Gökberk Çelebi.`,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project || project.inline) notFound();

  const more = getProjects()
    .filter((p) => p.slug !== slug)
    .slice(0, 2);

  return (
    <div className="max-w-2xl">
      <FadeIn>
        <Link
          href="/projects"
          className="inline-block font-[family-name:var(--font-label)] text-xs text-muted transition-colors hover:text-foreground"
        >
          &larr; All projects
        </Link>

        <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight">
          {project.title}
        </h1>
        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block font-[family-name:var(--font-label)] text-sm font-semibold uppercase tracking-wide text-accent transition-colors hover:text-foreground"
          >
            {project.linkLabel ?? "View project"} &rarr;
          </a>
        )}

        {project.thumbnail && (
          <div className="relative mt-6 aspect-[3/4] max-w-md overflow-hidden rounded-md bg-border">
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 448px"
              priority
              className="object-cover"
            />
          </div>
        )}

        <div className="prose-journal mt-8 space-y-5 leading-relaxed text-foreground/90">
          <MDXRemote source={project.content} />
        </div>

        {project.gallery && (
          <div className="mt-8">
            <PhotoGrid photos={project.gallery} columnBreakpoints={{ base: 2, sm: 2, lg: 3 }} />
          </div>
        )}
      </FadeIn>

      {more.length > 0 && (
        <FadeIn delay={0.15} className="mt-16 border-t border-border pt-8">
          <div className="flex items-baseline justify-between">
            <h2 className="font-[family-name:var(--font-label)] text-xs font-semibold uppercase tracking-wide text-muted">
              More Projects
            </h2>
            <Link
              href="/projects"
              className="font-[family-name:var(--font-label)] text-xs text-muted transition-colors hover:text-foreground"
            >
              View all projects
            </Link>
          </div>
          <div className="mt-4 divide-y divide-border">
            {more.map((p) =>
              p.inline ? (
                <a
                  key={p.slug}
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-baseline justify-between gap-4 py-4"
                >
                  <span className="font-[family-name:var(--font-display)] transition-colors group-hover:text-accent">
                    {p.title}
                  </span>
                </a>
              ) : (
                <Link
                  key={p.slug}
                  href={`/projects/${p.slug}`}
                  className="group flex items-baseline justify-between gap-4 py-4"
                >
                  <span className="font-[family-name:var(--font-display)] transition-colors group-hover:text-accent">
                    {p.title}
                  </span>
                </Link>
              )
            )}
          </div>
        </FadeIn>
      )}
    </div>
  );
}
