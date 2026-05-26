// ---- react ----
import { useNavigate } from "react-router-dom";

// ---- css ----
import styles from "./Sidebar.module.css";
import { useLabelStore } from "../../../features/labels/store/labelStore";
import { useEffect } from "react";




// type Label = {
//     id: number;
//     name: string
// }

type Props = {
    // labels: Label[];
    isOpen: boolean;

};



// 親: Layout.tsx





export default function Sidebar({ isOpen }: Props) {
    // labels,

    const {
        labels,
        fetchLabels,
    } = useLabelStore();

    const navigate = useNavigate();


    useEffect(() => {
        fetchLabels();
    }, []);






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
