"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db/index";
import { cards } from "@/db/schema";
import { updateCardSchema } from "@/lib/validations";
import { getOwnedCard, getRequiredUserId, parseOptionalDate } from "./shared";

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

  const userId = await getRequiredUserId();
  const card = await getOwnedCard(parsed.cardId, userId);

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
