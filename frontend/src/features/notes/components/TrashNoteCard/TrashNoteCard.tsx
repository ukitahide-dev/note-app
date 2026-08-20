
// ---- react ----
import { useState } from "react";


// ---- shared ui ----
import Card from "../../../../shared/ui/Card/Card";
import ConfirmModal from "../../../../shared/ui/ConfirmModal/ConfirmModal";



// ---- css ----
import styles from "./TrashNoteCard.module.css"
import { useNoteStore } from "../../store/useNoteStore";




// 親: TrashNotesPage.tsx


type Note = {
    id: number;
    title: string;
    content: string;
};


type Props = {
    note: Note;
    // onRestore: (id: number) => void;   // useNoteStoreで不要になった
    // onDelete: (id: number) => void;    // useNoteStoreで不要になった
};




// 親: TrashNotesPage.tsx


export default function TrashNoteCard({
    note,
    // onRestore,
    // onDelete,
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
                className={styles.trashCard}
            >

                <h3>{note.title}</h3>
                <p>{note.content}</p>

                <div className={styles.actions}>

                    <button onClick={async () => await restoreNote(note.id)}>
                        復元
                    </button>

                    <button onClick={() => setIsModalOpen(true)}>
                        完全削除
                    </button>

                </div>

            </Card>


            <ConfirmModal
                isOpen={isModalOpen}
                title="本当に削除しますか？"
                message="この操作は取り消せません。"
                onClose={() => setIsModalOpen(false)}
                onConfirm={async () => {
                    await deleteNoteForever(note.id);
                    setIsModalOpen(false);
                }}
            />

        </>
    );
}
