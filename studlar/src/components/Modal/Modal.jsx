import { useUser } from "@/contexts/UserContext";
import styles from "./modal.module.css";
import boardStyles from "@/components/Boards/board.module.css";
import { useEffect, useState } from "react";

export default function Modal(props) {
    const style = {
        opacity: 0,
        Animation: "fadeIn 0.5s forwards",
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                props.onClose();
            }
        };
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [props.onClose]);

    if (!props.show) {
        return null;
    }

    return (
        <div className={styles.modalBackground}>
            <article className={styles.modalContainer}>
                <div className={styles.cardHeader}>
                    <p>{props.title}</p>
                    <div className={boardStyles.headerOptionsContainer}>
                        {props.onDelete && (
                            <span
                                className="material-icons card-header-menu"
                                onClick={props.onDelete}
                            >
                                delete
                            </span>
                        )}
                        <span
                            className="material-icons card-header-menu"
                            onClick={props.onClose}
                        >
                            close
                        </span>
                    </div>
                </div>
                {props.children}
            </article>
        </div>
    );
}
