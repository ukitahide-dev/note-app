
import type { NoteImage, Note, } from "../../../../types/note"
// import { useNoteStore } from "../../store/useNoteStore";
import ImageItem from "../ImageItem/ImageItem";


// ---- Drag用 ----
import {
  DndContext,
} from "@dnd-kit/core";

import {
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";


// import { arrayMove } from "@dnd-kit/sortable";

// import type { DragEndEvent } from "@dnd-kit/core";
// // import { DragEndEvent } from "@dnd-kit/core";
// import { useState } from "react";
// import { reorderNoteImageApi } from "../../api/noteApi";
import { useSortableNoteImages } from "../../hooks/useSortableNoteImages";




type Props = {
    images: NoteImage[];
    isLarge: boolean;

    noteId: number;

    onDeleteImage: (imageId: number) => Promise<void>;

    // note: Note;

}


// 親: NoteDetailModal.tsx

export function ImageList({
    images,
    isLarge,
    noteId,
    onDeleteImage,


}: Props) {


    // hook
    const {
        handleDragEnd,
    } = useSortableNoteImages(images, noteId);



    console.log(images);  // [{…}, {…}] ex) [{id: 71, image: 'http://127.0.0.1:8000/media/note_images/%E3%82%B3%E3%83%AD%E3%83%92%E3%83%BC%E3%83%AD%E3%83%BC.png', order: 0, note: 298}, {id: 72, image: 'http://127.0.0.1:8000/media/note_images/%E3%83%9B%E3%82%A4%E3%83%9F%E3%83%B3.png', order: 1, note: 298}]

    return (

        <DndContext
            onDragEnd={handleDragEnd}
        >

            <SortableContext
                items={images.map((image) => image.id)}
                strategy={rectSortingStrategy}
            >

                {images.map((image) => (
                    <ImageItem
                        key={image.id}
                        image={image}
                        isLarge={isLarge}
                        onDeleteImage={() => onDeleteImage(image.id)}

                    />
                ))}

            </SortableContext>

        </DndContext>

    );



}





// hookに移した
// const [sortedImages, setSortedImages] = useState(images);


    // if (!images) return;


    // const handleDragEnd = async (event: DragEndEvent) => {
    //     const { active, over } = event;   // active = 掴んだ画像   over = 最後に重なっていた画像

    //     if (!over) return;

    //     if (active.id === over.id) return;



    //     const oldIndex = sortedImages.findIndex((image) => image.id === active.id);

    //     const newIndex = sortedImages.findIndex((image) => image.id === over.id);


    //     // oldIndex の要素を newIndex の位置へ移動して、間の要素は1つずつずれる。
    //     const newImages = arrayMove(
    //         sortedImages,
    //         oldIndex,
    //         newIndex
    //     );


    //     const reorderedImages = newImages.map((image, index) => ({
    //         id: image.id,
    //         order: index,
    //     }));


    //     await reorderNoteImageApi(noteId, reorderedImages);



    //     setSortedImages(newImages);



    // };
