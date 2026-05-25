// ---- react ----
import { useState } from "react";

// ---- dnd ----
import {
    DndContext,
    closestCenter,
} from "@dnd-kit/core";

import {
    arrayMove,
    SortableContext,
    rectSortingStrategy,
} from "@dnd-kit/sortable";

// ---- api ----
import { moveToTrash } from "../../api/noteApi";

// ---- components ----
import SortableNoteCard from "../SortableNoteCard/SortableNoteCard";

// ---- css ----
import styles from "./NoteList.module.css";





type Label = {
    id: number;
    name: string;
};


type Note = {
    id: number;
    title: string;
    content: string;
    labels: Label[];
};


type Props = {
    notes: Note[];

    setNotes: React.Dispatch<
        React.SetStateAction<Note[]>
    >;
};





// 親: NotesPage.tsx

export default function NotesList({
    notes,
    setNotes,
}: Props) {

    const [openMenuId, setOpenMenuId] = useState<number | null>(null);



    
    // ---- drag ----
    const handleDragEnd = (event: any) => {

        const { active, over } = event;

        if (!over) return;
        if (active.id === over.id) return;

        setNotes((prev) => {

            const oldIndex =
                prev.findIndex(
                    (note) => note.id === active.id
                );

            const newIndex =
                prev.findIndex(
                    (note) => note.id === over.id
                );

            return arrayMove(
                prev,
                oldIndex,
                newIndex
            );
        });
    };



    const handleMoveToTrash = async (
        id: number
    ) => {

        try {

            await moveToTrash(id);

            setNotes((prev) =>
                prev.filter(
                    (note) => note.id !== id
                )
            );

        } catch (error) {

            console.error(error);

        }
    };






    return (

        <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >

            <SortableContext
                items={notes.map((note) => note.id)}  // 並び替え対象はid一覧という意味。
                strategy={rectSortingStrategy}  // グリッド並び替え。カードUI向け。
            >

                <div className={styles.notesContainer}>

                    {notes.map((note) => (

                        <SortableNoteCard
                            key={note.id}
                            note={note}
                            openMenuId={openMenuId}
                            setOpenMenuId={setOpenMenuId}
                            onMoveToTrash={handleMoveToTrash}
                        />

                    ))}

                </div>

            </SortableContext>

        </DndContext>
    );
}
