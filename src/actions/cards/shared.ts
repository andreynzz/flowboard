import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db/index";
import { boards, cards, columns } from "@/db/schema";

export function parseOptionalDate(value?: string) {
  if (!value) {
    return null;
  }

  return new Date(`${value}T00:00:00`);
}

export async function getRequiredUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Usuário não autenticado");
  }

  return session.user.id;
}

export async function getOwnedColumn(columnId: string, userId: string) {
  const [column] = await db
    .select({
      id: columns.id,
      boardId: columns.boardId,
    })
    .from(columns)
    .innerJoin(boards, eq(columns.boardId, boards.id))
    .where(and(eq(columns.id, columnId), eq(boards.ownerId, userId)))
    .limit(1);

  return column;
}

export async function getOwnedCard(cardId: string, userId: string) {
  const [card] = await db
    .select({
      id: cards.id,
      boardId: boards.id,
    })
    .from(cards)
    .innerJoin(columns, eq(cards.columnId, columns.id))
    .innerJoin(boards, eq(columns.boardId, boards.id))
    .where(and(eq(cards.id, cardId), eq(boards.ownerId, userId)))
    .limit(1);

  return card;
}
