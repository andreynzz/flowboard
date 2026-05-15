import { createBoard } from "@/actions/board.actions";

export default function CreateBoardForm() {
  return (
    <form action={createBoard} className="grid gap-4 rounded-3xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-700 dark:bg-zinc-950">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
          Nome do quadro
        </label>
        <input
          id="title"
          name="title"
          required
          className="mt-2 w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-700"
          placeholder="Ex: Planejamento de produto"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
          Descrição
        </label>
        <textarea
          id="description"
          name="description"
          className="mt-2 min-h-[92px] w-full resize-none rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-700"
          placeholder="Opcional: descrição breve do quadro"
        />
      </div>

      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
      >
        Criar quadros
      </button>
    </form>
  );
}
