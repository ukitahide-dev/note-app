import NoteCard from "../NoteCard/NoteCard";
import SortableNoteCard from "../SortableNoteCard/SortableNoteCard";

import styles from "./NoteGrid.module.css";

// ---- types ----
import type { Note } from "../../../../types/api/note";
import type { NoteContext } from "../../../../types/ui/noteContext";



type Props = {
    enableSort: boolean;

    notes: Note[];

    context: NoteContext;

    // openMenuId: number | null;
    // setOpenMenuId: React.Dispatch<React.SetStateAction<number | null>>;

    openMenu: {
        noteId: number;
        context: NoteContext;
    } | null;

    setOpenMenu: React.Dispatch<
        React.SetStateAction<{
            noteId: number;
            context: NoteContext;
        } | null>
    >;

    openColor: {
        noteId: number;
        context: NoteContext;
    } | null;

    setOpenColor: React.Dispatch<
        React.SetStateAction<{
            noteId: number;
            context: NoteContext;
        } | null>
    >;

    // openColorId: number | null;
    // setOpenColorId: React.Dispatch<React.SetStateAction<number | null>>;


    // openNoteDetailId: number | null;
    // setOpenNoteDetailId: React.Dispatch<React.SetStateAction<number | null>>;

    // selectedNote: Note | null;

    // setSelectedNote: React.Dispatch<
    //     React.SetStateAction<Note | null>
    // >;
    setSelectedNoteId: React.Dispatch<
        React.SetStateAction<number | null>
    >;

    panelType: "label" | "history" | null;

    setPanelType: React.Dispatch<
        React.SetStateAction<"label" | "history" | null>
    >;

    dragHandleProps?: any;
};



export default function NoteGrid({
    enableSort,
    notes,

    context,

    openColor,
    setOpenColor,

    // openMenuId,
    // setOpenMenuId,
    openMenu,
    setOpenMenu,
    // openColorId,
    // setOpenColorId,

    // selectedNote,
    // setSelectedNote,
    setSelectedNoteId,
    // openNoteDetailId,
    // setOpenNoteDetailId,
    panelType,
    setPanelType,

}: Props) {


    const CardComponent = enableSort ? SortableNoteCard : NoteCard;



    return (

        <div className={styles.notesContainer}>

            {notes.map((note) => (

                <CardComponent
                    key={note.id}
                    note={note}
                    context={context}
                    openColor={openColor}
                    setOpenColor={setOpenColor}
                    // openMenuId={openMenuId}
                    // setOpenMenuId={setOpenMenuId}
                    openMenu={openMenu}
                    setOpenMenu={setOpenMenu}
                    // openColorId={openColorId}
                    // setOpenColorId={setOpenColorId}
                    // openNoteDetailId={openNoteDetailId}
                    // setOpenNoteDetailId={setOpenNoteDetailId}
                    // selectedNote={selectedNote}
                    setSelectedNoteId={setSelectedNoteId}
                    // setSelectedNote={setSelectedNote}
                    panelType={panelType}
                    setPanelType={setPanelType}
                />

            ))}

        </div>
    );
}
