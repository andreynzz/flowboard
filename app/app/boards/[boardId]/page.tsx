import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/db/index";
import { boards } from "@/db/schema";

interface BoardPageProps {
  params: {
    boardId: string;
  };
}

export default async function BoardPage({ params }: BoardPageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const board = await db
    .select()
    .from(boards)
    .where(and(eq(boards.id, params.boardId), eq(boards.ownerId, session.user.id)))
    .limit(1)
    .then((results) => results[0]);

  if (!board) {
    redirect("/app");
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-12 dark:bg-zinc-950">
      <main className="mx-auto w-full max-w-5xl rounded-3xl bg-white p-10 shadow-lg ring-1 ring-black/5 dark:bg-zinc-950 dark:ring-white/10">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
            Quadro
          </p>
          <h1 className="text-3xl font-semibold text-zinc-950 dark:text-zinc-50">{board.title}</h1>
          <p className="max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">{board.description ?? "Sem descrição disponível."}</p>
        </div>

        <section className="mt-10 rounded-3xl border border-zinc-200 bg-zinc-50 p-8 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Página do quadro ainda não implementada totalmente. Aqui você verá as colunas e cards do quadro.
          </p>
        </section>
      </main>
    </div>
  );
}
