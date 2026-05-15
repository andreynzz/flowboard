import { nanoid } from "nanoid";
import { getServerSession } from "next-auth";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { db } from "@/db/index";
import { boards, columns } from "@/db/schema";
import { createBoardSchema } from "@/lib/validations";

export async function createBoard(formData: FormData) {
  "use server";

  const title = formData.get("title");
  const description = formData.get("description");

  if (typeof title !== "string") {
    throw new Error("Título inválido");
  }

  const parsed = createBoardSchema.parse({
    title,
    description: typeof description === "string" ? description : undefined,
  });

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Usuário não autenticado");
  }

  const boardId = nanoid();

  await db.insert(boards).values({
    id: boardId,
    title: parsed.title,
    description: parsed.description ?? null,
    ownerId: session.user.id,
  });

  await db.insert(columns).values([
    {
      id: nanoid(),
      title: "A Fazer",
      position: 0,
      boardId,
    },
    {
      id: nanoid(),
      title: "Em Progresso",
      position: 1,
      boardId,
    },
    {
      id: nanoid(),
      title: "Concluído",
      position: 2,
      boardId,
    },
  ]);

  revalidatePath("/app");
}

export async function deleteBoard(formData: FormData) {
  "use server";

  const boardId = formData.get("boardId");
  if (typeof boardId !== "string") {
    throw new Error("Board ID inválido");
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Usuário não autenticado");
  }

  await db
    .delete(boards)
    .where(and(eq(boards.id, boardId), eq(boards.ownerId, session.user.id)));

  revalidatePath("/app");
}
