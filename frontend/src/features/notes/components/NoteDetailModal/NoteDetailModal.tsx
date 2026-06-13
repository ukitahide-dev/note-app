



// ---- css ----
import { useState } from "react";
import styles from "./NoteDetailModal.module.css";
import ColorPalette from "../../../../shared/ui/ColorPalette/ColorPalette";
import { updateNoteColor } from "../../api/noteApi";



type Label = {
    id: number;
    name: string;


}


type Note = {
    id: number;
    title: string;
    content: string;
    color: string;
    is_favorite: boolean;
    labels:  Label[];  // labelsはLabel型の配列。ex) labels: [{id: 1, name: "ゲーム"}, {id: 2, name: "本"}]
};


type Props = {
    note: Note;
    onSave: (
        id: number,
        title: string,
        content: string,
    ) => Promise<void>;

    onUpdateColor: (
        id: number,
        color: string,
    ) => Promise<void>


    // setNotes: React.Dispatch<
    //     React.SetStateAction<Note[]>
    // >;

}




// 親: NoteCard.tsx



export default function NoteDetailModal({
    note,
    onSave,
    onUpdateColor,
    // setNotes,



}: Props) {



    const [title, setTitle] = useState(note.title);
    const [content, setContent] = useState(note.content);
    const [isColorOpen, setIsColorOpen] = useState(false);
    const [tempColor, setTempColor] = useState(note.color);




    // 色の選択をUIに表示する
    const handleSelectColor = (
        color: string
    ) => {
        setTempColor(color);
    }


    // handleUpdateColorをNoteListに書いたから、これが不要になった。
    // ColorPaletteを閉じたときだけ、DBに変更を伝える。
    // const handleClosePalette = async () => {

    //     try {

    //         const updatedNote = await updateNoteColor(note.id, tempColor);

    //         setNotes((prev) => (
    //             prev.map((n) =>
    //                 n.id === note.id ? updatedNote : n
    //             )
    //         ));

    //     } catch (error) {

    //         console.error(error);

    //     }

    // }




    return (

        <div
            className={styles.overlay}
            onClick={() => onSave(note.id, title, content)}
        >

            <div
                className={styles.modal}
                style={{ backgroundColor: tempColor }}
                onClick={(e) => e.stopPropagation()}
            >

                <input
                    className={styles.titleInput}
                    style={{ backgroundColor: tempColor }}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <textarea
                    className={styles.contentInput}
                    style={{ backgroundColor: tempColor }}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />


                <div className={styles.bottom}>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsColorOpen(true);
                            // setOpenMenuId(null);
                            // setOpenColorId((prev) => prev === note.id ? null : note.id);
                        }}
                    >
                        🎨
                    </button>

                    <button
                        className={styles.menuButton}
                        onClick={(e) => {
                            e.stopPropagation();
                            // setIsLabelOpen(false);
                            // setOpenColorId(null);
                            // setOpenMenuId((prev) => prev === note.id ? null : note.id);
                        }}
                    >
                        ⋮
                    </button>

                    <button
                        className={styles.button}
                        onClick={
                                    () => {
                                        onSave(note.id, title, content);
                                        onUpdateColor(note.id, tempColor);
                                        // handleClosePalette();
                                    }
                            }
                    >
                        閉じる
                    </button>

                </div>



                {isColorOpen && (

                    <ColorPalette
                        onSelectColor={handleSelectColor}
                        onUpdateColor={onUpdateColor}
                        note={note}
                        tempColor={tempColor}
                        // onClose={handleClosePalette}

                    />
                )}





            </div>

        </div>
    );









}
