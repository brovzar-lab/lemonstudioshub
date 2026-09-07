import { getTranslations } from "next-intl/server";

type StatTile = {
  labelKey: string;
  value: number;
  variant: "neutral" | "blocked" | "pitching" | "ontrack";
};

const DEMO_STATS: StatTile[] = [
  { labelKey: "activeProjects", value: 8, variant: "neutral" },
  { labelKey: "blocked", value: 2, variant: "blocked" },
  { labelKey: "pitching", value: 2, variant: "pitching" },
  { labelKey: "onTrack", value: 4, variant: "ontrack" },
];

const variantClass: Record<StatTile["variant"], string> = {
  neutral: "text-text-primary",
  blocked: "text-status-blocked",
  pitching: "text-status-atrisk",
  ontrack: "text-status-ontrack",
};

export async function QuickStats() {
  const t = await getTranslations("commandCenter.stats");

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {DEMO_STATS.map((stat) => (
        <div
          key={stat.labelKey}
          className="rounded-lg border border-border bg-surface-elevated px-5 py-4"
        >
          <p className={`text-3xl font-bold tabular-nums ${variantClass[stat.variant]}`}>
            {stat.value}
          </p>
          <p className="mt-1 text-xs font-medium uppercase tracking-wider text-text-muted">
            {t(stat.labelKey as "activeProjects" | "blocked" | "pitching" | "onTrack")}
          </p>
        </div>
      ))}
    </div>
  );
}
