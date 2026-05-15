import type { ColumnWithCards } from "@/types";
import CreateCardForm from "./CreateCardForm";
import KanbanCard from "./KanbanCard";

export default function KanbanColumn({ column }: { column: ColumnWithCards }) {
  return (
    <section className="flex min-h-[28rem] w-[min(22rem,calc(100vw-3rem))] shrink-0 flex-col rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <header className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
            {column.title}
          </h2>
          <p className="mt-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {column.cards.length} {column.cards.length === 1 ? "card" : "cards"}
          </p>
        </div>
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
