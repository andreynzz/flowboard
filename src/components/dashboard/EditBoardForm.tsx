"use client";

import { Check, Pencil, X } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { updateBoard } from "@/actions/board.actions";
import type { Board } from "@/types";

interface EditBoardFormProps {
  board: Board;
  variant?: "card" | "page";
}

export default function EditBoardForm({
  board,
  variant = "card",
}: EditBoardFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(board.title);
  const [description, setDescription] = useState(board.description ?? "");

  useEffect(() => {
    setTitle(board.title);
    setDescription(board.description ?? "");
  }, [board.description, board.title]);

  function reset() {
    setTitle(board.title);
    setDescription(board.description ?? "");
    setIsEditing(false);
  }

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await updateBoard(formData);
      setIsEditing(false);
    });
  }

  const titleClassName =
    variant === "page"
      ? "text-3xl font-semibold text-zinc-950 dark:text-zinc-50"
      : "text-xl font-semibold text-zinc-950 dark:text-zinc-50";

  const descriptionClassName =
    variant === "page"
      ? "mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400"
      : "mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400";

  if (isEditing) {
    return (
      <form action={handleSubmit} className="grid gap-3">
        <input type="hidden" name="boardId" value={board.id} />
        <input
          name="title"
          required
          maxLength={80}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="rounded-2xl border border-zinc-300 bg-white px-3 py-2.5 text-sm font-semibold text-zinc-950 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-700"
        />
        <textarea
          name="description"
          maxLength={300}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="min-h-20 resize-none rounded-2xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-950 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-700"
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            <Check className="h-4 w-4" />
            Salvar
          </button>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            <X className="h-4 w-4" />
            Cancelar
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="group">
      <div className="flex items-start gap-3">
        <div className="min-w-0">
          {variant === "page" ? (
            <h1 className={titleClassName}>{title}</h1>
          ) : (
            <h2 className={titleClassName}>{title}</h2>
          )}
          <p className={descriptionClassName}>
            {description || "Sem descrição"}
          </p>
        </div>
        <button
          type="button"
          aria-label="Editar quadro"
          onClick={() => setIsEditing(true)}
          className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-zinc-300 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-950 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
        >
          <Pencil className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
