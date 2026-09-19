import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";


// ---- css ----
import styles from "./ImageItem.module.css";


// ---- type ----
import type { NoteImage } from "../../../../types/api/note";


type Props = {
    image: NoteImage;
    isLarge: boolean;
    onDeleteImage: () => void;

    onSelectImage: () => void;

};




export default function ImageItem({
    image,
    isLarge,
    onDeleteImage,
    onSelectImage,

}: Props) {


    const {
        attributes,   // dnd-kitが必要とする属性
        listeners,    // 「この要素を操作したらドラッグ開始できます」
        setNodeRef,   //「この要素が並び替える対象です」
        transform,    // 並び替え時の移動
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


    const imageClass = isLarge ? styles.largeImage : styles.image;



    return (

        <div
            key={image.id}
            ref={setNodeRef}
            style={style}
            // className={`${styles.imageWrapper} ${styles.largeImageWrapper}`}
            className={`${styles.imageWrapper} ${wrapperClass}`}
            // {...attributes}
            // {...listeners}
        >

            <img
                src={image.image}
                className={imageClass}
                onClick={onSelectImage}

                {...attributes}
                {...listeners}
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

    );

}
