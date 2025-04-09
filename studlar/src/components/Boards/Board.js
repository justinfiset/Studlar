import { useState } from "react";
import styles from "./board.module.css";
import { useUser } from "@/contexts/UserContext";
import { CSS } from "@dnd-kit/utilities";

import {
    DndContext,
    closestCorners,
    PointerSensor,
    useSensor,
    useSensors,
    useDraggable,    
} from "@dnd-kit/core";
import {
    useSortable,
} from "@dnd-kit/sortable";
const maxXPosition = 3;

export default function Board({ board, onDelete, onUpdate }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: `board-${board.id}` });

    // Move the board when draggedf
    const style = {
        transition: isDragging ? "none" : transition,
        transform: CSS.Transform.toString(transform),
    };

    const [showOptions, setShowOptions] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const { user } = useUser();

    // Editing
    const [boardName, setBoardName] = useState(board.name);

    const delCurrentBoard = async () => {
        // In the hope everything goes right, we remove the board from the list
        onDelete(board.id);

        // TODO KEEP IN HERE?
        try {
            const response = await fetch(
                `/api/boards/?id=${board.id}&owner_id=${user.id}`,
                { method: "DELETE" }
            );
            const data = await response.json();

            if (response.ok) {
                
            } else {
                console.error("Error:", data.error);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleEdit = (event) => {
        event.stopPropagation();
        event.preventDefault();

        setShowOptions(false);
        setIsEditing(!isEditing);

        if (isEditing) {
            board.name = boardName;
            updateBoard();
        }
    };

    const handleDelete = (event) => {
        event.stopPropagation();
        event.preventDefault();

        setShowOptions(false);
        delCurrentBoard();
    };

    const updateBoard = async () => {
        try {
            const response = await fetch("/api/boards/", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(board),
            });

            const data = await response.json();
            if (response.ok) {
                onUpdate();
            } else {
                console.error("Error:", data.error);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const moveCard = (shift) => {
        setShowOptions(false);
        const newXPosition = board.positionX + shift;
        if (newXPosition >= 0 && newXPosition <= maxXPosition) {
            board.positionX = newXPosition;
            updateBoard();
        }
    };

    const handleAdd = (event) => {};

    const displayTasks = (board) => {
        return board.task_lists.map((tasklist) => (
            <div key={tasklist.id}>
                {!isEditing && tasklist.name && (
                    <div className={styles.subsectionHeader}>
                        <p>{tasklist.name}</p>
                    </div>
                )}
                <div
                    className="todolist-task"
                    key={tasklist.id}
                    draggable="true"
                >
                    <span className="material-icons">
                        radio_button_unchecked
                    </span>
                    <p>{tasklist.name}</p>
                    <span className={`material-icons ${styles.dragIcon}`}>
                        drag_indicator
                    </span>
                </div>
                <span></span>
            </div>
        ));
    };

    const displayTasklist = (board) => {
        return (
            <>
                {board.task_lists.length > 0 && (
                    <>
                        {displayTasks(board)}
                        <div className="todolist-task">
                            <p>
                                <strong>+ Ajouter un item</strong>
                            </p>
                            <span></span>
                        </div>
                    </>
                )}
            </>
        );
    };

    const handleOptionsBtn = (event) => {
        event.stopPropagation();
        event.preventDefault();

        setShowOptions(!showOptions);
    };

    return (
        <article
            className={`${styles.card} ${isDragging ? styles.activeCard : ""}`}
            ref={setNodeRef}
            style={style}
            {...attributes}
        >
            <div className={styles.draggableHeader} {...listeners}></div>
            <div className="card-header">
                {isEditing ? (
                    <>
                        <input
                            type="text"
                            placeholder="Board Name"
                            className={styles.editInput}
                            id="boardName"
                            value={boardName}
                            onChange={(e) => setBoardName(e.target.value)}
                        />

                        <button className={styles.saveBtn} onClick={handleEdit}>
                            Save
                        </button>
                    </>
                ) : (
                    <>
                        <p>{board.name} {board.id}</p>
                        <div>
                            <span
                                className="material-icons card-header-menu"
                                onClick={handleAdd}
                            >
                                add
                            </span>
                            <span
                                className="material-icons card-header-menu"
                                onClick={handleOptionsBtn}
                            >
                                {showOptions ? "close" : "menu"}
                            </span>
                        </div>
                    </>
                )}
            </div>

            {!showOptions ? (
                <>
                    <p>{board.positionX} {board.positionY}</p>
                    <p>{board.description}</p>
                    {displayTasklist(board)}
                </>
            ) : (
                <div className={styles.options}>
                    {board.positionX > 0 && (
                        <div
                            className={styles.positionArrow}
                            onClick={moveCard.bind(this, -1)}
                        >
                            <p className={`material-icons`}>chevron_left</p>
                        </div>
                    )}
                    <div className={styles.optionsContainer}>
                        <p onClick={handleEdit} className="material-icons">
                            edit
                        </p>
                        <p
                            onClick={handleDelete}
                            className={`material-icons ${styles.deleteBtn}`}
                        >
                            delete
                        </p>
                    </div>
                    {board.positionX < maxXPosition && (
                        <div
                            className={styles.positionArrow}
                            onClick={moveCard.bind(this, 1)}
                        >
                            <p className={`material-icons`}>chevron_right</p>
                        </div>
                    )}
                </div>
            )}
        </article>
    );
}
