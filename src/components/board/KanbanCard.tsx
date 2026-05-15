import type { Card } from "@/types";

const priorityLabel: Record<Card["priority"], string> = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
  URGENT: "Urgente",
};

const priorityClassName: Record<Card["priority"], string> = {
  LOW: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/50 dark:text-emerald-300",
  MEDIUM:
    "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/50 dark:bg-sky-950/50 dark:text-sky-300",
  HIGH: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/50 dark:text-amber-300",
  URGENT:
    "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/50 dark:text-rose-300",
};

export default function KanbanCard({ card }: { card: Card }) {
  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold leading-6 text-zinc-950 dark:text-zinc-50">
          {card.title}
        </h3>
        <span
          className={`shrink-0 rounded-full border px-2 py-1 text-[11px] font-semibold ${priorityClassName[card.priority]}`}
        >
          {priorityLabel[card.priority]}
        </span>
      </div>

      {card.description ? (
        <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          {card.description}
        </p>
      ) : null}

      {card.dueDate ? (
        <p className="mt-4 text-xs font-medium text-zinc-500 dark:text-zinc-400">
          Prazo: {new Intl.DateTimeFormat("pt-BR").format(card.dueDate)}
        </p>
      ) : null}
    </article>
  );
}
