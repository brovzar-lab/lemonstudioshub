import { getTranslations } from "next-intl/server";

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const t = await getTranslations("errors");

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-2xl font-semibold text-text-primary mb-2">{t("forbidden")}</h1>
        <p className="text-text-secondary mb-6">
          {error === "AccessDenied"
            ? "Solo cuentas @lemonfilms.com pueden acceder."
            : t("forbiddenDescription")}
        </p>
        <a
          href="/auth/signin"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary hover:bg-surface-elevated transition-colors"
        >
          Volver al inicio de sesión
        </a>
      </div>
    </div>
  );
}
