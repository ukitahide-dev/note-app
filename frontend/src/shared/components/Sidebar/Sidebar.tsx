// ---- react ----
import { useNavigate } from "react-router-dom";

// ---- css ----
import styles from "./Sidebar.module.css";
import { useLabelStore } from "../../../features/labels/store/labelStore";
import { useState } from "react";
import LabelEditModal from "./LabelEditModal/LabelEditModal";






type Props = {
    isOpen: boolean;
};



// 親: Layout.tsx





export default function Sidebar({ isOpen }: Props) {
    const { labels } = useLabelStore();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();








    return (
        <>
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

            <div
                className={styles.item}
                onClick={() => navigate("/notes/favorites")}
            >
                ❤️
                {isOpen && (
                    <span>お気に入り</span>
                )}
            </div>

            <div
                className={styles.item}
                onClick={() => navigate("/calendar")}
                // onClick={() => navigate("/notes/favorites")}
            >
                📅
                {isOpen && (
                    <span>カレンダー</span>
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

            <div
                className={styles.item}
                onClick={() => setIsModalOpen(true)}
            >
                {isOpen && (
                    <span>ラベルの編集</span>
                )}

            </div>



            <div
                className={styles.item}
                onClick={() => navigate("/notes/trash")}
            >
                🗑

                {isOpen && (
                    <span>ゴミ箱</span>
                )}
            </div>

        </aside>


        {isModalOpen && (
            <LabelEditModal
                onClose={() => setIsModalOpen(false)}

            />
        )}
        </>
    );
}
