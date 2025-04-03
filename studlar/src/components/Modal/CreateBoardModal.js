import styles from "./modal.module.css";

export default function CreateBoardModel(props) {
    return (
        <div className={styles.modalBackground}>
            <article>
                <div className={styles.cardHeader}>
                    <p>Create a new board</p>
                    <span className={`material-icons ${styles.cardHeaderCclose}`} onClick={props.onClose}>
                        close
                    </span>
                </div>
                <p>
                    Studlar is a platform to help student organize and plans
                    their calendars.
                </p>
                <p>Join today and get productive!</p>
            </article>
        </div>
    );
}
