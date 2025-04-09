import { useUser } from "@/contexts/UserContext";
import styles from "./modal.module.css";
import boardStyles from "../Boards/board.module.css";
import { useState } from "react";
import Modal from "./Modal";

export default function AddBoardComponentModal(props) {
    const { id, onClose } = props;
    const { user } = useUser();

    const [type, setType] = useState("");
    const types = [
        { type: "tasklist", icon: "checklist" },
        { type: "note", icon: "text_fields" },
        { type: "file", icon: "attach_file" },
        { type: "calendar", icon: "calendar_month" },
    ];

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
    };

    return (
        <Modal
            title={type ? `Add a ${type}` : "Add to board"}
            onClose={props.onClose}
        >
            <form className={styles.formContent}>
                <label><strong>What should we add to your board?</strong></label>
                <div className={boardStyles.optionsContainer}>
                    {types.map(({ type: t, icon }) => (
                        <p
                            key={t}
                            className={`material-icons ${
                                type === t ? boardStyles.activeOption : ""
                            }`}
                            onClick={() => setType(t)}
                        >
                            {icon}
                        </p>
                    ))}
                </div>
                {type && (
                    <>
                        <label><strong>{`New ${type} name`} </strong> (optional) :</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            placeholder={`Your ${type} name`}
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            required
                        />
                        <label><strong>Description</strong> (optional) : </label>
                        <textarea
                            rows="5"
                            cols="40"
                            type="text"
                            name="description"
                            id="description"
                            value={description}
                            onChange={(event) =>
                                setDescription(event.target.value)
                            }
                            placeholder={`Very useful ${type} description...`}
                        />
                        <button
                            onClick={handleSubmit}
                        >{`Create new ${type}`}</button>
                    </>
                )}
            </form>
        </Modal>
    );
}
