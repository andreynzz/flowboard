import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { db } from "@/db/index";
import { boards, cards, columns } from "@/db/schema";
import { createCardSchema } from "@/lib/validations";

export async function createCard(formData: FormData) {
  "use server";

  const columnId = formData.get("columnId");
  const title = formData.get("title");

  const parsed = createCardSchema.parse({
    columnId,
    title,
  });

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Usuário não autenticado");
  }

  const [column] = await db
    .select({
      id: columns.id,
      boardId: columns.boardId,
    })
    .from(columns)
    .innerJoin(boards, eq(columns.boardId, boards.id))
    .where(
      and(eq(columns.id, parsed.columnId), eq(boards.ownerId, session.user.id))
    )
    .limit(1);

  if (!column) {
    throw new Error("Coluna não encontrada");
  }

  const existingCards = await db
    .select({ id: cards.id })
    .from(cards)
    .where(eq(cards.columnId, parsed.columnId));

  await db.insert(cards).values({
    id: nanoid(),
    title: parsed.title,
    description: null,
    position: existingCards.length,
    columnId: parsed.columnId,
  });

  revalidatePath(`/app/boards/${column.boardId}`);
}
