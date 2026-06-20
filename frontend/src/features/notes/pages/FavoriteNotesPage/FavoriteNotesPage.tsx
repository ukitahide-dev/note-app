// FavoritesPage.tsx

import { useEffect, useState } from "react";
import { getNotes } from "../../api/noteApi";

import NoteList from "../../components/NoteList/NoteList";


// ---- types ----
import type { Note } from "../../../../types/note";



// type Note = {
//     id: number;
//     title: string;
//     content: string;
//     color: string;
//     is_favorite: boolean;
// };




export default function FavoriteNotesPage() {

    const [notes, setNotes] = useState<Note[]>([]);

    useEffect(() => {

        const fetchNotes = async () => {

            const data = await getNotes();

            setNotes(
                data.filter(
                    (note: Note) => note.is_favorite
                )
            );
        };

        fetchNotes();

    }, []);




    return (
        <NoteList
            notes={notes}
            setNotes={setNotes}
        />
    );
}
