import { users, boards, columns, cards } from "@/db/schema";

export type User = typeof users.$inferSelect;
export type Board = typeof boards.$inferSelect;
export type Column = typeof columns.$inferSelect;
export type Card = typeof cards.$inferSelect;

export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface BoardWithColumns extends Board {
  columns: ColumnWithCards[];
}

export interface ColumnWithCards extends Column {
  cards: Card[];
}
