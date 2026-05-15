"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Check, Pencil, X } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { deleteCard, updateCard } from "@/actions/card.actions";
import ConfirmSubmitButton from "@/components/ui/ConfirmSubmitButton";
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
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description ?? "");
  const [priority, setPriority] = useState(card.priority);
  const [dueDate, setDueDate] = useState(
    card.dueDate?.toISOString().slice(0, 10) ?? ""
  );
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

  useEffect(() => {
    setTitle(card.title);
    setDescription(card.description ?? "");
    setPriority(card.priority);
    setDueDate(card.dueDate?.toISOString().slice(0, 10) ?? "");
  }, [card.description, card.dueDate, card.priority, card.title]);

  function reset() {
    setTitle(card.title);
    setDescription(card.description ?? "");
    setPriority(card.priority);
    setDueDate(card.dueDate?.toISOString().slice(0, 10) ?? "");
    setIsEditing(false);
  }

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await updateCard(formData);
      setIsEditing(false);
    });
  }

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
      {isEditing ? (
        <form
          action={handleSubmit}
          className="grid gap-3"
          onPointerDown={(event) => event.stopPropagation()}
        >
          <input type="hidden" name="cardId" value={card.id} />
          <input
            name="title"
            required
            maxLength={120}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="rounded-2xl border border-zinc-300 bg-white px-3 py-2.5 text-sm font-semibold text-zinc-950 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-700"
          />
          <textarea
            name="description"
            maxLength={2000}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="min-h-20 resize-none rounded-2xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-950 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-700"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-xs font-medium text-zinc-600 dark:text-zinc-300">
              Prioridade
              <select
                name="priority"
                value={priority}
                onChange={(event) =>
                  setPriority(event.target.value as Card["priority"])
                }
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
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                className="rounded-2xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-950 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-700"
              />
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-4 py-2 text-xs font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              <Check className="h-3.5 w-3.5" />
              Salvar
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-300 px-4 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              <X className="h-3.5 w-3.5" />
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-sm font-semibold leading-6 text-zinc-950 dark:text-zinc-50">
              {title}
            </h3>
            <div
              className="flex shrink-0 items-center gap-2"
              onPointerDown={(event) => event.stopPropagation()}
            >
              <span
                className={`rounded-full border px-2 py-1 text-[11px] font-semibold ${priorityClassName[priority]}`}
              >
                {priorityLabel[priority]}
              </span>
              <button
                type="button"
                aria-label="Editar card"
                onClick={() => setIsEditing(true)}
                className="grid h-7 w-7 place-items-center rounded-full border border-zinc-300 text-zinc-500 transition hover:bg-zinc-50 hover:text-zinc-950 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {description ? (
            <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              {description}
            </p>
          ) : null}

          {dueDate ? (
            <p className="mt-4 text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Prazo:{" "}
              {new Intl.DateTimeFormat("pt-BR").format(
                new Date(`${dueDate}T00:00:00`)
              )}
            </p>
          ) : null}
        </>
      )}

      <form
        action={deleteCard}
        className="mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-800"
        onPointerDown={(event) => event.stopPropagation()}
      >
          <input type="hidden" name="cardId" value={card.id} />
          <ConfirmSubmitButton
            message="Excluir este card?"
            className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/50 dark:text-red-300 dark:hover:bg-red-900"
          >
            Excluir
          </ConfirmSubmitButton>
      </form>
    </article>
  );
}
