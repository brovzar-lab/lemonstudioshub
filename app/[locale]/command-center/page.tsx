import { getTranslations } from "next-intl/server";
import { QuickStats } from "@/components/command-center/QuickStats";
import { NeedsAttentionWidget } from "@/components/command-center/NeedsAttentionWidget";
import { ActiveProjectsGrid } from "@/components/command-center/ActiveProjectsGrid";
import { RecentActivity } from "@/components/command-center/RecentActivity";

export default async function CommandCenterPage() {
  const t = await getTranslations("commandCenter");

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <h1 className="text-2xl font-semibold text-text-primary">{t("title")}</h1>

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
