
import type { NoteImage, Note, } from "../../../../types/note"
import { useNoteStore } from "../../store/useNoteStore";
import ImageItem from "../ImageItem/ImageItem";


type Props = {
    images: NoteImage[];
    isLarge: boolean;

    onDeleteImage: (imageId: number) => Promise<void>;

    // note: Note;

}


// 親: NoteDetailModal.tsx

export function ImageList({
    images,
    isLarge,
    onDeleteImage,
    // note,

}: Props) {



    if (!images) return;





    return (
        <>
            {images.map((image) => (
                <ImageItem
                    key={image.id}
                    image={image}
                    isLarge={isLarge}
                    onDeleteImage={() => onDeleteImage(image.id)}
                    // onDeleteImage={ () => {
                    //     onDeleteImage(image.id);
                    // }}
                />
            ))}
        </>
    );


    
}
