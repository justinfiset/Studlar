import Banner from "./Banner";
import styles from "./banner.module.css";

export default function SuccessBanner({ message }) {
    return (
        <Banner 
            message={message}
            icon="check_circle"
            bannerClass={styles.success}
        />
    );
}
