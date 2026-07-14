// import { useEffect } from "react";
// import { useNoteStore } from "../../notes/store/useNoteStore";

import type { Note } from "../../../types/note";
// import { useSearchStore } from "../store/SearchStore";




// ノートをラベルと検索ワードでフィルタリングするhook



export function useNoteFilter (
    notes: Note[],
    searchText: string,
    selectedLabel: string | null,
    selectedColor: string | null,


)  {






    // すでに使われているラベルだけを取得する
    const usedLabels = notes.flatMap((note) => note.labels);  //flatMap: map同様、値を1つずつ取り出し、新しく配列を作成する。そこから、配列を1段平らにする(配列をなくす)。


    // usedLabelsには重複して存在しているラベルがあるので、重複をなくす。
    const uniqueLabels = [
        ...new Set(usedLabels.map((label) => label.name))  // ...はスプレッド構文。Setの中身を1つずつ展開している。
    ];


    // 既に使われている色だけを取得する
    const usedColors = notes.map((note) => note.color);


    // usedColorsには重複して存在している色があるので、重複をなくす
    const uniqueColors = [...new Set(usedColors)];


    let targetNotes: Note[];

    if (selectedLabel) {
        // ノートをラベルで絞る
        targetNotes = notes.filter((note) =>
            note.labels.some((label) => label.name === selectedLabel)
        );

    } else if (selectedColor) {
        // ノートを色で絞る
        targetNotes = notes.filter((note) => note.color === selectedColor);

    } else {

        targetNotes = notes;

    }




    // ノートをラベルや色で絞った後に、検索で絞る
    const filteredNotes = targetNotes.filter(
        (note) =>
            note.title.includes(searchText) ||
            note.content.includes(searchText)
    );






    return {

        uniqueLabels,
        filteredNotes,
        uniqueColors,

    }


}
