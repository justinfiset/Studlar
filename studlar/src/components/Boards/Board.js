"use client";

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
import { useSortable } from "@dnd-kit/sortable";
import Tasklist from "../Tasklist/Tasklist";
const maxXPosition = 3;

export default function Board(props) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: `board-${props.board.id}` });

    // Move the board when draggedf
    const style = {
        transition: isDragging ? "none" : transition,
        transform: CSS.Transform.toString(transform),
    };

    const [showOptions, setShowOptions] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const { user } = useUser();

    // Editing
    const [boardName, setBoardName] = useState(props.board.name);

    const delCurrentBoard = async () => {
        // In the hope everything goes right, we remove the board from the list
        props.onDelete(props.board.id);

        // TODO KEEP IN HERE?
        try {
            const response = await fetch(
                `/api/boards/?id=${props.board.id}&owner_id=${user.id}`,
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
            props.board.name = boardName;
            updateBoard();
        }
    };

    const handleDelete = (event) => {
        event.stopPropagation();
        event.preventDefault();

        props.deleteModalCallback(() => handleDeleteCallback)
        props.showDeleteModal();
    };

    const handleDeleteCallback = () => {
        console.trace("Deleting board...");
        setShowOptions(false);
        delCurrentBoard();
    }

    const updateBoard = async () => {
        try {
            const response = await fetch("/api/boards/", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(props.board),
            });

            const data = await response.json();
            if (response.ok) {
                props.onUpdate();
            } else {
                console.error("Error:", data.error);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const moveCard = (shift) => {
        setShowOptions(false);
        const newXPosition = props.board.positionX + shift;
        if (newXPosition >= 0 && newXPosition <= maxXPosition) {
            props.board.positionX = newXPosition;
            updateBoard();
        }
    };

    const handleAdd = (event) => {
        props.showAddboardComponent(props.board.id);
    };

    const displayTasklist = (board) => {
        return props.board.task_lists.map((tasklist) => (
            <Tasklist tasklist={tasklist} key={`tasklist-${tasklist.id}`} />
        ));
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
                        <p>{props.board.name}</p>
                        <div className={styles.headerOptionsContainer}>
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
                    <p>
                        {props.board.positionX} {props.board.positionY} {props.board.description}
                    </p>
                    {displayTasklist(props.board)}
                </>
            ) : (
                <div className={styles.options}>
                    {props.board.positionX > 0 && (
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
                    {props.board.positionX < maxXPosition && (
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
