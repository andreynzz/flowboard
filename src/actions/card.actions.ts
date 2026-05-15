"use server";

import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { db } from "@/db/index";
import { boards, cards, columns } from "@/db/schema";
import {
  createCardSchema,
  moveCardSchema,
  updateCardSchema,
} from "@/lib/validations";

function parseOptionalDate(value?: string) {
  if (!value) {
    return null;
  }

  return new Date(`${value}T00:00:00`);
}

export async function createCard(formData: FormData) {
  const columnId = formData.get("columnId");
  const title = formData.get("title");
  const description = formData.get("description");
  const priority = formData.get("priority");
  const dueDate = formData.get("dueDate");

  const parsed = createCardSchema.parse({
    columnId,
    title,
    description: typeof description === "string" ? description : undefined,
    priority: typeof priority === "string" ? priority : undefined,
    dueDate: typeof dueDate === "string" ? dueDate : undefined,
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
    description: parsed.description || null,
    priority: parsed.priority ?? "MEDIUM",
    dueDate: parseOptionalDate(parsed.dueDate),
    position: existingCards.length,
    columnId: parsed.columnId,
  });

  revalidatePath(`/app/boards/${column.boardId}`);
}

export async function updateCard(formData: FormData) {
  const cardId = formData.get("cardId");
  const title = formData.get("title");
  const description = formData.get("description");
  const priority = formData.get("priority");
  const dueDate = formData.get("dueDate");

  const parsed = updateCardSchema.parse({
    cardId,
    title,
    description: typeof description === "string" ? description : undefined,
    priority: typeof priority === "string" ? priority : undefined,
    dueDate: typeof dueDate === "string" ? dueDate : undefined,
  });

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Usuário não autenticado");
  }

  const [card] = await db
    .select({
      id: cards.id,
      boardId: boards.id,
    })
    .from(cards)
    .innerJoin(columns, eq(cards.columnId, columns.id))
    .innerJoin(boards, eq(columns.boardId, boards.id))
    .where(and(eq(cards.id, parsed.cardId), eq(boards.ownerId, session.user.id)))
    .limit(1);

  if (!card) {
    throw new Error("Card não encontrado");
  }

  await db
    .update(cards)
    .set({
      title: parsed.title,
      description: parsed.description || null,
      priority: parsed.priority ?? "MEDIUM",
      dueDate: parseOptionalDate(parsed.dueDate),
      updatedAt: new Date(),
    })
    .where(eq(cards.id, parsed.cardId));

  revalidatePath(`/app/boards/${card.boardId}`);
}

export async function deleteCard(formData: FormData) {
  const cardId = formData.get("cardId");
  if (typeof cardId !== "string") {
    throw new Error("Card ID inválido");
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Usuário não autenticado");
  }

  const [card] = await db
    .select({
      id: cards.id,
      boardId: boards.id,
    })
    .from(cards)
    .innerJoin(columns, eq(cards.columnId, columns.id))
    .innerJoin(boards, eq(columns.boardId, boards.id))
    .where(and(eq(cards.id, cardId), eq(boards.ownerId, session.user.id)))
    .limit(1);

  if (!card) {
    throw new Error("Card não encontrado");
  }

  await db.delete(cards).where(eq(cards.id, cardId));

  revalidatePath(`/app/boards/${card.boardId}`);
}

export async function moveCard(input: unknown) {
  const parsed = moveCardSchema.parse(input);

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Usuário não autenticado");
  }

  const [targetColumn] = await db
    .select({
      id: columns.id,
      boardId: columns.boardId,
    })
    .from(columns)
    .innerJoin(boards, eq(columns.boardId, boards.id))
    .where(
      and(
        eq(columns.id, parsed.targetColumnId),
        eq(boards.ownerId, session.user.id)
      )
    )
    .limit(1);

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
