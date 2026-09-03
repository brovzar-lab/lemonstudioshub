import { NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware/with-auth";
import { prisma } from "@/lib/db";
import { sensitivityFilter } from "@/lib/db/project-filter";

export const GET = withAuth(async (req) => {
  const id = req.url.split("/").pop()!;

  const project = await prisma.project.findFirst({
    where: {
      id,
      ...sensitivityFilter(req.user.role),
    },
    include: {
      owner: { select: { id: true, name: true, email: true, image: true } },
    },
  });

  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(project);
});
