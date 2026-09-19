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


import {
    DndContext,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";


import {
    SortableContext,
    rectSortingStrategy,

} from "@dnd-kit/sortable";
import { useSortableNoteImages } from "../../hooks/useSortableNoteImages";
import ImageViewer from "../ImageViewer/ImageViewer";


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


    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);



    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,     // 8px以上動かしたら「ドラッグ」と判断する。
            },
        }),
    );



    // hooks
    const { tempColor, handleSelectColor, saveColor } = useNoteColor(note);


    // hooks
    const { labelStates, handleSelectLabel, handleRemoveNoteLabel } = useNoteLabels(
        {
            note,
        },
    );


    // hooks
    const {
        handleDragEnd,

    } = useSortableNoteImages(note.images, note.id)


    // Store
    const {
        updateNote,
        updateNoteColor,
        createNote,
        moveToTrash,
        deleteNoteImage,
        incrementNoteView,
        updateNoteViewTime,


    } = useNoteStore();


    // utils
    const {
        largeImages,
        normalImages,

    } = splitImages(note.images);


    // useRefの理由: 値を保存しておきたいけど、その値が変わったことで再レンダリングする必要はないから。
    const closed = useRef(false);   // { current: false }

    const viewed = useRef(false);   // このモーダルはもう閲覧数加算処理を実行したか？を記録する箱。{ current: false }
    const startTime = useRef(0);    // ノート詳細を開いた瞬間の時刻を保存しておく箱。{ current: 0 }という箱ができる。



    const handleClose = async () => {

        if (closed.current) {   // モーダルを閉じる処理を、1回だけ実行するためのストッパー。APIを複数回呼ぶ可能性を消している。
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





    const handleSelectImage = (
        imageId: number,

    ) => {

        console.log("handleSelectImage")

        const index = note.images.findIndex((image) => image.id === imageId);

        if (index === -1) return;


        setSelectedImageIndex(index);


    };



    const handleNextImage = () => {

        if (selectedImageIndex === null) return;
        if (selectedImageIndex >= note.images.length - 1) return;

        setSelectedImageIndex(selectedImageIndex + 1);
    };


    const handlePrevImage = () => {

        if (selectedImageIndex === null) return;
        if (selectedImageIndex <= 0) return;

        setSelectedImageIndex(selectedImageIndex - 1);
    };



    
    useEffect(() => {

        if (viewed.current) {   // Reactの開発環境で StrictMode が有効のせいで、useEffectが2回実行され、閲覧数が+2される。それを防ぐためのコード。
            return;
        }

        startTime.current = Date.now();

        viewed.current = true;

        incrementNoteView(note.id);

    }, [note.id]);   // note.id が変わったときに、この処理を実行する












    return (

        <>

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
                    sensors={sensors}
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
                                onDeleteImage={(imageId) => {
                                    deleteNoteImage(note.id, imageId);
                                }}
                                onSelectImage={handleSelectImage}
                            />

                        </div>

                        <div className={styles.images}>

                            <ImageList
                                images={normalImages}
                                isLarge={false}
                                noteId={note.id}
                                onDeleteImage={(imageId: number) => {
                                    deleteNoteImage(note.id, imageId);
                                }}
                                onSelectImage={handleSelectImage}
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

        {selectedImageIndex !== null && (

            <ImageViewer
                images={note.images}
                currentIndex={selectedImageIndex}
                onClose={() => setSelectedImageIndex(null)}
                onNext={handleNextImage}
                onPrev={handlePrevImage}
                // onNext={() => setSelectedImageIndex(selectedImageIndex + 1)}
                // onPrev={() => setSelectedImageIndex(selectedImageIndex - 1)}
            />


        )}

        </>

    );
}
