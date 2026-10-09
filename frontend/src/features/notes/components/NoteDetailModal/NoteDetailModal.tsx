import { useEffect, useRef, useState } from "react";




// ---- css ----
import styles from "./NoteDetailModal.module.css";

import { useNoteLabels } from "../../hooks/useNoteLabels";

// ---- types ----
import type { Note } from "../../../../types/api/note";
import { useNoteStore } from "../../store/useNoteStore";
import { useNoteColor } from "../../hooks/useNoteColor";


import ImageViewer from "../ImageViewer/ImageViewer";
import { NoteLabels } from "../NoteLabels/NoteLabels";
import NoteDetailModalActions from "./NoteDetailModalActions/NoteDetailModalActions";
import NoteDetailModalImages from "./NoteDetailModalImages/NoteDetailModalImages";
import NoteDetailModalPanel from "./NoteDetailModalPanel/NoteDetailModalPanel";
import NoteDetailModalEditor from "./NoteDetailModalEditor/NoteDetailModalEditor";
import { useNoteImageViewer } from "../../hooks/useNoteImageViewer";
import useNoteDetailSession from "../../hooks/useNoteDetailSession";



type Props = {
    note: Note;

    onClose: () => void;
};



// 親: NoteList,

export default function NoteDetailModal({
    note,
    onClose,

}: Props) {


    const [title, setTitle] = useState(note.title);
    const [content, setContent] = useState(note.content);

    const [panelType, setPanelType] = useState<
        "menu" | "color" | "label" | "history" | null
    >(null);




    // hook
    const {
        selectedImageIndex,
        handleSelectImage,
        handleNextImage,
        handlePrevImage,
        handleCloseImageViewer,

    } = useNoteImageViewer(note);



    // hook
    const { tempColor, handleSelectColor, saveColor } = useNoteColor(note);


    // hook
    const {
        labelStates,
        handleSelectLabel,
        handleRemoveNoteLabel,

    } = useNoteLabels({
        note,

    });


    // hook
    const {
        handleClose,

    } = useNoteDetailSession({
        note,
        title,
        content,
        tempColor,
        onClose,

    });



    // Store
    const {
        // updateNote,
        // updateNoteColor,
        createNote,
        moveToTrash,
        deleteNoteImage,
        // incrementNoteView,
        // updateNoteViewTime,


    } = useNoteStore();





    // useRefの理由: 値を保存しておきたいけど、その値が変わったことで再レンダリングする必要はないから。
    // const closed = useRef(false);   // { current: false }

    // const viewed = useRef(false);   // このモーダルはもう閲覧数加算処理を実行したか？を記録する箱。{ current: false }
    // const startTime = useRef(0);    // ノート詳細を開いた瞬間の時刻を保存しておく箱。{ current: 0 }という箱ができる。



    // const handleClose = async () => {

    //     if (closed.current) {   // モーダルを閉じる処理を、1回だけ実行するためのストッパー。APIを複数回呼ぶ可能性を消している。
    //         return;
    //     }

    //     closed.current = true;

    //     const seconds = Math.floor((Date.now() - startTime.current) / 1000);

    //     await updateNoteViewTime(note.id, seconds);


    //     if (title !== note.title || content !== note.content) {
    //         await updateNote(note.id, title, content);
    //     }

    //     if (tempColor !== note.color) {
    //         await updateNoteColor(note.id, tempColor);
    //         // await saveColor();  // ここでuseNoteColor hookを経由する意味がない気がする
    //     }

    //     onClose(); // 親に閉じてとお願いするだけ。閉じ方は親が知っている。

    // };




    // useEffect(() => {

    //     if (viewed.current) {   // Reactの開発環境で StrictMode が有効のせいで、useEffectが2回実行され、閲覧数が+2される。それを防ぐためのコード。
    //         return;
    //     }

    //     startTime.current = Date.now();

    //     viewed.current = true;

    //     incrementNoteView(note.id);

    // }, [note.id]);   // note.id が変わったときに、この処理を実行する







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

                <div
                    className={styles.main}
                >

                    <NoteDetailModalImages
                        note={note}
                        onDeleteImage={(imageId: number) => {
                            deleteNoteImage(note.id, imageId);
                        }}
                        onSelectImage={handleSelectImage}
                    />


                    <NoteDetailModalEditor
                        title={title}
                        content={content}
                        onChangeTitle={setTitle}
                        onChangeContent={setContent}
                        backgroundColor={tempColor}
                    />


                    <div className={styles.labels}>

                        <NoteLabels
                            labels={note.labels}
                            onRemoveLabel={handleRemoveNoteLabel}
                        />

                    </div>


                </div>


                <NoteDetailModalActions
                    onOpenColor={() => setPanelType("color")}
                    onOpenMenu={() => setPanelType("menu")}
                    onClose={handleClose}
                />


                <NoteDetailModalPanel
                    panelType={panelType}

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

                    tempColor={tempColor}
                    onSelectColor={handleSelectColor}
                    onCloseColor={saveColor}

                    labelStates={labelStates}
                    onSelectLabel={handleSelectLabel}

                    note={note}
                    onCloseHistory={() => setPanelType(null)}

                />

            </div>

        </div>


        {selectedImageIndex !== null && (

            <ImageViewer
                images={note.images}
                currentIndex={selectedImageIndex}
                onClose={handleCloseImageViewer}
                onNext={handleNextImage}
                onPrev={handlePrevImage}

            />


        )}

        </>

    );
}
