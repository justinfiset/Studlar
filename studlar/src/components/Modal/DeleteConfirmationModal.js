import styles from "./modal.module.css";
import { useState } from "react";
import Modal from "./Modal";

export default function DeleteConfirmationModal({ onClose, onConfirm }) {
    return (
        <Modal
            title="Delete Confirmation"
            onClose={onClose}
            show={true}
        >
            <div>
                <p><strong>Are you sure you want to delete this item?</strong> This action cannot be undone.</p>
            </div>
            <div className={styles.buttonSection}>
                <button className="danger-button" onClick={onConfirm}>
                    Delete Item
                </button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </Modal>
    );
}
