// FavoritesPage.tsx

import { useEffect, useState } from "react";
import { getNotesApi } from "../../api/noteApi";

import NoteList from "../../components/NoteList/NoteList";


// ---- types ----
import type { Note } from "../../../../types/note";








export default function FavoriteNotesPage() {

    const [notes, setNotes] = useState<Note[]>([]);

    useEffect(() => {

        const fetchNotes = async () => {

            const data = await getNotesApi();

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
