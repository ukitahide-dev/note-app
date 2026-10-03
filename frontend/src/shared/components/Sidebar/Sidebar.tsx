// ---- react ----
import { useNavigate } from "react-router-dom";

// ---- css ----
import styles from "./Sidebar.module.css";
import { useLabelStore } from "../../../features/labels/store/labelStore";
import { useEffect, useState } from "react";
import LabelEditModal from "./LabelEditModal/LabelEditModal";
import Tooltip from "../Tooltip/Tooltip";






type Props = {
    isOpen: boolean;
};



// 親: Layout.tsx





export default function Sidebar({ isOpen }: Props) {

    // Store
    const { usedLabels,
            fetchUsedLabels,

    } = useLabelStore();


    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();




    useEffect(() => {

        fetchUsedLabels();

    }, []);




    return (

        <>

        <aside
            className={
                isOpen
                    ? styles.sidebarOpen
                    : styles.sidebarClosed
            }
        >

            <div
                className={styles.item}
                onClick={() => navigate("/notes")}
            >

                <Tooltip
                    text="ノート一覧"
                >

                    <span>📝</span>

                    {isOpen && (
                        <span>ノート</span>
                    )}

                </Tooltip>

            </div>


            <div
                className={styles.item}
                onClick={() => navigate("/notes/favorites")}
            >

                <Tooltip
                    text="お気に入り一覧"

                >

                    <span>❤️</span>

                    {isOpen && (
                        <span>お気に入り</span>
                    )}

                </Tooltip>

            </div>


            <div
                className={styles.item}
                onClick={() => navigate("/calendar")}

            >
                <Tooltip
                    text="カレンダー"
                >

                    <span>📅</span>

                    {isOpen && (
                        <span>カレンダー</span>
                    )}

                </Tooltip>

            </div>


            {usedLabels.map((label) => (

                <div key={label.id}
                     className={styles.item}
                     onClick={() => navigate(`/labels/${label.name}`)}
                >

                    {/* <Tooltip
                        text={label.name}
                    >

                        <span className={styles.labelIcon}>🏷️</span>

                        {isOpen && (
                            <span
                                className={styles.labelName}
                            >
                                {label.name}
                            </span>
                        )}

                    </Tooltip> */}

                    <Tooltip
                        text={label.name}
                        fullWidth
                    >

                        <div className={styles.labelContent}>

                            <span className={styles.labelIcon}>🏷️</span>

                            {isOpen && (
                                <span className={styles.labelName}>
                                    {label.name}
                                </span>
                            )}

                        </div>

                    </Tooltip>

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

                <Tooltip
                    text="ゴミ箱"
                >
                    🗑

                    {isOpen && (
                        <span>ゴミ箱</span>
                    )}

                </Tooltip>

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
