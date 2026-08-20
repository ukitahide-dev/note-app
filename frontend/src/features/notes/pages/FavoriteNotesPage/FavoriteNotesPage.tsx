// FavoritesPage.tsx

import { useEffect, useState } from "react";
import { getNotesApi } from "../../api/noteApi";

import NoteList from "../../components/NoteList/NoteList";


// ---- types ----
import type { Note } from "../../../../types/note";
import { useNodeRef } from "@dnd-kit/utilities";
import { useNoteStore } from "../../store/useNoteStore";
import Pagination from "../../components/Pagination/Pagination";
import SortSelect from "../../components/SortSelect/SortSelect";








export default function FavoriteNotesPage() {


    const {
        notes,
        fetchFavoriteNotes,
        pageSize,
        ordering,
        setPageSize,
        setOrdering,
    } = useNoteStore();


    useEffect(() => {

        fetchFavoriteNotes();

    }, []);

    // const [notes, setNotes] = useState<Note[]>([]);

    // useEffect(() => {

    //     const fetchNotes = async () => {

    //         const data = await getNotesApi();

    //         setNotes(
    //             data.filter(
    //                 (note: Note) => note.is_favorite
    //             )
    //         );
    //     };

    //     fetchNotes();

    // }, []);





    return (
        <>
        <Pagination
            onPageChange={(page) => fetchFavoriteNotes(page, pageSize, ordering)}
            onPageSizeChange={async (size) => {
                setPageSize(size);

                await fetchFavoriteNotes(1, size, ordering);
            }}
        />

        <SortSelect
            onPageOrderChange={async (ordering) => {

                setOrdering(ordering);

                await fetchFavoriteNotes(1, pageSize, ordering);

            }}

        />

        <NoteList
            notes={notes}
            // setNotes={setNotes}
        />

        </>
    );
}
