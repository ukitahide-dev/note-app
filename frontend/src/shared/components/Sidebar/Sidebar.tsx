
// ---- css ----
import styles from "./Sidebar.module.css";



type Props = {
    isOpen: boolean;
};



export default function Sidebar({ isOpen }: Props) {

    return (

        <aside
            className={
                isOpen
                    ? styles.sidebarOpen
                    : styles.sidebarClosed
            }
        >

            <div className={styles.item}>
                📝

                {isOpen && (
                    <span>ノート</span>
                )}
            </div>

            <div className={styles.item}>
                🗑

                {isOpen && (
                    <span>ゴミ箱</span>
                )}
            </div>

        </aside>
    );
}
