
import { useNoteSelectionStore } from "../../store/useNoteSelectionStore";
import { useNoteStore } from "../../store/useNoteStore";


// 選択中のノートの色変更処理をまとめる。
// 呼び出し元: Header

export function useSelectedNoteColor() {

    // Store
    const {
        selectedNoteIds,
        previewColor,

    } = useNoteSelectionStore();

    // Store
    const {
        updateSelectedNoteColor,

    } = useNoteStore();



    const handleSaveSelectedColor = async () => {

        if (!previewColor) return;    // previewColorがnullの場合は、ここで処理を止める。色を選択していないから、APIを呼ぶ必要がない。

        await updateSelectedNoteColor(
            selectedNoteIds,
            previewColor,
        );
    };



    return {
        handleSaveSelectedColor,
    };


}
