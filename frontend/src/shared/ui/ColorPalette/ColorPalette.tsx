


// ---- css ----
import { useEffect, useRef } from "react";
import styles from "./ColorPalette.module.css";



type Props = {
    onSelectColor: (
        color: string
    ) => void;

    onClose: () => void;
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
    onClose,
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
                handleOutsideClick
            );
        };

    }, [onClose]);





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
