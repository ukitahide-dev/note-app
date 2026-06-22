import { create } from "zustand";




type NoteSelectionStore = {

    selectedNoteIds: number[];

    toggleSelect: (
        id: number
    ) => void;

    clearSelection: () => void;


}




export const useNoteSelectionStore = create<NoteSelectionStore>((set) => ({

    selectedNoteIds: [],


    toggleSelect: (id) =>
        set((state) => ({

            selectedNoteIds:
                state.selectedNoteIds.includes(id)
                    ? state.selectedNoteIds.filter(
                        (noteId) => noteId !== id
                    )
                    : [

                        id,
                        ...state.selectedNoteIds,

                    ]
        })),



    clearSelection: () =>
        set({
            selectedNoteIds: [],
        }),


}))
