


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



    const wrapperClass = isLarge
        ? styles.largeImageWrapper
        : styles.normalImageWrapper;


    const imageClass = isLarge
        ? styles.largeImage
        : styles.image;



    return (

        <div
            key={image.id}
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
