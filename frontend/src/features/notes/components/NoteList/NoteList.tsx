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

export default function NoteList({
    notes,
    setNotes,
}: Props) {

    const [openMenuId, setOpenMenuId] = useState<number | null>(null);




    // ドラッグ終了時に実行される関数
    const handleDragEnd = (event: any) => {

        const { active, over } = event;  // event.active, event.overを分割代入で取得。active: ドラッグしてた要素。over: 上に乗った(移動先の)相手。

        if (!over) return;  // 上に乗った相手がいないなら終了
        if (active.id === over.id) return;  // 同じ場所なら何もしない

        setNotes((prev) => {  // prevは更新直前の最新のstate

            const oldIndex =
                prev.findIndex(
                    (note) => note.id === active.id
                );

            const newIndex =
                prev.findIndex(
                    (note) => note.id === over.id
                );

            return arrayMove(
                prev,  // 並び替え対象の配列
                oldIndex,  // 移動させたい要素の現在位置
                newIndex  // 移動先位置
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

        <DndContext  // DndContextは「drag&drop機能を有効化する範囲」。dragシステム全体管理。
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}  // ドラッグ修了時に実行される
        >

            <SortableContext  // SortableContextは並び替え機能。
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
