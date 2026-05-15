import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-12 dark:bg-zinc-950">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 rounded-3xl bg-white p-10 shadow-lg ring-1 ring-black/5 dark:bg-zinc-950 dark:ring-white/10">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
            Flowboard
          </p>
          <h1 className="text-4xl font-semibold text-zinc-950 dark:text-zinc-50">
            Organize projetos com quadros Kanban simples, rápidos e visuais.
          </h1>
          <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Gerencie suas tarefas de forma intuitiva com drag and drop, colunas personalizáveis e uma interface limpa focada na produtividade.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            Começar agora
          </Link>
          <Link
            href="/app"
            className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-800"
          >
            Ver dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="space-y-2">
            <h3 className="font-semibold text-zinc-950 dark:text-zinc-50">
              Quadros ilimitados
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Crie quantos quadros precisar para organizar seus projetos.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-zinc-950 dark:text-zinc-50">
              Drag and drop
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Mova cards entre colunas de forma intuitiva e rápida.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-zinc-950 dark:text-zinc-50">
              Interface limpa
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Foco na produtividade com design minimalista e responsivo.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

