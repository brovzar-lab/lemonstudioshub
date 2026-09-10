import { getTranslations } from "next-intl/server";

type TaskStatus = "PENDING" | "IN_PROGRESS" | "DONE";

type Task = {
  id: string;
  title: string;
  assignee: string;
  deadline: Date | null;
  status: TaskStatus;
};

const DEMO_TASKS: Task[] = [
  {
    id: "task-1",
    title: "Incorporar notas del productor al guion",
    assignee: "Ana García",
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    status: "IN_PROGRESS",
  },
  {
    id: "task-2",
    title: "Enviar propuesta de presupuesto a coproductor",
    assignee: "Carlos Mendez",
    deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    status: "PENDING",
  },
  {
    id: "task-3",
    title: "Programar lectura de mesa con elenco propuesto",
    assignee: "Isabel Torres",
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    status: "PENDING",
  },
  {
    id: "task-4",
    title: "Archivar borrador v1 y v2",
    assignee: "Ana García",
    deadline: null,
    status: "DONE",
  },
];

const STATUS_STYLES: Record<TaskStatus, { label: { es: string; en: string }; classes: string }> = {
  PENDING: {
    label: { es: "Pendiente", en: "Pending" },
    classes: "bg-surface border border-border text-text-muted",
  },
  IN_PROGRESS: {
    label: { es: "En progreso", en: "In progress" },
    classes: "bg-accent/10 text-accent",
  },
  DONE: {
    label: { es: "Completado", en: "Done" },
    classes: "bg-status-ontrack/10 text-status-ontrack",
  },
};

function formatDueDate(date: Date, locale: string, isOverdue: boolean) {
  const str = date.toLocaleDateString(locale === "es" ? "es-MX" : "en-US", {
    day: "numeric",
    month: "short",
  });
  return { str, isOverdue };
}

type Props = {
  locale: string;
  demoMode?: boolean;
};

export async function TasksTab({ locale, demoMode = false }: Props) {
  const t = await getTranslations("cockpit");
  const lang = locale === "es" ? "es" : "en";
  const now = new Date();

  return (
    <section aria-label={t("tabs.tareas")}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-text-muted">
          {t("tabs.tareas")}
        </h2>
        <button
          disabled={demoMode}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border border-border text-text-secondary hover:text-text-primary hover:border-text-muted transition-colors disabled:cursor-not-allowed disabled:text-text-muted disabled:hover:border-border"
        >
          <span aria-hidden="true">+</span>
          {t("tasks.newTask")}
        </button>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface border-b border-border">
              <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                {t("tasks.task")}
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                {t("tasks.assignee")}
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                {t("tasks.deadline")}
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                {t("tasks.status")}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-border">
            {DEMO_TASKS.map((task) => {
              const isOverdue =
                task.deadline !== null &&
                task.deadline < now &&
                task.status !== "DONE";
              const style = STATUS_STYLES[task.status];
              return (
                <tr
                  key={task.id}
                  className={task.status === "DONE" ? "opacity-60" : ""}
                >
                  <td className="px-4 py-3 text-text-primary">
                    <span className={task.status === "DONE" ? "line-through text-text-muted" : ""}>
                      {task.title}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{task.assignee}</td>
                  <td className="px-4 py-3">
                    {task.deadline ? (
                      <span
                        className={
                          isOverdue
                            ? "text-status-blocked font-medium"
                            : "text-text-secondary"
                        }
                      >
                        {formatDueDate(task.deadline, locale, isOverdue).str}
                        {isOverdue && (
                          <span className="ml-1 text-[10px] font-semibold">
                            ({lang === "es" ? "vencida" : "overdue"})
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="text-text-muted">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${style.classes}`}
                    >
                      {style.label[lang]}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {demoMode && (
        <p className="mt-3 text-xs text-text-muted italic text-right">
          {t("tasks.demoNote")}
        </p>
      )}
    </section>
  );
}
