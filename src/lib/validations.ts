import { z } from "zod";

export const createBoardSchema = z.object({
  title: z.string().min(1, "O título é obrigatório").max(80),
  description: z.string().max(300).optional(),
});

export const updateBoardSchema = z.object({
  boardId: z.string().min(1),
  title: z.string().min(1, "O título é obrigatório").max(80),
  description: z.string().max(300).optional(),
});

export const createColumnSchema = z.object({
  boardId: z.string().min(1),
  title: z.string().min(1, "O título é obrigatório").max(60),
});

export const updateColumnSchema = z.object({
  columnId: z.string().min(1),
  title: z.string().min(1, "O título é obrigatório").max(60),
});

export const createCardSchema = z.object({
  columnId: z.string().min(1),
  title: z.string().min(1, "O título é obrigatório").max(120),
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
  sourceColumnId: z.string().min(1),
  targetColumnId: z.string().min(1),
  newPosition: z.number().int().min(0),
});
