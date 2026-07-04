import { useEffect, useState } from "react";
import useLabels from "../../labels/hooks/useLabels";
import { useLabelStore } from "../../labels/store/labelStore";






export function useNoteFormLabels (
    labelName?: string,

) {



    const {
        labels
    } = useLabelStore();



    const [selectedLabels, setSelectedLabels] = useState<number[]>([]);



    useEffect(() => {
        if (!labelName) return;

        const label = labels.find((l) => l.name === labelName);

        if (label) {
            setSelectedLabels([label.id]);
        }

    }, [labelName, labels]);



    const selectedLabelNames = labels
        .filter((label) => selectedLabels.includes(label.id))
        .map((label) => label.name);


    
    // const labelStates = labels.map((label) => ({

    //     id: label.id,

    //     state: label.name === labelName || selectedLabels.includes(label.id) ? "checked" : "unchecked"

    // }))

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
