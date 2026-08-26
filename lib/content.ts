import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Photo } from "@/components/PhotoGrid";

const JOURNAL_DIR = path.join(process.cwd(), "content", "journal");
const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");

export type JournalPost = {
  slug: string;
  title: string;
  date: string;
  category: string;
  subtitle?: string;
  cover?: string;
  coverCredit?: string;
  youtube?: string;
  content: string;
};

export type Project = {
  slug: string;
  title: string;
  url?: string;
  linkLabel?: string;
  inline?: boolean;
  order: number;
  thumbnail?: string;
  gallery?: Photo[];
  content: string;
};

export function getJournalPosts(): JournalPost[] {
  const files = fs.readdirSync(JOURNAL_DIR).filter((f) => f.endsWith(".mdx"));
  const posts = files.map((file) => {
    const slug = file.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(JOURNAL_DIR, file), "utf8");
    const { data, content } = matter(raw);
    return { slug, content, ...(data as Omit<JournalPost, "slug" | "content">) };
  });
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getJournalPost(slug: string): JournalPost | undefined {
  return getJournalPosts().find((p) => p.slug === slug);
}

export function getProjects(): Project[] {
  const files = fs.readdirSync(PROJECTS_DIR).filter((f) => f.endsWith(".mdx"));
  const projects = files.map((file) => {
    const slug = file.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(PROJECTS_DIR, file), "utf8");
    const { data, content } = matter(raw);
    return { slug, content, ...(data as Omit<Project, "slug" | "content">) };
  });
  return projects.sort((a, b) => a.order - b.order);
}

export function getProject(slug: string): Project | undefined {
  return getProjects().find((p) => p.slug === slug);
}

export function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00Z");
  return d
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    })
    .toUpperCase()
    .replace(/ /g, " ");
}
