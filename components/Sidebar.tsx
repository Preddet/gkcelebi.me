"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import CopyEmailButton from "./CopyEmailButton";
import BachButton from "./BachButton";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/journal", label: "Journal" },
  { href: "/projects", label: "Projects" },
  { href: "/photos", label: "Photos" },
  { href: "/contact", label: "Contact" },
];

const SOCIAL_LINKS = [
  {
    href: "https://open.spotify.com/user/utpkb99568j8ads02vigobrhn",
    label: "Spotify",
    icon: SpotifyIcon,
  },
  {
    href: "https://www.linkedin.com/in/g%C3%B6kberk-%C3%A7elebi/",
    label: "LinkedIn",
    icon: LinkedinIcon,
  },
  {
    href: "https://www.instagram.com/gokberk_celebi/",
    label: "Instagram",
    icon: InstagramIcon,
  },
  {
    href: "https://www.behance.net/gkberkelebi",
    label: "Behance",
    icon: BehanceIcon,
  },
];

function iconProps(props: React.SVGProps<SVGSVGElement>) {
  return {
    xmlns: "http://www.w3.org/2000/svg",
    width: 17,
    height: 17,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...props,
  };
}

function SpotifyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={17} height={17} fill="currentColor" {...props}>
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.49 17.306c-.215.353-.675.463-1.027.248-2.863-1.748-6.464-2.144-10.707-1.177-.404.093-.804-.162-.897-.565-.093-.403.162-.803.565-.896 4.638-1.06 8.614-.604 11.818 1.362.353.216.463.676.248 1.028zm1.223-2.723c-.27.44-.845.578-1.284.308-3.278-2.016-8.276-2.6-12.156-1.423-.494.15-1.016-.13-1.166-.624-.149-.494.13-1.016.625-1.165 4.432-1.345 9.938-.694 13.694 1.62.44.27.578.845.287 1.284zm.105-2.835C15.29 9.412 8.774 9.19 5.026 10.335c-.593.18-1.22-.155-1.399-.748-.18-.593.155-1.22.748-1.4 4.301-1.305 11.49-1.05 16.028 1.62.53.312.706.99.394 1.52-.31.53-.99.706-1.52.394z" />
    </svg>
  );
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps(props)}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps(props)}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function BehanceIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={17} height={17} fill="none" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth={2} />
      <text
        x="12"
        y="16"
        textAnchor="middle"
        fontSize="9"
        fontWeight="700"
        fill="currentColor"
        fontFamily="Arial, sans-serif"
      >
        Bē
      </text>
    </svg>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-full shrink-0 flex-col justify-between border-border px-8 py-10 md:h-screen md:w-72 md:border-r md:sticky md:top-0">
      <div>
        <Link href="/" className="flex flex-col items-start">
          <Image
            src="/images/logo-mark.png"
            alt="Gökberk Çelebi"
            width={64}
            height={64}
            className="rounded-none"
          />
          <div className="mt-4 font-[family-name:var(--font-label)]">
            <div className="text-lg font-bold leading-tight">Gökberk Çelebi</div>
            <div className="text-sm text-muted leading-tight">
              Bioengineering &middot; Photography
            </div>
          </div>
        </Link>

        <nav className="mt-10 flex flex-col gap-4">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-[family-name:var(--font-label)] text-lg transition-colors ${
                  active ? "text-foreground font-medium" : "text-muted hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-10 flex flex-col gap-4">
        <BachButton />
        <CopyEmailButton email="gkcelebi69@gmail.com" />
        <div className="flex items-center gap-4 text-muted">
          {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="transition-colors hover:text-foreground"
            >
              <Icon />
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}
