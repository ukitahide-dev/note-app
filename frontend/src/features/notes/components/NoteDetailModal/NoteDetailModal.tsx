



// ---- css ----
import { useState } from "react";
import styles from "./NoteDetailModal.module.css";
import ColorPalette from "../../../../shared/ui/ColorPalette/ColorPalette";
import { updateNote as updateNoteApi, updateNoteColor } from "../../api/noteApi";
import NoteMenu from "../SortableNoteCard/NoteMenu/NoteMenu";
import LabelPanel from "../SortableNoteCard/LabelPanel/LabelPanel";
import { useNoteLabels } from "../../hooks/useNoteLabels";


// ---- types ----
import type { Note } from "../../../../types/note";
import { useNoteStore } from "../../store/useNoteStore";




type Props = {
    note: Note;
    // onSave: (
    //     id: number,
    //     title: string,
    //     content: string,
    // ) => Promise<void>;

    // onUpdateColor: (
    //     id: number,
    //     color: string,
    // ) => Promise<void>;

    // onMoveToTrash: (id: number) => void;


    setNotes: React.Dispatch<
        React.SetStateAction<Note[]>
    >;

    setOpenNoteDetailId:
        React.Dispatch<
            React.SetStateAction<
                number | null
            >
        >;

    // onDuplicateNote: (
    //     note: Note,
    // ) => Promise<void>;

}




// 親: NoteCard.tsx



export default function NoteDetailModal({
    note,
    setNotes,
    setOpenNoteDetailId,
    // onSave,
    // onUpdateColor,
    // onMoveToTrash,
    // onDuplicateNote,

}: Props) {



    const [title, setTitle] = useState(note.title);
    const [content, setContent] = useState(note.content);

    const [tempColor, setTempColor] = useState(note.color);

    const [panelType, setPanelType] = useState<"menu" | "color" | "label" | null>(null);





    // 色の選択をUIに表示する
    const handleSelectColor = (
        color: string
    ) => {
        setTempColor(color);
    }




    // useNoteLabels hooksを使う
    const {
        // isLabelOpen,
        // handleOpenLabel,
        selectedLabels,
        handleSelectLabel,
        handleRemoveLabel,
    } = useNoteLabels({
        note,
        setNotes,
    });




    const {
        updateNote,
        createNote,
    } = useNoteStore();





    const handleClosePalette = async () => {



        try {

            const updatedNote = await updateNoteColor(Number(note.id), tempColor);
            updateNote(updatedNote);  // useNoteStore


        } catch (error) {

            console.error(error);

        }


    }



    const handleSave = (
        id: number,
        title: string,
        content: string,
    ) => {

        updateNote(id, title, content);
        setOpenNoteDetailId(null);

    }




    // const handleSave = async (
    //     id: number,
    //     title: string,
    //     content: string,

    // ) => {

    //     try {
    //         const updatedNote = await updateNoteApi(Number(id), title, content);
    //         updateNote(updatedNote);  // useNoteStore

    //     } catch (error) {
    //         console.error(error);
    //         alert("保存失敗");
    //     }

    //     setOpenNoteDetailId(null);  // これはここに書けない。どうするか。今のままだと、閉じたときに、モーダルが開いたままになる。

    // }




    const {
        moveToTrash,
    } = useNoteStore();




    return (

        <div
            className={styles.overlay}
            onClick={() => {
                handleSave(note.id, title, content);
                handleClosePalette();

            }}
            // onClick={() => onSave(note.id, title, content)}
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
                            setPanelType("color");
                            // setIsColorOpen((prev) => !prev);
                            // setIsMenuOpen(false)
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
                            setPanelType("menu");
                            // setIsMenuOpen((prev) => !prev);
                            // setIsColorOpen(false)

                        }}
                    >
                        ⋮
                    </button>

                    <button
                        className={styles.button}
                        onClick={
                                    () => {
                                        handleSave(note.id, title, content);
                                        handleClosePalette();
                                        // onSave(note.id, title, content);
                                        // onUpdateColor(note.id, tempColor);

                                    }
                            }
                    >
                        閉じる
                    </button>

                </div>


                {panelType === "color" && (

                    <ColorPalette
                        onSelectColor={handleSelectColor}
                        // onUpdateColor={onUpdateColor}
                        // note={note}
                        tempColor={tempColor}
                        onClose={handleClosePalette}

                    />
                )}


                {panelType === "menu" && (

                    <NoteMenu
                        onOpenLabel={() => setPanelType("label")}
                        onMoveToTrash={() => moveToTrash(note.id)}
                        onDuplicateNote={
                            () =>
                                createNote(
                                    note.title,
                                    note.content,
                                    note.labels.map((label) => label.id),
                                    note.color
                                )
                        }
                        // onDuplicateNote={() => onDuplicateNote(note)}

                    />
                )}

                {panelType === "label" && (

                    <LabelPanel
                        selectedLabels={selectedLabels}
                        onSelectLabel={handleSelectLabel}

                    />
                )}

            </div>

        </div>
    );


}




// ) : (

//                         <NoteMenu
//                             onOpenLabel={handleOpenLabel}
//                             onMoveToTrash={() => moveToTrash(note.id)}
//                             onDuplicateNote={
//                                 () =>
//                                     createNote(
//                                         note.title,
//                                         note.content,
//                                         note.labels.map((label) => label.id),
//                                         note.color
//                                     )
//                             }
//                             // onDuplicateNote={() => onDuplicateNote(note)}

//                         />


//                     )
