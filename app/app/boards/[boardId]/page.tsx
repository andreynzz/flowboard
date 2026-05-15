import { and, asc, eq, inArray } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/db/index";
import { boards, cards, columns } from "@/db/schema";
import BoardView from "@/components/board/BoardView";
import SignOutButton from "@/components/auth/SignOutButton";
import EditBoardForm from "@/components/dashboard/EditBoardForm";
import type { BoardWithColumns } from "@/types";

interface BoardPageProps {
  params: Promise<{
    boardId: string;
  }>;
}

export default async function BoardPage({ params }: BoardPageProps) {
  const { boardId } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const board = await db
    .select()
    .from(boards)
    .where(and(eq(boards.id, boardId), eq(boards.ownerId, session.user.id)))
    .limit(1)
    .then((results) => results[0]);

  if (!board) {
    redirect("/app");
  }

  const boardColumns = await db
    .select()
    .from(columns)
    .where(eq(columns.boardId, board.id))
    .orderBy(asc(columns.position));

  const boardCards =
    boardColumns.length > 0
      ? await db
          .select()
          .from(cards)
          .where(
            inArray(
              cards.columnId,
              boardColumns.map((column) => column.id)
            )
          )
          .orderBy(asc(cards.position))
      : [];

  const boardWithColumns: BoardWithColumns = {
    ...board,
    columns: boardColumns.map((column) => ({
      ...column,
      cards: boardCards.filter((card) => card.columnId === column.id),
    })),
  };

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-8 dark:bg-zinc-950">
      <main className="mx-auto w-full max-w-7xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
              Quadro
            </p>
            <div className="mt-2">
              <EditBoardForm board={board} variant="page" />
            </div>
          </div>
          <SignOutButton />
        </div>

        <BoardView board={boardWithColumns} />
      </main>
    </div>
  );
}
