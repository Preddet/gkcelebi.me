import type { Metadata } from "next";
import FadeIn from "@/components/FadeIn";
import CopyEmailButton from "@/components/CopyEmailButton";

export const metadata: Metadata = { title: "Contact" };

const EMAILS = ["gokberkcelebi@std.iyte.edu.tr", "gkcelebi69@gmail.com"];

const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/gokberk_celebi/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/g%C3%B6kberk-%C3%A7elebi/" },
  { label: "Behance", href: "https://www.behance.net/gkberkelebi" },
  {
    label: "Spotify",
    href: "https://open.spotify.com/user/utpkb99568j8ads02vigobrhn",
  },
];

export default function ContactPage() {
  return (
    <div className="max-w-2xl">
      <FadeIn>
        <span className="font-[family-name:var(--font-label)] text-xs font-semibold uppercase tracking-wide text-accent">
          Contact
        </span>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight">
          Let&rsquo;s talk!
        </h1>
        <p className="mt-4 leading-relaxed text-foreground/90">
          Don&rsquo;t hesitate contacting me to have a chat.
        </p>
        <a
          href="https://tr.wikipedia.org/wiki/İzmir"
          target="_blank"
          rel="noreferrer"
          className="mt-6 block font-[family-name:var(--font-label)] text-base text-muted transition-colors hover:text-foreground"
        >
          İzmir, Türkiye
        </a>

        <div className="mt-8 space-y-3">
          {EMAILS.map((email) => (
            <div key={email} className="flex items-center gap-3">
              <a
                href={`mailto:${email}`}
                className="font-[family-name:var(--font-mono)] text-sm hover:text-accent"
              >
                {email}
              </a>
              <CopyEmailButton email={email} />
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-2">
          {SOCIALS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="font-[family-name:var(--font-label)] text-sm text-muted transition-colors hover:text-foreground"
            >
              {label}
            </a>
          ))}
        </div>
      </FadeIn>
    </div>
  );
}
