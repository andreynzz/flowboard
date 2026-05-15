"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db/index";
import { cards, columns } from "@/db/schema";
import { moveCardSchema } from "@/lib/validations";
import { getOwnedColumn, getRequiredUserId } from "./shared";

export async function moveCard(input: unknown) {
  const parsed = moveCardSchema.parse(input);

  const userId = await getRequiredUserId();
  const targetColumn = await getOwnedColumn(parsed.targetColumnId, userId);

  if (!targetColumn) {
    throw new Error("Coluna de destino não encontrada");
  }

  const allowedColumns = await db
    .select({ id: columns.id })
    .from(columns)
    .where(eq(columns.boardId, targetColumn.boardId));

  const allowedColumnIds = new Set(allowedColumns.map((column) => column.id));
  const payloadUsesOnlyBoardColumns = parsed.cards.every((card) =>
    allowedColumnIds.has(card.columnId)
  );

  if (!payloadUsesOnlyBoardColumns) {
    throw new Error("Payload de ordenação inválido");
  }

  const cardIds = parsed.cards.map((card) => card.id);
  const boardCards = await db
    .select({ id: cards.id })
    .from(cards)
    .innerJoin(columns, eq(cards.columnId, columns.id))
    .where(eq(columns.boardId, targetColumn.boardId));

  const boardCardIds = new Set(boardCards.map((card) => card.id));
  const payloadUsesOnlyBoardCards = cardIds.every((cardId) =>
    boardCardIds.has(cardId)
  );

  if (!payloadUsesOnlyBoardCards || !cardIds.includes(parsed.cardId)) {
    throw new Error("Cards de ordenação inválidos");
  }

  await Promise.all(
    parsed.cards.map((card) =>
      db
        .update(cards)
        .set({
          columnId: card.columnId,
          position: card.position,
          updatedAt: new Date(),
        })
        .where(eq(cards.id, card.id))
    )
  );

  revalidatePath(`/app/boards/${targetColumn.boardId}`);
}
