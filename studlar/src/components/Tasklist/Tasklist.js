import { useEffect, useRef, useState } from "react";

import styles from "./tasklist.module.css";
import boardStyles from "@/components/Boards/board.module.css";
import TaskStatusSelector from "./TaskStatusSelector";

export default function Tasklist({ tasklist }) {
    const statusList = [
        { name: "todo", icon: "radio_button_unchecked" },
        { name: "in progress", icon: "hourglass_empty" },
        { name: "done", icon: "radio_button_checked" },
    ];

    const [addingTask, setAddingTask] = useState(false);
    const [newTaskName, setNewTaskName] = useState("");

    const [showStatusDialog, setShowStatusDialog] = useState(false);
    const [clickedTask, setClickedTask] = useState(null);
    const statusDialog = useRef(null);
    const [cursorPosition, setCursorPosition] = useState({
        x: 0,
        y: 0,
    });
    const [lastClickedCursorPosition, setLastClickedCursorPosition] = useState({
        x: 0,
        y: 0,
    });

    const [forceRefresh, setForceRefresh] = useState(0);
    const refreshList = () => {
        setForceRefresh((prev) => prev + 1);
    };

    useEffect(() => {
        const updateCursorPosition = (event) => {
            setCursorPosition({
                x: event.clientX,
                y: event.clientY,
            });
        };
        window.addEventListener("mousemove", updateCursorPosition);

        const handleMouseDown = (event) => {
            if (
                showStatusDialog &&
                statusDialog.current &&
                !statusDialog.current.contains(event.target)
            ) {
                setShowStatusDialog(false);
            }
        };
        document.addEventListener("mousedown", handleMouseDown);

        return () => {
            window.removeEventListener("mousemove", updateCursorPosition);
            document.removeEventListener("mousedown", handleMouseDown);
        };
    }, [showStatusDialog]);

    useEffect(() => {
        setNewTaskName("");
    }, [addingTask]);

    const hanleShowStatusDialog = (event) => {
        setLastClickedCursorPosition(cursorPosition);
        setShowStatusDialog(true);
    };

    const handleTaskCreation = async (event) => {
        event.preventDefault();

        if (addingTask) {
            const response = await fetch("/api/boards/tasks/", {
                method: "POST",
                body: JSON.stringify({
                    title: newTaskName,
                    description: "",
                    status: "todo",
                    list_id: tasklist.id,
                }),
            });

            const data = response.json();
            if (response.ok) {
                tasklist.tasks.push(data);
            } else {
                console.error("Error:", data.error);
            }

            setAddingTask(false);
        } else {
            setAddingTask(true);
        }
    };

    return (
        <>
            {showStatusDialog && (
                <TaskStatusSelector
                    ref={statusDialog}
                    x={lastClickedCursorPosition.x}
                    y={lastClickedCursorPosition.y}
                    statusMap={statusList}
                    currentStatus={clickedTask.status}
                    onChangeStatus={(newStatus) => {
                        const updatedTasks = tasklist.tasks.map((task) => {
                            if (task.id === clickedTask.id) {
                                return { ...task, status: newStatus };
                            }
                            return task;
                        });

                        tasklist.tasks = updatedTasks;
                        setClickedTask(null);
                        setShowStatusDialog(false);
                        refreshList();
                    }}
                />
            )}
            <div>
                {tasklist.name && (
                    <div className={boardStyles.subsectionHeader}>
                        <p>{tasklist.name}</p>
                    </div>
                )}
                {tasklist.tasks.map((task) => (
                    <div
                        className={styles.tasklistTask}
                        key={`task-${tasklist.id}-${task.id}-${forceRefresh}`}
                    >
                        <span className="material-icons">
                            {statusList.find(
                                (status) => status.name === task.status
                            )?.icon || "radio_button_unchecked"}
                        </span>

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
                        <span
                            className={`material-icons ${boardStyles.dragIcon}`}
                        >
                            drag_indicator
                        </span>
                    </div>
                ))}
                <div
                    className={styles.tasklistTask}
                    onClick={handleTaskCreation}
                >
                    {addingTask ? (
                        <form
                            onSubmit={handleTaskCreation}
                            className={styles.taskForm}
                        >
                            <input
                                type="text"
                                placeholder="Task Name"
                                className={styles.taskInput}
                                id="taskName"
                                value={newTaskName}
                                onBlur={() => {
                                    setAddingTask(false);
                                }}
                                autoFocus
                                onChange={(e) => setNewTaskName(e.target.value)}
                                required
                            />
                        </form>
                    ) : (
                        <p className={styles.addTask}>
                            <strong>+ Add a new task</strong>
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}
