"use client";

type Props = {
  locale: string;
};

export function SearchButton({ locale }: Props) {
  const label = locale === "es" ? "Buscar" : "Search";

  function trigger() {
    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true })
    );
  }

  return (
    <button
      onClick={trigger}
      className="hidden sm:inline-flex items-center gap-1.5 rounded border border-border px-2.5 py-1 text-xs text-text-muted hover:text-text-secondary transition-colors"
      aria-label={label}
    >
      <span>{label}</span>
      <kbd className="font-mono text-[10px]">⌘K</kbd>
    </button>
  );
}
