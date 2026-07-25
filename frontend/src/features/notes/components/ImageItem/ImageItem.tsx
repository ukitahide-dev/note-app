
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";



// ---- css ----
import styles from "./ImageItem.module.css";


// ---- type ----
import type { NoteImage } from "../../../../types/note";



type Props = {
    image: NoteImage;
    isLarge: boolean;
    onDeleteImage: () => Promise<void>;

}

export default function ImageItem ({
    image,
    isLarge,
    onDeleteImage,
}: Props) {


    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({
        id: image.id,
    });


    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };


    const wrapperClass = isLarge
        ? styles.largeImageWrapper
        : styles.normalImageWrapper;


    const imageClass = isLarge
        ? styles.largeImage
        : styles.image;



    return (

        <div
            key={image.id}
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            // className={`${styles.imageWrapper} ${styles.largeImageWrapper}`}
            className={`${styles.imageWrapper} ${wrapperClass}`}
        >

            <img
                src={image.image}
                className={imageClass}
                // className={styles.largeImage}
            />

            <button
                className={styles.deleteButton}
                onClick={(e) => {
                    e.stopPropagation();
                    onDeleteImage();
                }}

            >
                🗑️
            </button>

        </div>



    )



}
