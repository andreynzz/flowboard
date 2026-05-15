import { deleteColumn, updateColumn } from "@/actions/column.actions";
import type { ColumnWithCards } from "@/types";
import CreateCardForm from "./CreateCardForm";
import KanbanCard from "./KanbanCard";

export default function KanbanColumn({ column }: { column: ColumnWithCards }) {
  return (
    <section className="flex min-h-[28rem] w-[min(22rem,calc(100vw-3rem))] shrink-0 flex-col rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <header className="mb-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
            {column.title}
          </h2>
          <p className="mt-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {column.cards.length} {column.cards.length === 1 ? "card" : "cards"}
          </p>
        </div>
        <details className="relative shrink-0">
          <summary className="grid h-8 w-8 cursor-pointer list-none place-items-center rounded-full border border-zinc-300 text-sm font-bold text-zinc-600 transition hover:bg-white dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-950">
            ...
          </summary>
          <div className="absolute right-0 z-10 mt-2 w-64 rounded-2xl border border-zinc-200 bg-white p-3 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
            <form action={updateColumn} className="grid gap-2">
              <input type="hidden" name="columnId" value={column.id} />
              <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                Renomear coluna
              </label>
              <input
                name="title"
                required
                maxLength={60}
                defaultValue={column.title}
                className="rounded-2xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-950 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-700"
              />
              <button
                type="submit"
                className="rounded-full bg-zinc-950 px-4 py-2 text-xs font-semibold text-white transition hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
              >
                Salvar nome
              </button>
            </form>

            <form action={deleteColumn} className="mt-3 border-t border-zinc-200 pt-3 dark:border-zinc-800">
              <input type="hidden" name="columnId" value={column.id} />
              <button
                type="submit"
                className="w-full rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/50 dark:text-red-300 dark:hover:bg-red-900"
              >
                Excluir coluna
              </button>
            </form>
          </div>
        </details>
      </header>

      <div className="flex flex-1 flex-col gap-3">
        {column.cards.length > 0 ? (
          column.cards.map((card) => <KanbanCard key={card.id} card={card} />)
        ) : (
          <div className="grid min-h-32 place-items-center rounded-2xl border border-dashed border-zinc-300 px-4 py-8 text-center text-sm leading-6 text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            Nenhum card nesta coluna.
          </div>
        )}
      </div>

      <div className="mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-800">
        <CreateCardForm columnId={column.id} />
      </div>
    </section>
  );
}
