
// ----components----
import { useEffect } from "react";
import NoteForm from "../components/NoteForm/NoteForm";
import NoteList from "../components/NoteList/NoteList";
import { useNoteStore } from "../store/useNoteStore";




// ----css----
import styles from "./NotesPage.module.css";
import UndoSnackbar from "../components/UndoSnackbar/UndoSnackbar";
import Pagination from "../components/Pagination/Pagination";
// import SortSelect from "../components/SortSelect/SortSelect";
import { Snackbar } from "../../../shared/ui/Snackbar/Snackbar";
import { useErrorStore } from "../../../shared/stores/useErrorStore";
import NoteListSkeleton from "../components/NoteListSkeleton/NoteListSkeleton";








export default function NotesPage() {



    const {
        notes,
        pinnedNotes,

        fetchNotes,
        fetchPinnedNotes,

        isFetchtingNotes,

        pageSize,
        ordering,
        setPageSize,


    } = useNoteStore();


    const {
        errorMessage

    } = useErrorStore();





    useEffect(() => {

        fetchNotes();
        fetchPinnedNotes();

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




