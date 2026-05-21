
// ---- css ----
import { useNavigate } from "react-router-dom";
import styles from "./Sidebar.module.css";



type Props = {
    isOpen: boolean;
};



export default function Sidebar({ isOpen }: Props) {
    const navigate = useNavigate();

    return (

        <aside
            className={
                isOpen
                    ? styles.sidebarOpen
                    : styles.sidebarClosed
            }
        >

            <div className={styles.item} onClick={() => navigate("/notes")}>
                📝

                {isOpen && (
                    <span>ノート</span>
                )}
            </div>

            <div className={styles.item} onClick={() => navigate("/notes/trash")}>
                🗑

                {isOpen && (
                    <span>ゴミ箱</span>
                )}
            </div>

        </aside>
    );
}
