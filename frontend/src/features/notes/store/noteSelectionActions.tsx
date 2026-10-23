import type { StateCreator } from "zustand";
import type { NoteStore } from "./useNoteStore";

import {
    createNoteApi,
    updateNoteColorApi,
    updateNotePinnedApi,
    updateNoteLabelsApi,
} from "../api/noteApi";
import { useLabelStore } from "../../labels/store/labelStore";


type SelectionActionNames =
    | "updateSelectedNotePin"
    | "updateSelectedNoteColor"
    | "duplicateSelectedNotes"
    | "updateSelectedNoteLabels";



export const createNoteSelectionActions: StateCreator<
    NoteStore,
    [],
    [],
    Pick<NoteStore, SelectionActionNames>

> = (set, get) => ({


    // 選択したノートのピンをまとめて変更する
    updateSelectedNotePin: async (
        noteIds: number[],
        mode: "add" | "remove",

    ) => {

        const {
            notes,
            pinnedNotes,
            searchResultNotes,
            calendarDayNotes,

            currentPage,
            pageSize,
            ordering,
            pinnedOrdering,
            currentView,
            currentLabelName,

            searchParams,

        } = get();



        // 全ノートを対象にする
        const allNotes = [
            ...notes,
            ...pinnedNotes,
            ...searchResultNotes,
            ...calendarDayNotes,
        ];


        const selectedNotes = allNotes.filter(
            (note) => noteIds.includes(note.id),
        );


        try {

            const updatedNotes = await Promise.all(

                selectedNotes.map(async (note) => {
                    return await updateNotePinnedApi(
                        note.id,
                        mode === "add",
                    );
                }),
            );

            await get().fetchPinnedNotes(pinnedOrdering);


            if (currentView === "notes") {   // 通常notes一覧とピン止めノート一覧は両立しないから、ここでnotesを再取得する。再取得しないと、ピン止めしたのに、瞬時にノート一覧から消えてくれない。
                await get().fetchNotes(
                    currentPage,
                    pageSize,
                    ordering,
                );
            }

            // if (currentView === "label" && currentLabelName) {   // ラベル一覧とピン止め一覧は両立するから、わざわざ再取得しなくていい。
            //     await get().fetchLabelNotes(
            //         currentLabelName,
            //         currentPage,
            //         pageSize,
            //         ordering,
            //     );
            // }

            // if (currentView === "search") {   // 検索結果ノート一覧と、ピン止めノート一覧、両立するから、再取得必要なし。

            //     await get().searchNotes(
            //         searchParams.query,
            //         searchParams.labelName,
            //         searchParams.color,
            //         searchParams.month,
            //         currentPage,
            //         pageSize,
            //         ordering
            //     );

            // }


            set((state) => ({

                ...(currentView !== "notes" && {    // 通常notesの場合は上で最新のnotesを取得して、画面更新してるから、ここでは更新しないようにする。お気に入りやラベル用の更新。
                    notes: state.notes.map((note) => {
                        const updatedNote = updatedNotes.find(
                            (updatedNote) => updatedNote.id === note.id,
                        );

                        return updatedNote ?? note;
                    }),
                }),
                // notes: state.notes.map((note) => {   // 不要だと思ったが、label一覧の時とか使う。これ書かないと、ピン止めマークが瞬時に切り替わらない。
                //     const updatedNote = updatedNotes.find(
                //         (updatedNote) => updatedNote.id === note.id,
                //     );

                //     return updatedNote ?? note;
                // }),

                // pinnedNotes: state.pinnedNotes.map((pinnedNote) => {
                //     const updatedNote = updatedNotes.find(
                //         (updatedNote) => updatedNote.id === pinnedNote.id
                //     );

                //     return updatedNote ?? pinnedNote;

                // }),

                searchResultNotes: state.searchResultNotes.map((note) => {
                    const updatedNote = updatedNotes.find(
                        (updatedNote) => updatedNote.id === note.id
                    )

                    return updatedNote ?? note
                }),





            }));

        } catch (error) {
            console.error(error);
        }
    },


    // 選択したノートの色をまとめて変更する
    updateSelectedNoteColor: async (
        ids: number[],
        color: string,

    ) => {

        try {

            await Promise.all(    // 選択したすべてのノートの API 呼び出しが完了するまで待つ。
                ids.map((id) => updateNoteColorApi(id, color)),
            );

            // これ無くても挙動は正しい。NoteCard側で、カードの色が瞬時に変わるように書いてるから。
            set((state) => ({

                notes: state.notes.map((note) =>
                    ids.includes(note.id)
                        ? { ...note, color }
                        : note,
                ),


                pinnedNotes: state.pinnedNotes.map((note) =>
                    ids.includes(note.id)
                        ? { ...note, color }
                        : note,
                ),

                searchResultNotes: state.searchResultNotes.map((note) =>
                    ids.includes(note.id)
                        ? { ...note, color }
                        : note,
                ),

                calendarDayNotes: state.calendarDayNotes.map((note) =>
                    ids.includes(note.id)
                        ? { ...note, color }
                        : note,
                ),

            }));

        } catch (error) {
            console.error(error);
        }
    },



    // 選択中のノートのラベルを更新する
    updateSelectedNoteLabels: async (
        noteIds: number[],
        labelId: number,
        mode: "add" | "remove",

    ) => {

        const {
            notes,
            pinnedNotes,
            searchResultNotes,
            calendarDayNotes,

        } = get();

        // const notes = get().notes;

        // 全ノートを対象にする
        const allNotes = [
            ...notes,
            ...pinnedNotes,
            ...searchResultNotes,
            ...calendarDayNotes,
        ];

        // 同じIDのノートが重複していたら1つにまとめる
        const selectedNotes = Array.from(
            new Map(
                allNotes
                    .filter((note) => noteIds.includes(note.id))
                    .map((note) => [note.id, note]),
            ).values(),
        );


        // これがバグの原因。これだと、pinnedNotesを選択した場合に、pinnedNotesからノートを取得できない。notesからfilterしてるから。
        // const selectedNotes = notes.filter(
            // (note) => noteIds.includes(note.id),
        // );

        try {

            const updatedNotes = await Promise.all(   // Promise.all()：複数のPromiseの完了をまとめて待つ。

                selectedNotes.map(async (note) => {   // async：非同期処理を扱う関数を定義する。

                    const currentIds = note.labels.map(
                        (label) => label.id,
                    );

                    let newIds: number[];


                    if (mode === "add") {

                        if (currentIds.includes(labelId)) {
                            newIds = currentIds;
                        } else {
                            newIds = [labelId, ...currentIds];
                        }

                    } else {
                        newIds = currentIds.filter(
                            (id) => id !== labelId,
                        );
                    }

                    return await updateNoteLabelsApi(
                        note.id,
                        newIds,
                    );

                }),

            );


            const updatedNotesMap = new Map(
                updatedNotes.map((note) => [note.id, note]),
            );


            set((state) => ({

                notes: state.notes.map(
                    (note) => updatedNotesMap.get(note.id) ?? note
                ),


                // notes: state.notes.map((note) => {

                //     const updatedNote = updatedNotes.find(
                //         (n) => n.id === note.id,
                //     );

                //     return updatedNote ?? note;

                // }),

                // ピン留めノート一覧を更新する
                pinnedNotes: state.pinnedNotes.map(
                    (note) => updatedNotesMap.get(note.id) ?? note,
                ),

                // 検索結果のノート一覧を更新する
                searchResultNotes: state.searchResultNotes.map(
                    (note) => updatedNotesMap.get(note.id) ?? note,
                ),

                // カレンダーの日付に紐づくノート一覧を更新する
                calendarDayNotes: state.calendarDayNotes.map(
                    (note) => updatedNotesMap.get(note.id) ?? note,
                ),

                // pinnedNotes: state.notes.map((note) => {

                //     const updatedNote = updatedNotes.find(
                //         (n) => n.id === note.id,
                //     );

                //     return updatedNote ?? note;

                // }),

            }));

            await useLabelStore.getState().fetchUsedLabels();

        } catch (error) {

            console.error(error);

        }
    },


    // 選択したノートをまとめて複製する
    duplicateSelectedNotes: async (noteIds: number[]) => {

        const notes = get().notes;

        try {

            const newNotes = await Promise.all(

                notes
                    .filter((note) => noteIds.includes(note.id))
                    .map((note) =>
                        createNoteApi(
                            note.title,
                            note.content,
                            note.labels.map((label) => label.id),
                            note.color,
                        ),
                    ),
            );

            set((state) => ({
                notes: [...newNotes, ...state.notes],
            }));

        } catch (error) {
            console.error(error);
        }
    },






});
