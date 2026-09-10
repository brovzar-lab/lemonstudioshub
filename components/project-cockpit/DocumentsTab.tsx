import { getTranslations } from "next-intl/server";

type DocumentVersion = {
  id: string;
  filename: string;
  version: number;
  uploader: string;
  uploadedAt: Date;
  sizeKb: number;
  mimeType: string;
  isCanonical: boolean;
};

const DEMO_DOCUMENTS: DocumentVersion[] = [
  {
    id: "doc-v3",
    filename: "ElUltimoTren_v3_FINAL.pdf",
    version: 3,
    uploader: "Ana García",
    uploadedAt: new Date("2026-08-28T14:22:00"),
    sizeKb: 1842,
    mimeType: "application/pdf",
    isCanonical: true,
  },
  {
    id: "doc-v2",
    filename: "ElUltimoTren_v2.pdf",
    version: 2,
    uploader: "Carlos Mendez",
    uploadedAt: new Date("2026-08-14T09:45:00"),
    sizeKb: 1790,
    mimeType: "application/pdf",
    isCanonical: false,
  },
  {
    id: "doc-v1",
    filename: "ElUltimoTren_borrador_v1.pdf",
    version: 1,
    uploader: "Ana García",
    uploadedAt: new Date("2026-07-30T16:10:00"),
    sizeKb: 1654,
    mimeType: "application/pdf",
    isCanonical: false,
  },
];

function formatDate(date: Date, locale: string) {
  return date.toLocaleDateString(locale === "es" ? "es-MX" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatSize(kb: number) {
  if (kb >= 1024) return `${(kb / 1024).toFixed(1)} MB`;
  return `${kb} KB`;
}

type Props = {
  locale: string;
  demoMode?: boolean;
};

export async function DocumentsTab({ locale, demoMode = false }: Props) {
  const t = await getTranslations("cockpit");

  return (
    <section aria-label={t("tabs.documentos")}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-text-muted">
          {t("tabs.documentos")}
        </h2>
        {demoMode ? (
          <button
            disabled
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded border border-border text-text-muted bg-surface cursor-not-allowed"
            title={t("documents.demoUpload")}
          >
            <span aria-hidden="true">↑</span>
            {t("documents.uploadNew")}
          </button>
        ) : (
          <button className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded border border-border text-text-secondary hover:text-text-primary hover:border-text-muted transition-colors">
            <span aria-hidden="true">↑</span>
            {t("documents.uploadNew")}
          </button>
        )}
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface border-b border-border">
              <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                {t("documents.version")}
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                {t("documents.filename")}
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                {t("documents.uploader")}
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                {t("documents.date")}
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                {t("documents.size")}
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-text-muted"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-border">
            {DEMO_DOCUMENTS.map((doc) => (
              <tr key={doc.id} className={doc.isCanonical ? "bg-accent/5" : ""}>
                <td className="px-4 py-3 font-mono text-xs text-text-secondary">
                  v{doc.version}
                </td>
                <td className="px-4 py-3 font-medium text-text-primary">
                  <div className="flex items-center gap-2">
                    <span className="text-red-500 text-xs" aria-hidden="true">
                      PDF
                    </span>
                    <span className="truncate max-w-[220px]">{doc.filename}</span>
                    {doc.isCanonical && (
                      <span className="shrink-0 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-accent/10 text-accent uppercase tracking-wider">
                        {t("documents.canonical")}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-text-secondary">{doc.uploader}</td>
                <td className="px-4 py-3 text-text-secondary">{formatDate(doc.uploadedAt, locale)}</td>
                <td className="px-4 py-3 text-text-muted">{formatSize(doc.sizeKb)}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    disabled={demoMode}
                    className="text-xs text-accent hover:underline disabled:text-text-muted disabled:no-underline disabled:cursor-not-allowed"
                    title={demoMode ? t("documents.demoDownload") : undefined}
                  >
                    {t("documents.download")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {demoMode && (
        <p className="mt-3 text-xs text-text-muted italic text-right">
          {t("documents.demoNote")}
        </p>
      )}
    </section>
  );
}
