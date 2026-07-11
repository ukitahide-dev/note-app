

// ---- css ----
import styles from "./HistoryPanel.module.css";



import type { Note, History } from "../../../../types/note";
import { useEffect, useState } from "react";
import { getNoteHistory } from "../../api/noteApi";


type Props = {
    note: Note;

}


// 親: NoteDetailModal.tsx、


export function HistoryPanel ({
    note,

}: Props) {


    const [histories, setHistories] = useState<History[]>([]);


    useEffect(() => {

        const fetchHistory = async () => {

            const data = await getNoteHistory(note.id);
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

            // onClick={() => onSave(note.id, title, content)}
        >

            <div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.top}>
                    <h2>変更履歴</h2>
                    <button>×</button>
                </div>

                <div className={styles.histories}>
                    {histories.map(history => (

                        <div
                            key={history.id}
                        >
                            <p>{formatDate(history.created_at)}</p>
                            <p>{history.action}</p>
                        </div>


                    ))}

                </div>

            </div>


        </div>
    );






}
