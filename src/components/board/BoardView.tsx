import type { BoardWithColumns } from "@/types";
import KanbanColumn from "./KanbanColumn";

export default function BoardView({ board }: { board: BoardWithColumns }) {
  return (
    <div className="mt-8">
      {board.columns.length > 0 ? (
        <div className="flex gap-5 overflow-x-auto pb-4">
          {board.columns.map((column) => (
            <KanbanColumn key={column.id} column={column} />
          ))}
        </div>
      ) : (
        <section className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
            Este quadro ainda não tem colunas
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Crie colunas para começar a organizar seus cards.
          </p>
        </section>
      )}
    </div>
  );
}
