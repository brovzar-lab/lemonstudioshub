import { NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware/with-auth";
import { prisma } from "@/lib/db";
import { sensitivityFilter } from "@/lib/db/project-filter";

export const GET = withAuth(async (req) => {
  const projects = await prisma.project.findMany({
    where: sensitivityFilter(req.user.role),
    include: {
      owner: { select: { id: true, name: true, email: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(projects);
});
