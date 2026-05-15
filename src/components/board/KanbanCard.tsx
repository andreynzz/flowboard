"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { deleteCard, updateCard } from "@/actions/card.actions";
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
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: "card",
      cardId: card.id,
      columnId: card.columnId,
    },
  });

  return (
    <article
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={`rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 ${
        isDragging
          ? "cursor-grabbing opacity-60 ring-2 ring-zinc-400"
          : "cursor-grab"
      }`}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold leading-6 text-zinc-950 dark:text-zinc-50">
          {card.title}
        </h3>
        <div className="flex shrink-0 items-center gap-2">
          <span
            className={`rounded-full border px-2 py-1 text-[11px] font-semibold ${priorityClassName[card.priority]}`}
          >
            {priorityLabel[card.priority]}
          </span>
        </div>
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

      <details className="mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-800">
        <summary className="cursor-pointer text-xs font-semibold text-zinc-600 transition hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50">
          Editar card
        </summary>

        <form action={updateCard} className="mt-4 grid gap-3">
          <input type="hidden" name="cardId" value={card.id} />
          <label className="grid gap-1 text-xs font-medium text-zinc-600 dark:text-zinc-300">
            Título
            <input
              name="title"
              required
              maxLength={120}
              defaultValue={card.title}
              className="rounded-2xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-950 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-700"
            />
          </label>
          <label className="grid gap-1 text-xs font-medium text-zinc-600 dark:text-zinc-300">
            Descrição
            <textarea
              name="description"
              maxLength={2000}
              defaultValue={card.description ?? ""}
              className="min-h-20 resize-none rounded-2xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-950 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-700"
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-xs font-medium text-zinc-600 dark:text-zinc-300">
              Prioridade
              <select
                name="priority"
                defaultValue={card.priority}
                className="rounded-2xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-950 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-700"
              >
                <option value="LOW">Baixa</option>
                <option value="MEDIUM">Média</option>
                <option value="HIGH">Alta</option>
                <option value="URGENT">Urgente</option>
              </select>
            </label>
            <label className="grid gap-1 text-xs font-medium text-zinc-600 dark:text-zinc-300">
              Prazo
              <input
                type="date"
                name="dueDate"
                defaultValue={card.dueDate?.toISOString().slice(0, 10)}
                className="rounded-2xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-950 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-700"
              />
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              className="rounded-full bg-zinc-950 px-4 py-2 text-xs font-semibold text-white transition hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              Salvar
            </button>
          </div>
        </form>

        <form action={deleteCard} className="mt-3">
          <input type="hidden" name="cardId" value={card.id} />
          <button
            type="submit"
            className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/50 dark:text-red-300 dark:hover:bg-red-900"
          >
            Excluir
          </button>
        </form>
      </details>
    </article>
  );
}
