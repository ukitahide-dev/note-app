



// ---- css ----
import { useState } from "react";
import styles from "./NoteDetailModal.module.css";


type Note = {
    id: number;
    title: string;
    content: string;
    color: string;
    is_favorite: boolean;
    // labels:  Label[];  // labelsはLabel型の配列。ex) labels: [{id: 1, name: "ゲーム"}, {id: 2, name: "本"}]
};


type Props = {
    note: Note;
    onSave: (
        id: number,
        title: string,
        content: string,
    ) => Promise<void>;

}


export default function NoteDetailModal({
    note,
    onSave,




}: Props) {



    const [title, setTitle] = useState(note.title);
    const [content, setContent] = useState(note.content);




    return (

        <div
            className={styles.overlay}
            onClick={() => onSave(note.id, title, content)}
        >

            <div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
            >

                <input
                    className={styles.titleInput}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <textarea
                    className={styles.contentInput}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />


                <button
                    className={styles.button}
                    onClick={() => onSave(note.id, title, content)}
                >
                    閉じる
                </button>

            </div>

        </div>
    );









}
