import { useState } from "react";
import { updateNoteLabels } from "../api/noteApi";



type Label = {
    id: number,
    name: string,
}



type Note = {
    id: number;
    title: string;
    content: string;
    color: string;
    is_favorite: boolean;
    labels: Label[];

}



type Props = {
    note: Note;
    setNotes: React.Dispatch<
        React.SetStateAction<Note[]>
    >;

}




export function useNoteLabels({
    note,
    setNotes,

}: Props) {


    const [isLabelOpen, setIsLabelOpen] = useState(false);

    const [selectedLabels, setSelectedLabels] = useState<number[]>(  // selectedLabels は「各ノート固有の状態」だから、このコンポーネント(各ノートのコンポ)に書く
        note.labels.map(
            (label) => label.id
        )  // ex) selectedLabels = [1, 2, 3] チェックボックスの選択状態を管理するだけだから、id配列で取り出す。nameとか不要な情報は除く。
    );



    const handleOpenLabel = () => {
        setIsLabelOpen((prev) => !prev);
        // setIsLabelOpen(true);
    }



    const updateLabels = async (
            newIds: number[]
        ) => {

            setSelectedLabels(newIds);

            const updatedNote = await updateNoteLabels(note.id, newIds);

            // これで、ラベル追加・削除と同時に、各ノートのラベル名表示も反映される。
            setNotes((prev) =>
                prev.map((n) =>
                    n.id === note.id ? updatedNote : n
                )
            );

        }




    const handleSelectLabel = async (labelId: number) => {

        try {

            let newIds;

            if (selectedLabels.includes(labelId)) {

                newIds = selectedLabels.filter((id) => id !== labelId);

            } else {

                newIds = [...selectedLabels, labelId];
            }

            updateLabels(newIds);

        } catch (error) {

            console.error(error);

        }

    };




    const handleRemoveLabel = async (
        labelId: number
    ) => {

        try {

            const newIds = selectedLabels.filter((id) => id !== labelId);

            updateLabels(newIds);

        } catch (error) {

            console.error(error);

        }
    };




    return {
        isLabelOpen,
        handleOpenLabel,
        selectedLabels,
        handleSelectLabel,
        handleRemoveLabel,
    };


}


