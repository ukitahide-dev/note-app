



// ---- shared ui ----
import Card from "../../../../shared/ui/Card/Card";



// ---- css ----
import styles from "./TrashNoteCard.module.css"



type Note = {
    id: number;
    title: string;
    content: string;
};


type Props = {
    note: Note;
    onRestore: (id: number) => void;
    onDelete: (id: number) => void;
};





export default function TrashNoteCard({
    note,
    onRestore,
    onDelete,
}: Props) {

    return (

        <Card className={styles.trashCard}>

            <h3>{note.title}</h3>

            <p>{note.content}</p>

            <div className={styles.actions}>

                <button
                    onClick={() =>
                        onRestore(note.id)
                    }
                >
                    復元
                </button>

                <button
                    onClick={() =>
                        onDelete(note.id)
                    }
                >
                    完全削除
                </button>

            </div>

        </Card>
    );
}
