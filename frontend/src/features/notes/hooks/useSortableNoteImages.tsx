import { useEffect, useState } from "react";

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



// 呼び出し元: ImageList


export function useSortableNoteImages(
    images: NoteImage[],
    noteId: number,


) {



    // const [sortedImages, setSortedImages] = useState(images);


    // Store
    const {
        updateNoteImageOrder,
    } = useNoteStore();



    // これ書かないと、エラーになる。モーダルから画像消えなくなる。ノートカードからは消えてる。
    // useEffect(() => {
    //     setSortedImages(images);
    // }, [images]);



    // ドラッグが終了すると、実行される。
    const handleDragEnd = async (event: DragEndEvent) => {

        const { active, over } = event;   // active = 掴んだ画像   over = 最後に重なっていた画像

        if (!over) return;

        if (active.id === over.id) return;



        const oldIndex = images.findIndex((image) => image.id === active.id);

        const newIndex = images.findIndex((image) => image.id === over.id);


        // oldIndex の要素を newIndex の位置へ移動して、間の要素は1つずつずれる。
        const newImages = arrayMove(
            images,
            oldIndex,
            newIndex
        );


        await updateNoteImageOrder(noteId, newImages);

        // setSortedImages(newImages);



    };




    return {
        // sortedImages,
        handleDragEnd,

    }


}
