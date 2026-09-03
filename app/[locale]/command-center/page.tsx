import { getTranslations } from "next-intl/server";
import { NeedsAttentionWidget } from "@/components/command-center/NeedsAttentionWidget";

export default async function CommandCenterPage() {
  const t = await getTranslations("commandCenter");

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-semibold text-text-primary mb-8">{t("title")}</h1>
      <NeedsAttentionWidget />
    </main>
  );
}
