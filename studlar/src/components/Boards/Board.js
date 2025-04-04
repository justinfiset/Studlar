import { useState } from "react";
import styles from "./board.module.css";
import { useUser } from "@/contexts/UserContext";

export default function Board({ board, onDelete }) {
    const [showOptions, setShowOptions] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user } = useUser();

    const delCurrentBoard = async () => {
        setLoading(true);
        try {
            const respone = await fetch(
                `/api/boards/?id=${board.id}&owner_id=${user.id}`,
                {
                    method: "DELETE",
                }
            );
            const data = await respone.json();

            if (respone.ok) {
                onDelete();
            } else {
                //setError("Error: " + data.error);
            }
        } catch (error) {
            console.error("Error:", error);
            //setError("Error: " + error.message);
        }
    };

    const handleEdit = () => {
        setShowOptions(false);
    };

    const handleDelete = () => {
        setShowOptions(false);
        delCurrentBoard();
    };

    const displayTasks = (board) => {
        return board.task_lists.map((tasklist) => {
            return (
                <div key={tasklist.id}>
                    {
                        // Display the tasklist name only if it is not empty
                        tasklist.name && (
                            <div className={styles.subsectionHeader}>
                                <p>{tasklist.name}</p>
                            </div>
                        )
                    }
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
            );
        });
    };

    const displayTasklist = (board) => {
        return (
            <>
                {board.task_lists.length > 0 ? (
                    <>
                        {displayTasks(board)}
                        <div className="todolist-task">
                            <p>
                                <strong>+ Ajouter un item</strong>
                            </p>
                            <span></span>
                        </div>
                    </>
                ) : (
                    <></>
                )}
            </>
        );
    };

    const handleOptionsBtn = () => {
        setShowOptions(!showOptions);
    };

    return (
        <article className={styles.card}>
            {!loading ? (
                <>
                    <div className={styles.draggableHeader}></div>
                    <div className="card-header">
                        <p>{board.name}</p>
                        <span
                            className="material-icons card-header-menu"
                            onClick={handleOptionsBtn}
                        >
                            {showOptions ? "close" : "menu"}
                        </span>
                    </div>
            {!showOptions ? (
                        <>
                            <p>{board.description}</p>
                            {displayTasklist(board)}
                        </>
                    ) : (
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
                            {/* <p className="material-icons">share</p> */}
                        </div>
                    )}
                </>
            ) : (
                <div className={styles.loading}>
                    <span className="material-icons">hourglass_top</span>
                    <p>Loading...</p>
                </div>
            )}
        </article>
    );
}
