import { useState } from "react";




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
        createNote,
        moveToTrash,
        deleteNoteImage,

    } = useNoteStore();




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
