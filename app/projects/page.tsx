import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import FadeIn from "@/components/FadeIn";
import { getProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects",
  description: "Bioengineering and software projects by Gökberk Çelebi, including SmartEpitope.",
};

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

      <div className="mt-10 space-y-12">
        {projects.map((project, i) => (
          <FadeIn key={project.slug} delay={i * 0.1}>
            {project.url ? (
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="font-[family-name:var(--font-display)] text-xl font-medium transition-colors hover:text-accent"
              >
                {project.title} &rarr;
              </a>
            ) : (
              <h2 className="font-[family-name:var(--font-display)] text-xl font-medium">
                {project.title}
              </h2>
            )}
            <div className="prose-journal mt-3 leading-relaxed text-foreground/90">
              <MDXRemote source={project.content} />
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
