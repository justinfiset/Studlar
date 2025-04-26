import { useEffect, useRef, useState } from "react";

import styles from "./tasklist.module.css";
import boardStyles from "@/components/Boards/board.module.css";
import TaskStatusSelector from "./TaskStatusSelector";
import Task from "./Task";

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

            const data = await response.json();
            console.log(data);
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

    const handleStatusChange = (newStatus) => {
        const updatedTasks = tasklist.tasks.map((task) => {
            if (task.id === clickedTask.id) {
                return { ...task, status: newStatus };
            }
            return task;
        });

        tasklist.tasks = updatedTasks;

        sendStatusChange(clickedTask.id, newStatus);

        setClickedTask(null);
        setShowStatusDialog(false);
        refreshList();
    };

    const sendStatusChange = async (taskId, newStatus) => {
        const response = await fetch("/api/boards/tasks/", {
            method: "PUT",
            body: JSON.stringify({
                id: taskId,
                status: newStatus,
            }),
        });

        const data = await response.json();
        console.log(data);
        if (response.ok) {
            // We do nothing as the tasklist is already updated (anticipated response)
        } else {
            console.error("Error:", data.error);
        }
    }

    return (
        <>
            {showStatusDialog && (
                <TaskStatusSelector
                    ref={statusDialog}
                    x={lastClickedCursorPosition.x}
                    y={lastClickedCursorPosition.y}
                    statusMap={statusList}
                    currentStatus={clickedTask.status}
                    onChangeStatus={handleStatusChange}
                />
            )}
            <div>
                {tasklist.name && (
                    <div className={boardStyles.subsectionHeader}>
                        <p>{tasklist.name}</p>
                    </div>
                )}
                {tasklist.description && (
                    <div className={boardStyles.subsectionDescription}>
                        <p>{tasklist.description}</p>
                    </div>
                )}
                {tasklist.tasks.map((task) => (
                    <Task
                        task={task}
                        icon={
                            statusList.find(
                                (status) => status.name === task.status
                            )?.icon || "radio_button_unchecked"
                        }
                        key={`task-${tasklist.id}-${task.id}-${forceRefresh}`}
                        id={`task-${tasklist.id}-${task.id}-${forceRefresh}`}
                        setClickedTask={setClickedTask}
                        hanleShowStatusDialog={hanleShowStatusDialog}
                    />
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
