import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sensitivityFilter } from "@/lib/db/project-filter";
import { isDemoMode } from "@/lib/demo";
import type { CockpitProject } from "@/lib/types/project";
import { CockpitHeader } from "@/components/project-cockpit/CockpitHeader";
import { OverviewTab } from "@/components/project-cockpit/OverviewTab";
import { DocumentsTab } from "@/components/project-cockpit/DocumentsTab";
import { CoverageTab } from "@/components/project-cockpit/CoverageTab";
import { TasksTab } from "@/components/project-cockpit/TasksTab";
import { ActivityTab } from "@/components/project-cockpit/ActivityTab";
import { CockpitTabs } from "@/components/project-cockpit/CockpitTabs";
import type { Role } from "@prisma/client";

type Tab = "resumen" | "documentos" | "cobertura" | "tareas" | "actividad";

type Props = {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ tab?: string }>;
};

const DEMO_PROJECTS: Record<string, CockpitProject> = {
  "demo-blocked": {
    title: "El Último Tren",
    format: "LIMITED_SERIES",
    logline: "Una inspectora de ferroviaria descubre que el accidente que investiga fue un asesinato político encubierto.",
    stage: "PITCHING",
    health: "BLOCKED",
    healthOverride: false,
    sensitivity: "VISIBLE_ALL",
    ownerId: null,
    owner: { id: "demo-user-2", name: "Carlos Mendez", email: "carlos@lemonfilms.com", image: null },
    blocker: "Esperando respuesta de coproductor internacional para continuar con el presupuesto.",
    nextAction: "Seguimiento con coproductor",
    nextActionDue: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    nextActionOwner: "Carlos Mendez",
  },
  "demo-noowner": {
    title: "Verano Eterno",
    format: "SHORT",
    logline: null,
    stage: "INBOX",
    health: "ON_TRACK",
    healthOverride: false,
    sensitivity: "VISIBLE_ALL",
    ownerId: null,
    owner: null,
    blocker: null,
    nextAction: null,
    nextActionDue: null,
    nextActionOwner: null,
  },
  "demo-hidden": {
    title: "La Última Frontera",
    format: "FEATURE",
    logline: "Un astronauta descubre que la misión de rescate fue una trampa.",
    stage: "DEVELOPMENT",
    health: "ON_TRACK",
    healthOverride: false,
    sensitivity: "HIDDEN_ALL",
    ownerId: "demo-user-1",
    owner: { id: "demo-user-1", name: "Ana García", email: "ana@lemonfilms.com", image: null },
    blocker: null,
    nextAction: "Enviar guion a revisión de cobertura",
    nextActionDue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    nextActionOwner: "Ana García",
  },
};

function resolveTab(raw: string | undefined): Tab {
  const valid: Tab[] = ["resumen", "documentos", "cobertura", "tareas", "actividad"];
  return valid.includes(raw as Tab) ? (raw as Tab) : "resumen";
}

function TabContent({
  tab,
  project,
  locale,
  demoMode,
}: {
  tab: Tab;
  project: CockpitProject;
  locale: string;
  demoMode: boolean;
}) {
  switch (tab) {
    case "documentos":
      return <DocumentsTab locale={locale} demoMode={demoMode} />;
    case "cobertura":
      return <CoverageTab locale={locale} demoMode={demoMode} />;
    case "tareas":
      return <TasksTab locale={locale} demoMode={demoMode} />;
    case "actividad":
      return <ActivityTab locale={locale} demoMode={demoMode} />;
    case "resumen":
    default:
      return <OverviewTab project={project} />;
  }
}

export default async function ProjectCockpitPage({ params, searchParams }: Props) {
  const { id, locale } = await params;
  const { tab: rawTab } = await searchParams;
  const tab = resolveTab(rawTab);
  const t = await getTranslations("errors");

  if (isDemoMode) {
    const demoProject = DEMO_PROJECTS[id] ?? DEMO_PROJECTS["demo-blocked"];
    return (
      <div className="max-w-5xl mx-auto px-6 py-8">
        <CockpitHeader project={demoProject} />
        <CockpitTabs locale={locale} />
        <TabContent
          tab={tab}
          project={demoProject}
          locale={locale}
          demoMode={true}
        />
      </div>
    );
  }

  const session = await auth();
  if (!session?.user) {
    redirect(`/${locale}/auth/signin`);
  }

  const userRole = (session.user.role ?? "DEV_TEAM") as Role;

  const project = await prisma.project.findFirst({
    where: {
      id,
      ...sensitivityFilter(userRole),
    },
    include: {
      owner: { select: { id: true, name: true, email: true, image: true } },
    },
  });

  if (!project) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="rounded-lg border border-border bg-surface-elevated p-8 text-center">
          <h1 className="text-2xl font-semibold text-text-primary mb-2">{t("forbidden")}</h1>
          <p className="text-text-secondary">{t("forbiddenDescription")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <CockpitHeader project={project} />
      <CockpitTabs locale={locale} />
      <TabContent
        tab={tab}
        project={project}
        locale={locale}
        demoMode={false}
      />
    </div>
  );
}
