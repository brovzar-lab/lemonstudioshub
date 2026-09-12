"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

type Result = {
  id: string;
  title: string;
  format: string;
  stage: string;
  ownerName: string | null;
  health: string;
};

const DEMO_PROJECTS: Result[] = [
  { id: "demo-blocked", title: "La Última Frontera", format: "FEATURE", stage: "DEVELOPMENT", ownerName: "Ana García", health: "BLOCKED" },
  { id: "demo-atrisk", title: "El Peso de las Flores", format: "SHORT", stage: "READING", ownerName: "Carlos Mendez", health: "AT_RISK" },
  { id: "demo-verano", title: "Verano Eterno", format: "LIMITED_SERIES", stage: "PITCHING", ownerName: "María Torres", health: "ON_TRACK" },
  { id: "demo-astronauta", title: "El Astronauta", format: "FEATURE", stage: "DEVELOPMENT", ownerName: "Ana García", health: "ON_TRACK" },
  { id: "demo-noowner", title: "Sin Nombre", format: "DOCUMENTARY", stage: "INBOX", ownerName: null, health: "STALE" },
  { id: "demo-horizonte", title: "Horizonte Norte", format: "FEATURE", stage: "PACKAGING", ownerName: "Ricardo Vega", health: "ON_TRACK" },
  { id: "demo-dias", title: "Días de Gloria", format: "RETURNING_SERIES", stage: "PITCHING", ownerName: "María Torres", health: "AT_RISK" },
  { id: "demo-herencia", title: "La Herencia", format: "FEATURE", stage: "SUBMITTED", ownerName: "Carlos Mendez", health: "ON_TRACK" },
  { id: "demo-ultimo-tren", title: "El Último Tren", format: "LIMITED_SERIES", stage: "PITCHING", ownerName: "Carlos Mendez", health: "BLOCKED" },
];

const HEALTH_DOT: Record<string, string> = {
  BLOCKED: "text-status-blocked",
  AT_RISK: "text-status-atrisk",
  ON_TRACK: "text-status-ontrack",
  STALE: "text-status-stale",
};

const FORMAT_LABELS: Record<string, { es: string; en: string }> = {
  FEATURE: { es: "Largometraje", en: "Feature" },
  LIMITED_SERIES: { es: "Serie Limitada", en: "Limited Series" },
  RETURNING_SERIES: { es: "Serie en Curso", en: "Returning Series" },
  SHORT: { es: "Cortometraje", en: "Short" },
  DOCUMENTARY: { es: "Documental", en: "Documentary" },
};

const STAGE_LABELS: Record<string, { es: string; en: string }> = {
  INBOX: { es: "Entrada", en: "Inbox" },
  TRIAGE: { es: "Clasificación", en: "Triage" },
  READING: { es: "Lectura", en: "Reading" },
  DEVELOPMENT: { es: "Desarrollo", en: "Development" },
  PACKAGING: { es: "Empaque", en: "Packaging" },
  PITCHING: { es: "Presentación", en: "Pitching" },
  SUBMITTED: { es: "Enviado", en: "Submitted" },
};

type Props = {
  locale: string;
};

export function CommandKSearch({ locale }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const lang = locale === "es" ? "es" : "en";

  const results = query.trim()
    ? DEMO_PROJECTS.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.ownerName?.toLowerCase().includes(q) ||
          p.stage.toLowerCase().includes(q) ||
          (FORMAT_LABELS[p.format]?.[lang] ?? "").toLowerCase().includes(q) ||
          (STAGE_LABELS[p.stage]?.[lang] ?? "").toLowerCase().includes(q)
        );
      })
    : DEMO_PROJECTS.slice(0, 6);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setSelectedIdx(0);
  }, []);

  const navigate = useCallback((id: string) => {
    router.push(`/${locale}/projects/${id}`);
    close();
  }, [router, locale, close]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (!open) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIdx((i) => Math.min(i + 1, results.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIdx((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter" && results[selectedIdx]) {
        navigate(results[selectedIdx].id);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, results, selectedIdx, close, navigate]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIdx(0);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIdx(0);
  }, [query]);

  if (!open) return null;

  const placeholder = lang === "es" ? "Buscar proyectos…" : "Search projects…";
  const noResults = lang === "es" ? "Sin resultados" : "No results";
  const openLabel = lang === "es" ? "Abrir proyecto" : "Open project";

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] p-4"
      role="dialog"
      aria-modal="true"
      aria-label={lang === "es" ? "Búsqueda rápida" : "Quick search"}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={close} />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-xl rounded-xl bg-white border border-border shadow-2xl overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <span className="text-text-muted text-base" aria-hidden="true">⌕</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="flex-1 text-sm text-text-primary placeholder:text-text-muted bg-transparent focus:outline-none"
          />
          <kbd className="shrink-0 inline-flex items-center rounded border border-border px-1.5 py-0.5 text-xs font-mono text-text-muted">
            esc
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto">
          {results.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-text-muted">{noResults}</div>
          ) : (
            <ul role="listbox">
              {results.map((p, idx) => (
                <li key={p.id} role="option" aria-selected={idx === selectedIdx}>
                  <button
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                      idx === selectedIdx ? "bg-accent/5" : "hover:bg-surface"
                    }`}
                    onClick={() => navigate(p.id)}
                    onMouseEnter={() => setSelectedIdx(idx)}
                  >
                    <span
                      className={`shrink-0 text-sm ${HEALTH_DOT[p.health] ?? "text-text-muted"}`}
                      aria-hidden="true"
                    >
                      ●
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">{p.title}</p>
                      <p className="text-xs text-text-muted mt-0.5">
                        {FORMAT_LABELS[p.format]?.[lang] ?? p.format}
                        {" · "}
                        {STAGE_LABELS[p.stage]?.[lang] ?? p.stage}
                        {p.ownerName && ` · ${p.ownerName}`}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-text-muted opacity-0 group-hover:opacity-100">
                      {openLabel} →
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer hint */}
        <div className="flex items-center gap-4 px-4 py-2 border-t border-border bg-surface">
          <span className="text-xs text-text-muted flex items-center gap-1">
            <kbd className="inline-flex items-center rounded border border-border px-1 py-0.5 text-[10px] font-mono">↑↓</kbd>
            {lang === "es" ? "navegar" : "navigate"}
          </span>
          <span className="text-xs text-text-muted flex items-center gap-1">
            <kbd className="inline-flex items-center rounded border border-border px-1 py-0.5 text-[10px] font-mono">↵</kbd>
            {lang === "es" ? "abrir" : "open"}
          </span>
          <span className="text-xs text-text-muted flex items-center gap-1">
            <kbd className="inline-flex items-center rounded border border-border px-1 py-0.5 text-[10px] font-mono">esc</kbd>
            {lang === "es" ? "cerrar" : "close"}
          </span>
          {query === "" && (
            <span className="ml-auto text-xs text-text-muted italic">
              {lang === "es" ? "Datos de demo" : "Demo data"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
