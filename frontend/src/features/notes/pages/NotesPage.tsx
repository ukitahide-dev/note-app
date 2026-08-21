// ---- react ----
// import { useEffect, useState } from "react";




// ----api----
// import { getNotes,  } from "../api/noteApi";
// moveToTrash

// ----components----
import { useEffect } from "react";
import NoteForm from "../components/NoteForm/NoteForm";
import NoteList from "../components/NoteList/NoteList";
import { useNoteStore } from "../store/useNoteStore";




// ----css----
import styles from "./NotesPage.module.css";
import UndoSnackbar from "../components/UndoSnackbar/UndoSnackbar";
import Pagination from "../components/Pagination/Pagination";
import SortSelect from "../components/SortSelect/SortSelect";
import { Snackbar } from "../../../shared/ui/Snackbar/Snackbar";
import { useErrorStore } from "../../../shared/stores/useErrorStore";
import NoteListSkeleton from "../components/NoteListSkeleton/NoteListSkeleton";



// ---- types ----
// import type { Note } from "../../../types/note";







export default function NotesPage() {
    // const [notes, setNotes] = useState<Note[]>([]);
    // const [openMenuId, setOpenMenuId] = useState<number | null>(null);  // どのノートのメニューが開いているか」を全ノートで共有したいから、SortableNoteCardではなくて、このコンポーネントで定義する。


    const {
        notes,
        fetchNotes,
        isFetchtingNotes,

        pageSize,
        ordering,
        setPageSize,
        setOrdering,
    } = useNoteStore();


    const {
        errorMessage
    } = useErrorStore();





    useEffect(() => {
        fetchNotes();
    }, []);






    return (
        <>

            <Pagination
                onPageChange={(page) => fetchNotes(page, pageSize, ordering)}
                onPageSizeChange={ async (size) => {

                    setPageSize(size);

                    await fetchNotes(1, size, ordering);

                }}


            />

            <SortSelect
                onPageOrderChange={async (ordering) => {

                    setOrdering(ordering);

                    await fetchNotes(1, pageSize, ordering);

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
                        enableSort={true}

                    />

                )}


                <Pagination
                    onPageChange={(page) => fetchNotes(page, pageSize, ordering)}
                    onPageSizeChange={ async (size) => {

                        setPageSize(size);

                        await fetchNotes(1, size, ordering);

                    }}
                />


                <UndoSnackbar


                />


                {errorMessage && (

                    <Snackbar
                        message={errorMessage}

                    />

                )}




            </div>
        </>
    )
}




