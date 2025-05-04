import styles from "@/components/Modal/modal.module.css";
import { useEffect, useState } from "react";
import Modal from "../Modal";
import { useModal } from "@/contexts/ModalContext";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import Tasklist from "@/components/Tasklist/Tasklist";

export default function TasklistEditModal({
    onClose = () => {},
    onConfirm = () => {},
    tasklist = {},
}) {
    const { openModal, closeModal } = useModal();
    const [tempTasklist, setTempTasklist] = useState({});

    useEffect(() => {
        setTempTasklist(tasklist);
    }, [tasklist]);

    const handleEditTasklist = async () => {
        const response = fetch(`/api/boards/tasklists/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(tempTasklist),
        });

        onConfirm(tempTasklist);
    };

    const handleDelete = () => {
        openModal(DeleteConfirmationModal, {
            onConfirm: () => {
                handleDeleteCallback();

                onConfirm({
                    ...tempTasklist,
                    deleted: true,
                });
            },
            onClose: () => {
                openModal(
                    TasklistEditModal,
                    {
                        onClose: onClose,
                        onConfirm: onConfirm,
                        tasklist: tempTasklist,
                    }
                )
            },
        });
    };

    const handleDeleteCallback = async () => {
        const response = fetch(`/api/boards/tasklists/`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: tempTasklist.id,
            }),
        });
    };

    return (
        <Modal
            title="Tasklist Detail"
            onClose={onClose}
            onDelete={handleDelete}
            show={true}
        >
            <div>
                <form className={styles.formContent}>
                    <label>
                        <strong>Name</strong> :
                    </label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        placeholder={`Your tasklist name...`}
                        defaultValue={tempTasklist.name}
                        onChange={(event) => {
                            setTempTasklist({
                                ...tempTasklist,
                                name: event.target.value,
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
                        defaultValue={tempTasklist.description}
                        onChange={(e) => {
                            setTempTasklist({
                                ...tempTasklist,
                                description: e.target.value,
                            });
                        }}
                        placeholder="Your tasklist description..."
                    />
                </form>
                <div className="button-section">
                    <button onClick={handleEditTasklist}>Save</button>
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
