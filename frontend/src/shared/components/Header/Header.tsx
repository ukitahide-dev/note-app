

// ---- css ----
import styles from "./Header.module.css";



type Props = {
    onMenuClick: () => void;
};



export default function Header({ onMenuClick }: Props) {

    return (

        <header className={styles.header}>

            <button
                className={styles.menuButton}
                onClick={onMenuClick}
            >
                ☰
            </button>

            <h1 className={styles.logo}>
                My Keep
            </h1>

            <input
                className={styles.search}
                type="text"
                placeholder="検索..."
            />

        </header>
    );
}
