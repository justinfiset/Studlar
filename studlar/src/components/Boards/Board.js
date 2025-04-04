import styles from "./Board.module.css";

export default function Board({ board }) {
    const displayTasklist = (board) => {
        return board.task_lists.map((tasklist) => {
            return (
                <div key={tasklist.id}>
                    {
                        // Display the tasklist name only if it is not empty
                        tasklist.name && (
                            <div className={styles.subsectionHeader}>
                                <p>{tasklist.name}</p>
                            </div>
                        )
                    }
                    <div
                        className="todolist-task"
                        key={tasklist.id}
                        draggable="true"
                    >
                        <span className="material-icons">
                            radio_button_unchecked
                        </span>
                        <p>{tasklist.name}</p>
                        <span className={`material-icons ${styles.dragIcon}`}>
                            drag_indicator
                        </span>
                    </div>
                    <span></span>
                </div>
            );
        });
    };
    
    return (
        <article>
            <div className={styles.draggableHeader}></div>
            <div className="card-header">
                <p>{board.name}</p>
                <span className="material-icons card-header-menu">menu</span>
            </div>
            <p>{board.description}</p>
            {displayTasklist(board)}
            <div className="todolist-task">
                <p>
                    <strong>+ Ajouter un item</strong>
                </p>
                <span></span>
            </div>
        </article>
    );
}
