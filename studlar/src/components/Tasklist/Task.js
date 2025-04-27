import styles from "./tasklist.module.css";
import boardStyles from "@/components/Boards/board.module.css";

import { useSortable } from "@dnd-kit/sortable";
import { useState } from "react";
import { useModal } from "@/contexts/ModalContext";
import TaskEditModal from "@/components/Modal/TaskEditModal";

export default function Task({
    task,
    icon,
    id,
    setClickedTask,
    hanleShowStatusDialog,
}) {
    const { openModal, closeModal } = useModal();

    const { attributes, listeners, setNoderef, transform } = useSortable({
        id: id,
    });

    return (
        <div
            className={styles.tasklistTask}
        >
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
            <p className={styles.taskName}
                onClick={() => {
                    openModal(TaskEditModal,
                        {
                            task: task,
                            onClose: () => {
                                closeModal();
                            },
                            onConfirm: () => {
                                deleteTask(task.id);
                                closeModal();
                            },
                        }
                    )
                }}
            >{task.title}</p>
            <span className={`material-icons ${boardStyles.dragIcon}`}>
                drag_indicator
            </span>
        </div>
    );
}
