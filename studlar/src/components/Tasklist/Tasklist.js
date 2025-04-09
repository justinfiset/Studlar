import boardStyles from "@/components/Boards/board.module.css";

const handleTaskCreation = () => {
    // TODO IMPL.
}

export default function Tasklist({ tasklist }) {
    return (
        <div key={`tasklist-${tasklist.id}`}>
        { tasklist.name && (
            <div className={boardStyles.subsectionHeader}>
                <p>{tasklist.name}</p>
            </div>
        )}
        {tasklist.tasks.map((task) => (
            <div
                className="todolist-task"
                key={`task-${tasklist.id}-${task.id}`}
            >
                <span className="material-icons">
                    radio_button_unchecked
                </span>
                <p>{tasklist.name}</p>
                <span className={`material-icons ${boardStyles.dragIcon}`}>
                    drag_indicator
                </span>
            </div>
        ))}
        <div className="todolist-task" onClick={handleTaskCreation}>
            <p>
                <strong>+ Add a new task</strong>
            </p>
            <span></span>
        </div>
    </div>
    );
}
