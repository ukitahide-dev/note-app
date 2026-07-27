

// ---- store ----
import { useNoteStore } from "../../store/useNoteStore"


// ---- css ----
import styles from "./UndoSnackbar.module.css";


export default function UndoSnackbar() {


    // Store
    const {
        showUndo,
        deletedNote,
        undoDelete,
        hideUndo,
    } = useNoteStore();



    if(!showUndo || !deletedNote){
        return null;
    }


    return (

        <div
            className={styles.undoSnackbar}
        >

            <div
                className={styles.content}
            >
                <span>
                    ノートをゴミ箱に移動しました
                </span>

                <button
                    onClick={undoDelete}
                >
                    元に戻す
                </button>

                <button
                    onClick={hideUndo}
                >
                    ×
                </button>

            </div>

        </div>


    )



}
