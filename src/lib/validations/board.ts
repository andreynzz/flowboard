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
