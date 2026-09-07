import { getTranslations, getLocale } from "next-intl/server";
import Link from "next/link";

type Health = "BLOCKED" | "AT_RISK" | "ON_TRACK" | "STALE";
type Stage =
  | "INBOX" | "READING" | "DEVELOPMENT" | "PACKAGING"
  | "PITCHING" | "SUBMITTED";
type Format = "FEATURE" | "LIMITED_SERIES" | "RETURNING_SERIES" | "SHORT" | "DOCUMENTARY";

type DemoProject = {
  id: string;
  title: string;
  format: Format;
  stage: Stage;
  ownerName: string | null;
  health: Health;
  nextAction: string | null;
  nextActionDue: Date | null;
  blocker: string | null;
  latestVerdict: "PASS" | "CONSIDER" | "RECOMMEND" | null;
};

const DEMO_PROJECTS: DemoProject[] = [
  {
    id: "demo-blocked",
    title: "La Última Frontera",
    format: "FEATURE",
    stage: "DEVELOPMENT",
    ownerName: "Ana García",
    health: "BLOCKED",
    nextAction: "Seguimiento estado derechos IP",
    nextActionDue: new Date(Date.now() - 4 * 86400_000),
    blocker: "Estado de derechos IP sin clarificar",
    latestVerdict: "RECOMMEND",
  },
  {
    id: "demo-atrisk",
    title: "El Peso de las Flores",
    format: "SHORT",
    stage: "READING",
    ownerName: "Carlos Mendez",
    health: "AT_RISK",
    nextAction: "Cobertura de segunda lectura",
    nextActionDue: new Date(Date.now() - 2 * 86400_000),
    blocker: null,
    latestVerdict: "CONSIDER",
  },
  {
    id: "demo-verano",
    title: "Verano Eterno",
    format: "LIMITED_SERIES",
    stage: "PITCHING",
    ownerName: "María Torres",
    health: "ON_TRACK",
    nextAction: "Reunión con Netflix — preparar pitch deck",
    nextActionDue: new Date(Date.now() + 3 * 86400_000),
    blocker: null,
    latestVerdict: "RECOMMEND",
  },
  {
    id: "demo-astronauta",
    title: "El Astronauta",
    format: "FEATURE",
    stage: "DEVELOPMENT",
    ownerName: "Ana García",
    health: "ON_TRACK",
    nextAction: "Revisión de guion v3 con director",
    nextActionDue: new Date(Date.now() + 7 * 86400_000),
    blocker: null,
    latestVerdict: null,
  },
  {
    id: "demo-noowner",
    title: "Sin Nombre",
    format: "DOCUMENTARY",
    stage: "INBOX",
    ownerName: null,
    health: "STALE",
    nextAction: "Asignar lector",
    nextActionDue: null,
    blocker: null,
    latestVerdict: null,
  },
  {
    id: "demo-horizonte",
    title: "Horizonte Norte",
    format: "FEATURE",
    stage: "PACKAGING",
    ownerName: "Ricardo Vega",
    health: "ON_TRACK",
    nextAction: "Finalizar paquete de ventas",
    nextActionDue: new Date(Date.now() + 10 * 86400_000),
    blocker: null,
    latestVerdict: "RECOMMEND",
  },
  {
    id: "demo-dias",
    title: "Días de Gloria",
    format: "RETURNING_SERIES",
    stage: "PITCHING",
    ownerName: "María Torres",
    health: "AT_RISK",
    nextAction: "Seguimiento propuesta Amazon",
    nextActionDue: new Date(Date.now() + 1 * 86400_000),
    blocker: null,
    latestVerdict: "CONSIDER",
  },
  {
    id: "demo-herencia",
    title: "La Herencia",
    format: "FEATURE",
    stage: "SUBMITTED",
    ownerName: "Carlos Mendez",
    health: "ON_TRACK",
    nextAction: "Esperando decisión de Cannes",
    nextActionDue: new Date(Date.now() + 21 * 86400_000),
    blocker: null,
    latestVerdict: "RECOMMEND",
  },
];

const healthDot: Record<Health, string> = {
  BLOCKED: "text-status-blocked",
  AT_RISK: "text-status-atrisk",
  ON_TRACK: "text-status-ontrack",
  STALE: "text-status-stale",
};

const verdictClass: Record<"PASS" | "CONSIDER" | "RECOMMEND", string> = {
  PASS: "bg-status-stale/10 text-status-stale",
  CONSIDER: "bg-status-atrisk/10 text-status-atrisk",
  RECOMMEND: "bg-status-ontrack/10 text-status-ontrack",
};

function DueDateLabel({
  due,
  overdueTpl,
  dueInTpl,
  todayLabel,
}: {
  due: Date;
  overdueTpl: string;
  dueInTpl: string;
  todayLabel: string;
}) {
  const diffDays = Math.round((due.getTime() - Date.now()) / 86400_000);
  if (diffDays < 0) {
    return (
      <span className="text-status-blocked text-xs font-medium">
        {overdueTpl.replace("{days}", String(Math.abs(diffDays)))}
      </span>
    );
  }
  if (diffDays === 0) {
    return <span className="text-status-atrisk text-xs font-medium">{todayLabel}</span>;
  }
  return (
    <span className="text-text-muted text-xs">
      {dueInTpl.replace("{days}", String(diffDays))}
    </span>
  );
}

export async function ActiveProjectsGrid() {
  const t = await getTranslations("commandCenter.activeProjects");
  const cockpitT = await getTranslations("cockpit");
  const locale = await getLocale();

  const overdueTpl = t("overdue");
  const dueInTpl = t("dueIn");
  const todayLabel = t("dueToday");

  return (
    <section className="rounded-lg border border-border bg-surface-elevated overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
          {t("title")}
        </h2>
        <span className="text-xs text-text-muted">{DEMO_PROJECTS.length} proyectos</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface">
              <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-text-muted w-6" />
              <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                {t("columns.project")}
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-text-muted hidden sm:table-cell">
                {t("columns.stage")}
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-text-muted hidden md:table-cell">
                {t("columns.owner")}
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-text-muted hidden lg:table-cell">
                {t("columns.nextAction")}
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-text-muted hidden xl:table-cell">
                Veredicto
              </th>
            </tr>
          </thead>
          <tbody>
            {DEMO_PROJECTS.map((p) => (
              <tr
                key={p.id}
                className="border-b border-border last:border-b-0 hover:bg-surface transition-colors group"
              >
                <td className="px-4 py-3">
                  <span
                    className={`text-base leading-none ${healthDot[p.health]}`}
                    aria-label={p.health}
                  >
                    ●
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/${locale}/projects/${p.id}`}
                    className="block group-hover:text-text-primary"
                  >
                    <p className="font-medium text-text-primary">{p.title}</p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {cockpitT(`format.${p.format}` as Parameters<typeof cockpitT>[0])}
                    </p>
                    {p.health === "BLOCKED" && p.blocker && (
                      <p className="text-xs text-status-blocked mt-1 font-medium">
                        ⚠ {p.blocker}
                      </p>
                    )}
                  </Link>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                    {cockpitT(`stage.${p.stage}` as Parameters<typeof cockpitT>[0])}
                  </span>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  {p.ownerName ? (
                    <span className="text-sm text-text-primary">{p.ownerName}</span>
                  ) : (
                    <span className="text-xs text-status-blocked font-medium">
                      ⚠ {t("noOwner")}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 hidden lg:table-cell max-w-xs">
                  <div>
                    <p className="text-sm text-text-primary truncate">
                      {p.nextAction ?? t("noAction")}
                    </p>
                    {p.nextActionDue && (
                      <div className="mt-0.5">
                        <DueDateLabel
                          due={p.nextActionDue}
                          overdueTpl={overdueTpl}
                          dueInTpl={dueInTpl}
                          todayLabel={todayLabel}
                        />
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 hidden xl:table-cell">
                  {p.latestVerdict ? (
                    <span
                      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold ${verdictClass[p.latestVerdict]}`}
                    >
                      {p.latestVerdict}
                    </span>
                  ) : (
                    <span className="text-text-muted text-xs">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
