import { z } from "zod";

export const createColumnSchema = z.object({
  boardId: z.string().min(1),
  title: z.string().min(1, "O título é obrigatório").max(60),
});

export const updateColumnSchema = z.object({
  columnId: z.string().min(1),
  title: z.string().min(1, "O título é obrigatório").max(60),
});
