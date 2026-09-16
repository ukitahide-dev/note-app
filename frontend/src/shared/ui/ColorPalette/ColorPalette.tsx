


// ---- css ----

import styles from "./ColorPalette.module.css";





type Props = {
    onSelectColor: (
        color: string
    ) => void;

    tempColor?: string;

    paletteRef?: React.RefObject<HTMLDivElement | null>;


    onClose?: () => void;  // onCloseを実行して、親で色変更のapiを呼ぶ形にする。onUpdateColorやnoteを渡してもらう必要がなくなる。

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
    "#5c3df5",
    "#3e7c79",
    "#a1d6a8",
];



// 親: NoteCard.tsx、NoteDetailModal.tsx、NoteForm.tsx、Header.tsx、


export default function ColorPalette({
    onSelectColor,
    paletteRef,

}: Props) {



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
                            // console.log("選択した色", color);
                            e.stopPropagation();
                            onSelectColor(color);
                        }

                    }


                />

            ))}

        </div>

    );
}
