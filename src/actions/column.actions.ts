"use server";

import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { db } from "@/db/index";
import { boards, columns } from "@/db/schema";
import { createColumnSchema, updateColumnSchema } from "@/lib/validations";

export async function createColumn(formData: FormData) {
  const boardId = formData.get("boardId");
  const title = formData.get("title");

  const parsed = createColumnSchema.parse({
    boardId,
    title,
  });

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Usuário não autenticado");
  }

  const [board] = await db
    .select({ id: boards.id })
    .from(boards)
    .where(and(eq(boards.id, parsed.boardId), eq(boards.ownerId, session.user.id)))
    .limit(1);

  if (!board) {
    throw new Error("Quadro não encontrado");
  }

  const existingColumns = await db
    .select({ id: columns.id })
    .from(columns)
    .where(eq(columns.boardId, parsed.boardId));

  await db.insert(columns).values({
    id: nanoid(),
    title: parsed.title,
    position: existingColumns.length,
    boardId: parsed.boardId,
  });

  revalidatePath(`/app/boards/${parsed.boardId}`);
}

export async function updateColumn(formData: FormData) {
  const columnId = formData.get("columnId");
  const title = formData.get("title");

  const parsed = updateColumnSchema.parse({
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

  await db
    .update(columns)
    .set({
      title: parsed.title,
      updatedAt: new Date(),
    })
    .where(eq(columns.id, parsed.columnId));

  revalidatePath(`/app/boards/${column.boardId}`);
}

export async function deleteColumn(formData: FormData) {
  const columnId = formData.get("columnId");
  if (typeof columnId !== "string") {
    throw new Error("Column ID inválido");
  }

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
    .where(and(eq(columns.id, columnId), eq(boards.ownerId, session.user.id)))
    .limit(1);

  if (!column) {
    throw new Error("Coluna não encontrada");
  }

  await db.delete(columns).where(eq(columns.id, columnId));

  revalidatePath(`/app/boards/${column.boardId}`);
}
