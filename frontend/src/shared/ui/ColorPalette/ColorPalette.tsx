


// ---- css ----
import { useEffect, useRef } from "react";
import styles from "./ColorPalette.module.css";
import { useNoteSelectionStore } from "../../../features/notes/store/useNoteSelectionStore";


// type Note = {
//     id: number;
//     title: string;
//     content: string;
//     color: string;
// }


type Props = {
    onSelectColor: (
        color: string
    ) => void;

    tempColor?: string;

    // onUpdateColor?: (
    //     id: number,
    //     color: string,
    // ) => Promise<void>;

    // note?: Note;

    onClose: () => void;  // onCloseを実行して、親で色変更のapiを呼ぶ形にする。onUpdateColorやnoteを渡してもらう必要がなくなる。

}



const colors = [
    "#ffffff",
    "#f28b82",
    "#fbbc04",
    "#fff475",
    "#ccff90",
    "#a7ffeb",
    "#cbf0f8",
    "#aecbfa",
];



// 親: NoteCard.tsx、NoteDetailModal.tsx、NoteForm.tsx、Header.tsx、


export default function ColorPalette({
    onSelectColor,
    // onUpdateColor,
    // note,
    // tempColor,
    onClose,
}: Props) {

    const paletteRef = useRef<HTMLDivElement | null>(null);

    console.log('ColorPalette再レンダリング');



    // const {
    //     previewColor
    // } = useNoteSelectionStore();





    useEffect(() => {

        const handleOutsideClick = (
            event: MouseEvent
        ) => {

            console.log("ColorPalette mounted");


            if ( // ColorPaletteが存在していて、クリックされた場所がColorPaletteの外だった場合。
                paletteRef.current &&  // paletteRef.currentは<div class="palette">のDOMを指している。
                !paletteRef.current.contains(  // event.targetは実際にクリックされた要素。ex) <button>赤</button>
                    event.target as Node
                )
            ) {
                console.log("outside");
                onClose();
            }
        };


        document.addEventListener(
            "click",
            handleOutsideClick
        );


        return () => {
            document.removeEventListener(
                "click",
                handleOutsideClick,
            );
        };

    }, [onClose]);  // []だと初回マウント時のみuseEffect内が実行される。[tempColor]にしないと、ColorPaletteが最初に開かれた時点でのtempColorが登録されたままになる。onSelectColor(color)で色変更して、NoteCard再レンダリング → ColorPalette再レンダリングされても、[]だと、useEffect内は再実行されないから、最初のtempColorをずっと保持したままになる。

    // [tempColor, previewColor]
    // [onClose]


    return (

        <div
            ref={paletteRef}
            className={styles.palette}
            onClick={(e) => e.stopPropagation()}
        >

            {colors.map((color) => (

                <button
                    key={color}
                    type="button"
                    style={{
                        backgroundColor: color,
                    }}

                    onClick={(e) => {
                            console.log("選択した色", color);
                            e.stopPropagation();
                            onSelectColor(color);
                            // setPreviewColor(color);
                        }

                    }


                />

            ))}

        </div>

    );
}
