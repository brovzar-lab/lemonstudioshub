import { getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sensitivityFilter } from "@/lib/db/project-filter";
import { isDemoMode } from "@/lib/demo";
import type { Health, Role } from "@prisma/client";

type AttentionItem = {
  id: string;
  title: string;
  health: Health;
  blocker: string | null;
  nextActionDue: Date | null;
  ownerId: string | null;
  stage: string;
};

const DEMO_ITEMS: AttentionItem[] = [
  {
    id: "demo-1",
    title: "La Ultima Frontera",
    health: "BLOCKED",
    blocker: "Estado de derechos IP sin clarificar",
    nextActionDue: null,
    ownerId: "demo-hod",
    stage: "DEVELOPMENT",
  },
  {
    id: "demo-2",
    title: "El Peso de las Flores",
    health: "AT_RISK",
    blocker: null,
    nextActionDue: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    ownerId: "demo-hod",
    stage: "READING",
  },
];

const healthDotClass: Record<Health, string> = {
  BLOCKED: "text-status-blocked",
  AT_RISK: "text-status-atrisk",
  STALE: "text-status-stale",
  ON_TRACK: "text-status-ontrack",
};

function itemReason(item: AttentionItem): "blocked" | "overdue" | "noOwner" {
  if (item.health === "BLOCKED") return "blocked";
  if (item.nextActionDue && item.nextActionDue < new Date()) return "overdue";
  return "noOwner";
}

function daysOverdue(date: Date): number {
  return Math.max(1, Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24)));
}

export async function NeedsAttentionWidget() {
  const t = await getTranslations("commandCenter.needsAttention");
  const locale = await getLocale();

  let items: AttentionItem[];

  if (isDemoMode) {
    items = DEMO_ITEMS;
  } else {
    const session = await auth();
    const userRole = (session?.user?.role ?? "DEV_TEAM") as Role;

    items = await prisma.project.findMany({
      where: {
        AND: [
          sensitivityFilter(userRole),
          {
            OR: [
              { health: "BLOCKED" },
              { nextActionDue: { lt: new Date() } },
              { stage: { not: "INBOX" }, ownerId: null },
            ],
          },
        ],
      },
      orderBy: [
        { health: "desc" },
        { nextActionDue: "asc" },
      ],
      select: {
        id: true,
        title: true,
        health: true,
        blocker: true,
        nextActionDue: true,
        ownerId: true,
        stage: true,
      },
      take: 10,
    });
  }

  return (
    <section className="rounded-lg border border-border bg-surface-elevated overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
          {t("title")}
        </h2>
        {items.length > 0 && (
          <span className="rounded-full bg-status-blocked/10 px-2 py-0.5 text-xs font-semibold text-status-blocked">
            {items.length}
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex items-center gap-2 px-6 py-4 text-sm text-text-muted">
          <span aria-hidden="true">✓</span>
          <span>{t("empty")}</span>
        </div>
      ) : (
        <ul>
          {items.map((item) => {
            const reason = itemReason(item);
            return (
              <li key={item.id} className="border-b border-border last:border-b-0">
                <Link
                  href={`/${locale}/projects/${item.id}`}
                  className="flex items-center gap-3 px-6 min-h-[48px] py-3 hover:bg-surface transition-colors group"
                >
                  <span
                    className={`text-base leading-none shrink-0 ${healthDotClass[item.health]}`}
                    aria-hidden="true"
                  >
                    ●
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {reason === "blocked" && (
                        <>
                          {t("reason.blocked")}
                          {item.blocker ? `: ${item.blocker}` : ""}
                        </>
                      )}
                      {reason === "overdue" && item.nextActionDue && (
                        t("reason.overdue", { days: daysOverdue(item.nextActionDue) })
                      )}
                      {reason === "noOwner" && t("reason.noOwner")}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
