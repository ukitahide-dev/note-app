import { useState } from "react";

import type { NoteImage } from "../../../types/note";

// ---- Drag用 ----
// import {
//   DndContext,
// } from "@dnd-kit/core";

// import {
//   SortableContext,
//   rectSortingStrategy,
// } from "@dnd-kit/sortable";


import { arrayMove } from "@dnd-kit/sortable";

import type { DragEndEvent } from "@dnd-kit/core";
import { useNoteStore } from "../store/useNoteStore";


export function useSortableNoteImages(
    images: NoteImage[],
    noteId: number,


) {



    const [sortedImages, setSortedImages] = useState(images);


    // Store
    const {
        updateNoteImageOrder,
    } = useNoteStore();


    


    const handleDragEnd = async (event: DragEndEvent) => {

        const { active, over } = event;   // active = 掴んだ画像   over = 最後に重なっていた画像

        if (!over) return;

        if (active.id === over.id) return;



        const oldIndex = sortedImages.findIndex((image) => image.id === active.id);

        const newIndex = sortedImages.findIndex((image) => image.id === over.id);


        // oldIndex の要素を newIndex の位置へ移動して、間の要素は1つずつずれる。
        const newImages = arrayMove(
            sortedImages,
            oldIndex,
            newIndex
        );


        // const reorderedImages = newImages.map((image, index) => ({
        //     id: image.id,
        //     order: index,
        // }));


        await updateNoteImageOrder(noteId, newImages);
        // await reorderNoteImageApi(noteId, reorderedImages);



        setSortedImages(newImages);



    };




    return {
        sortedImages,
        handleDragEnd,

    }


}
