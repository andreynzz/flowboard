import { desc, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/db/index";
import { boards } from "@/db/schema";
import CreateBoardForm from "@/components/dashboard/CreateBoardForm";
import BoardCard from "@/components/dashboard/BoardCard";

export default async function AppDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userBoards = await db
    .select()
    .from(boards)
    .where(eq(boards.ownerId, session.user.id))
    .orderBy(desc(boards.updatedAt));

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-12 dark:bg-zinc-950">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <section className="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-black/5 dark:bg-zinc-950 dark:ring-white/10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                Dashboard
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-zinc-950 dark:text-zinc-50">
                Meus quadros
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                Organize seus projetos em quadros Kanban. Crie seu primeiro quadro ou continue onde parou.
              </p>
            </div>
            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-xs uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">Usuário</p>
              <p className="mt-2 text-lg font-semibold text-zinc-950 dark:text-zinc-50">{session.user.name ?? session.user.email ?? "Usuário"}</p>
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            {userBoards.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-8 text-center text-zinc-700 shadow-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">
                <h2 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">Você ainda não tem quadros</h2>
                <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  Crie o seu primeiro quadro para começar a organizar suas tarefas agora mesmo.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {userBoards.map((board) => (
                  <BoardCard key={board.id} board={board} />
                ))}
              </div>
            )}
          </div>

          <CreateBoardForm />
        </section>
      </main>
    </div>
  );
}
