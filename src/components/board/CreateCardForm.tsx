import { createCard } from "@/actions/card.actions";

export default function CreateCardForm({ columnId }: { columnId: string }) {
  return (
    <form action={createCard} className="grid gap-3">
      <input type="hidden" name="columnId" value={columnId} />
      <label className="sr-only" htmlFor={`card-title-${columnId}`}>
        Título do card
      </label>
      <input
        id={`card-title-${columnId}`}
        name="title"
        required
        maxLength={120}
        placeholder="Novo card"
        className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-700"
      />
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
      >
        Adicionar card
      </button>
    </form>
  );
}
