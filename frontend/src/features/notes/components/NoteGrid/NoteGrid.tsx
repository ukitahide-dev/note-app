import NoteCard from "../NoteCard/NoteCard";
import SortableNoteCard from "../SortableNoteCard/SortableNoteCard";


import styles from './NoteGrid.module.css';


// ---- types ----
import type { Note } from "../../../../types/note";






type Props = {
    enableSort: boolean;

    notes: Note[];



    openMenuId: number | null;

    openColorId: number | null;
    setOpenColorId: React.Dispatch<
            React.SetStateAction<
                number | null
            >
        >;



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

    panelType: "label" | null;

    setPanelType: React.Dispatch<
            React.SetStateAction<
                "label" | null
            >
        >;

    dragHandleProps?: any;

};



export default function NoteGrid ({
    enableSort,
    notes,

    openMenuId,
    setOpenMenuId,
    openColorId,
    setOpenColorId,
    openNoteDetailId,
    setOpenNoteDetailId,
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
                    
                    openMenuId={openMenuId}
                            setOpenMenuId={setOpenMenuId}
                            openColorId={openColorId}
                            setOpenColorId={setOpenColorId}
                            openNoteDetailId={openNoteDetailId}
                            setOpenNoteDetailId={setOpenNoteDetailId}
                            panelType={panelType}
                            setPanelType={setPanelType}

                        />
            ))}

        </div>


    )


}
