
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


    // const {
    //     deleteNoteImage,
    // } = useNoteStore();


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


    // return (

    //     {images.map((image: NoteImage) => (

    //         <ImageItem

    //             image={image}
    //             isLarge={isLarge}
    //             onDeleteImage={ async () => {
    //                 await deleteNoteImage(note.id, image.id);
    //             }}
    //         />

    //         // <>
    //         // // {/* <div
    //         // //     key={image.id}
    //         // //     className={`${styles.imageWrapper} ${styles.largeImageWrapper}`}
    //         // // >

    //         // //     <img
    //         // //         src={image.image}
    //         // //         className={styles.largeImage}
    //         // //     />

    //         // //     <button
    //         // //         className={styles.deleteButton}
    //         // //         onClick={async (e) => {
    //         // //             e.stopPropagation();
    //         // //             await deleteNoteImage(note.id, image.id);
    //         // //         }}

    //         // //     >
    //         // //         🗑️
    //         // //     </button>

    //         // // </div>


    //         // // <div
    //         // //     key={image.id}
    //         // //     className={`${styles.imageWrapper} ${styles.normalImageWrapper}`}

    //         // // >

    //         // //     <img
    //         // //         src={image.image}
    //         // //         className={styles.image}
    //         // //     />

    //         // //     <button
    //         // //         className={styles.deleteButton}
    //         // //         onClick={async (e) => {
    //         // //             e.stopPropagation();
    //         // //             await deleteNoteImage(note.id, image.id);
    //         // //         }}

    //         // //     >
    //         // //         🗑️
    //         // //     </button>


    //         // // </div> */}
    //         // </>


    //     ))}






    // )

}
