import type { Format, Health, Sensitivity, Stage } from "@prisma/client";

// Shared type that satisfies both CockpitHeader and OverviewTab
export type CockpitProject = {
  title: string;
  format: Format;
  logline: string | null;
  stage: Stage;
  health: Health;
  healthOverride: boolean;
  sensitivity: Sensitivity;
  ownerId: string | null;
  owner: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  } | null;
  blocker: string | null;
  nextAction: string | null;
  nextActionDue: Date | null;
  nextActionOwner: string | null;
};
