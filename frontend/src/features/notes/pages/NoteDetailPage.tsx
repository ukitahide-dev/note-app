import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getNote } from "../api/noteApi";


//  ---- css ----
import styles from "./NoteDetailPage.module.css";



type Note = {
    id: number;
    title: string;
    content: string;
};



export default function NoteDetail() {
    const { id } = useParams();
    console.log(`id: ${id}`);

    const navigate = useNavigate();

    const [note, setNote] = useState<Note | null>(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");


    useEffect(() => {
        const fetchNote = async () => {
            const data = await getNote(Number(id));
            setNote(data);
            setTitle(data.title);
            setContent(data.content);
        };

        fetchNote();
    }, [id]);


    if (!note) return null;



    return (
        <div
            className={styles.overlay}
            onClick={() => navigate("/notes")}
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
                    onClick={() => navigate("/notes")}
                >
                    閉じる
                </button>

            </div>

        </div>
    );
}
