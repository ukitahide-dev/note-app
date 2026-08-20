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






export default function TrashNotesPage() {
    // const [notes, setNotes] = useState<Note[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);


    // useNoteStore
    const {
        notes,
        fetchTrashNotes,
        emptyTrash,
        isFetchtingNotes,
        pageSize,
        ordering,
    } = useNoteStore();



    useEffect(() => {
        fetchTrashNotes();
    }, []);







    return (

        <>

            <Pagination
                onPageChange={(page) => fetchTrashNotes(page, pageSize, ordering)}
            />

            <SortSelect

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
                        }

                    }
                onClose={() => setIsModalOpen(false)}
            />

        </>


    );



}



