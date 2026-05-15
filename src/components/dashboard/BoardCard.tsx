import Link from "next/link";
import { deleteBoard } from "@/actions/board.actions";
import ConfirmSubmitButton from "@/components/ui/ConfirmSubmitButton";
import type { Board } from "@/types";
import EditBoardForm from "./EditBoardForm";

export default function BoardCard({ board }: { board: Board }) {
  return (
    <article className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950">
      <EditBoardForm board={board} />

      <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
        <Link
          href={`/app/boards/${board.id}`}
          className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-950 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-800"
        >
          Abrir
        </Link>

        <form action={deleteBoard} className="inline">
          <input type="hidden" name="boardId" value={board.id} />
          <ConfirmSubmitButton
            message="Excluir este quadro, colunas e cards?"
            className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/50 dark:text-red-300 dark:hover:bg-red-900"
          >
            Excluir
          </ConfirmSubmitButton>
        </form>
      </div>
    </article>
  );
}
