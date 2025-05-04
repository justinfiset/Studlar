import { useEffect, useRef, useState } from "react";

import styles from "./tasklist.module.css";
import boardStyles from "@/components/Boards/board.module.css";
import TaskStatusSelector from "./TaskStatusSelector";
import Task from "./Task";
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useModal } from "@/contexts/ModalContext";
import TasklistEditModal from "@/components/Modal/Tasks/TasklistEditModal";

export default function Tasklist({ tasklist, setTaskList }) {
    const { openModal, closeModal } = useModal();

    const [tasks, setTasks] = useState(tasklist.tasks);
    useEffect(() => {
        setTasks(tasklist.tasks);
    }, [tasklist.tasks]);

    const statusList = [
        { name: "todo", icon: "radio_button_unchecked" },
        { name: "in progress", icon: "hourglass_empty" },
        { name: "done", icon: "radio_button_checked" },
    ];

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: `tasklist-${tasklist.id}`,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

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
    const [touchPosition, setTouchPosition] = useState({ x: 0, y: 0 });
    const [lastTouchPosition, setLastTouchPosition] = useState({ x: 0, y: 0 });

    const [forceRefresh, setForceRefresh] = useState(0);
    const refreshList = () => {
        setForceRefresh((prev) => prev + 1);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showStatusDialog && statusDialog.current) {
                const isTouch = event.type.includes("touch");
                const target = isTouch
                    ? document.elementFromPoint(
                          event.touches[0].clientX,
                          event.touches[0].clientY
                      )
                    : event.target;

                if (!statusDialog.current.contains(target)) {
                    setShowStatusDialog(false);
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [showStatusDialog]);

    useEffect(() => {
        setNewTaskName("");
    }, [addingTask]);

    const handleShowStatusDialog = (event, task) => {
        console.log("Event received:", event);
        console.log("Task:", task);
        // Sauvegarder la tâche cliquée
        setClickedTask(task);

        // Empêcher le comportement par défaut si l'événement existe
        event?.preventDefault?.();

        // Déterminer les coordonnées
        let clientX, clientY;

        // Gérer les événements tactiles
        if (event?.touches) {
            const touch = event.touches[0] || event.changedTouches?.[0];
            if (touch) {
                clientX = touch.clientX;
                clientY = touch.clientY;
            }
        }
        // Gérer les événements souris
        else if (event) {
            clientX = event.clientX;
            clientY = event.clientY;
        }
        // Fallback si pas d'événement
        else {
            clientX = 0;
            clientY = 0;
        }

        setLastClickedCursorPosition({ x: clientX, y: clientY });
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
                console.error("Error updating task");
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
    };

    const setTask = (task) => {
        const newTaskList = tasklist;
        if (!task.deleted) {
            newTaskList.tasks = newTaskList.tasks.map((t) => {
                if (t.id === task.id) {
                    return task;
                }
                return t;
            });
        } else {
            newTaskList.tasks = tasklist.tasks.filter((t) => t.id !== task.id);
        }

        setTaskList(newTaskList);
        refreshList();
    };

    return (
        <>
            {showStatusDialog && clickedTask && (
                <TaskStatusSelector
                    ref={statusDialog}
                    x={lastClickedCursorPosition.x}
                    y={lastClickedCursorPosition.y}
                    statusMap={statusList}
                    currentStatus={clickedTask.status}
                    onChangeStatus={handleStatusChange}
                />
            )}
            <div {...attributes} ref={setNodeRef} style={style}>
                <div className={boardStyles.subsectionHeader}>
                    <p>{tasklist.name ? tasklist.name : ""}</p>
                    <div className={boardStyles.subsectionHeaderIcons}>
                        <span
                            className="material-icons card-header-menu"
                            onClick={() => {
                                openModal(TasklistEditModal, {
                                    tasklist: tasklist,
                                    onConfirm: (result) => {
                                        if (result) {
                                            setTaskList(result);
                                        }
                                        closeModal();
                                    },
                                    onClose: () => {
                                        closeModal();
                                    }
                                });
                            }}
                        >
                            settings
                        </span>
                    </div>
                </div>
                {tasklist.description && (
                    <div className={boardStyles.subsectionDescription}>
                        <p>{tasklist.description}</p>
                    </div>
                )}
                <SortableContext
                    items={tasks.map((task) => `task-${task.id}`)}
                    strategy={verticalListSortingStrategy}
                >
                    {tasks.map((task) => (
                        <Task
                            task={task}
                            tasklist_id={tasklist.id}
                            icon={
                                statusList.find(
                                    (status) => status.name === task.status
                                )?.icon || "radio_button_unchecked"
                            }
                            key={`task-${tasklist.id}-${task.id}-${forceRefresh}`}
                            setClickedTask={setClickedTask}
                            hanleShowStatusDialog={handleShowStatusDialog}
                            setTask={setTask}
                        />
                    ))}
                </SortableContext>

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
