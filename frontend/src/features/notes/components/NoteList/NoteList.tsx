// ---- react ----
import { useState } from "react";

// ---- dnd ----
import { DndContext, closestCenter } from "@dnd-kit/core";

import {
    arrayMove,
    SortableContext,
    rectSortingStrategy,
} from "@dnd-kit/sortable";

import NoteGrid from "../NoteGrid/NoteGrid";

// ---- types ----
import type { Note } from "../../../../types/api/note";
import type { NoteContext } from "../../../../types/ui/noteContext";

import { useNoteStore } from "../../store/useNoteStore";
import SortSelect from "../SortSelect/SortSelect";

import styles from "./NoteList.module.css";
import NoteDetailModal from "../NoteDetailModal/NoteDetailModal";



//  NoteList が、「自分は通常ページなのか？」「検索ページなのか？」「お気に入りページなのか？」を知れる。
// type NoteContext =
//     | "notes"
//     | "search"
//     | "label"
//     | "favorite";


type Props = {
    notes: Note[];
    pinnedNotes: Note[];

    enableSort: boolean;

    context: NoteContext;

};







// 親: NotesPage.tsx、LabelNotesPage.tsx、FavoriteNotesPage.tsx、SearchResultsPage.tsx

export default function NoteList({
    notes,
    pinnedNotes,
    enableSort,
    context,

}: Props) {

    const [openMenuId, setOpenMenuId] = useState<number | null>(null);   // 今どのノートのメニューが開いているかを表す。NoteCardの親(NoteList)で定義することで、各ノートカード全体で共有できるようになる。ex) openMenuId = 1という状態を全カードで共有できる。
    const [openColorId, setOpenColorId] = useState<number | null>(null);
    // const [openNoteDetailId, setOpenNoteDetailId] = useState<number | null>(
    //     null,
    // );

    const [openColor, setOpenColor] = useState<{
        noteId: number;
        context: NoteContext;
    } | null>(null);


    const [selectedNote, setSelectedNote] = useState<Note | null>(null);


    const [panelType, setPanelType] = useState<"label" | "history" | null>(
        null,
    );

    const [isPinnedOpen, setIsPinnedOpen] = useState(true);


    const {
        reorderNotes,
        reorderPinnedNotes,

        ordering,
        setOrdering,

        pinnedOrdering,
        setPinnedOrdering,

    } = useNoteStore();


    const noteGridProps = {
        openMenuId, // 省略記法: 本当は、openMenuId: openMenuId
        setOpenMenuId,
        openColorId,
        setOpenColorId,

        openColor,
        setOpenColor,
        // openNoteDetailId,
        // setOpenNoteDetailId,
        selectedNote,
        setSelectedNote,
        panelType,
        setPanelType,

    };



    const canSortNormalNotes = enableSort && ordering === "order";
    const canSortPinnedNotes = enableSort && pinnedOrdering === "pinned_order";



    // ドラッグ終了時に実行される関数
    const handleNormalDragEnd = (event: any) => {

        const { active, over } = event; // event.active, event.overを分割代入で取得。active: ドラッグしてた要素。over: 上に乗った(移動先の)相手。

        if (!over) return; // 移動先の相手がいないなら終了
        if (active.id === over.id) return; // 同じ場所なら何もしない

        const oldIndex = notes.findIndex((note) => note.id === active.id);
        const newIndex = notes.findIndex((note) => note.id === over.id);

        const newNotes = arrayMove(
            notes, // 並び替え対象の配列
            oldIndex, // 移動させたい要素の現在位置
            newIndex, // 移動先位置
        );

        reorderNotes(newNotes);
    };


    const handlePinnedDragEnd = (event: any) => {

        const { active, over } = event;

        if (!over) return;
        if (active.id === over.id) return;

        const oldIndex = pinnedNotes.findIndex((note) => note.id === active.id);
        const newIndex = pinnedNotes.findIndex((note) => note.id === over.id);

        const newPinnedNotes = arrayMove(pinnedNotes, oldIndex, newIndex);

        reorderPinnedNotes(newPinnedNotes);

    };






    return (

        <>

            {/* 📌 固定済みノート */}
            {pinnedNotes.length > 0 && (

                <section
                    className={`${styles.pinnedSection} ${
                        isPinnedOpen ? styles.pinnedOpen : styles.pinnedClosed
                    }`}
                >

                    <button
                        className={styles.pinnedHeader}
                        onClick={() => setIsPinnedOpen((prev) => !prev)}
                    >

                        <span className={styles.pinnedTitle}>

                            📌 固定済み
                            <span className={styles.pinnedCount}>
                                {pinnedNotes.length}件
                            </span>

                        </span>

                        <span className={styles.pinnedArrow}>
                            {isPinnedOpen ? "▲" : "▼"}
                        </span>

                    </button>


                    {isPinnedOpen && (

                    <div className={styles.pinnedContent}>

                        <SortSelect
                            ordering={pinnedOrdering}
                            onPageOrderChange={setPinnedOrdering}
                            manualOrderValue="pinned_order"
                        />

                        {canSortPinnedNotes ? (

                            <DndContext
                                collisionDetection={closestCenter}
                                onDragEnd={handlePinnedDragEnd}
                            >
                                <SortableContext
                                    items={pinnedNotes.map((note) => note.id)}
                                    strategy={rectSortingStrategy}
                                >
                                    <NoteGrid
                                        {...noteGridProps}
                                        enableSort={true}
                                        notes={pinnedNotes}
                                        context="pinned"
                                    />
                                </SortableContext>
                            </DndContext>

                        ) : (

                            <NoteGrid
                                {...noteGridProps}
                                enableSort={false}
                                notes={pinnedNotes}
                                context="pinned"
                            />

                        )}

                    </div>

                    )}
                </section>


            )}

            <h3>その他</h3>

            <SortSelect
                ordering={ordering}
                onPageOrderChange={setOrdering}
                manualOrderValue={"order"}
            />

            {/* 📝 通常ノート */}
            {canSortNormalNotes ? (
                // 通常ノートが「手動順」のときだけD&Dを有効にする
                <DndContext
                    collisionDetection={closestCenter}
                    onDragEnd={handleNormalDragEnd}
                >

                    <SortableContext
                        items={notes.map((note) => note.id)}
                        strategy={rectSortingStrategy}
                    >

                        <NoteGrid
                            {...noteGridProps}
                            enableSort={true}
                            notes={notes}
                            context={context}
                        />

                    </SortableContext>

                </DndContext>

            ) : (

                // 通常ノートが「手動順」以外なら通常表示
                <NoteGrid
                    {...noteGridProps}
                    enableSort={false}
                    notes={notes}
                    context={context}
                />

            )}

            {selectedNote && (
                <NoteDetailModal
                    note={selectedNote}
                    onClose={() => setSelectedNote(null)}
                />
            )}

        </>

    );
}
