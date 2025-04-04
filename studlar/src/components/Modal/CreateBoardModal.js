import { useUser } from "@/contexts/UserContext";
import styles from "./modal.module.css";
import { useState } from "react";

export default function CreateBoardModel(props) {
    const { user } = useUser();
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        const boardname = document.getElementById("boardname").value;
        const description = document.getElementById("description").value;
        
        if (!user) {
            setError("Error: user not logged in");
            return;
        }

        if (boardname.length < 1) {
            setError("Error: please fill all required fields");
            return;
        }

        try {
            const response = await fetch("/api/boards/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: boardname,
                    description: description,
                    owner_id: user.id,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                props.onClose();
                props.onCreate();
                console.log("Board created successfully.");
            } else {
                setError("Error: " + data.error);
                console.error("Error:", data.error);
            }
        } catch (error) {
            setError("Error: " + error.message);
            console.error("Error:", error);
        }
    }

    return (
        <div className={styles.modalBackground}>
            <article>
                <div className={styles.cardHeader}>
                    <p>Create a new board</p>
                    <span className={`material-icons ${styles.cardHeaderClose}`} onClick={props.onClose}>
                        close
                    </span>
                </div>
                <form className={styles.formContent}>
                        <label>New board name : </label>
                        <input
                            type="text"
                            name="boardname"
                            id="boardname"
                            placeholder="Your board name"
                            required
                        />
                        <label>Description : </label>
                        <textarea
                            rows="5"
                            cols="40"
                            type="text"
                            name="description"
                            id="description"
                            placeholder="Very useful board description..."
                        />
                        <button onClick={handleSubmit}>Create new board</button>
                    </form>
            </article>
        </div>
    );
}
