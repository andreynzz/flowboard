import { updateBoard } from "@/actions/board.actions";
import type { Board } from "@/types";

export default function EditBoardForm({ board }: { board: Board }) {
  return (
    <details className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <summary className="cursor-pointer text-sm font-semibold text-zinc-700 transition hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-zinc-50">
        Editar quadro
      </summary>

      <form action={updateBoard} className="mt-4 grid gap-3">
        <input type="hidden" name="boardId" value={board.id} />
        <label className="grid gap-1 text-xs font-medium text-zinc-600 dark:text-zinc-300">
          Título
          <input
            name="title"
            required
            maxLength={80}
            defaultValue={board.title}
            className="rounded-2xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-950 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-700"
          />
        </label>
        <label className="grid gap-1 text-xs font-medium text-zinc-600 dark:text-zinc-300">
          Descrição
          <textarea
            name="description"
            maxLength={300}
            defaultValue={board.description ?? ""}
            className="min-h-20 resize-none rounded-2xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-950 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-700"
          />
        </label>
        <button
          type="submit"
          className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          Salvar alterações
        </button>
      </form>
    </details>
  );
}
