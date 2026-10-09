import { useState } from "react";
import type { Note } from "../../../types/api/note";


// 呼び出し元: NoteDetailModal

export function useNoteImageViewer(
    note: Note,

) {



    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);



    const handleSelectImage = (
        imageId: number,

    ) => {


        const index = note.images.findIndex(
            (image) => image.id === imageId
        );

        if (index === -1) return;

        setSelectedImageIndex(index);

    };



    const handleNextImage = () => {

        if (selectedImageIndex === null) return;

        if (selectedImageIndex >= note.images.length - 1) return;

        setSelectedImageIndex(selectedImageIndex + 1);

    };


    const handlePrevImage = () => {

        if (selectedImageIndex === null) return;

        if (selectedImageIndex <= 0) return;

        setSelectedImageIndex(selectedImageIndex - 1);

    };


    const handleCloseImageViewer = () => {

        setSelectedImageIndex(null);

    };


    return {

        selectedImageIndex,
        handleSelectImage,
        handleNextImage,
        handlePrevImage,
        handleCloseImageViewer,
    }




}





