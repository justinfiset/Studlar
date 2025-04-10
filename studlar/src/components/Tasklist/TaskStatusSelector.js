import styles from "./tasklist.module.css";

export default function TaskStatusSelector({ref, onChangeStatus, x, y, statusMap}) {
    const style = {
        top: `${y}px`,
        left: `${x}px`,
    }

    return (
        <div ref={ref} className={styles.taskStatusSelector} style={style}>
            {
                statusMap.map(status => (
                    <div className={styles.taskStatusItem} key={status.name} onClick={() => onChangeStatus(status.name)}>
                        <span className="material-icons">{status.icon}</span>
                    </div>
                ))
            }
        </div>
    );
} 