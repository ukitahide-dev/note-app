// ---- react ----
import { useNavigate } from "react-router-dom";

// ---- css ----
import styles from "./Sidebar.module.css";




type Label = {
    id: number;
    name: string
}

type Props = {
    labels: Label[];
    isOpen: boolean;

};



// 親: Layout.tsx





export default function Sidebar({ labels, isOpen }: Props) {
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

            {labels.map((label) => (

                <div key={label.id}
                     className={styles.item}
                     onClick={() => navigate(`/labels/${label.name}`)}
                >

                    {isOpen && (
                        <span>{label.name}</span>
                    )}

                </div>


            ))}



            <div className={styles.item} onClick={() => navigate("/notes/trash")}>
                🗑

                {isOpen && (
                    <span>ゴミ箱</span>
                )}
            </div>

        </aside>
    );
}
