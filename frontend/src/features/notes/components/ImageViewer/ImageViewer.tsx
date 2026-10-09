
import type { NoteImage } from "../../../../types/api/note";


import styles from "./ImageViewer.module.css";




type Props = {
    images: NoteImage[];
    currentIndex: number;
    onNext: () => void;
    onPrev: () => void;
    onClose: () => void;

};



// 親: NoteDetailModal,



export default function ImageViewer({
    images,
    currentIndex,
    onNext,
    onPrev,
    onClose,

}: Props) {



    const image = images[currentIndex];




    return (

        <div
            className={styles.viewer}
            onClick={onClose}
        >

            <button
                className={styles.closeButton}

                // onClick={onClose}
            >
                ✕
            </button>

            {currentIndex > 0 && (

                <button
                    className={styles.prevButton}
                    onClick={(e) => {
                        e.stopPropagation();
                        onPrev();
                    }}

                >
                    ←
                </button>

            )}


            <img
                className={styles.image}
                src={image.image}
                alt=""
                onClick={(e) => {
                    e.stopPropagation();
                }}
            />

            {currentIndex < images.length - 1 && (

                <button
                    className={styles.nextButton}
                    onClick={(e) => {
                        e.stopPropagation();
                        onNext();
                    }}

                >
                    →
                </button>

            )}


        </div>

    );

}
