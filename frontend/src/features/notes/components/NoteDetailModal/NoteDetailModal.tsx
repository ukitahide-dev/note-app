



// ---- css ----
import { useState } from "react";
import styles from "./NoteDetailModal.module.css";
import ColorPalette from "../../../../shared/ui/ColorPalette/ColorPalette";
import { updateNoteColor } from "../../api/noteApi";
import NoteMenu from "../SortableNoteCard/NoteMenu/NoteMenu";
import LabelPanel from "../SortableNoteCard/LabelPanel/LabelPanel";
import { useNoteLabels } from "../../hooks/useNoteLabels";



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
    ) => Promise<void>;

    onMoveToTrash: (id: number) => void;


    setNotes: React.Dispatch<
        React.SetStateAction<Note[]>
    >;

}




// 親: NoteCard.tsx



export default function NoteDetailModal({
    note,
    setNotes,
    onSave,
    onUpdateColor,
    // menuRef,
    onMoveToTrash,
    // setIsLabelOpen,
    // setNotes,



}: Props) {



    const [title, setTitle] = useState(note.title);
    const [content, setContent] = useState(note.content);
    const [isColorOpen, setIsColorOpen] = useState(false);
    const [tempColor, setTempColor] = useState(note.color);

    // const [isLabelOpen, setIsLabelOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);




    // 色の選択をUIに表示する
    const handleSelectColor = (
        color: string
    ) => {
        setTempColor(color);
    }




    // useNoteLabels hooksを使う
    const {
        isLabelOpen,
        handleOpenLabel,
        selectedLabels,
        handleSelectLabel,
        handleRemoveLabel,
    } = useNoteLabels({
        note,
        setNotes,
    });






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

                {/* ノートが所持しているラベル名表示 NoteCardと被っている*/}
                <div className={styles.labels}>

                    {note.labels.map((label) =>

                        <div
                            key={label.id}
                            className={styles.label}
                        >
                            <span

                            >
                                {label.name}
                            </span>

                            <button
                                className={styles.removeLabel}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveLabel(
                                        label.id
                                    );
                                }}
                            >
                                ×
                            </button>

                        </div>


                    )}



                </div>

                {/* ボタン表示もNoteCardと被っている */}
                <div className={styles.bottom}>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsColorOpen((prev) => !prev);
                            setIsMenuOpen(false)
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
                            setIsMenuOpen((prev) => !prev);
                            setIsColorOpen(false)
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


                {isMenuOpen && (

                    isLabelOpen ? (

                        <LabelPanel
                            selectedLabels={selectedLabels}
                            onSelectLabel={handleSelectLabel}

                        />

                    ) : (

                        <NoteMenu
                            noteId={note.id}
                            onOpenLabel={handleOpenLabel}
                            onMoveToTrash={onMoveToTrash}

                        />


                    )


                )}

            </div>

        </div>
    );









}
