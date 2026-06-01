

// ---- css ----
import styles from "./ConfirmModal.module.css";




// 親: TrashNoteCard.tsx、LabelEditModal



type Props = {
    isOpen: boolean;
    title: string;
    message?: string;
    onConfirm: () => void;
    onClose: () => void;
};




export default function ConfirmModal({
    isOpen,
    title,
    message,
    onConfirm,
    onClose,
}: Props) {

    // 閉じている時は何も表示しない
    if (!isOpen) return null;




    return (

        <div
            className={styles.overlay}
            onClick={onClose}
        >

            <div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
            >

                <h2>{title}</h2>

                {message && (
                    <p>{message}</p>
                )}

                <div className={styles.actions}>

                    <button
                        className={styles.cancelButton}
                        onClick={onClose}
                    >
                        キャンセル
                    </button>

                    <button
                        className={styles.confirmButton}
                        onClick={onConfirm}
                    >
                        削除
                    </button>

                </div>

            </div>

        </div>
    );
}
