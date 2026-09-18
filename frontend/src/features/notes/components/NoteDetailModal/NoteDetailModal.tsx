import { useEffect, useRef, useState } from "react";

// ---- component ----
import NoteMenu from "../SortableNoteCard/NoteMenu/NoteMenu";
import LabelPanel from "../SortableNoteCard/LabelPanel/LabelPanel";
import { HistoryPanel } from "../HistoryPanel/HistoryPanel";
import { ImageList } from "../ImageList/ImageList";
import LabelItem from "../LabelItem/LabelItem";

// ---- css ----
import styles from "./NoteDetailModal.module.css";

import ColorPalette from "../../../../shared/ui/ColorPalette/ColorPalette";
import { useNoteLabels } from "../../hooks/useNoteLabels";

// ---- types ----
import type { Note } from "../../../../types/api/note";
import { useNoteStore } from "../../store/useNoteStore";
import { useNoteColor } from "../../hooks/useNoteColor";

// ---- utils ----
import { splitImages } from "../../utils/splitImages";


import type { DragEndEvent } from "@dnd-kit/core";

import { DndContext } from "@dnd-kit/core";

import {
    SortableContext,
    rectSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable";
import { useSortableNoteImages } from "../../hooks/useSortableNoteImages";


type Props = {
    note: Note;

    onClose: () => void;
};



// 親: NoteCard.tsx

export default function NoteDetailModal({
    note,
    onClose,

}: Props) {


    const [title, setTitle] = useState(note.title);
    const [content, setContent] = useState(note.content);

    const [panelType, setPanelType] = useState<
        "menu" | "color" | "label" | "history" | null
    >(null);


    // hooks
    const { tempColor, handleSelectColor, saveColor } = useNoteColor(note);


    // hooks
    const { labelStates, handleSelectLabel, handleRemoveNoteLabel } = useNoteLabels(
        {
            note,
        },
    );


    // Store
    const {
        updateNote,
        updateNoteColor,
        createNote,
        moveToTrash,
        deleteNoteImage,
        incrementNoteView,
        updateNoteViewTime,
        updateNoteImageOrder,

    } = useNoteStore();


    // utils
    const {
        largeImages,
        normalImages

    } = splitImages(note.images);


    const closed = useRef(false);


    const handleClose = async () => {

        if (closed.current) {
            return;
        }

        closed.current = true;

        const seconds = Math.floor((Date.now() - startTime.current) / 1000);

        await updateNoteViewTime(note.id, seconds);


        if (title !== note.title || content !== note.content) {
            await updateNote(note.id, title, content);
        }

        if (tempColor !== note.color) {
            await updateNoteColor(note.id, tempColor);
            // await saveColor();  // ここでuseNoteColor hookを経由する意味がない気がする
        }

        onClose(); // 親に閉じてとお願いするだけ。閉じ方は親が知っている。

    };


    const viewed = useRef(false); // このモーダルはもう閲覧数加算処理を実行したか？を記録する箱。{ current: false }
    const startTime = useRef(0); // ノート詳細を開いた瞬間の時刻を保存しておく箱。{ current: 0 }という箱ができる。


    useEffect(() => {
        if (viewed.current) {
            return;
        }

        startTime.current = Date.now();

        viewed.current = true;

        incrementNoteView(note.id);

    }, [note.id]);



    // hooks 
    const {
        handleDragEnd,

    } = useSortableNoteImages(note.images, note.id)




    // const handleDragEnd = async (event: DragEndEvent) => {

    //     const { active, over } = event;

    //     if (!over) return;

    //     if (active.id === over.id) return;


    //     const oldIndex = note.images.findIndex(
    //         (image) => image.id === active.id
    //     );


    //     const newIndex = note.images.findIndex(
    //         (image) => image.id === over.id
    //     );


    //     if (oldIndex === -1 || newIndex === -1) return;


    //     const newImages = arrayMove(
    //         note.images,
    //         oldIndex,
    //         newIndex
    //     );

    //     await updateNoteImageOrder(note.id, newImages);

    // };




    return (

        <div
            className={styles.overlay}
            onClick={handleClose}
        >

            <div
                className={styles.modal}
                style={{ backgroundColor: tempColor }}
                onClick={(e) => e.stopPropagation()}
            >

                <DndContext
                    onDragEnd={handleDragEnd}
                >

                    <SortableContext
                        items={note.images.map((image) => image.id)}
                        strategy={rectSortingStrategy}
                    >

                        <div className={styles.largeImages}>

                            <ImageList
                                images={largeImages}
                                isLarge={true}
                                noteId={note.id}
                                onDeleteImage={async (imageId) => {
                                    await deleteNoteImage(note.id, imageId);
                                }}
                            />

                        </div>

                        <div className={styles.images}>

                            <ImageList
                                images={normalImages}
                                isLarge={false}
                                noteId={note.id}
                                onDeleteImage={async (imageId: number) => {
                                    await deleteNoteImage(note.id, imageId);
                                }}
                            />

                        </div>

                    </SortableContext>

                </DndContext>

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
                    {note.labels.map((label) => (
                        <LabelItem
                            label={label}
                            onRemoveLabel={(labelId: number) =>
                                handleRemoveNoteLabel(labelId)
                            }
                        />
                    ))}
                </div>

                {/* ボタン表示もNoteCardと被っている */}
                <div className={styles.bottom}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setPanelType("color");
                        }}
                    >
                        🎨
                    </button>

                    <button
                        className={styles.menuButton}
                        onClick={(e) => {
                            e.stopPropagation();
                            setPanelType("menu");
                        }}
                    >
                        ⋮
                    </button>

                    <button className={styles.button} onClick={handleClose}>
                        閉じる
                    </button>
                </div>


                {panelType === "color" && (
                    <ColorPalette
                        onSelectColor={handleSelectColor}
                        tempColor={tempColor}
                        onClose={saveColor}
                    />
                )}


                {panelType === "menu" && (
                    <NoteMenu
                        onOpenLabel={() => setPanelType("label")}
                        onOpenHistory={() => setPanelType("history")}
                        onMoveToTrash={() => moveToTrash(note.id)}
                        onDuplicateNote={() =>
                            createNote(
                                note.title,
                                note.content,
                                note.labels.map((label) => label.id),
                                note.color,
                            )
                        }
                    />
                )}


                {panelType === "label" && (
                    <LabelPanel
                        labelStates={labelStates}
                        onSelectLabel={handleSelectLabel}
                    />
                )}


                {panelType === "history" && (
                    <HistoryPanel
                        note={note}
                        onClose={() => setPanelType(null)}
                    />
                )}

            </div>

        </div>

    );
}
