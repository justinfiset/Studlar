import { useUser } from "@/contexts/UserContext";
import styles from "./modal.module.css";
import { useState } from "react";
import Modal from "./Modal";

export default function CreateBoardModel(props) {
    const { user } = useUser();

    const [type, setType] = useState("");
    const [name, setName] = useState("");
    const [description, setDescriptin] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
    }

    return (
        <Modal 
            title="Create a new board"
            onClose={props.onClose}
        >
            <form className={styles.formContent}>
                <label>New board name : </label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder={`Your ${type} name`}
                    value={name}
                    onChange={event => setName(event.target.value)}
                    required
                />
                <label>Description : </label>
                <textarea
                    rows="5"
                    cols="40"
                    type="text"
                    name="description"
                    id="description"
                    value={description}
                    onChange={event => setDescriptin(event.target.value)}
                    placeholder="Very useful board description..."
                />
                <button onClick={handleSubmit}>Create new board</button>
            </form>
        </Modal>
    );
}
