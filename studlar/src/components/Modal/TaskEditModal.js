import styles from "./modal.module.css";
import { useState } from "react";
import Modal from "./Modal";

export default function TaskEditModal({
    onClose = () => {},
    onConfirm = () => {},
    task = {},
}) {
    console.log("TaskEditModal", task);
    return (
        <Modal title="Task Detail" onClose={onClose} show={true}>
            <div>
                <form className={styles.formContent}>
                    <label>
                        <strong>Title</strong> :
                    </label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        placeholder={`Your task title...`}
                        value={task.title}
                        onChange={(event) => setName(event.target.value)}
                    />
                    <label>
                        <strong>Description</strong> :
                    </label>
                    <textarea
                        rows="5"
                        cols="40"
                        type="text"
                        name="description"
                        id="description"
                        value={task.description}
                        onChange={(event) => {
                            // setDescription(event.target.value)
                        }}
                        placeholder="Your task description..."
                    />

                    <p>
                        <strong>Created at</strong> : <br/>
                        {new Date(task.created_at).toLocaleString()}
                        <br/> <br/>
                        <strong>Updated at</strong> : <br/>
                        {new Date(task.updated_at).toLocaleString()}
                    </p>
                </form>
            </div>
            {/* <div className={styles.buttonSection}>
                <button className="danger-button" onClick={onConfirm}>
                    Delete Item
                </button>
                <button onClick={onClose}>Cancel</button>
            </div> */}
        </Modal>
    );
}
