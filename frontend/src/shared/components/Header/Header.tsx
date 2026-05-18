

// ---- css ----
import styles from "./Header.module.css";



export default function Header() {

    return (

        <header className={styles.header}>

            <button className={styles.menuButton}>
                ☰
            </button>

            <h1 className={styles.logo}>
                My Note
            </h1>

            <input
                className={styles.search}
                type="text"
                placeholder="検索..."
            />

        </header>
    );
}
