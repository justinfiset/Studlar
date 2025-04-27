import { useUser } from "@/contexts/UserContext";
import styles from "./modal.module.css";
import { useEffect, useState } from "react";

export default function Modal(props) {
    const style = {
        opacity: 0,
        Animation: "fadeIn 0.5s forwards",
    }

    useEffect(() => {
        const handleKeyDown = (event) => {
            if(event.key === "Escape") {
                props.onClose();
            }
        }
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        }
    }, [props.onClose]);

    if(!props.show) {
        return null;
    }

    return (
        <div className={styles.modalBackground}>
        <article className={styles.modalContainer}>
            <div className={styles.cardHeader}>
                <p>{props.title}</p>
                <span className={`material-icons ${styles.cardHeaderClose}`} onClick={props.onClose}>
                    close
                </span>
            </div>
            {props.children}
        </article>
    </div>
    );
}
