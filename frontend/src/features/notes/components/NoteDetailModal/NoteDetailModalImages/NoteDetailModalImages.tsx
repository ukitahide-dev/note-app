

import {
    DndContext,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";


import {
    SortableContext,
    rectSortingStrategy,

} from "@dnd-kit/sortable";
import type { Note } from "../../../../../types/api/note";
import { splitImages } from "../../../utils/splitImages";
import { ImageList } from "../../ImageList/ImageList";


import styles from "./NoteDetailModalImages.module.css";
import { useSortableNoteImages } from "../../../hooks/useSortableNoteImages";



type Props = {
    note: Note;
    onDeleteImage: (imageId: number) => void;
    onSelectImage: (imageId: number) => void;

}



export default function ({
    note,
    onDeleteImage,
    onSelectImage,


}: Props) {





    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,     // 8px以上動かしたら「ドラッグ」と判断する。
            },
        }),
    );


    // hook
    const { handleDragEnd } = useSortableNoteImages(
        note.images,
        note.id,
    );


    // utils
    const {
        largeImages,
        normalImages,

    } = splitImages(note.images);






    return (


        <DndContext
            sensors={sensors}
            onDragEnd={handleDragEnd}
        >

            <SortableContext
                items={note.images.map((image) => image.id)}
                strategy={rectSortingStrategy}
            >

                <div className={styles.largeImages}>

                    <ImageList
                        images={largeImages}
                        isLarge={true}
                        noteId={note.id}
                        onDeleteImage={onDeleteImage}
                        onSelectImage={onSelectImage}
                    />

                </div>

                <div className={styles.images}>

                    <ImageList
                        images={normalImages}
                        isLarge={false}
                        noteId={note.id}
                        onDeleteImage={onDeleteImage}
                        onSelectImage={onSelectImage}
                    />

                </div>

            </SortableContext>

        </DndContext>
    );
}
