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
      <label className="sr-only" htmlFor={`card-description-${columnId}`}>
        Descrição do card
      </label>
      <textarea
        id={`card-description-${columnId}`}
        name="description"
        maxLength={2000}
        placeholder="Descrição opcional"
        className="min-h-20 w-full resize-none rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-700"
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1 text-xs font-medium text-zinc-600 dark:text-zinc-300">
          Prioridade
          <select
            name="priority"
            defaultValue="MEDIUM"
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
            className="rounded-2xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-950 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-700"
          />
        </label>
      </div>
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
      >
        Adicionar card
      </button>
    </form>
  );
}
