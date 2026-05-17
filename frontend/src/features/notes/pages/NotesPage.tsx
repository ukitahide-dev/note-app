import { useEffect, useState } from "react";

// ----api----
import { getNotes } from "../api/noteApi";


// ----components----
import NoteForm from "../components/NoteForm/Noteform";


// ----css----
import styles from "./NotesPage.module.css";
import { useNavigate } from "react-router-dom";



type Note = {
        id: number,
        title: string,
        content: string,
    };




export default function NotesPage() {

    const [notes, setNotes] = useState<Note[]>([]);
    const navigate = useNavigate();
    


    const handleAddNote = (
        newNote: Note
    ) => {

        setNotes((prev) => [
            newNote,
            ...prev
        ]);
    };


    useEffect(() => {
        const fetchNotes = async () => {

            try {
                const data = await getNotes();
                setNotes(data);
            } catch (error) {
                console.error("ノート取得に失敗");
            }


        }

        fetchNotes();

    }, [])



    return (
        <div className={styles.container}>
            <NoteForm
                onAddNote={handleAddNote}
            />


            <div className={styles.notesContainer}>
                {notes.map((note) => (
                    <div key={note.id} className={styles.card} onClick={() => navigate(`/notes/${note.id}`)}>
                        <h3>{note.title}</h3>
                        <p>{note.content}</p>
                    </div>

                ))}
            </div>

        </div>
    )

}
