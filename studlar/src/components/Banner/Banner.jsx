import { useEffect, useState } from "react";
import styles from "./banner.module.css";

export default function Banner({
    message,
    icon,
    bannerClass,
    duration = 3000,
}) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, duration);
        return () => clearTimeout(timer);
    }, [duration]);

    return (
        <div className={styles.banner + " " + bannerClass + " " + (isVisible ? '' : styles.hide)}>
            <p>
                <span className="material-icons">{icon}</span>
            </p>
            <p>{message}</p>
        </div>
    );
}
