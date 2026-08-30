// Shared styling tokens for the ELISA tool, matching the site design system.

export const PRIMARY_BTN =
  "rounded-md bg-foreground px-4 py-2 font-[family-name:var(--font-label)] text-sm text-background transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40";

export const SECONDARY_BTN =
  "rounded-md border border-border px-4 py-2 font-[family-name:var(--font-label)] text-sm transition-colors hover:border-foreground disabled:cursor-not-allowed disabled:opacity-40";

export const SMALL_BTN =
  "rounded border border-border px-2 py-1 font-[family-name:var(--font-label)] text-xs transition-colors hover:border-foreground disabled:cursor-not-allowed disabled:opacity-40";

export const LINK_BTN =
  "font-[family-name:var(--font-label)] text-xs text-muted underline underline-offset-2 transition-colors hover:text-foreground";

export const FIELD =
  "w-full rounded border border-border bg-background px-2 py-1 text-sm outline-none focus:border-foreground";

export const LABEL = "font-[family-name:var(--font-label)] text-xs text-muted";

// Distinct, low-saturation tints for condition bands (cycled by index).
export const CONDITION_TINTS = [
  "#fef9c3",
  "#ffedd5",
  "#e0e7ff",
  "#dcfce7",
  "#fae8ff",
  "#fee2e2",
  "#ccfbf1",
  "#f1f5f9",
];

export function conditionTint(index: number): string {
  return CONDITION_TINTS[index % CONDITION_TINTS.length];
}

export const ROLE_STYLES: Record<string, { bg: string; label: string }> = {
  sample: { bg: "transparent", label: "sample" },
  blank: { bg: "#fef08a", label: "blank" },
  empty: { bg: "#f8f8f8", label: "empty" },
};
