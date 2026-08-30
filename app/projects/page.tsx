import type { Metadata } from "next";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import FadeIn from "@/components/FadeIn";
import { getProjects, formatDate } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects",
  description: "Bioengineering and software projects by Gökberk Çelebi, including SmartEpitope.",
};

const TOOLS = [{ title: "ELISA Analysis Tool", href: "/tools/elisa" }];

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <div className="max-w-2xl">
      <FadeIn>
        <span className="font-[family-name:var(--font-label)] text-xs font-semibold uppercase tracking-wide text-accent">
          Projects
        </span>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight">
          Projects
        </h1>
      </FadeIn>

      {TOOLS.length > 0 && (
        <FadeIn className="mt-10">
          <span className="font-[family-name:var(--font-label)] text-xs font-semibold uppercase tracking-wide text-muted">
            Tools
          </span>
          <div className="mt-2 divide-y divide-border">
            {TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group flex items-center justify-between gap-4 py-4"
              >
                <div className="font-[family-name:var(--font-display)] text-lg transition-colors group-hover:text-accent">
                  {tool.title}
                </div>
                <span
                  aria-hidden
                  className="shrink-0 font-[family-name:var(--font-display)] text-xl text-muted transition-all group-hover:translate-x-1 group-hover:text-accent"
                >
                  &rarr;
                </span>
              </Link>
            ))}
          </div>
        </FadeIn>
      )}

      <div className="my-8 border-t border-border" />

      <div className="divide-y divide-border">
        {projects.map((project, i) =>
          project.inline ? (
            <FadeIn key={project.slug} delay={i * 0.05} className="py-5">
              {project.date && (
                <div className="font-[family-name:var(--font-mono)] text-xs text-muted">
                  {formatDate(project.date)}
                </div>
              )}
              {project.url ? (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group mt-1 inline-flex items-center gap-2 font-[family-name:var(--font-display)] text-xl font-medium transition-colors hover:text-accent"
                >
                  {project.title}
                  <span
                    aria-hidden
                    className="inline-block transition-transform group-hover:translate-x-1"
                  >
                    &rarr;
                  </span>
                </a>
              ) : (
                <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl font-medium">
                  {project.title}
                </h2>
              )}
              <div className="prose-journal mt-3 leading-relaxed text-foreground/90">
                <MDXRemote source={project.content} />
              </div>
            </FadeIn>
          ) : (
            <FadeIn key={project.slug} delay={i * 0.05}>
              <Link
                href={`/projects/${project.slug}`}
                className="group flex items-center justify-between gap-4 py-5"
              >
                <div>
                  {project.date && (
                    <div className="font-[family-name:var(--font-mono)] text-xs text-muted">
                      {formatDate(project.date)}
                    </div>
                  )}
                  <div className="mt-1 font-[family-name:var(--font-display)] text-lg transition-colors group-hover:text-accent">
                    {project.title}
                  </div>
                </div>
                <span
                  aria-hidden
                  className="shrink-0 font-[family-name:var(--font-display)] text-xl text-muted transition-all group-hover:translate-x-1 group-hover:text-accent"
                >
                  &rarr;
                </span>
              </Link>
            </FadeIn>
          )
        )}
      </div>
    </div>
  );
}
