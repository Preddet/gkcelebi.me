"use client";

import { useState } from "react";

export default function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="group flex items-center gap-2 text-xs font-[family-name:var(--font-label)] text-muted transition-colors hover:text-foreground"
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
      {copied ? "Copied!" : "Copy e-mail"}
    </button>
  );
}
