"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useTransition } from "react";

export default function LoginContent() {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const callbackUrl = searchParams.get("callbackUrl") ?? "/app";

  function handleGithubSignIn() {
    startTransition(() => {
      void signIn("github", { callbackUrl });
    });
  }

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-8 rounded-3xl bg-white p-10 shadow-lg ring-1 ring-black/5 dark:bg-zinc-950 dark:ring-white/10">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
          Flowboard
        </p>
        <h1 className="text-3xl font-semibold text-zinc-950 dark:text-zinc-50">
          Entrar com GitHub
        </h1>
        <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          Use sua conta GitHub para acessar seus quadros e começar a gerenciar suas tarefas.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={handleGithubSignIn}
          disabled={isPending}
          className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
        >
          {isPending ? "Redirecionando..." : "Entrar com GitHub"}
        </button>
        <Link
          href="/"
          className="text-sm font-medium text-zinc-600 underline underline-offset-4 dark:text-zinc-300"
        >
          Voltar para home
        </Link>
      </div>
    </main>
  );
}
