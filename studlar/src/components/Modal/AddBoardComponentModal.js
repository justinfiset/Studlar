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
        { type: "tasklist", icon: "checklist", enabled: true, apiPahth: "/api/boards/tasklists/" },
        { type: "note", icon: "text_fields", enabled: false, apiPahth: "/api/boards/notes/" },      
        { type: "file", icon: "attach_file", enabled: false, apiPahth: "/api/boards/files/" },
        { type: "calendar", icon: "calendar_month", enabled: false, apiPahth: "/api/boards/calendars/" },
    ];

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const handleCreation = async (event) => {
        event.preventDefault();

        if(!user || !type) { return; }

        try {
            const typeData = types.find(t => t.type === type);
            if(!typeData) { return; }

            const response = await fetch(typeData.apiPahth, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name,
                    description: description,
                    owner_id: user.id,
                    board_id: id,
                }),
            });

            const data = await response.json();
            if(response.ok) {
                props.onClose();
            }
        } catch(error) {
            console.error("Error:", error);
        }
    }

    return (
        <Modal
            show={true}
            title={type ? `Add a ${type}` : "Add to board"}
            onClose={props.onClose}
        >
            <form className={styles.formContent}>
                <label><strong>What should we add to your board?</strong></label>
                <div className={boardStyles.optionsContainer}>
                    {types.map(({ type: t, icon, enabled }) => (
                        <p
                            key={t}
                            className={`material-icons ${
                                type === t ? boardStyles.activeOption : ""
                            } ${enabled ? "" : boardStyles.disabledOption}`}
                            onClick={() => { if(enabled) setType(t)}}
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
                            onClick={handleCreation}
                        >{`Create new ${type}`}</button>
                    </>
                )}
            </form>
        </Modal>
    );
}
