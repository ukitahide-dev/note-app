

// ---- css ----
import styles from "./HistoryPanel.module.css";



import type { Note } from "../../../../types/note";


type Props = {
    note: Note;

}


// 親: NoteDetailModal.tsx、


export function HistoryPanel ({
    note,

}: Props) {


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
                    

                </div>

            </div>


        </div>
    );






}
