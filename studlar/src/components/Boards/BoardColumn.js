import { useDroppable } from "@dnd-kit/core";
import styles from "./board.module.css";

export default function BoardColumn(props) {
    const { isOver, setNodeRef } = useDroppable({
        id: props.column,
    });

    return (
        <div
            ref={setNodeRef}
            className={`${styles.contentCol} ${isOver ? styles.isOver : ''}`}
        >
            {props.children}
        </div>
    );
}
