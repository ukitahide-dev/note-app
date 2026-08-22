//  ---- react ----
import { useEffect, useState } from "react";



// ---- api ----
// import { deleteNoteForever, emptyTrash, getTrashNotes, restoreNote } from "../api/noteApi";



// ---- css ----
import styles from "./TrashNotesPage.module.css";
import TrashNoteCard from "../components/TrashNoteCard/TrashNoteCard";
import ConfirmModal from "../../../shared/ui/ConfirmModal/ConfirmModal";



// ---- types ----
// import type { Note } from "../../../types/note";
import { useNoteStore } from "../store/useNoteStore";
import NoteListSkeleton from "../components/NoteListSkeleton/NoteListSkeleton";
import Pagination from "../components/Pagination/Pagination";
import SortSelect from "../components/SortSelect/SortSelect";
import { Snackbar } from "../../../shared/ui/Snackbar/Snackbar";






export default function TrashNotesPage() {

    const [isModalOpen, setIsModalOpen] = useState(false);
    // const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    // useNoteStore
    const {
        notes,
        fetchTrashNotes,
        emptyTrash,
        isFetchtingNotes,
        pageSize,
        ordering,
        setPageSize,
        setOrdering,
    } = useNoteStore();



    useEffect(() => {
        fetchTrashNotes();
    }, []);







    return (

        <>

            <Pagination
                onPageChange={(page) => fetchTrashNotes(page, pageSize, ordering)}
                onPageSizeChange={ async (size) => {

                    setPageSize(size);

                    await fetchTrashNotes(1, size, ordering);

                }}
            />

            <SortSelect
                onPageOrderChange={async (ordering) => {

                    setOrdering(ordering);

                    await fetchTrashNotes(1, pageSize, ordering);

                }}

            />

            <div className={styles.container}>

                <div
                    className={styles.top}
                >

                    <p>ゴミ箱内のメモは7日後に削除されます。</p>

                    <button
                        onClick={() => setIsModalOpen(true)}
                    >
                        ゴミ箱を空にする

                    </button>

                </div>


                {isFetchtingNotes && (

                    <NoteListSkeleton />

                )}


                {!isFetchtingNotes && (


                <div className={styles.notesContainer}>


                        {notes.map((note) => (

                            <TrashNoteCard
                                key={note.id}
                                note={note}
                                onDeleteSuccess={() => setSnackbarMessage("ノートを削除しました。")}
                                onRestoreNote={() => setSnackbarMessage("ノートを復元しました。")}
                            />

                        ))}

                </div>


                )}

            </div>


            <ConfirmModal
                isOpen={isModalOpen}
                title="ゴミ箱を空にしますか？"
                message="ゴミ箱内の全てのノートが完全に削除されます。"
                onConfirm={
                        async () => {
                            await emptyTrash();
                            setIsModalOpen(false);
                            setSnackbarMessage("ゴミ箱内のノートを全て削除しました。")
                            // setIsSnackbarOpen(true);
                        }

                    }
                onClose={() => setIsModalOpen(false)}
            />


            {snackbarMessage && (
                <Snackbar
                    message={snackbarMessage}
                    onClose={() => setSnackbarMessage("")}
                />
            )}

        </>


    );



}



