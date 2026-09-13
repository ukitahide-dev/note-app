
import type { NoteImage,} from "../../../../types/note"

import ImageItem from "../ImageItem/ImageItem";


// ---- Drag用 ----
import {
  DndContext,
} from "@dnd-kit/core";

import {
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";



import { useSortableNoteImages } from "../../hooks/useSortableNoteImages";




type Props = {
    images: NoteImage[];
    isLarge: boolean;

    noteId: number;

    onDeleteImage: (imageId: number) => Promise<void>;


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



    // console.log(images);  // [{…}, {…}] ex) [{id: 71, image: 'http://127.0.0.1:8000/media/note_images/%E3%82%B3%E3%83%AD%E3%83%92%E3%83%BC%E3%83%AD%E3%83%BC.png', order: 0, note: 298}, {id: 72, image: 'http://127.0.0.1:8000/media/note_images/%E3%83%9B%E3%82%A4%E3%83%9F%E3%83%B3.png', order: 1, note: 298}]

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





