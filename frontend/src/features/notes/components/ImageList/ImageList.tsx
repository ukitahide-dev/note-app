import type { NoteImage } from "../../../../types/api/note";

import ImageItem from "../ImageItem/ImageItem";



type Props = {
    images: NoteImage[];
    isLarge: boolean;

    noteId: number;

    // onDeleteImage: (imageId: number) => Promise<void>;
    onDeleteImage: (imageId: number) => void;

    onSelectImage: (imageId: number) => void;
};




// 親: NoteDetailModal.tsx


export function ImageList({
    images,
    isLarge,

    onDeleteImage,
    onSelectImage,

}: Props) {





    // console.log(images);  // [{…}, {…}] ex) [{id: 71, image: 'http://127.0.0.1:8000/media/note_images/%E3%82%B3%E3%83%AD%E3%83%92%E3%83%BC%E3%83%AD%E3%83%BC.png', order: 0, note: 298}, {id: 72, image: 'http://127.0.0.1:8000/media/note_images/%E3%83%9B%E3%82%A4%E3%83%9F%E3%83%B3.png', order: 1, note: 298}]



    return (

            <>
                {images.map((image) => (
                    <ImageItem
                        key={image.id}
                        image={image}
                        isLarge={isLarge}
                        onDeleteImage={() => onDeleteImage(image.id)}  // あとで実行する関数を新しく作って渡す
                        onSelectImage={() => onSelectImage(image.id)}
                        // onDeleteImage={onDeleteImage(image.id)}   // 関数を実行して、その結果を渡す。
                    />
                ))}
            </>




    );
}
