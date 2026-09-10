import { getTranslations } from "next-intl/server";

type Verdict = "RECOMMEND" | "CONSIDER" | "PASS";

type CoverageRecord = {
  id: string;
  reader: string;
  date: Date;
  verdict: Verdict;
  documentVersion: number;
  excerpt: string;
};

const DEMO_COVERAGE: CoverageRecord[] = [
  {
    id: "cov-1",
    reader: "Isabel Torres",
    date: new Date("2026-09-02T11:30:00"),
    verdict: "RECOMMEND",
    documentVersion: 3,
    excerpt:
      "El guion presenta una voz narrativa singular y personajes con motivaciones complejas. El giro del segundo acto es inesperado y funciona bien. Recomiendo considerar para desarrollo inmediato.",
  },
  {
    id: "cov-2",
    reader: "Miguel Reyes",
    date: new Date("2026-08-18T15:10:00"),
    verdict: "CONSIDER",
    documentVersion: 2,
    excerpt:
      "La premisa es sólida pero el tercer acto pierde ritmo. Los personajes secundarios necesitan más desarrollo. Vale la pena continuar si se revisan los últimos 25 páginas antes de presentar.",
  },
  {
    id: "cov-3",
    reader: "Isabel Torres",
    date: new Date("2026-08-01T09:00:00"),
    verdict: "PASS",
    documentVersion: 1,
    excerpt:
      "El borrador inicial no logra establecer el tono con claridad. La estructura es confusa en el primer acto. Se recomienda revisión profunda antes de la siguiente lectura.",
  },
];

const VERDICT_STYLES: Record<Verdict, { label: { es: string; en: string }; classes: string }> = {
  RECOMMEND: {
    label: { es: "RECOMENDAR", en: "RECOMMEND" },
    classes: "bg-status-ontrack/10 text-status-ontrack",
  },
  CONSIDER: {
    label: { es: "CONSIDERAR", en: "CONSIDER" },
    classes: "bg-status-atrisk/10 text-status-atrisk",
  },
  PASS: {
    label: { es: "PASAR", en: "PASS" },
    classes: "bg-status-blocked/10 text-status-blocked",
  },
};

function formatDate(date: Date, locale: string) {
  return date.toLocaleDateString(locale === "es" ? "es-MX" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

type Props = {
  locale: string;
  demoMode?: boolean;
};

export async function CoverageTab({ locale, demoMode = false }: Props) {
  const t = await getTranslations("cockpit");
  const lang = locale === "es" ? "es" : "en";

  return (
    <section aria-label={t("tabs.cobertura")}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-text-muted">
          {t("tabs.cobertura")}
        </h2>
        <div className="flex items-center gap-3 text-xs text-text-muted">
          <span className="inline-flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-status-ontrack" />
            {VERDICT_STYLES.RECOMMEND.label[lang]}:{" "}
            {DEMO_COVERAGE.filter((c) => c.verdict === "RECOMMEND").length}
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-status-atrisk" />
            {VERDICT_STYLES.CONSIDER.label[lang]}:{" "}
            {DEMO_COVERAGE.filter((c) => c.verdict === "CONSIDER").length}
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-status-blocked" />
            {VERDICT_STYLES.PASS.label[lang]}:{" "}
            {DEMO_COVERAGE.filter((c) => c.verdict === "PASS").length}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {DEMO_COVERAGE.map((record) => {
          const style = VERDICT_STYLES[record.verdict];
          return (
            <div
              key={record.id}
              className="rounded-lg border border-border bg-white p-4"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${style.classes}`}
                  >
                    {style.label[lang]}
                  </span>
                  <span className="text-sm font-medium text-text-primary">
                    {record.reader}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs text-text-muted">
                    {formatDate(record.date, locale)}
                  </div>
                  <div className="text-xs text-text-muted mt-0.5">
                    v{record.documentVersion}
                  </div>
                </div>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed border-l-2 border-border pl-3 italic">
                &ldquo;{record.excerpt}&rdquo;
              </p>
            </div>
          );
        })}
      </div>

      {demoMode && (
        <p className="mt-3 text-xs text-text-muted italic text-right">
          {t("coverage.demoNote")}
        </p>
      )}
    </section>
  );
}
