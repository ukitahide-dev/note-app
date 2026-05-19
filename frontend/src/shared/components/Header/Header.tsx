

// ---- css ----
import styles from "./Header.module.css";



type Props = {  // Props object の中にonMenuClickというプロパティがあるという意味。
    onMenuClick: () => void;  // onMenuClickプロパティの型は関数型という意味。
};



export default function Header({ onMenuClick }: Props) {   // 分割代入でpropsからonMenuClickを取り出している。props全体の型はProps。

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
