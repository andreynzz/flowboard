"use client";

import {
  closestCorners,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { useEffect, useState, useTransition } from "react";
import { moveCard } from "@/actions/card.actions";
import type { BoardWithColumns } from "@/types";
import CreateColumnForm from "./CreateColumnForm";
import KanbanColumn from "./KanbanColumn";

export default function BoardView({ board }: { board: BoardWithColumns }) {
  const [columns, setColumns] = useState(board.columns);
  const [isPending, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    setColumns(board.columns);
  }, [board.columns]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);
    const sourceColumnIndex = columns.findIndex((column) =>
      column.cards.some((card) => card.id === activeId)
    );

    if (sourceColumnIndex === -1) {
      return;
    }

    const targetColumnIndex = columns.findIndex(
      (column) =>
        column.id === overId || column.cards.some((card) => card.id === overId)
    );

    if (targetColumnIndex === -1) {
      return;
    }

    const previousColumns = columns;
    const sourceColumn = columns[sourceColumnIndex];
    const targetColumn = columns[targetColumnIndex];
    const sourceCardIndex = sourceColumn.cards.findIndex(
      (card) => card.id === activeId
    );
    const targetCardIndex = targetColumn.cards.findIndex(
      (card) => card.id === overId
    );
    const activeCard = sourceColumn.cards[sourceCardIndex];

    if (!activeCard) {
      return;
    }

    const nextColumns = columns.map((column) => ({
      ...column,
      cards: [...column.cards],
    }));

    if (sourceColumn.id === targetColumn.id) {
      const nextIndex =
        targetCardIndex === -1 ? targetColumn.cards.length - 1 : targetCardIndex;

      nextColumns[sourceColumnIndex].cards = arrayMove(
        nextColumns[sourceColumnIndex].cards,
        sourceCardIndex,
        nextIndex
      );
    } else {
      nextColumns[sourceColumnIndex].cards.splice(sourceCardIndex, 1);
      const nextIndex =
        targetCardIndex === -1
          ? nextColumns[targetColumnIndex].cards.length
          : targetCardIndex;

      nextColumns[targetColumnIndex].cards.splice(nextIndex, 0, {
        ...activeCard,
        columnId: targetColumn.id,
      });
    }

    const normalizedColumns = nextColumns.map((column) => ({
      ...column,
      cards: column.cards.map((card, position) => ({
        ...card,
        columnId: column.id,
        position,
      })),
    }));

    setColumns(normalizedColumns);

    const movedCard = normalizedColumns
      .flatMap((column) => column.cards)
      .find((card) => card.id === activeId);

    if (!movedCard) {
      return;
    }

    startTransition(async () => {
      try {
        await moveCard({
          cardId: movedCard.id,
          targetColumnId: movedCard.columnId,
          cards: normalizedColumns.flatMap((column) =>
            column.cards.map((card) => ({
              id: card.id,
              columnId: card.columnId,
              position: card.position,
            }))
          ),
        });
      } catch {
        setColumns(previousColumns);
      }
    });
  }

  return (
    <div className="mt-8">
      {columns.length > 0 ? (
        <>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-5 overflow-x-auto pb-4">
              {columns.map((column) => (
                <KanbanColumn key={column.id} column={column} />
              ))}
              <CreateColumnForm boardId={board.id} />
            </div>
          </DndContext>
          {isPending ? (
            <p className="mt-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Salvando nova ordem...
            </p>
          ) : null}
        </>
      ) : (
        <div className="grid gap-5 md:grid-cols-[1fr_auto]">
          <section className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
              Este quadro ainda não tem colunas
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              Crie colunas para começar a organizar seus cards.
            </p>
          </section>
          <CreateColumnForm boardId={board.id} />
        </div>
      )}
    </div>
  );
}
