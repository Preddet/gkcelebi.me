import type { Metadata } from "next";
import FadeIn from "@/components/FadeIn";
import {
  resumeHeader,
  summary,
  education,
  experience,
  activities,
  skills,
  languages,
  honors,
  projects,
  programs,
  certifications,
  type Entry,
} from "@/lib/resume";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Gökberk Çelebi's resume — Bioengineering student at IZTECH, research experience in antibody engineering, and personal projects.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10 first:mt-0">
      <h2 className="border-b border-border pb-2 font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function EntryBlock({ entry }: { entry: Entry }) {
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <div className="font-medium text-foreground">
          {entry.href ? (
            <a href={entry.href} target="_blank" rel="noreferrer" className="hover:text-accent">
              {entry.title}
            </a>
          ) : (
            entry.title
          )}
        </div>
        <div className="shrink-0 font-[family-name:var(--font-mono)] text-xs text-muted">
          {entry.date}
        </div>
      </div>
      {entry.subtitle && <div className="text-sm italic text-foreground/80">{entry.subtitle}</div>}
      {entry.org && <div className="text-sm text-muted">{entry.org}</div>}
      {entry.bullets && (
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90">
          {entry.bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function ResumePage() {
  return (
    <div className="max-w-2xl">
      <FadeIn>
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <span className="font-[family-name:var(--font-label)] text-xs font-semibold uppercase tracking-wide text-accent">
              Resume
            </span>
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight">
              {resumeHeader.name}
            </h1>
          </div>
          <a
            href="/files/gokberk-celebi-cv.pdf"
            className="shrink-0 font-[family-name:var(--font-label)] text-sm text-muted transition-colors hover:text-foreground"
          >
            Download PDF &darr;
          </a>
        </div>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-[family-name:var(--font-label)] text-sm text-muted">
          <span>{resumeHeader.phone}</span>
          <a href={`mailto:${resumeHeader.email}`} className="hover:text-foreground">
            {resumeHeader.email}
          </a>
          <span>{resumeHeader.location}</span>
          <a href={resumeHeader.linkedin} target="_blank" rel="noreferrer" className="hover:text-foreground">
            LinkedIn
          </a>
        </div>

        <p className="mt-6 leading-relaxed text-foreground/90">{summary}</p>

        <Section title="Education">
          <div className="space-y-6">
            {education.map((entry) => (
              <EntryBlock key={entry.title} entry={entry} />
            ))}
          </div>
        </Section>

        <Section title="Experience">
          <div className="space-y-6">
            {experience.map((entry) => (
              <EntryBlock key={entry.title} entry={entry} />
            ))}
          </div>
        </Section>

        <Section title="Activities">
          <div className="space-y-6">
            {activities.map((entry) => (
              <EntryBlock key={entry.title} entry={entry} />
            ))}
          </div>
        </Section>

        <Section title="Skills">
          <div className="space-y-2 text-sm leading-relaxed text-foreground/90">
            <p>
              <span className="font-medium text-foreground">Technical Skills: </span>
              {skills.technical}
            </p>
            <p>
              <span className="font-medium text-foreground">Software Skills: </span>
              {skills.software}
            </p>
            <p>
              <span className="font-medium text-foreground">Interests: </span>
              {skills.interests}
            </p>
          </div>
        </Section>

        <Section title="Languages">
          <div className="space-y-1.5">
            {languages.map((row) => (
              <div key={row.label} className="flex justify-between text-sm">
                <span className="font-medium text-foreground">{row.label}</span>
                <span className="text-muted">{row.value}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Honors">
          <div className="space-y-1.5">
            {honors.map((row, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="font-medium text-foreground">{row.label}</span>
                <span className="text-muted">{row.value}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Projects">
          <div className="space-y-6">
            {projects.map((entry) => (
              <EntryBlock key={entry.title} entry={entry} />
            ))}
          </div>
        </Section>

        <Section title="Professional Programs">
          <div className="space-y-6">
            {programs.map((entry) => (
              <EntryBlock key={entry.title} entry={entry} />
            ))}
          </div>
        </Section>

        <Section title="Certifications">
          <div className="space-y-1.5 text-sm">
            {certifications.map((c) => (
              <p key={c.label}>
                <span className="font-medium text-foreground">{c.label}, </span>
                <span className="text-muted">{c.org}</span>
              </p>
            ))}
          </div>
        </Section>
      </FadeIn>
    </div>
  );
}
