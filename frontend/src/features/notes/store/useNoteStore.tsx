import { create } from "zustand";
import type { Note, NoteImage } from "../../../types/note"
import {
    createNote as createNoteApi,
    deleteNoteForever as deleteNoteForeverApi,
    deleteNoteImageApi,
    emptyTrash as emptyTrashApi,
    // getNote,
    getNotes,
    getTrashNotes as getTrashNotesApi,
    moveToTrash as moveToTrashApi,
    reorderNoteImageApi,
    restoreNoteApi,
    updateNote as updateNoteApi,
    updateNoteColor as updateNoteColorApi,
    updateNoteFavorite,
    updateNoteLabelsApi,
    updateNotePinned }
from "../api/noteApi";




type NoteStore = {

    notes: Note[];

    // deletedNote: Note | null;

    deletedNote: {
        note: Note;
        index: number;
    } | null;

    showUndo: boolean;

    undoTimer: ReturnType<typeof setTimeout> | null;  // 前のタイマーを止めるために必要。


    hideUndo: () => void;

    // newImages: NoteImage[];

    fetchNotes: () => Promise<void>;


    fetchTrashNotes: () => Promise<void>;


    createNote: (
        title: string,
        content: string,
        labels: number[],
        color: string,
    ) => Promise<void>;


    addNote: (note: Note) => void;

    updateNote: (id: number, title: string, content: string) => Promise<void>;

    updateNoteColor: (id: number, color: string,) => Promise<void>;

    moveToTrash: (id: number) => Promise<void>;

    deleteNoteForever: (id: number) => Promise<void>;

    restoreNote: (id: number) => Promise<void>;

    emptyTrash: () => Promise<void>;

    moveSelectedToTrash: (ids: number[]) => Promise<void>;

    toggleFavorite: (id: number, is_favorite: boolean) => Promise<void>;

    togglePin: (id: number, is_pinned: boolean) => Promise<void>;

    updateSelectedNotePin: (noteIds: number[], mode: "add" | "remove") => Promise<void>;

    updateSelectedNoteColor: (ids: number[], color: string) => Promise<void>;

    duplicateSelectedNotes: (ids: number[]) => Promise<void>;


    updateNoteLabels: (noteId: number, labelIds: number[]) => Promise<void>;


    updateSelectedNoteLabels: (noteIds: number[], labelId: number, mode: "add" | "remove") => Promise<void>;



    deleteNoteImage: (noteId: number, imageId: number) => Promise<void>;


    updateNoteImageOrder: (
        noteId: number,
        newImages: NoteImage[],
        // reorderedImages:
        )
    => Promise<void>;


    undoDelete: () => Promise<void>;

}



export const useNoteStore = create<NoteStore>((set, get) => ({

    notes: [],

    deletedNote: null,

    showUndo: false,


    undoTimer: null as ReturnType<typeof setTimeout> | null,





    fetchNotes: async () => {

        try {

            const data = await getNotes();

            set({
                notes: data,
            });

        } catch (error) {

            console.error(error);

        }

    },


    fetchTrashNotes: async () => {

        try {

            const data = await getTrashNotesApi();

            set({
                notes: data
            });


        } catch (error) {

            console.error(error);

        }




    },



    // 新規ノート作成。単体ノート複製もこのメソッドを使っている。
    createNote: async (
        title,
        content,
        labels,
        color,

    ) => {

        try {

            const newNote = await createNoteApi(title, content, labels, color);

            set((state) => ({

                notes: [
                    newNote,
                    ...state.notes,
                ]

            }))

        } catch (error) {

            console.error(error);
            throw error;  // 捕まえたエラーを、もう一度外側へ投げる。

        }




    },



    addNote: (newNote) =>

        set((state) => ({

            notes: [
                newNote,
                ...state.notes,
            ]

        })),




    updateNote: async (
        id: number,
        title: string,
        content: string,
    ) => {

        try {

            const updatedNote = await updateNoteApi(Number(id), title, content);

            set((state) => ({

                notes: state.notes.map((note) =>
                    note.id === updatedNote.id ? updatedNote : note
                )

            }));


        } catch (error) {

            console.error(error);

        }


    },



    updateNoteColor: async (
        id: number,
        color: string,
    ) => {
        try {

            const updatedNote = await updateNoteColorApi(id, color);

            set((state) => ({

                notes: state.notes.map((note) =>
                    note.id === updatedNote.id ? updatedNote : note
                )

            }));

        } catch (error) {

            console.error(error);

        }


    },


    // updateNote: (updatedNote) =>

    //     set((state) => ({

    //         notes: state.notes.map((note) =>
    //             note.id === updatedNote.id ? updatedNote : note
    //         )

    //     })),

    hideUndo: () => {

        const timer = get().undoTimer;
        console.log(`timerの中身: ${timer}`);


        if(timer){
            clearTimeout(timer);
        }

        set({
            showUndo: false,
            deletedNote: null,
            undoTimer: null,
        });

    },


    // ノート単体をゴミ箱に移動する
    moveToTrash: async (
        id: number,
    ) => {

        try {

            // 削除対象のノートを、削除前に取得する。
            const deletedNote = get().notes.find(
                note => note.id === id
            );

            // 削除対象のノートのインデックスを、削除前に取得する。
            const deletedIndex = get().notes.findIndex(
                note => note.id === id
            );


            if (!deletedNote) return;


            // 以前のタイマーがあれば削除
            const oldTimer = get().undoTimer;
            console.log(`oldTimerの中身: ${oldTimer}`);

            if (oldTimer) {
                clearTimeout(oldTimer);
            }


            await moveToTrashApi(id);



            set((state) => ({

                deletedNote: {  // このdeletedNote: Storeで定義したもの。
                    note: deletedNote,    // このdeletedNote: 上で定義した変数。削除対象のノートをStoreで保存しておく。
                    index: deletedIndex,

                },

                // deletedNote: deletedNote,   // 左辺のdeletedNote: Storeで定義したもの。  右辺のdeletedNOte: 上で定義した変数。削除対象のノートをStoreで保存しておく。
                showUndo: true,

                notes: state.notes.filter((note) =>
                    note.id !== id
                )
            }));


            // 新しいタイマーを作る。5秒後にUndo終了
            const timer = setTimeout(() => {
                get().hideUndo();
            }, 5000);


            // console.log("moveToTrash!");


            // 今動いているタイマーはこれだと、Storeに保存する。これを書かないと、ノートA削除中に、ノートB削除みたいに連続で削除すると、バグる。
            set({
                undoTimer: timer,
            });


        } catch (error) {

            console.error(error);

        }
    },



    // 削除処理をキャンセルする。元に戻すを押したとき。
    undoDelete: async (

    ) => {

        const deletedNote = get().deletedNote;  // Storeに保存しておいた削除したノートを取り出す。

        if (!deletedNote) return;


        // 現在のundoTimerを取得し、止める。
        const timer = get().undoTimer;

        if (timer) {
            clearTimeout(timer);
        }


        try {

            // await restoreNoteApi(deletedNote.id);
            await restoreNoteApi(deletedNote.note.id);

            set((state) => {

                const newNotes = [...state.notes];

                newNotes.splice(
                    deletedNote.index,
                    0,
                    deletedNote.note,
                );

                return {
                    notes: newNotes,
                    showUndo: false,
                    deletedNote: null,
                    undoTimer: null,
                }

            });

            // set((state) => ({

            //     notes: [
            //         deletedNote.note,
            //         // deletedNote,
            //         ...state.notes,
            //     ],

            //     showUndo: false,
            //     deletedNote: null,
            //     undoTimer:null,


            // }));

        } catch (error) {

            console.error(error);

        }

    },




    // ノート単体を削除する
    deleteNoteForever: async (
        id: number,
    ) => {

        try {

            await deleteNoteForeverApi(id);

            set((state) => ({
                notes: state.notes.filter((note) => note.id !== id)
            }));

        } catch (error) {

            console.error(error);

        }


    },


    // ゴミ箱にあるノートを復活させる
    restoreNote: async (
        id: number,
    ) => {

        try {

            await restoreNoteApi(id);

            set((state) => ({
                notes: state.notes.filter((note) => note.id !== id)
            }));

        } catch (error) {

            console.error(error);

        }

    },



    // ゴミ箱内のノートをすべて削除する
    emptyTrash: async (

    ) => {

        try {

            await emptyTrashApi();

            set({
                notes: []
            });

        } catch (error) {

            console.error(error);

        }

    },



    // 選択した複数のノートをゴミ箱に移動する
    moveSelectedToTrash: async (
        ids: number[]
    ) => {

        try {

            await Promise.all(
                ids.map(
                    (id) => moveToTrashApi(id)
                )
            )

            set((state) => ({

                notes: state.notes.filter(
                    (note) => !ids.includes(note.id)
                )

            }))

        } catch (error) {

            console.error(error);
        }



    },




    // お気に入りを切り替える
    toggleFavorite: async (
        id: number,
        is_favorite: boolean,
    ) => {

        try {

            const updatedNote = await updateNoteFavorite(id, !is_favorite);

            set((state) => ({
                notes: state.notes.map(
                    (note) => note.id === id ? updatedNote : note

                )

            }))

        } catch (error) {

            console.error(error);

        }

    },




    // ピンのつけ外し
    togglePin: async (
        id: number,
        is_pinned: boolean,
    ) => {

        try {

            const updatedNote = await updateNotePinned(id, !is_pinned);

            set((state) => ({
                notes: state.notes.map(
                    (note) => note.id === id ? updatedNote : note
                )


            }));


        } catch (error) {

            console.error(error);

        }


    },



    // 選択中のノートのピンを切り替える
    updateSelectedNotePin: async (
        noteIds: number[],
        mode: "add" | "remove",

    ) => {

        const notes = get().notes;
        const selectedNotes = notes.filter((note) => noteIds.includes((note.id)));


        try {

            const updatedNotes = await Promise.all(

                selectedNotes.map(async (note) => {

                    return await updateNotePinned(
                        note.id,
                        mode === "add",
                    );

                })

            );


            set((state) => ({

                notes: state.notes.map((note) => {

                    const updatedNote = updatedNotes.find((n) => n.id === note.id);

                    return updatedNote ?? note;

                })

            }))

        } catch (error) {

            console.error(error);

        }

    },





    // 選択した複数のノートの色を変える
    updateSelectedNoteColor: async (
        ids: number[],
        color: string,
    ) => {

        try {

            await Promise.all(ids.map(
                (id) => updateNoteColorApi(id, color)
            ));


            set((state) => ({

                notes: state.notes.map((note) =>
                    ids.includes(note.id)
                        ? {
                            ...note, // noteはコピーして展開し、
                            color,  // 色だけ変更する
                        }
                        :
                        note
                )

            }))


        } catch (error) {

            console.error(error);

        }

    },



    // 選択した複数のノートをコピーする
    duplicateSelectedNotes: async (
        ids: number[]
    ) => {

        const notes = get().notes;

        try {

            const newNotes = await Promise.all(
                notes
                .filter((note) => ids.includes(note.id))
                .map((note) =>
                    createNoteApi(
                        note.title,
                        note.content,
                        note.labels.map((label) => label.id),
                        note.color,
                    )
                )
            )

            set((state) => ({
                notes: [
                    ...newNotes,
                    ...state.notes

                ]

            }))





        } catch (error) {

            console.error(error);

        }



    },



    // ノートについているラベルを更新する
    updateNoteLabels: async (
        noteId: number,
        labelIds: number[],
    ) => {

        try {

            const updatedNote = await updateNoteLabelsApi(noteId, labelIds);

            set((state) => ({
                notes: state.notes.map(
                    (note) => note.id === noteId ? updatedNote : note
                )

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

        const notes = get().notes;

        // noteIdsを使い、選択中のノートを抽出する。
        const selectedNotes = notes.filter((note) => noteIds.includes(note.id));


        try {

            const updatedNotes = await Promise.all(  // Promise.all() は、Promise.all(配列)の形じゃないとだめ。選択中の全ノートに対してラベル更新を同時に実行する。

                selectedNotes.map(async (note) => {

                    const currentIds = note.labels.map((label) => label.id);

                    let newIds: number[];


                    if (mode == "add") {

                        if (currentIds.includes(labelId)) {
                            newIds = currentIds;
                        } else {
                            newIds = [
                                labelId,
                                ...currentIds,
                            ]
                        }


                    } else {

                        newIds = currentIds.filter((id) => id !== labelId);

                    }

                    return await updateNoteLabelsApi(note.id, newIds);

                })
            );


            set((state) => ({

                notes: state.notes.map((note) => {

                    const updatedNote = updatedNotes.find((n) => n.id === note.id)

                    return updatedNote ?? note;

                })

            }));


        } catch (error) {

            console.error(error);
        }
    },



    // 各ノートが所持している画像を削除する
    deleteNoteImage: async (
        noteId: number,
        imageId: number,
    ) => {


        try {

            await deleteNoteImageApi(imageId);


            set((state) => ({

                notes: state.notes.map((note) =>

                    note.id === noteId
                        ? {
                            ...note,
                            images: note.images.filter((image) => image.id !== imageId)
                        }

                        : note

                )

            }));




        } catch (error) {

            console.error(error);

        }
    },




    // ノートの画像並び順を更新する
    updateNoteImageOrder: async(
        noteId: number,
        newImages: NoteImage[],
        // reorderedImages:
    ) => {


        // newImagesから、画像idだけ抽出し、orderにはindexを順番に割り当てる。
        const reorderedImages = newImages.map((image, index) => ({
            id: image.id,
            order: index,
        }));


        try {

            await reorderNoteImageApi(noteId, reorderedImages);


            set((state) => ({
                notes: state.notes.map((note) =>

                    note.id === noteId
                        ? {
                            ...note,
                            images: newImages,
                        }

                        : note
                )
            }))



        } catch (error) {

            console.error(error);

        }



    },







}))
