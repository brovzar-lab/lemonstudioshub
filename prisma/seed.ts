import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed 3 synthetic projects per plan §9 Task A2
  await prisma.project.createMany({
    data: [
      {
        title: "La Última Frontera",
        format: "FEATURE",
        stage: "DEVELOPMENT",
        health: "ON_TRACK",
        sensitivity: "HIDDEN_ALL",
        logline: "Un astronauta descubre que la misión de rescate fue una trampa.",
        nextAction: "Enviar guion a revisión de cobertura",
        nextActionDue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        nextActionOwner: "Ana García",
      },
      {
        title: "El Último Tren",
        format: "LIMITED_SERIES",
        stage: "PITCHING",
        health: "BLOCKED",
        sensitivity: "VISIBLE_ALL",
        blocker: "Esperando respuesta de coproductor internacional para continuar con el presupuesto.",
        nextAction: "Seguimiento con coproductor",
        nextActionDue: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        nextActionOwner: "Carlos Mendez",
      },
      {
        title: "Verano Eterno",
        format: "SHORT",
        stage: "INBOX",
        health: "ON_TRACK",
        sensitivity: "VISIBLE_ALL",
        ownerId: null,
        nextAction: null,
      },
    ],
  });

  console.log("Seed complete — 3 synthetic projects created.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
