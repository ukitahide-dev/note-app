
// ---- react ----
import { useState } from "react";


// ---- shared ui ----
import Card from "../../../../shared/ui/Card/Card";
import ConfirmModal from "../../../../shared/ui/ConfirmModal/ConfirmModal";



// ---- css ----
import styles from "./TrashNoteCard.module.css"
import { useNoteStore } from "../../store/useNoteStore";
// import { Snackbar } from "../../../../shared/ui/Snackbar/Snackbar";


import type { Note } from "../../../../types/note";







type Props = {
    note: Note;
    onDeleteSuccess: () => void;
    onRestoreNote: () => void;

};




// 親: TrashNotesPage.tsx


export default function TrashNoteCard({
    note,
    onDeleteSuccess,
    onRestoreNote,

}: Props) {

    const [isModalOpen, setIsModalOpen] = useState(false);




    // useNoteStore
    const {
        deleteNoteForever,
        restoreNote,
    } = useNoteStore();



    return (

        <>

            <Card
                style={{ backgroundColor: note.color }}
                className={styles.trashCard}
            >

                <div
                    className={styles.images}
                >

                    {note.images.map((image) => (
                        <img
                            key={image.id}
                            className={styles.image}
                            src={image.image}
                            // src={`http://127.0.0.1:8000${image.image}`}
                            alt=""
                        />

                    ))}
                </div>

                <div
                    className={styles.chars}
                >

                    <h3
                        className={styles.title}
                    >
                        {note.title}
                    </h3>

                    <p
                        className={styles.content}
                    >
                        {note.content}
                    </p>

                </div>



                <div className={styles.actions}>

                    <button
                        onClick={async () => {
                            await restoreNote(note.id);
                            onRestoreNote();
                        }}
                    >
                        復元
                    </button>

                    {/* <button onClick={async () => await restoreNote(note.id)}>
                        復元
                    </button> */}

                    <button
                        onClick={() => {
                            setIsModalOpen(true);
                        }}
                    >
                        完全削除
                    </button>



                </div>

            </Card>


            <ConfirmModal
                isOpen={isModalOpen}
                title="本当に削除しますか？"
                message="この操作は取り消せません。"
                onConfirm={async () => {
                    await deleteNoteForever(note.id);
                    setIsModalOpen(false);
                    onDeleteSuccess();
                    // setIsSnackbarOpen(true);
                }}
                onClose={() => setIsModalOpen(false)}
            />


            {/* {isSnackbarOpen && (
                <Snackbar
                    message="ノートを削除しました。"
                />
            )} */}


        </>
    );
}
