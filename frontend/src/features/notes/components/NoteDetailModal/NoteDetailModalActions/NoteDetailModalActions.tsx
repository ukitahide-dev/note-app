



import styles from "./NoteDetailModalActions.module.css";


type Props = {
    onOpenColor: () => void;
    onOpenMenu: () => void;
    onClose: () => void;


}



// 親: NoteDetailModal,


export default function ({
    onOpenColor,
    onOpenMenu,
    onClose,


}: Props) {


    return (

        <div className={styles.bottom}>

            <button
                className={styles.colorButton}
                onClick={(e) => {
                    e.stopPropagation();
                    onOpenColor();
                }}
            >
                🎨
            </button>

            <button
                className={styles.menuButton}
                onClick={(e) => {
                    e.stopPropagation();
                    onOpenMenu();
                }}
            >
                ⋮
            </button>

            <button
                className={styles.closeButton}
                onClick={onClose}
            >
                閉じる
            </button>

        </div>
    );
}
