import type { Prisma, Role } from "@prisma/client";

// Applied at query layer — never post-filter in application code
export function sensitivityFilter(userRole: Role): Prisma.ProjectWhereInput {
  if (userRole === "PARTNER") {
    return { sensitivity: "VISIBLE_ALL" };
  }
  return {}; // HOD, DEV_TEAM, ADMIN see all
}
