import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getNote } from "../api/noteApi";




type Note = {
    id: number;
    title: string;
    content: string;
};



export default function NoteDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [note, setNote] = useState<Note | null>(null);

    
    useEffect(() => {
        const fetchNote = async () => {
            const data = await getNote(Number(id));
            setNote(data);
        };

        fetchNote();
    }, [id]);


    if (!note) return null;



    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
            onClick={() => navigate("/notes")}
        >
            <div
                style={{
                    background: "white",
                    width: 500,
                    padding: 20,
                    borderRadius: 10,
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <h2>{note.title}</h2>
                <p>{note.content}</p>

                <button onClick={() => navigate("/notes")}>
                    閉じる
                </button>
            </div>
        </div>
    );
}
