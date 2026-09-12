import { getTranslations } from "next-intl/server";
import { isDemoMode } from "@/lib/demo";
import { QuickStats } from "@/components/command-center/QuickStats";
import { NeedsAttentionWidget } from "@/components/command-center/NeedsAttentionWidget";
import { ActiveProjectsGrid } from "@/components/command-center/ActiveProjectsGrid";
import { RecentActivity } from "@/components/command-center/RecentActivity";
import { CreateProjectFlow } from "@/components/project-cockpit/CreateProjectFlow";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function CommandCenterPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("commandCenter");

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text-primary">{t("title")}</h1>
        <CreateProjectFlow locale={locale} demoMode={isDemoMode} />
      </div>

      <QuickStats />

      <ActiveProjectsGrid />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <NeedsAttentionWidget />
        </div>
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
