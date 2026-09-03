import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed 2 synthetic users per plan §9 Task A2
  const hod = await prisma.user.upsert({
    where: { email: "hod@lemonfilms.com" },
    update: {},
    create: {
      email: "hod@lemonfilms.com",
      name: "Head of Development",
      role: "HOD",
    },
  });

  await prisma.user.upsert({
    where: { email: "partner@lemonfilms.com" },
    update: {},
    create: {
      email: "partner@lemonfilms.com",
      name: "Partner",
      role: "PARTNER",
    },
  });

  // Seed 3 synthetic projects per plan §9 Task A2
  await prisma.project.createMany({
    skipDuplicates: true,
    data: [
      {
        // 1. HIDDEN_ALL project in DEVELOPMENT — BLOCKED health
        title: "La Ultima Frontera",
        format: "FEATURE",
        stage: "DEVELOPMENT",
        health: "BLOCKED",
        sensitivity: "HIDDEN_ALL",
        ownerId: hod.id,
        blocker: "Estado de derechos IP sin clarificar",
        nextAction: null,
        nextActionDue: null,
      },
      {
        // 2. VISIBLE_ALL project in READING — AT_RISK, overdue nextAction
        title: "El Peso de las Flores",
        format: "FEATURE",
        stage: "READING",
        health: "AT_RISK",
        sensitivity: "VISIBLE_ALL",
        ownerId: hod.id,
        nextAction: "Completar cobertura de guion",
        nextActionDue: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        // 3. VISIBLE_ALL project in INBOX — ON_TRACK, no owner
        title: "Barrio Alto",
        format: "FEATURE",
        stage: "INBOX",
        health: "ON_TRACK",
        sensitivity: "VISIBLE_ALL",
        ownerId: null,
        nextAction: null,
        nextActionDue: null,
      },
    ],
  });

  console.log("Seed complete — 2 users and 3 synthetic projects created.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
