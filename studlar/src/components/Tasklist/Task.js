import styles from "./tasklist.module.css";
import boardStyles from "@/components/Boards/board.module.css";

import { useSortable } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import { useModal } from "@/contexts/ModalContext";
import TaskEditModal from "@/components/Modal/TaskEditModal";
import { CSS } from "@dnd-kit/utilities";

export default function Task({
    task,
    tasklist_id,
    icon,
    setClickedTask,
    hanleShowStatusDialog,
    setTask,
}) {
    const { openModal, closeModal } = useModal();

    const {
        attributes,
        listeners,
        setNoderef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: `task-${task.id}`,
    });

    const handleEditClick = (e) => {
        e.preventDefault();
        setClickedTask(task);
        hanleShowStatusDialog(e, task);
    };

    return (
        <div
            className={styles.tasklistTask}
            ref={setNoderef}
            style={{
                transform: CSS.Transform.toString(transform),
                opacity: isDragging ? 0.5 : 1,
                transition,
                position: "relative",
                boxShadow: isDragging ? "0 4px 8px rgba(0,0,0,0.1)" : "none",
            }}
            {...attributes}
            {...listeners}
        >
            <span className="material-icons" onClick={handleEditClick}>
                {icon}
            </span>

            <span className="material-icons" onClick={handleEditClick}>
                arrow_drop_down
            </span>
            <p
                className={styles.taskName}
                onClick={() => {
                    openModal(TaskEditModal, {
                        task: task,
                        tasklist_id: tasklist_id,
                        onClose: () => {
                            closeModal();
                        },
                        onConfirm: (result) => {
                            if (result != task) {
                                setTask(result);
                            }
                            closeModal();
                        },
                    });
                }}
            >
                {task.title}
            </p>
            <span className={`material-icons ${boardStyles.dragIcon}`}>
                drag_indicator
            </span>
        </div>
    );
}
