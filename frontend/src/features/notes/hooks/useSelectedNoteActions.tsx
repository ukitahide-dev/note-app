import { useNoteSelectionStore } from "../store/useNoteSelectionStore"
import { useNoteStore } from "../store/useNoteStore";




// 選択中ノートに対する操作をまとめるhooks。このhooksがHeader専用なら、setPanelType(null)をここに書くのもあり。



export function useSelectedNoteActions (

) {


    const {
        moveSelectedToTrash,
        duplicateSelectedNotes,
    } = useNoteStore();


    const {
        selectedNoteIds
    } = useNoteSelectionStore();


    const handleMoveToTrash = async () => {

        await moveSelectedToTrash(selectedNoteIds);

    }



    const handleDuplicateNotes = async () => {

        await duplicateSelectedNotes(selectedNoteIds);

    }



    return {
        handleMoveToTrash,
        handleDuplicateNotes,
    }



}
