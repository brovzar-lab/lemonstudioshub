import { getTranslations } from "next-intl/server";

export async function CockpitTabs() {
  const t = await getTranslations("cockpit.tabs");

  const tabs = [
    { key: "resumen", active: true },
    { key: "documentos", active: false },
    { key: "cobertura", active: false },
    { key: "tareas", active: false },
    { key: "actividad", active: false },
  ] as const;

  return (
    <nav
      className="flex items-end gap-0 border-b border-border mb-6 mt-6"
      aria-label="Project tabs"
    >
      {tabs.map(({ key, active }) =>
        active ? (
          <span
            key={key}
            className="px-4 py-2.5 text-sm font-semibold text-text-primary border-b-2 border-accent -mb-px"
            aria-current="page"
          >
            {t(key)}
          </span>
        ) : (
          <span
            key={key}
            className="px-4 py-2.5 text-sm text-text-muted cursor-not-allowed select-none"
            aria-disabled="true"
            title="Disponible en Fase 3b"
          >
            {t(key)}
          </span>
        )
      )}
    </nav>
  );
}
