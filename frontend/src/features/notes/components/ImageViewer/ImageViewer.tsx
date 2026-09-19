
import type { NoteImage } from "../../../../types/api/note";


import styles from "./ImageViewer.module.css";




type Props = {
    images: NoteImage[];

    currentIndex: number;

    onClose: () => void;

    onNext: () => void;
    onPrev: () => void;

};



// 親: NoteDetailModal,



export default function ImageViewer({
    images,
    currentIndex,
    onClose,
    onNext,
    onPrev,

}: Props) {



    const image = images[currentIndex];




    return (

        <div className={styles.viewer}>

            <button
                className={styles.closeButton}
                onClick={onClose}
            >
                ✕
            </button>

            {currentIndex > 0 && (

                <button
                    className={styles.prevButton}
                    onClick={onPrev}
                >
                    ←
                </button>

            )}


            <img
                className={styles.image}
                src={image.image}
                alt=""
            />

            {currentIndex < images.length - 1 && (

                <button
                    className={styles.nextButton}
                    onClick={onNext}
                >
                    →
                </button>

            )}


        </div>
        
    );

}
