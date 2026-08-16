

// ---- css ----
import styles from "./HistoryPanel.module.css";



import type { Note, History } from "../../../../types/note";
import { useEffect, useState } from "react";
import { getNoteHistoryApi } from "../../api/noteApi";


type Props = {
    note: Note;

    onClose: () => void;

}


// 親: NoteDetailModal.tsx、


export function HistoryPanel ({
    note,
    onClose,

}: Props) {


    const [histories, setHistories] = useState<History[]>([]);


    useEffect(() => {

        const fetchHistory = async () => {

            const data = await getNoteHistoryApi(note.id);
            setHistories(data);

        }

        fetchHistory();

    }, [note.id]);




    const formatDate = (
        dateString: string,
    ) => {

        const date = new Date(dateString);

        const weekDays = ["日", "月", "火", "水", "木", "金", "土"];

        const weekDay = weekDays[date.getDay()];

        return `${date.getFullYear()}年 ${date.getMonth() + 1}月${date.getDate()}日(${weekDay}) ${String(date.getHours()).padStart(2, "0")}時${String(date.getMinutes()).padStart(2, "0")}分`

    }






    return (

        <div
            className={styles.overlay}
            onClick={(e) => e.stopPropagation()} // これがないと、親にクリックイベントが伝播して、NoteDetailModalが開く。

            // onClick={() => onSave(note.id, title, content)}
        >

            <div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.top}>
                    <h1>変更履歴</h1>
                    <button
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <div className={styles.histories}>
                    {histories.map(history => (

                        <div
                            key={history.id}
                            className={styles.history}
                        >
                            <p>{formatDate(history.created_at)}</p>
                            <p>{history.action}</p>
                        </div>


                    ))}

                </div>

                <div className={styles.bottom}>
                    <button
                        onClick={onClose}
                    >
                        閉じる
                    </button>

                </div>

            </div>


        </div>
    );

}
