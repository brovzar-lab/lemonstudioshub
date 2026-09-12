"use client";

import { useState, useCallback } from "react";

type Format = "FEATURE" | "LIMITED_SERIES" | "RETURNING_SERIES" | "SHORT" | "DOCUMENTARY";
type Stage = "INBOX" | "TRIAGE" | "READING" | "DEVELOPMENT" | "PACKAGING" | "PITCHING";
type Sensitivity = "VISIBLE_ALL" | "HIDDEN_ALL";

const FORMAT_OPTIONS: { value: Format; es: string; en: string }[] = [
  { value: "FEATURE", es: "Largometraje", en: "Feature" },
  { value: "LIMITED_SERIES", es: "Serie Limitada", en: "Limited Series" },
  { value: "RETURNING_SERIES", es: "Serie en Curso", en: "Returning Series" },
  { value: "SHORT", es: "Cortometraje", en: "Short" },
  { value: "DOCUMENTARY", es: "Documental", en: "Documentary" },
];

const STAGE_OPTIONS: { value: Stage; es: string; en: string }[] = [
  { value: "INBOX", es: "Entrada", en: "Inbox" },
  { value: "TRIAGE", es: "Clasificación", en: "Triage" },
  { value: "READING", es: "Lectura", en: "Reading" },
  { value: "DEVELOPMENT", es: "Desarrollo", en: "Development" },
  { value: "PACKAGING", es: "Empaque", en: "Packaging" },
  { value: "PITCHING", es: "Presentación", en: "Pitching" },
];

const SENSITIVITY_OPTIONS: { value: Sensitivity; es: string; en: string }[] = [
  { value: "VISIBLE_ALL", es: "Visible para todos", en: "Visible to all" },
  { value: "HIDDEN_ALL", es: "Confidencial", en: "Confidential" },
];

type Toast = { id: number; message: string };

type Props = {
  locale: string;
  demoMode?: boolean;
};

export function CreateProjectFlow({ locale, demoMode = false }: Props) {
  const [open, setOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    format: "FEATURE" as Format,
    logline: "",
    stage: "INBOX" as Stage,
    sensitivity: "VISIBLE_ALL" as Sensitivity,
  });

  const lang = locale === "es" ? "es" : "en";

  const addToast = useCallback((message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  function resetForm() {
    setForm({ title: "", format: "FEATURE", logline: "", stage: "INBOX", sensitivity: "VISIBLE_ALL" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSubmitting(true);

    if (demoMode) {
      await new Promise((r) => setTimeout(r, 600));
      setSubmitting(false);
      setOpen(false);
      resetForm();
      addToast(lang === "es" ? "Modo demo — no se guardó el proyecto" : "Demo mode — project not saved");
      return;
    }

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setOpen(false);
      resetForm();
      addToast(lang === "es" ? "Proyecto creado" : "Project created");
    } catch {
      addToast(lang === "es" ? "Error al crear proyecto" : "Failed to create project");
    } finally {
      setSubmitting(false);
    }
  }

  const labels = {
    button: { es: "Nuevo Proyecto", en: "New Project" },
    title: { es: "Título", en: "Title" },
    titlePlaceholder: { es: "Nombre del proyecto", en: "Project name" },
    format: { es: "Formato", en: "Format" },
    logline: { es: "Sinopsis", en: "Logline" },
    loglinePlaceholder: { es: "Una sola frase que capture la esencia del proyecto…", en: "One sentence capturing the essence of the project…" },
    stage: { es: "Etapa inicial", en: "Initial stage" },
    sensitivity: { es: "Visibilidad", en: "Visibility" },
    submit: { es: "Crear proyecto", en: "Create project" },
    cancel: { es: "Cancelar", en: "Cancel" },
    modalTitle: { es: "Nuevo Proyecto", en: "New Project" },
    demoNotice: { es: "Modo demo — los datos no se guardarán", en: "Demo mode — data will not be saved" },
  };

  return (
    <>
      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="rounded-lg bg-text-primary text-surface px-4 py-2.5 text-sm font-medium shadow-lg animate-in slide-in-from-bottom-2"
          >
            {t.message}
          </div>
        ))}
      </div>

      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-sm font-medium border border-border text-text-secondary hover:text-text-primary hover:border-text-muted transition-colors"
      >
        <span aria-hidden="true" className="text-base leading-none">+</span>
        {labels.button[lang]}
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={labels.modalTitle[lang]}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => { setOpen(false); resetForm(); }}
          />

          {/* Panel */}
          <div className="relative z-10 w-full max-w-lg rounded-xl bg-white border border-border shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-base font-semibold text-text-primary">
                {labels.modalTitle[lang]}
              </h2>
              <button
                onClick={() => { setOpen(false); resetForm(); }}
                className="text-text-muted hover:text-text-primary transition-colors text-lg leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {demoMode && (
              <div className="px-6 py-2 bg-status-atrisk/5 border-b border-status-atrisk/20">
                <p className="text-xs text-status-atrisk">{labels.demoNotice[lang]}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">
                  {labels.title[lang]} <span className="text-status-blocked">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder={labels.titlePlaceholder[lang]}
                  className="w-full rounded border border-border px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                />
              </div>

              {/* Format + Stage row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">
                    {labels.format[lang]}
                  </label>
                  <select
                    value={form.format}
                    onChange={(e) => setForm((f) => ({ ...f, format: e.target.value as Format }))}
                    className="w-full rounded border border-border px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                  >
                    {FORMAT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o[lang]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">
                    {labels.stage[lang]}
                  </label>
                  <select
                    value={form.stage}
                    onChange={(e) => setForm((f) => ({ ...f, stage: e.target.value as Stage }))}
                    className="w-full rounded border border-border px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                  >
                    {STAGE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o[lang]}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Logline */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">
                  {labels.logline[lang]}
                </label>
                <textarea
                  value={form.logline}
                  onChange={(e) => setForm((f) => ({ ...f, logline: e.target.value }))}
                  placeholder={labels.loglinePlaceholder[lang]}
                  rows={2}
                  className="w-full rounded border border-border px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none"
                />
              </div>

              {/* Sensitivity */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">
                  {labels.sensitivity[lang]}
                </label>
                <select
                  value={form.sensitivity}
                  onChange={(e) => setForm((f) => ({ ...f, sensitivity: e.target.value as Sensitivity }))}
                  className="w-full rounded border border-border px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                >
                  {SENSITIVITY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o[lang]}</option>
                  ))}
                </select>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => { setOpen(false); resetForm(); }}
                  className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  {labels.cancel[lang]}
                </button>
                <button
                  type="submit"
                  disabled={submitting || !form.title.trim()}
                  className="px-4 py-2 text-sm font-medium rounded bg-accent text-white hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "…" : labels.submit[lang]}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
