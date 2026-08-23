import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-full max-w-2xl flex-col items-start justify-center">
      <span className="font-[family-name:var(--font-mono)] text-sm text-muted">404</span>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight">
        Page not found
      </h1>
      <p className="mt-3 text-foreground/80">
        The page you&rsquo;re looking for doesn&rsquo;t exist, or has moved.
      </p>
      <Link
        href="/"
        className="mt-6 font-[family-name:var(--font-label)] text-sm text-accent transition-colors hover:text-foreground"
      >
        &larr; Back home
      </Link>
    </div>
  );
}
