import { useEffect, useState } from "react";

import { useLabelStore } from "../../../labels/store/labelStore";



export function useNoteFormLabels(
    labelName?: string,   // LabelNotesPage経由で呼ばれたときに渡される。


) {

    // Store
    const { labels } = useLabelStore();

    const [selectedLabels, setSelectedLabels] = useState<number[]>([]);


    useEffect(() => {
        if (!labelName) return;

        const label = labels.find((l) => l.name === labelName);   // find(): 配列の中から条件に一致する最初の要素を1つ返すメソッド。見つからなければ、undefined を返す。

        if (label) {
            setSelectedLabels([label.id]);
        }


    }, [labelName, labels]);


    // state状態(selectedLabels)から必要なものを計算する。これがreactで良い書き方。
    const selectedLabelNames = labels
        .filter((label) => selectedLabels.includes(label.id))
        .map((label) => label.name);


    const labelStates = labels.map((label) => ({
        id: label.id,

        state: selectedLabels.includes(label.id) ? "checked" : "unchecked",
    }));



    const handleSelectLabel = (labelId: number) => {

        if (selectedLabels.includes(labelId)) {
            setSelectedLabels(selectedLabels.filter((id) => id !== labelId));
        } else {
            setSelectedLabels([labelId, ...selectedLabels]);
        }
    };



    return {
        selectedLabels,
        selectedLabelNames,
        labelStates,
        handleSelectLabel,
    };
}
