

// ---- store ----
import { Snackbar } from "../../../../shared/ui/Snackbar/Snackbar";
import { useNoteStore } from "../../store/useNoteStore"


// ---- css ----
import styles from "./UndoSnackbar.module.css";


export default function UndoSnackbar() {


    // Store
    const {
        showUndo,
        deletedNotes,
        undoDelete,
        hideUndo,
    } = useNoteStore();



    if(!showUndo || !deletedNotes.length){
        return null;
    }


    return (


        <Snackbar
            message="ノートをゴミ箱に移動しました"
            actionLabel="元に戻す"
            onAction={undoDelete}
            onClose={hideUndo}

        />

        // <div
        //     className={styles.undoSnackbar}
        // >

        //     <div
        //         className={styles.content}
        //     >
        //         <span>
        //             ノートをゴミ箱に移動しました
        //         </span>

        //         <div className={styles.actions}>

        //             <button onClick={undoDelete}>
        //                 元に戻す
        //             </button>

        //             <button onClick={hideUndo}>
        //                 ×
        //             </button>

        //         </div>

        //     </div>

        // </div>


    )



}
