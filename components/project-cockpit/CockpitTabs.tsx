"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";

const TAB_KEYS = ["resumen", "documentos", "cobertura", "tareas", "actividad"] as const;
type TabKey = (typeof TAB_KEYS)[number];

const TAB_LABELS: Record<TabKey, { es: string; en: string }> = {
  resumen: { es: "Resumen", en: "Overview" },
  documentos: { es: "Documentos", en: "Documents" },
  cobertura: { es: "Cobertura", en: "Coverage" },
  tareas: { es: "Tareas", en: "Tasks" },
  actividad: { es: "Actividad", en: "Activity" },
};

type Props = {
  locale: string;
};

export function CockpitTabs({ locale }: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const activeTab = (searchParams.get("tab") as TabKey) ?? "resumen";
  const lang = locale === "es" ? "es" : "en";

  function handleTab(tab: TabKey) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <nav
      className="flex items-end gap-0 border-b border-border mb-6 mt-6"
      aria-label="Project tabs"
    >
      {TAB_KEYS.map((key) => {
        const isActive = key === activeTab;
        return (
          <button
            key={key}
            onClick={() => handleTab(key)}
            className={
              isActive
                ? "px-4 py-2.5 text-sm font-semibold text-text-primary border-b-2 border-accent -mb-px"
                : "px-4 py-2.5 text-sm text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
            }
            aria-current={isActive ? "page" : undefined}
          >
            {TAB_LABELS[key][lang]}
          </button>
        );
      })}
    </nav>
  );
}
