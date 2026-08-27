

import styles from "./Snackbar.module.css";



type Props = {
    message: string;
    actionLabel?: string;
    onAction?: () => void;
    onClose?: () => void;

}




// 親: NotesPage.tsx、UndoSnackbar.tsx、TrashNotesPage.tsx、TrashNoteCard.tsx、


export function Snackbar ({

    message,
    actionLabel,
    onAction,
    onClose,

}: Props) {




    return (

        <div className={styles.snackbar}>


            <span className={styles.message}>
                {message}
            </span>


            <div className={styles.actions}>

                {actionLabel && onAction && (
                    <button
                        className={styles.actionButton}
                        onClick={onAction}
                    >
                        {actionLabel}
                    </button>
                )}


                <button
                    className={styles.closeButton}
                    onClick={onClose}
                >
                    ×
                </button>


            </div>

        </div>

    )


}
