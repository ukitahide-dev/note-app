// FavoritesPage.tsx

import { useEffect } from "react";
// import { getNotesApi } from "../../api/noteApi";

import NoteList from "../../components/NoteList/NoteList";


// ---- types ----
// import type { Note } from "../../../../types/note";
// import { useNodeRef } from "@dnd-kit/utilities";
import { useNoteStore } from "../../store/useNoteStore";
import Pagination from "../../components/Pagination/Pagination";
// import SortSelect from "../../components/SortSelect/SortSelect";
import NoteForm from "../../components/NoteForm/NoteForm";
import NoteListSkeleton from "../../components/NoteListSkeleton/NoteListSkeleton";




import styles from "./FavoriteNotesPage.module.css";




export default function FavoriteNotesPage() {


    const {
        notes,
        pinnedNotes,
        fetchPinnedNotes,
        fetchFavoriteNotes,

        isFetchtingNotes,

        pageSize,
        ordering,
        pinnedOrdering,
        setPageSize,


    } = useNoteStore();


    useEffect(() => {

        fetchFavoriteNotes(1, pageSize, ordering);

    }, [ordering]);



    useEffect(() => {

        fetchPinnedNotes(pinnedOrdering);

    }, [pinnedOrdering]);






    return (

        <>

            <Pagination

                onPageChange={(page) => fetchFavoriteNotes(page, pageSize, ordering)}

                onPageSizeChange={ async (size) => {

                    setPageSize(size);

                    await fetchFavoriteNotes(1, size, ordering);

                }}


            />



            <div className={styles.container}>

                <NoteForm

                />


                {isFetchtingNotes ? (

                    <NoteListSkeleton

                    />

                ) : (

                    <NoteList
                        notes={notes}
                        pinnedNotes={pinnedNotes}
                        enableSort={false}

                    />

                )}


                <Pagination
                    onPageChange={(page) => fetchFavoriteNotes(page, pageSize, ordering)}
                    onPageSizeChange={ async (size) => {

                        setPageSize(size);

                        await fetchFavoriteNotes(1, size, ordering);

                    }}
                />


                {/* <UndoSnackbar


                />


                {errorMessage && (

                    <Snackbar
                        message={errorMessage}

                    />

                )} */}

            </div>

            {/* <Pagination
                onPageChange={(page) => fetchFavoriteNotes(page, pageSize, ordering)}
                onPageSizeChange={async (size) => {
                    setPageSize(size);

                    await fetchFavoriteNotes(1, size, ordering);
                }}
            />



            <NoteList
                notes={notes}
                pinnedNotes={pinnedNotes}
                enableSort={false}

            /> */}

        </>
    );
}
