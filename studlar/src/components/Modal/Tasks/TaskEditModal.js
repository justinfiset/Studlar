import styles from "@/components/Modal/modal.module.css";
import { useEffect, useState } from "react";
import Modal from "../Modal";
import { useModal } from "@/contexts/ModalContext";
import DeleteConfirmationModal from "../DeleteConfirmationModal";

export default function TaskEditModal({
    onClose = () => {},
    onConfirm = () => {},
    task = {},
    tasklist_id = -1
}) {
    const { openModal, closeModal } = useModal();
    const [tempTask, setTempTask] = useState({});

    useEffect(() => {
        setTempTask(task);
    }, [task]);

    const handleEditTask = async () => {
        const response = fetch(`/api/boards/tasks/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(tempTask),
        });

        onConfirm(tempTask);
    };

    const handleDelete = () => {
        openModal(DeleteConfirmationModal, {
            onConfirm: () => {
                handleDeleteCallback();
                onConfirm({
                    ...tempTask,
                    deleted: true,
                });
            },
            onClose: () => {
                openModal(
                    TaskEditModal,
                    {
                        onClose: onClose,
                        onConfirm: onConfirm,
                        task: tempTask,
                    }
                )
            },
        });
    };

    const handleDeleteCallback = async () => {
        const response = fetch(`/api/boards/tasks/`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: tempTask.id,
                list_id: tasklist_id,
            })
        });
    };

    return (
        <Modal
            title="Task Detail"
            onClose={onClose}
            onDelete={handleDelete}
            show={true}
        >
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
                        defaultValue={tempTask.title}
                        onChange={(event) => {
                            setTempTask({
                                ...tempTask,
                                title: event.target.value,
                            });
                        }}
                        required
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
                        defaultValue={tempTask.description}
                        onChange={(e) => {
                            setTempTask({
                                ...tempTask,
                                description: e.target.value,
                            });
                        }}
                        placeholder="Your task description..."
                    />

                    <p>
                        <strong>Created at</strong> : <br />
                        {new Date(task.created_at).toLocaleString()}
                        <br /> <br />
                        <strong>Updated at</strong> : <br />
                        {new Date(task.updated_at).toLocaleString()}
                    </p>
                </form>
                <div className="button-section">
                    <button onClick={handleEditTask}>Save</button>
                    <button
                        className="danger-button"
                        onClick={() => {
                            onClose();
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </Modal>
    );
}
