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


import NoteGrid from "../NoteGrid/NoteGrid";





// ---- types ----
import type { Note } from "../../../../types/note";





type Props = {
    notes: Note[];

    setNotes: React.Dispatch<
        React.SetStateAction<Note[]>
    >;

    enableSort: boolean;

};





// 親: NotesPage.tsx、LabelNotesPage.tsx、FavoriteNotesPage.tsx、SearchResultsPage.tsx

export default function NoteList({
    notes,
    setNotes,
    enableSort,
}: Props) {

    const [openMenuId, setOpenMenuId] = useState<number | null>(null);  // 今どのノートのメニューが開いているかを表す。SortableNoteCardの親(NoteList)で定義することで、各ノートカード全体で共有できるようになる。ex) openMenuId = 1という状態を全カードで共有できる。
    const [openColorId, setOpenColorId] = useState<number | null>(null);
    const [openNoteDetailId, setOpenNoteDetailId] = useState<number | null>(null);
    const [panelType, setPanelType] = useState<"label" | "history" | null>(null);









    const pinnedNotes = notes.filter((note) => note.is_pinned);
    const normalNotes = notes.filter((note) => !note.is_pinned);






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












    return (

        enableSort ? (

        <DndContext  // DndContextは「drag&drop機能を有効化する範囲」。dragシステム全体管理。
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}  // ドラッグ修了時に実行される
        >

            <SortableContext  // SortableContextは並び替え機能。
                items={notes.map((note) => note.id)}  // 並び替え対象はid一覧という意味。
                strategy={rectSortingStrategy}  // グリッド並び替え。カードUI向け。
            >

                <>

                    {pinnedNotes.length > 0 && (

                    <>
                        <h3>📌 固定済み</h3>

                        <NoteGrid
                            enableSort={enableSort}
                            notes={pinnedNotes}
                            // setNotes={setNotes}
                            openMenuId={openMenuId}
                            setOpenMenuId={setOpenMenuId}
                            openColorId={openColorId}
                            setOpenColorId={setOpenColorId}
                            openNoteDetailId={openNoteDetailId}
                            setOpenNoteDetailId={setOpenNoteDetailId}
                            panelType={panelType}
                            setPanelType={setPanelType}
                            // onSave={handleSave}
                            // onUpdateColor={handleUpdateColor}
                            // onMoveToTrash={handleMoveToTrash}
                            // onToggleFavorite={handleToggleFavorite}
                            // onTogglePin={handleTogglePin}
                            // onDuplicateNote={handleDuplicateNote}
                        />

                        <h3>その他</h3>

                    </>

                    )}


                <NoteGrid
                    enableSort={enableSort}
                    notes={normalNotes}
                    // setNotes={setNotes}
                    openMenuId={openMenuId}
                    setOpenMenuId={setOpenMenuId}
                    openColorId={openColorId}
                    setOpenColorId={setOpenColorId}
                    openNoteDetailId={openNoteDetailId}
                    setOpenNoteDetailId={setOpenNoteDetailId}
                    panelType={panelType}
                    setPanelType={setPanelType}
                    // onSave={handleSave}
                    // onUpdateColor={handleUpdateColor}
                    // onMoveToTrash={handleMoveToTrash}
                    // onToggleFavorite={handleToggleFavorite}
                    // onTogglePin={handleTogglePin}
                    // onDuplicateNote={handleDuplicateNote}
                />

                </>


            </SortableContext>

        </DndContext>


        ) : (

            <>
                {pinnedNotes.length > 0 && (

                <>
                    <h3>📌 固定済み</h3>

                    <NoteGrid
                        enableSort={enableSort}
                        notes={pinnedNotes}
                        // setNotes={setNotes}
                        openMenuId={openMenuId}
                        setOpenMenuId={setOpenMenuId}
                        openColorId={openColorId}
                        setOpenColorId={setOpenColorId}
                        openNoteDetailId={openNoteDetailId}
                        setOpenNoteDetailId={setOpenNoteDetailId}
                        panelType={panelType}
                        setPanelType={setPanelType}
                        // onSave={handleSave}
                        // onUpdateColor={handleUpdateColor}
                        // onMoveToTrash={handleMoveToTrash}
                        // onToggleFavorite={handleToggleFavorite}
                        // onTogglePin={handleTogglePin}
                        // onDuplicateNote={handleDuplicateNote}
                    />

                    <h3>その他</h3>

                </>

                )}

                <NoteGrid
                    enableSort={enableSort}
                    notes={normalNotes}
                    // setNotes={setNotes}
                    openMenuId={openMenuId}
                    setOpenMenuId={setOpenMenuId}
                    openColorId={openColorId}
                    setOpenColorId={setOpenColorId}
                    openNoteDetailId={openNoteDetailId}
                    setOpenNoteDetailId={setOpenNoteDetailId}
                    panelType={panelType}
                    setPanelType={setPanelType}
                    // onSave={handleSave}
                    // onUpdateColor={handleUpdateColor}
                    // onMoveToTrash={handleMoveToTrash}
                    // onToggleFavorite={handleToggleFavorite}
                    // onTogglePin={handleTogglePin}
                    // onDuplicateNote={handleDuplicateNote}
                />

            </>

        )

    );
}



