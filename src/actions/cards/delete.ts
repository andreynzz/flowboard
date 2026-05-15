"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db/index";
import { cards } from "@/db/schema";
import { getOwnedCard, getRequiredUserId } from "./shared";

export async function deleteCard(formData: FormData) {
  const cardId = formData.get("cardId");
  if (typeof cardId !== "string") {
    throw new Error("Card ID inválido");
  }

  const userId = await getRequiredUserId();
  const card = await getOwnedCard(cardId, userId);

  if (!card) {
    throw new Error("Card não encontrado");
  }

  await db.delete(cards).where(eq(cards.id, cardId));

  revalidatePath(`/app/boards/${card.boardId}`);
}
