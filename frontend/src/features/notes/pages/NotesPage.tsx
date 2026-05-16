import { useEffect, useState } from "react";

// ----api----
import { getNotes } from "../api/noteApi";


// ----components----
import NoteForm from "../components/NoteForm/Noteform";



type Note = {
        id: number,
        title: string,
        content: string,
    };




export default function NotesPage() {

    const [notes, setNotes] = useState<Note[]>([]);

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
        <div>
            <NoteForm />


            {notes.map((note) => (
                <div key={note.id}>
                    <h3>{note.title}</h3>
                    <p>{note.content}</p>
                </div>
            ))}
        </div>
    )

}
