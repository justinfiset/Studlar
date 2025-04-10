import { useEffect, useState } from "react";

import styles from "./tasklist.module.css";
import boardStyles from "@/components/Boards/board.module.css";

export default function Tasklist({ tasklist }) {
    const [addingTask, setAddingTask] = useState(false);
    const [newTaskName, setNewTaskName] = useState("");

    useEffect(() => {
        setNewTaskName("");
    }, [addingTask]);

    const handleTaskCreation = async (event) => {
        event.preventDefault();
        
        if (addingTask) {
            // TODO IMPL.
            alert(newTaskName);
            const response = await fetch("/api/boards/tasks/", {
                method: "POST",
                body: JSON.stringify({
                    title: newTaskName,
                    description: "",
                    status: "todo",
                    list_id: tasklist.id,
                })
            })

            const data = response.json();
            if(response.ok) {
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
        <div key={`tasklist-${tasklist.id}`}>
            {tasklist.name && (
                <div className={boardStyles.subsectionHeader}>
                    <p>{tasklist.name}</p>
                </div>
            )}
            {tasklist.tasks.map((task) => (
                <div
                    className={styles.tasklistTask}
                    key={`task-${tasklist.id}-${task.id}`}
                >
                    <span className="material-icons">
                        radio_button_unchecked
                    </span>
                    <p>{task.title}</p>
                    <span className={`material-icons ${boardStyles.dragIcon}`}>
                        drag_indicator
                    </span>
                </div>
            ))}
            <div className={styles.tasklistTask} onClick={handleTaskCreation}>
                {addingTask ? (
                    <form onSubmit={handleTaskCreation} className={styles.taskForm}>
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
    );
}
