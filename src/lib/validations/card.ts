import { z } from "zod";

export const createCardSchema = z.object({
  columnId: z.string().min(1),
  title: z.string().min(1, "O título é obrigatório").max(120),
  description: z.string().max(2000).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  dueDate: z.string().optional(),
});

export const updateCardSchema = z.object({
  cardId: z.string().min(1),
  title: z.string().min(1, "O título é obrigatório").max(120),
  description: z.string().max(2000).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  dueDate: z.string().optional(),
});

export const moveCardSchema = z.object({
  cardId: z.string().min(1),
  targetColumnId: z.string().min(1),
  cards: z
    .array(
      z.object({
        id: z.string().min(1),
        columnId: z.string().min(1),
        position: z.number().int().min(0),
      })
    )
    .min(1),
});
