


// ---- css ----
import { useEffect, useRef } from "react";
import styles from "./ColorPalette.module.css";


type Note = {
    id: number;
    title: string;
    content: string;
    color: string;
}


type Props = {
    onSelectColor: (
        color: string
    ) => void;

    // onClose: () => void;

    onUpdateColor: (
        id: number,
        color: string,
    ) => Promise<void>;

    note: Note;

    tempColor: string;
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



export default function ColorPalette({
    onSelectColor,
    onUpdateColor,
    // onClose,
    note,
    tempColor,
}: Props) {

    const paletteRef = useRef<HTMLDivElement | null>(null);



    useEffect(() => {

        const handleOutsideClick = (
            event: MouseEvent
        ) => {

            if ( // ColorPaletteが存在していて、クリックされた場所がColorPaletteの外だった場合。
                paletteRef.current &&  // paletteRef.currentは<div class="palette">のDOMを指している。
                !paletteRef.current.contains(  // event.targetは実際にクリックされた要素。ex) <button>赤</button>
                    event.target as Node
                )
            ) {

                onUpdateColor(note.id, tempColor);
            }
        };


        document.addEventListener(
            "click",
            handleOutsideClick
        );


        return () => {
            document.removeEventListener(
                "click",
                handleOutsideClick
            );
        };

    }, [tempColor]);  // []だと初回マウント時のみuseEffect内が実行される。[tempColor]にしないと、ColorPaletteが最初に開かれた時点でのtempColorが登録されたままになる。onSelectColor(color)で色変更して、NoteCard再レンダリング → ColorPalette再レンダリングされても、[]だと、useEffect内は再実行されないから、最初のtempColorをずっと保持したままになる。





    return (

        <div
            ref={paletteRef}
            className={styles.palette}
        >

            {colors.map((color) => (

                <button
                    key={color}
                    style={{
                        backgroundColor: color,
                    }}
                    onClick={(e) => {
                            e.stopPropagation();
                            onSelectColor(color);
                        }

                    }


                />

            ))}

        </div>

    );
}
