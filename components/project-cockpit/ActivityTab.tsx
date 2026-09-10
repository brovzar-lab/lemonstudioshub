import { getTranslations } from "next-intl/server";

type ActivityKind =
  | "PROJECT_CREATED"
  | "STAGE_CHANGED"
  | "DOCUMENT_UPLOADED"
  | "COVERAGE_ADDED"
  | "TASK_ASSIGNED"
  | "BLOCKER_SET"
  | "BLOCKER_CLEARED";

type ActivityEntry = {
  id: string;
  kind: ActivityKind;
  actor: string;
  timestamp: Date;
  detail: { es: string; en: string };
};

const DEMO_ACTIVITY: ActivityEntry[] = [
  {
    id: "act-7",
    kind: "BLOCKER_SET",
    actor: "Carlos Mendez",
    timestamp: new Date("2026-09-05T10:15:00"),
    detail: {
      es: "Bloqueador establecido: Esperando respuesta de coproductor internacional",
      en: "Blocker set: Waiting for response from international co-producer",
    },
  },
  {
    id: "act-6",
    kind: "COVERAGE_ADDED",
    actor: "Isabel Torres",
    timestamp: new Date("2026-09-02T11:30:00"),
    detail: {
      es: "Cobertura añadida a v3 — Veredicto: RECOMENDAR",
      en: "Coverage added on v3 — Verdict: RECOMMEND",
    },
  },
  {
    id: "act-5",
    kind: "DOCUMENT_UPLOADED",
    actor: "Ana García",
    timestamp: new Date("2026-08-28T14:22:00"),
    detail: {
      es: "ElUltimoTren_v3_FINAL.pdf subido y marcado como versión canónica",
      en: "ElUltimoTren_v3_FINAL.pdf uploaded and marked as canonical",
    },
  },
  {
    id: "act-4",
    kind: "STAGE_CHANGED",
    actor: "Carlos Mendez",
    timestamp: new Date("2026-08-20T16:00:00"),
    detail: {
      es: "Etapa cambiada de DESARROLLO → PRESENTACIÓN",
      en: "Stage changed from DEVELOPMENT → PITCHING",
    },
  },
  {
    id: "act-3",
    kind: "COVERAGE_ADDED",
    actor: "Miguel Reyes",
    timestamp: new Date("2026-08-18T15:10:00"),
    detail: {
      es: "Cobertura añadida a v2 — Veredicto: CONSIDERAR",
      en: "Coverage added on v2 — Verdict: CONSIDER",
    },
  },
  {
    id: "act-2",
    kind: "TASK_ASSIGNED",
    actor: "Ana García",
    timestamp: new Date("2026-08-10T09:00:00"),
    detail: {
      es: "Tarea asignada a Carlos Mendez: Enviar propuesta de presupuesto",
      en: "Task assigned to Carlos Mendez: Send budget proposal",
    },
  },
  {
    id: "act-1",
    kind: "PROJECT_CREATED",
    actor: "Carlos Mendez",
    timestamp: new Date("2026-07-30T16:10:00"),
    detail: {
      es: "Proyecto creado · Formato: SERIE LIMITADA · Etapa inicial: ENTRADA",
      en: "Project created · Format: LIMITED SERIES · Initial stage: INBOX",
    },
  },
];

const KIND_ICONS: Record<ActivityKind, string> = {
  PROJECT_CREATED: "✦",
  STAGE_CHANGED: "→",
  DOCUMENT_UPLOADED: "↑",
  COVERAGE_ADDED: "◎",
  TASK_ASSIGNED: "☐",
  BLOCKER_SET: "⚠",
  BLOCKER_CLEARED: "✓",
};

const KIND_COLORS: Record<ActivityKind, string> = {
  PROJECT_CREATED: "text-accent",
  STAGE_CHANGED: "text-text-secondary",
  DOCUMENT_UPLOADED: "text-status-ontrack",
  COVERAGE_ADDED: "text-accent",
  TASK_ASSIGNED: "text-text-secondary",
  BLOCKER_SET: "text-status-blocked",
  BLOCKER_CLEARED: "text-status-ontrack",
};

function formatTimestamp(date: Date, locale: string) {
  return date.toLocaleString(locale === "es" ? "es-MX" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type Props = {
  locale: string;
  demoMode?: boolean;
};

export async function ActivityTab({ locale, demoMode = false }: Props) {
  const t = await getTranslations("cockpit");
  const lang = locale === "es" ? "es" : "en";

  return (
    <section aria-label={t("tabs.actividad")}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-text-muted">
          {t("tabs.actividad")}
        </h2>
        <span className="text-xs text-text-muted">{DEMO_ACTIVITY.length} {t("activity.entries")}</span>
      </div>

      <div className="rounded-lg border border-border bg-white divide-y divide-border overflow-hidden">
        {DEMO_ACTIVITY.map((entry) => (
          <div key={entry.id} className="flex gap-3 px-4 py-3">
            <div className={`shrink-0 w-5 text-center font-mono text-sm mt-0.5 ${KIND_COLORS[entry.kind]}`}>
              {KIND_ICONS[entry.kind]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-primary leading-snug">
                {entry.detail[lang]}
              </p>
              <div className="flex items-center gap-2 mt-1 text-xs text-text-muted">
                <span>{entry.actor}</span>
                <span aria-hidden="true">·</span>
                <span>{formatTimestamp(entry.timestamp, locale)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {demoMode && (
        <p className="mt-3 text-xs text-text-muted italic text-right">
          {t("activity.demoNote")}
        </p>
      )}
    </section>
  );
}
