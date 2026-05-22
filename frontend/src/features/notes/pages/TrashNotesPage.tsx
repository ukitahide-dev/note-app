//  ---- react ----
import { useEffect, useState } from "react";



// ---- api ----
import { deleteNoteForever, getTrashNotes, restoreNote } from "../api/noteApi";



// ---- css ----
import styles from "./TrashNotesPage.module.css";
import TrashNoteCard from "../components/TrashNoteCard/TrashNoteCard";



type Note = {
    id: number,
    title: string,
    content: string,
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




    const handleRestore = async (id: number) => {
        try {
            await restoreNote(id);
            setNotes((prev) =>
                prev.filter((note) => note.id !== id)
            );
        } catch (error) {
            console.error(error);
        }
    }



    const handleDelete = async (id: number) => {
        try {
            await deleteNoteForever(id);

            setNotes((prev) =>
                prev.filter((note) => note.id !== id)
            );

        } catch(error) {
            console.error(error);
        }
    }






    return (
        <div className={styles.container}>
            <h1>ゴミ箱</h1>

            <div className={styles.notesContainer}>

                {notes.map((note) => (
                    <TrashNoteCard
                        key={note.id}
                        note={note}
                        onRestore={handleRestore}
                        onDelete={handleDelete}
                    />
                ))}

            {/* {notes.map((note) => (

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
            ))} */}
            </div>

        </div>


    );



}
