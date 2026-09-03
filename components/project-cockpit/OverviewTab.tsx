import { getTranslations, getLocale } from "next-intl/server";
import type { Health } from "@prisma/client";
import type { CockpitProject } from "@/lib/types/project";

type Props = {
  project: CockpitProject;
};

function formatDueDate(date: Date, locale: string): string {
  return date.toLocaleDateString(locale === "es" ? "es-MX" : "en-US", {
    day: "numeric",
    month: "short",
  });
}

function Initials({ name }: { name: string }) {
  const parts = name.split(" ").filter(Boolean);
  const initials =
    parts.length >= 2
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : (parts[0]?.[0] ?? "?");

  return (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-surface-elevated border border-border text-xs font-semibold text-text-secondary uppercase">
      {initials}
    </span>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 py-4 border-b border-border last:border-b-0">
      <dt className="text-xs font-semibold uppercase tracking-widest text-text-muted">{label}</dt>
      <dd className="text-sm text-text-primary">{children}</dd>
    </div>
  );
}

const healthTextColors: Record<Health, string> = {
  BLOCKED: "text-status-blocked",
  AT_RISK: "text-status-atrisk",
  ON_TRACK: "text-status-ontrack",
  STALE: "text-status-stale",
};

export async function OverviewTab({ project }: Props) {
  const t = await getTranslations("cockpit");
  const locale = await getLocale();

  const ownerName = project.owner?.name ?? project.owner?.email ?? null;

  return (
    <section aria-label={t("tabs.resumen")}>
      <dl className="rounded-lg border border-border bg-white divide-y divide-border px-6">

        <FieldRow label={t("overview.nextAction")}>
          {project.nextAction ? (
            <div className="flex flex-col gap-0.5">
              <span>{project.nextAction}</span>
              <div className="flex flex-wrap items-center gap-3 text-xs text-text-secondary mt-0.5">
                {project.nextActionDue && (
                  <span>
                    {t("overview.dueDate", {
                      date: formatDueDate(project.nextActionDue, locale),
                    })}
                  </span>
                )}
                {project.nextActionOwner && (
                  <span className="text-text-muted">{project.nextActionOwner}</span>
                )}
              </div>
            </div>
          ) : (
            <span className="text-text-muted italic">{t("overview.noNextAction")}</span>
          )}
        </FieldRow>

        <FieldRow label={t("overview.owner")}>
          {ownerName ? (
            <div className="flex items-center gap-2">
              {project.owner?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={project.owner.image}
                  alt={ownerName}
                  className="h-8 w-8 rounded-full object-cover border border-border"
                />
              ) : (
                <Initials name={ownerName} />
              )}
              <span>{ownerName}</span>
            </div>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-status-blocked font-medium">
              <span aria-hidden="true">⚠</span>
              {t("overview.noOwner")}
            </span>
          )}
        </FieldRow>

        <FieldRow label={t("overview.logline")}>
          {project.logline ? (
            <p className="text-text-primary leading-relaxed">{project.logline}</p>
          ) : (
            <span className="text-text-muted italic">{t("overview.noLogline")}</span>
          )}
        </FieldRow>

        <FieldRow label={t("overview.stage")}>
          <span className="font-medium">{t(`stage.${project.stage}`)}</span>
          {/* Stage transition history — placeholder for Phase 3b */}
        </FieldRow>

        <FieldRow label={t("overview.health")}>
          <div className="flex flex-wrap items-baseline gap-2">
            <span className={`font-semibold ${healthTextColors[project.health]}`}>
              {t(`health.${project.health}`)}
            </span>
            {project.healthOverride && (
              <span className="text-xs text-text-muted">{t("overview.manualOverride")}</span>
            )}
          </div>
        </FieldRow>

      </dl>
    </section>
  );
}
