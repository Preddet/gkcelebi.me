"use client";

import { useEffect, useState } from "react";
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
  { href: "/resume", label: "Resume" },
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
  {
    href: "https://github.com/Preddet",
    label: "GitHub",
    icon: GithubIcon,
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

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={17} height={17} fill="currentColor" {...props}>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.113.793-.26.793-.577 0-.285-.01-1.04-.016-2.04-3.338.725-4.043-1.61-4.043-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.42-1.305.762-1.605-2.665-.303-5.467-1.333-5.467-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.4 3.003-.404 1.02.004 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.655 1.652.243 2.873.12 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.604-.014 2.897-.014 3.293 0 .32.192.694.8.576C20.565 21.796 24 17.298 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" {...props}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const sidebarBody = (
    <>
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
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3 md:hidden">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/logo-mark.png" alt="Gökberk Çelebi" width={28} height={28} />
          <span className="font-[family-name:var(--font-label)] text-sm font-bold">
            Gökberk Çelebi
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="p-1 text-foreground"
        >
          <MenuIcon />
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-50 md:hidden ${open ? "" : "pointer-events-none"}`}>
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/40 transition-opacity ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          className="absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col justify-between overflow-y-auto bg-background px-8 py-10 shadow-xl transition-transform duration-300"
          style={{ transform: open ? "translateX(0)" : "translateX(-100%)" }}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="absolute right-4 top-4 text-muted transition-colors hover:text-foreground"
          >
            <CloseIcon />
          </button>
          {sidebarBody}
        </aside>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden shrink-0 flex-col justify-between border-border px-8 py-10 md:flex md:h-screen md:w-72 md:border-r md:sticky md:top-0">
        {sidebarBody}
      </aside>
    </>
  );
}
