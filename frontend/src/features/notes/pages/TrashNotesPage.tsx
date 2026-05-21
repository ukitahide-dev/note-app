//  ---- react ----
import { useEffect, useState } from "react";



// ---- api ----
import { getTrashNotes } from "../api/noteApi";




type Note = {
    id: number,
    title: String,
    content: String,
}




export default function TrashNotesPage() {
    const [notes, setNotes] = useState<Note[]>([]);


    useEffect(() => {
        const fetchTrashNotes = async () => {
            try {
                const data = await getTrashNotes();
                setNotes(data);
            } catch (error) {
                console.error(error);
            }
        }

        fetchTrashNotes();

    }, []);






    return (

        <div>

            <h1>ゴミ箱</h1>

            {notes.map((note) => (

                <div
                    key={note.id}
                    style={{
                        border:
                            "1px solid gray",
                        padding: 16,
                        marginBottom: 16,
                    }}
                >

                    <h3>{note.title}</h3>
                    <p>{note.content}</p>

                    <button
                        onClick={() =>
                            handleRestore(note.id)
                        }
                    >
                        復元
                    </button>

                    <button
                        onClick={() =>
                            handleDelete(note.id)
                        }
                    >
                        完全削除
                    </button>
                </div>
            ))}
        </div>
    );



}
