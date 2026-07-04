import { useState } from "react";
import useLabels from "../../labels/hooks/useLabels";
import { useLabelStore } from "../../labels/store/labelStore";






export function useNoteFormLabels (


) {

    const {
        labels
    } = useLabelStore();



    const [selectedLabels, setSelectedLabels] = useState<number[]>([]);


    const selectedLabelNames = labels
        .filter((label) => selectedLabels.includes(label.id))
        .map((label) => label.name);


    const labelStates = labels.map((label) => ({

        id: label.id,

        state: selectedLabels.includes(label.id) ? "checked" : "unchecked"


    }));



    const handleSelectLabel = (
        labelId: number,
    ) => {

        if (selectedLabels.includes(labelId)) {

            setSelectedLabels(selectedLabels.filter((id) => id !== labelId));

        } else {

            setSelectedLabels(
                [
                    labelId,
                    ...selectedLabels,
                ]
            );
        }

    }



    return {
        selectedLabels,
        selectedLabelNames,
        labelStates,
        handleSelectLabel,
    }




}
