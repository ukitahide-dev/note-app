import NoteCard from "../NoteCard/NoteCard";
import SortableNoteCard from "../SortableNoteCard/SortableNoteCard";


import styles from './NoteGrid.module.css';


// ---- types ----
import type { Note } from "../../../../types/note";






type Props = {
    enableSort: boolean;

    notes: Note[];

    setNotes: React.Dispatch<
        React.SetStateAction<Note[]>
    >;

    openMenuId: number | null;

    openColorId: number | null;
    setOpenColorId: React.Dispatch<
            React.SetStateAction<
                number | null
            >
        >;

    // onMoveToTrash: (id: number) => void;

    setOpenMenuId:
        React.Dispatch<
            React.SetStateAction<
                number | null
            >
        >;

    openNoteDetailId: number | null;
    setOpenNoteDetailId: React.Dispatch<
            React.SetStateAction<
                number | null
            >
        >;

    // onSave: (
    //     id: number,
    //     title: string,
    //     content: string,
    // ) => Promise<void>

    // onUpdateColor: (
    //     id: number,
    //     color: string,
    // ) => Promise<void>

    dragHandleProps?: any;

    onToggleFavorite: (
        id: number,
        is_favorite: boolean,
    ) => Promise<void>;

    onTogglePin: (
        id: number,
        is_pinned: boolean,
    ) => Promise<void>;


    // onDuplicateNote: (
    //     note: Note,
    // ) => Promise<void>;
};



export default function NoteGrid ({
    enableSort,
    notes,
    setNotes,
    openMenuId,
    setOpenMenuId,
    openColorId,
    setOpenColorId,
    openNoteDetailId,
    setOpenNoteDetailId,
    // onSave,
    // onUpdateColor,
    // onMoveToTrash,
    onToggleFavorite,
    onTogglePin,
    // onDuplicateNote,

}: Props) {



    const CardComponent = enableSort ? SortableNoteCard : NoteCard;





    return (


        <div className={styles.notesContainer}>

            {notes.map((note) => (

                <CardComponent
                    key={note.id}
                    note={note}
                    setNotes={setNotes}
                    openMenuId={openMenuId}
                            setOpenMenuId={setOpenMenuId}
                            openColorId={openColorId}
                            setOpenColorId={setOpenColorId}
                            openNoteDetailId={openNoteDetailId}
                            setOpenNoteDetailId={setOpenNoteDetailId}
                            // onSave={onSave}
                            // onUpdateColor={onUpdateColor}
                            // onMoveToTrash={onMoveToTrash}
                            onToggleFavorite={onToggleFavorite}
                            onTogglePin={onTogglePin}
                            // onDuplicateNote={onDuplicateNote}
                        />
            ))}

        </div>


    )






}
