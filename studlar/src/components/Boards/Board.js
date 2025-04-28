"use client";

import { useEffect, useState } from "react";
import styles from "./board.module.css";
import { useUser } from "@/contexts/UserContext";
import { CSS } from "@dnd-kit/utilities";

import { useSortable } from "@dnd-kit/sortable";
import Tasklist from "../Tasklist/Tasklist";
import { useModal } from "@/contexts/ModalContext";
import DeleteConfirmationModal from "../Modal/DeleteConfirmationModal";
import AddBoardComponentModal from "../Modal/AddBoardComponentModal";
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

    const [tempBoard, setTempBoard] = useState(props.board);
    useEffect(() => {
        setTempBoard(props.board);
    }, [props.board]);

    const { openModal, closeModal } = useModal();

    // Move the board when draggedf
    const style = {
        transition: isDragging ? "none" : transition,
        transform: CSS.Transform.toString(transform),
    };

    const [showOptions, setShowOptions] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const { user } = useUser();

    const delCurrentBoard = async () => {
        // In the hope everything goes right, we remove the board from the list
        props.onDelete(props.board.id);

        // TODO: KEEP IN HERE?
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

        if (isEditing) {
            updateBoard();
        }

        setIsEditing(!isEditing);
    };

    const handleDelete = (event) => {
        event.stopPropagation();
        event.preventDefault();

        openModal(DeleteConfirmationModal, {
            onConfirm: () => {
                setShowOptions(false);
                delCurrentBoard();
                closeModal();
            },
            onClose: () => {
                closeModal();
            },
        });
    };

    const updateBoard = async () => {
        props.boardsHook((prev) => {
            return prev.map((b) => {
                if (b.id === props.board.id) {
                    return {
                        ...b,
                        name: tempBoard.name,
                        description: tempBoard.description,
                        positionX: tempBoard.positionX,
                    };
                }
                return b;
            });
        });

        try {
            const response = await fetch("/api/boards/", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(tempBoard), // Envoyez tempBoard au lieu de props.board
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
            props.boardsHook((prev) => {
                return prev.map((board) => {
                    if (board.id === props.board.id) {
                        board.positionX = newXPosition;
                    }
                    return board;
                });
            });

            updateBoard();
        }
    };

    const handleAdd = (event) => {
        event.stopPropagation();
        event.preventDefault();

        openModal(AddBoardComponentModal, {
            id: props.board.id,
            onConfirm: () => {
                closeModal();
                props.requestRefresh();
            },
            onClose: () => {
                setAddComponentModal(false);
                props.requestRefresh();
            },
        });
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
            {isEditing && (
                <div className="button-section">
                    <button onClick={handleEdit}>
                        Save
                    </button>
                    <button
                        className="danger-button"
                        onClick={() => {
                            setIsEditing(false);
                            setTempBoard(props.board);
                        }}
                    >
                        Cancel
                    </button>
                </div>
            )}
            <div className="card-header">
                {isEditing ? (
                    <>
                        <input
                            type="text"
                            placeholder="Board Name"
                            className={styles.editInput}
                            id="boardName"
                            defaultValue={props.board.name}
                            onChange={(event) => {
                                setTempBoard((prev) => {
                                    return {
                                        ...prev,
                                        name: event.target.value,
                                    };
                                });
                            }}
                        />
                    </>
                ) : (
                    <>
                        <p className="no-overflow">{props.board.name}</p>
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
                <div className={styles.boardContent}>
                    {/* <p>
                        {props.board.positionX} {props.board.positionY} {props.board.description}
                    </p> */}
                    {isEditing ? (
                        <textarea
                            className={styles.textaeraEdit}
                            rows="5"
                            color="40"
                            type="text"
                            name="description"
                            defaultValue={tempBoard.description}
                            id="description"
                            onChange={(event) => {
                                setTempBoard((prev) => {
                                    return {
                                        ...prev,
                                        description: event.target.value,
                                    };
                                });
                            }}
                            placeholder="Your board description..."
                        />
                    ) : (
                        props.board.description && (
                            <p className="no-overflow">
                                {props.board.description}
                            </p>
                        )
                    )}
                    {displayTasklist(props.board)}
                </div>
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
