export default function AppDashboardPage() {
  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-12 dark:bg-zinc-950">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 rounded-3xl bg-white p-10 shadow-lg ring-1 ring-black/5 dark:bg-zinc-950 dark:ring-white/10">
        <h1 className="text-3xl font-semibold text-zinc-950 dark:text-zinc-50">
          Dashboard
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Este é o painel protegido do Flowboard. A autenticação já está configurada e você verá esta página somente após login.
        </p>
      </main>
    </div>
  );
}
