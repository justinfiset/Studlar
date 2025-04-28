"use client";

import { useDroppable } from "@dnd-kit/core";
import styles from "./board.module.css";
import { CSS } from "@dnd-kit/utilities";
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Board from "./Board";

export default function BoardColumn(props) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
        isOver,
    } = useSortable({
        id: `col-${props.column}`,
    });

    const isOverColumn = props.overColumn === props.column;

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            className={`${styles.contentCol} ${
                isOver || isOverColumn ? styles.isOver : ""
            }`}
            style={style}
        >
            <SortableContext
                items={props.boards.map((board) => `board-${board.id}`)}
                strategy={verticalListSortingStrategy}
            >
                {props.boards.map((board) => {
                    return (
                        <Board
                            key={board.id}
                            board={board}
                            onDelete={props.onDelete}
                            onUpdate={props.onUpdate}
                            requestRefresh={props.requestRefresh}

                            boardsHook={props.boardsHook}
                        />
                    );
                })}
            </SortableContext>
        </div>
    );
}
