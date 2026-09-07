import { getTranslations } from "next-intl/server";

type ActivityEvent = {
  id: string;
  actor: string;
  kind: "documentUploaded" | "stageChanged" | "coverageAdded" | "projectCreated" | "taskCompleted";
  projectTitle: string;
  detail: string;
  timestamp: Date;
};

const DEMO_ACTIVITY: ActivityEvent[] = [
  {
    id: "a1",
    actor: "Ana García",
    kind: "documentUploaded",
    projectTitle: "El Astronauta",
    detail: "guion_v4.pdf",
    timestamp: new Date(Date.now() - 1 * 3600_000),
  },
  {
    id: "a2",
    actor: "María Torres",
    kind: "stageChanged",
    projectTitle: "Verano Eterno",
    detail: "PITCHING",
    timestamp: new Date(Date.now() - 3 * 3600_000),
  },
  {
    id: "a3",
    actor: "Sistema",
    kind: "projectCreated",
    projectTitle: "Sin Nombre",
    detail: "",
    timestamp: new Date(Date.now() - 6 * 3600_000),
  },
  {
    id: "a4",
    actor: "Carlos Mendez",
    kind: "coverageAdded",
    projectTitle: "El Astronauta",
    detail: "RECOMMEND",
    timestamp: new Date(Date.now() - 26 * 3600_000),
  },
  {
    id: "a5",
    actor: "Ricardo Vega",
    kind: "taskCompleted",
    projectTitle: "Horizonte Norte",
    detail: "",
    timestamp: new Date(Date.now() - 28 * 3600_000),
  },
  {
    id: "a6",
    actor: "María Torres",
    kind: "stageChanged",
    projectTitle: "Días de Gloria",
    detail: "PITCHING",
    timestamp: new Date(Date.now() - 3 * 86400_000),
  },
  {
    id: "a7",
    actor: "Ana García",
    kind: "coverageAdded",
    projectTitle: "La Última Frontera",
    detail: "RECOMMEND",
    timestamp: new Date(Date.now() - 3 * 86400_000 - 3600_000),
  },
];

function timeAgo(date: Date): { key: string; n?: number } {
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  const diffH = Math.floor(diffMs / 3600_000);
  const diffD = Math.floor(diffMs / 86400_000);

  if (diffMin < 1) return { key: "justNow" };
  if (diffH < 1) return { key: "minutesAgo", n: diffMin };
  if (diffD < 1) return { key: "hoursAgo", n: diffH };
  if (diffD === 1) return { key: "yesterday" };
  return { key: "daysAgo", n: diffD };
}

function actorInitials(name: string): string {
  if (name === "Sistema") return "S";
  const parts = name.split(" ").filter(Boolean);
  return parts.length >= 2
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`
    : (parts[0]?.[0] ?? "?");
}

export async function RecentActivity() {
  const t = await getTranslations("commandCenter.activity");
  const stageT = await getTranslations("cockpit.stage");

  return (
    <section className="rounded-lg border border-border bg-surface-elevated overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
          {t("title")}
        </h2>
      </div>

      {DEMO_ACTIVITY.length === 0 ? (
        <p className="px-6 py-4 text-sm text-text-muted">{t("empty")}</p>
      ) : (
        <ul className="divide-y divide-border">
          {DEMO_ACTIVITY.map((event) => {
            const ago = timeAgo(event.timestamp);
            const agoStr =
              ago.key === "justNow"
                ? t("timeAgo.justNow")
                : ago.key === "yesterday"
                  ? t("timeAgo.yesterday")
                  : t(`timeAgo.${ago.key}` as Parameters<typeof t>[0], { n: ago.n ?? 0 });

            let description: string;
            switch (event.kind) {
              case "documentUploaded":
                description = `${t("events.documentUploaded", { filename: event.detail })} ${event.projectTitle}`;
                break;
              case "stageChanged":
                description = `${t("events.stageChanged", { stage: stageT(event.detail as Parameters<typeof stageT>[0]) })} ${event.projectTitle}`;
                break;
              case "coverageAdded":
                description = `${t("events.coverageAdded", { verdict: event.detail })} ${event.projectTitle}`;
                break;
              case "projectCreated":
                description = `${t("events.projectCreated")} ${event.projectTitle}`;
                break;
              case "taskCompleted":
                description = `${t("events.taskCompleted")} ${event.projectTitle}`;
                break;
            }

            return (
              <li key={event.id} className="flex items-start gap-3 px-6 py-3">
                <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface border border-border text-xs font-semibold text-text-secondary uppercase">
                  {actorInitials(event.actor)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary">
                    <span className="font-medium">{event.actor}</span>{" "}
                    <span className="text-text-secondary">{description}</span>
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">{agoStr}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
