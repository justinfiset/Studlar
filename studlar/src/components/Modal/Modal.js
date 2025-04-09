import { useUser } from "@/contexts/UserContext";
import styles from "./modal.module.css";
import { useState } from "react";

export default function Modal(props) {
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
