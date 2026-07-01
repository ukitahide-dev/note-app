import { useLabelStore } from "../../labels/store/labelStore";
import { useNoteSelectionStore } from "../store/useNoteSelectionStore";
import { useNoteStore } from "../store/useNoteStore";








export function useSelectedNoteLabels(

) {


    const {
        notes,
        updateSelectedNoteLabels,
    } = useNoteStore();




    const {
        selectedNoteIds
    } = useNoteSelectionStore();



    const {
        labels,
    } = useLabelStore();




    const selectedNotes = notes.filter((note) => selectedNoteIds.includes(note.id));


    const labelStates = labels.map((label) => {  // => {} と書いた場合は、アロー関数のこと。{}には関数内の処理を書く。 => ({})のように、()で囲むのは、省略記法。今回はifとか使いたいから、{}で、関数内の処理として書く必要がある。

        const count = selectedNotes.filter((note) =>

            note.labels.some((l) => l.id === label.id)  // 選択中のノートが、今見ているラベルを所持しているかを調べる。

        ).length;


        if (count === 0) {
            return {
                id: label.id,
                state: "unchecked",
            }
        }

        if (count === selectedNotes.length) {
            return {
                id: label.id,
                state: "checked",
            }
        }

        return {
            id: label.id,
            state: "indeterminate",
        }

    });



    const handleSelectLabel = (
        labelId: number,
    ) => {

        const labelState = labelStates.find((l) => l.id === labelId)!;  // 選択したラベルの状態を抽出する・!はTypescriptに、この値は絶対にnullやundefinedではないことを教える。!消すとlabelStateに赤線出る。



        if (labelState.state === "checked") {
            updateSelectedNoteLabels(selectedNoteIds, labelId, "remove");
        } else {
            updateSelectedNoteLabels(selectedNoteIds, labelId, "add");
        }

    }



    return {
        selectedNotes,
        labelStates,
        handleSelectLabel,
    }

}
