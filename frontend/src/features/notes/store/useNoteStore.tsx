import { create } from "zustand";
import type { Note } from "../../../types/note"
import { createNote as createNoteApi, getNote, getNotes, moveToTrash as moveToTrashApi, updateNote as updateNoteApi, updateNoteColor as updateNoteColorApi, updateNoteFavorite, updateNoteLabels, updateNotePinned } from "../api/noteApi";




type NoteStore = {

    notes: Note[];

    fetchNotes: () => Promise<void>;

    createNote: (
        title: string,
        content: string,
        labels: number[],
        color: string,
    ) => Promise<void>;

    addNote: (note: Note) => void;

    updateNote: (id: number, title: string, content: string) => void;

    moveToTrash: (id: number) => Promise<void>;

    moveSelectedToTrash: (ids: number[]) => Promise<void>;

    toggleFavorite: (id: number, is_favorite: boolean) => Promise<void>;

    togglePin: (id: number, is_pinned: boolean) => Promise<void>;

    updateSelectedNotePin: (noteIds: number[], mode: "add" | "remove") => Promise<void>;

    updateSelectedNoteColor: (ids: number[], color: string) => Promise<void>;

    duplicateSelectedNotes: (ids: number[]) => Promise<void>;


    updateNoteLabels: (noteId: number, labelIds: number[]) => Promise<void>;


    updateSelectedNoteLabels: (noteIds: number[], labelId: number, mode: "add" | "remove") => Promise<void>;



}



export const useNoteStore = create<NoteStore>((set, get) => ({

    notes: [],


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


    // updateNote: (updatedNote) =>

    //     set((state) => ({

    //         notes: state.notes.map((note) =>
    //             note.id === updatedNote.id ? updatedNote : note
    //         )

    //     })),




    moveToTrash: async (
        id: number,
    ) => {

        try {

            await moveToTrashApi(id);  // api呼ぶ

            set((state) => ({
                notes: state.notes.filter((note) =>
                    note.id !== id
                )
            }))


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

            const updatedNote = await updateNoteLabels(noteId, labelIds);

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

                    return await updateNoteLabels(note.id, newIds);

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










}))
