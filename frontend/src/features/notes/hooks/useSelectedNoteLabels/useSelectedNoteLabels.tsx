import { useLabelStore } from "../../../labels/store/labelStore";
import { useNoteSelectionStore } from "../../store/useNoteSelectionStore";
import { useNoteStore } from "../../store/useNoteStore";

// ---- type ----
import type { LabelState } from "../../../../types/ui/label";
import { useSelectedNotes } from "../useSelectedNotes/useSelectedNotes";



// 選択中のノートについて、ラベル関連の処理をまとめる。
// 呼び出し元: Header、SelectedNotesHeader


export function useSelectedNoteLabels() {

    // Store
    const {

        updateSelectedNoteLabels

    } = useNoteStore();


    // Store
    const { selectedNoteIds } = useNoteSelectionStore();

    // Store
    const { labels } = useLabelStore();


    // 選択中のノートを取得
    const { selectedNotes } = useSelectedNotes();




    // 今選択しているノートを対象に、全ラベルについて『全員持っている』『誰も持っていない』『一部だけ持っている』のどれなのかを調べている。
    const labelStates: LabelState[] = labels.map((label) => {
        // => {} と書いた場合は、アロー関数のこと。{}には関数内の処理を書く。 => ({})のように、()で囲むのは、省略記法。今回はifとか使いたいから、{}で、関数内の処理として書く必要がある。


        const count = selectedNotes.filter(
            (note) => note.labels.some((l) => l.id === label.id),  // 選択中のノートが、今見ているラベルを所持しているかを調べる。
        ).length;


        if (selectedNotes.length === 0 || count === 0) {
            return { id: label.id, state: "unchecked" };
        }


        if (count === selectedNotes.length) {
            return {
                id: label.id,
                state: "checked",
            };
        }

        return {
            id: label.id,
            state: "indeterminate",
        };
    });

    // console.log(labelStates);   // ex) [{id: 20, state: 'unchecked'}, {id: 2, state: 'checked'}]



    const handleSelectLabel = (
        labelId: number

    ) => {

        // const labelState = labelStates.find((l) => l.id === labelId)!; // 選択したラベルの状態を抽出する・!はTypescriptに、この値は絶対にnullやundefinedではないことを教える。!消すとlabelStateに赤線出る。

        const labelState = labelStates.find((l) => l.id === labelId);

        if (!labelState) {
            return;
        }

        if (labelState.state === "checked") {
            updateSelectedNoteLabels(selectedNoteIds, labelId, "remove");
        } else {
            updateSelectedNoteLabels(selectedNoteIds, labelId, "add");
        }
    };


    return {
        labelStates,
        handleSelectLabel,
    };
}
