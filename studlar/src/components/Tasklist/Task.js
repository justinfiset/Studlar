import styles from "./tasklist.module.css";
import boardStyles from "@/components/Boards/board.module.css";

import { useSortable } from "@dnd-kit/sortable";

export default function Task({ task, icon, id }) {
    const { attributes, listeners, setNoderef, transform } = useSortable({
        id: id
    });

    return (
        <div className={styles.tasklistTask}>
            <span className="material-icons">{icon}</span>

            <span
                className="material-icons"
                onClick={() => {
                    setClickedTask(task);
                    hanleShowStatusDialog();
                }}
            >
                arrow_drop_down
            </span>
            <p>{task.title}</p>
            <span className={`material-icons ${boardStyles.dragIcon}`}>
                drag_indicator
            </span>
        </div>
    );
}
