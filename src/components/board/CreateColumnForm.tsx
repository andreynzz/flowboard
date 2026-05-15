import { createColumn } from "@/actions/column.actions";

export default function CreateColumnForm({ boardId }: { boardId: string }) {
  return (
    <form
      action={createColumn}
      className="flex w-[min(22rem,calc(100vw-3rem))] shrink-0 flex-col gap-3 rounded-2xl border border-dashed border-zinc-300 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-950"
    >
      <input type="hidden" name="boardId" value={boardId} />
      <label
        htmlFor={`column-title-${boardId}`}
        className="text-sm font-semibold text-zinc-950 dark:text-zinc-50"
      >
        Nova coluna
      </label>
      <input
        id={`column-title-${boardId}`}
        name="title"
        required
        maxLength={60}
        placeholder="Ex: Revisão"
        className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-700"
      />
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
      >
        Criar coluna
      </button>
    </form>
  );
}
