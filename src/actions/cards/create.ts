"use server";

import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { db } from "@/db/index";
import { cards } from "@/db/schema";
import { createCardSchema } from "@/lib/validations";
import { getOwnedColumn, getRequiredUserId, parseOptionalDate } from "./shared";

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

  const userId = await getRequiredUserId();
  const column = await getOwnedColumn(parsed.columnId, userId);

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
