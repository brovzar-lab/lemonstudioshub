import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { routing } from "@/i18n/routing";
import { isDemoMode } from "@/lib/demo";
import { auth } from "@/lib/auth";
import LocaleSwitcher from "@/components/ui/LocaleSwitcher";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Lemon Development Hub",
  description: "Gestión de proyectos cinematográficos — Lemon Films",
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "es" | "en")) {
    notFound();
  }

  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const isAuthRoute = pathname.includes("/auth/");

  if (!isDemoMode && !isAuthRoute) {
    const session = await auth();
    if (!session?.user) {
      redirect(`/${locale}/auth/signin`);
    }
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="min-h-screen bg-surface text-text-primary antialiased">
        <NextIntlClientProvider messages={messages}>
          <header className="border-b border-border bg-surface-elevated">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-14 items-center justify-between">
                <span className="text-sm font-semibold tracking-wide text-text-primary">
                  Lemon Development Hub
                </span>
                <div className="flex items-center gap-3">
                  {isDemoMode && (
                    <span className="rounded-full bg-status-atrisk/10 px-2.5 py-0.5 text-xs font-medium text-status-atrisk">
                      Demo Mode
                    </span>
                  )}
                  <LocaleSwitcher />
                </div>
              </div>
            </div>
          </header>
          <main>{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
