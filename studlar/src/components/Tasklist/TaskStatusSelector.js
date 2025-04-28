import styles from "./tasklist.module.css";
import { useEffect } from "react";

export default function TaskStatusSelector({ ref, onChangeStatus, x, y, statusMap, currentStatus }) {
    const isMobile = window.innerWidth <= 768;
    const style = {
        position: 'fixed',
        top: isMobile ? `${y - 50}px` : `${y}px`,
        left: isMobile ? `${x - 50}px` : `${x}px`,
        zIndex: 1000,
        touchAction: 'none',
        transform: isMobile ? 'scale(1.2)' : 'none'
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    return (
        <div 
            ref={ref} 
            className={styles.taskStatusSelector} 
            style={style}
            onTouchMove={(e) => e.preventDefault()}
        >
            {statusMap.map(status => status.name !== currentStatus && (
                <div 
                    className={styles.taskStatusItem} 
                    key={status.name} 
                    onClick={() => onChangeStatus(status.name)}
                    onTouchEnd={(e) => {
                        e.preventDefault();
                        onChangeStatus(status.name);
                    }}
                >
                    <span className="material-icons">{status.icon}</span>
                </div>
            ))}
        </div>
    );
}