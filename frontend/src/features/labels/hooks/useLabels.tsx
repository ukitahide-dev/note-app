

import { useEffect, useState } from "react";



// ---- api ----
import { createLabel, getLabels } from "../../notes/api/labelApi";
import { updateNoteLabels } from "../../notes/api/noteApi";




type Label = {
    id: number;
    name: string;
};




export default function useLabels(
    noteId: number,
    initialLabels: Label[]
) {

    // ---- 全ラベル一覧 ----
    const [labels, setLabels] = useState<Label[]>([]);


    // ---- ノートに付いてるラベルid ----
    const [selectedLabels, setSelectedLabels] = useState<number[]>(

        initialLabels.map(
            (label) => label.id
        )

    );



    // ---- ラベル一覧取得 ----
    useEffect(() => {

        const fetchLabels = async () => {

            try {

                const data = await getLabels();

                setLabels(data);

            } catch (error) {

                console.error(error);

            }
        };

        fetchLabels();

    }, []);




    // ---- 新規ラベル作成 ----
    const handleCreateLabel = async (
        name: string
    ) => {

        try {

            const newLabel =
                await createLabel(name);

            setLabels((prev) => [
                ...prev,
                newLabel,
            ]);

        } catch (error) {

            console.error(error);

        }
    };




    // ---- ラベル選択 ----
    const handleSelectLabel = async (
        labelId: number
    ) => {

        try {

            let newIds;

            if (
                selectedLabels.includes(labelId)
            ) {

                newIds =
                    selectedLabels.filter(
                        (id) => id !== labelId
                    );

            } else {

                newIds = [
                    ...selectedLabels,
                    labelId,
                ];
            }

            setSelectedLabels(newIds);

            await updateNoteLabels(
                noteId,
                newIds
            );

        } catch (error) {

            console.error(error);

        }
    };


    return {

        labels,
        selectedLabels,

        handleCreateLabel,
        handleSelectLabel,
    };
}
