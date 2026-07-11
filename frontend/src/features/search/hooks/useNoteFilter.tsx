import { useEffect } from "react";
import { useNoteStore } from "../../notes/store/useNoteStore";

import type { Note } from "../../../types/note";
import { useSearchStore } from "../store/SearchStore";




export function useNoteFilter (
    notes: Note[],
    searchText: string,
    selectedLabel: string | null,


)  {


    // useSearchStore
    // const { searchText } = useSearchStore();



    // すでに使われているラベルだけを取得する
    const usedLabels = notes.flatMap((note) => note.labels);

    const uniqueLabels = [
        ...new Set(usedLabels.map((label) => label.name))  // ...はスプレッド構文。Setの中身を1つずつ展開している。
    ];




    // ノートをラベルで絞る
    const targetNotes =
        selectedLabel
            ? notes.filter((note) =>
                note.labels.some(
                    (label) => label.name === selectedLabel
                )
            )
            : notes;



    // ノートをラベルで絞った後に、検索で絞る
    const filteredNotes =
        targetNotes.filter(
            (note) =>
                note.title.includes(searchText) ||
                note.content.includes(searchText)
        );




    return {
        // usedLabels,
        uniqueLabels,
        filteredNotes,

    }


}
