import { getTranslations } from "next-intl/server";
import type { Health } from "@prisma/client";
import type { CockpitProject } from "@/lib/types/project";

type Props = {
  project: CockpitProject;
};

const healthColors: Record<Health, string> = {
  BLOCKED: "bg-red-100 text-status-blocked border-red-200",
  AT_RISK: "bg-amber-100 text-status-atrisk border-amber-200",
  ON_TRACK: "bg-green-100 text-status-ontrack border-green-200",
  STALE: "bg-gray-100 text-status-stale border-gray-200",
};

export async function CockpitHeader({ project }: Props) {
  const t = await getTranslations("cockpit");

  const formatLabel = t(`format.${project.format}`);
  const stageLabel = t(`stage.${project.stage}`);
  const healthLabel = t(`health.${project.health}`);
  const ownerName = project.owner?.name ?? project.owner?.email ?? null;

  return (
    <header className="mb-4">
      <div className="flex flex-wrap items-start gap-3 mb-2">
        <h1 className="text-3xl font-semibold text-text-primary leading-tight flex-1 min-w-0">
          {project.title}
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        {/* Format badge — gray, non-status */}
        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold tracking-wide bg-gray-100 text-text-secondary border border-border">
          {formatLabel}
        </span>

        {/* Stage badge — neutral, not a status color */}
        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold tracking-wide bg-surface-elevated text-text-secondary border border-border">
          {stageLabel}
        </span>

        {/* Health badge — color matches status */}
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold tracking-wide border ${healthColors[project.health]}`}
        >
          {healthLabel}
        </span>

        {/* Sensitivity badge — HIDDEN_ALL only */}
        {project.sensitivity === "HIDDEN_ALL" && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold tracking-wide bg-gray-50 text-text-muted border border-border-strong">
            {t("header.confidential")}
          </span>
        )}
      </div>

      <p className="text-sm text-text-secondary">
        {ownerName ? (
          ownerName
        ) : (
          <span className="text-text-muted italic">{t("header.noOwner")}</span>
        )}
      </p>

      {project.blocker && (
        <div
          className="mt-4 flex items-start gap-3 rounded-lg border border-red-300 bg-red-50 px-4 py-3"
          role="alert"
        >
          <span className="text-xl leading-none select-none" aria-hidden="true">⛔</span>
          <div>
            <p className="text-sm font-semibold text-status-blocked uppercase tracking-wide mb-1">
              {t("blockerBanner.title")}
            </p>
            <p className="text-sm text-red-800">{project.blocker}</p>
          </div>
        </div>
      )}
    </header>
  );
}
