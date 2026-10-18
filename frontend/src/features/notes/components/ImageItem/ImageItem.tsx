import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";


// ---- css ----
import styles from "./ImageItem.module.css";


// ---- type ----
import type { NoteImage } from "../../../../types/api/note";


type Props = {
    image: NoteImage;
    isLarge: boolean;
    onDeleteImage: (imageId: number) => void;
    onSelectImage: (imageId: number) => void;


};



// 親: ImageList,


export default function ImageItem({   // 分割代入でプロパティの値を取得している。
    image,
    isLarge,     // isLargeはfalseかtrueという値そのもの。
    onDeleteImage,
    onSelectImage,

}: Props) {

    // console.log(image);
    // console.log(isLarge)

    const {
        attributes,   // dnd-kitが必要とする属性
        listeners,    // 「この要素を操作したらドラッグ開始」
        setNodeRef,   //「この要素が並び替える対象」
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
            className={`${styles.imageWrapper} ${wrapperClass}`}

        >

            <img
                src={image.image}
                className={imageClass}
                onClick={() => onSelectImage(image.id)}

                {...attributes}
                {...listeners}
            />

            <button
                className={styles.deleteButton}
                onClick={(e) => {
                    e.stopPropagation();
                    onDeleteImage(image.id);
                }}
            >
                🗑️

            </button>

        </div>

    );

}
