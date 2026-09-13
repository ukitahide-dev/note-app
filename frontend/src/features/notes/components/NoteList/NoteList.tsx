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
import type { Note } from "../../../../types/note";
import { useNoteStore } from "../../store/useNoteStore";
import SortSelect from "../SortSelect/SortSelect";


type Props = {
    notes: Note[];
    pinnedNotes: Note[];
    // setNotes: React.Dispatch<
    //     React.SetStateAction<Note[]>
    // >;

    enableSort: boolean;
};




// 親: NotesPage.tsx、LabelNotesPage.tsx、FavoriteNotesPage.tsx、SearchResultsPage.tsx


export default function NoteList({
    notes,
    pinnedNotes,
    // setNotes,
    enableSort,

}: Props) {

    const [openMenuId, setOpenMenuId] = useState<number | null>(null); // 今どのノートのメニューが開いているかを表す。SortableNoteCardの親(NoteList)で定義することで、各ノートカード全体で共有できるようになる。ex) openMenuId = 1という状態を全カードで共有できる。
    const [openColorId, setOpenColorId] = useState<number | null>(null);
    const [openNoteDetailId, setOpenNoteDetailId] = useState<number | null>(
        null,
    );

    const [panelType, setPanelType] = useState<"label" | "history" | null>(
        null,
    );

    const {
        reorderNotes,
        reorderPinnedNotes,
        ordering,
        setOrdering,
        pinnedOrdering,
        setPinnedOrdering,

    } = useNoteStore();

    // const pinnedNotes = notes.filter((note) => note.is_pinned);
    // const normalNotes = notes.filter((note) => !note.is_pinned);

    // const normalNotes = notes;



    const canSortNormalNotes = enableSort && ordering === "order";
    const canSortPinnedNotes = enableSort && pinnedOrdering === "pinned_order";


    // ドラッグ終了時に実行される関数
    const handleNormalDragEnd = (event: any) => {

        const { active, over } = event; // event.active, event.overを分割代入で取得。active: ドラッグしてた要素。over: 上に乗った(移動先の)相手。

        if (!over) return; // 上に乗った相手がいないなら終了
        if (active.id === over.id) return; // 同じ場所なら何もしない

        const oldIndex = notes.findIndex((note) => note.id === active.id);
        const newIndex = notes.findIndex((note) => note.id === over.id);

        const newNotes = arrayMove(
            notes, // 並び替え対象の配列
            oldIndex, // 移動させたい要素の現在位置
            newIndex, // 移動先位置
        );

        reorderNotes(newNotes);

        // setNotes((prev) => {  // prevは更新直前の最新のstate

        //     const oldIndex =
        //         prev.findIndex(
        //             (note) => note.id === active.id
        //         );

        //     const newIndex =
        //         prev.findIndex(
        //             (note) => note.id === over.id
        //         );

        //     return arrayMove(
        //         prev,  // 並び替え対象の配列
        //         oldIndex,  // 移動させたい要素の現在位置
        //         newIndex  // 移動先位置
        //     );
        // });
    };




    const handlePinnedDragEnd = (event: any) => {

        const { active, over } = event;

        if(!over) return;
        if (active.id === over.id) return;


        const oldIndex = pinnedNotes.findIndex((note) => note.id === active.id);
        const newIndex = pinnedNotes.findIndex((note) => note.id === over.id);


        const newPinnedNotes = arrayMove(
            pinnedNotes,
            oldIndex,
            newIndex,
        );


        reorderPinnedNotes(newPinnedNotes);

    }







    return (

        <>

            {/* 📌 固定済みノート */}
            {pinnedNotes.length > 0 && (
                <>
                    <h3>📌 固定済み</h3>

                    <SortSelect
                        ordering={pinnedOrdering}
                        onPageOrderChange={setPinnedOrdering}
                        manualOrderValue="pinned_order"
                    />

                    {canSortPinnedNotes ? (
                        // 固定済みが「手動順」のときだけD&Dを有効にする
                        <DndContext
                            collisionDetection={closestCenter}
                            onDragEnd={handlePinnedDragEnd}
                        >

                            <SortableContext
                                items={pinnedNotes.map((note) => note.id)}
                                strategy={rectSortingStrategy}
                            >

                                <NoteGrid
                                    enableSort={true}
                                    notes={pinnedNotes}
                                    openMenuId={openMenuId}
                                    setOpenMenuId={setOpenMenuId}
                                    openColorId={openColorId}
                                    setOpenColorId={setOpenColorId}
                                    openNoteDetailId={openNoteDetailId}
                                    setOpenNoteDetailId={setOpenNoteDetailId}
                                    panelType={panelType}
                                    setPanelType={setPanelType}
                                />

                            </SortableContext>

                        </DndContext>
                    ) : (
                        // 固定済みが「手動順」以外なら通常表示
                        <NoteGrid
                            enableSort={false}
                            notes={pinnedNotes}
                            openMenuId={openMenuId}
                            setOpenMenuId={setOpenMenuId}
                            openColorId={openColorId}
                            setOpenColorId={setOpenColorId}
                            openNoteDetailId={openNoteDetailId}
                            setOpenNoteDetailId={setOpenNoteDetailId}
                            panelType={panelType}
                            setPanelType={setPanelType}
                        />
                    )}

                    <h3>その他</h3>

                    <SortSelect
                        ordering={ordering}
                        onPageOrderChange={setOrdering}
                        manualOrderValue={"order"}
                        // onPageOrderChange={async (ordering) => {
                        //     await setOrdering(ordering);
                        // }}
                    />
                </>
            )}

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
                            enableSort={true}
                            notes={notes}
                            openMenuId={openMenuId}
                            setOpenMenuId={setOpenMenuId}
                            openColorId={openColorId}
                            setOpenColorId={setOpenColorId}
                            openNoteDetailId={openNoteDetailId}
                            setOpenNoteDetailId={setOpenNoteDetailId}
                            panelType={panelType}
                            setPanelType={setPanelType}
                        />

                    </SortableContext>

                </DndContext>
            ) : (
                // 通常ノートが「手動順」以外なら通常表示
                <NoteGrid
                    enableSort={false}
                    notes={notes}
                    openMenuId={openMenuId}
                    setOpenMenuId={setOpenMenuId}
                    openColorId={openColorId}
                    setOpenColorId={setOpenColorId}
                    openNoteDetailId={openNoteDetailId}
                    setOpenNoteDetailId={setOpenNoteDetailId}
                    panelType={panelType}
                    setPanelType={setPanelType}
                />

            )}

        </>

    );





    // return canSortNormalNotes ? (

    //     <>
    //         {/* 📌 ピン留めノート */}
    //         {pinnedNotes.length > 0 && (
    //             <>
    //                 <h3>📌 固定済み</h3>

    //                 <SortSelect
    //                     ordering={pinnedOrdering}
    //                     onPageOrderChange={async (pinnedOrdering) => {
    //                         await setPinnedOrdering(pinnedOrdering);
    //                     }}
    //                     // onPageOrderChange={setPinnedOrdering}
    //                 />


    //                 <DndContext
    //                     collisionDetection={closestCenter}
    //                     onDragEnd={handlePinnedDragEnd}
    //                 >

    //                     <SortableContext
    //                         items={pinnedNotes.map((note) => note.id)}
    //                         strategy={rectSortingStrategy}
    //                     >

    //                         <NoteGrid
    //                             enableSort={true}
    //                             notes={pinnedNotes}
    //                             openMenuId={openMenuId}
    //                             setOpenMenuId={setOpenMenuId}
    //                             openColorId={openColorId}
    //                             setOpenColorId={setOpenColorId}
    //                             openNoteDetailId={openNoteDetailId}
    //                             setOpenNoteDetailId={setOpenNoteDetailId}
    //                             panelType={panelType}
    //                             setPanelType={setPanelType}
    //                         />

    //                     </SortableContext>

    //                 </DndContext>


    //                 {/* <NoteGrid
    //                     enableSort={false}
    //                     notes={pinnedNotes}
    //                     openMenuId={openMenuId}
    //                     setOpenMenuId={setOpenMenuId}
    //                     openColorId={openColorId}
    //                     setOpenColorId={setOpenColorId}
    //                     openNoteDetailId={openNoteDetailId}
    //                     setOpenNoteDetailId={setOpenNoteDetailId}
    //                     panelType={panelType}
    //                     setPanelType={setPanelType}
    //                 /> */}

    //                 <h3>その他</h3>
    //             </>
    //         )}

    //         {/* 📝 通常ノート */}
    //         <DndContext
    //             collisionDetection={closestCenter}
    //             onDragEnd={handleNormalDragEnd}
    //         >
    //             <SortableContext
    //                 items={notes.map((note) => note.id)}
    //                 strategy={rectSortingStrategy}
    //             >
    //                 <NoteGrid
    //                     enableSort={true}
    //                     notes={notes}
    //                     openMenuId={openMenuId}
    //                     setOpenMenuId={setOpenMenuId}
    //                     openColorId={openColorId}
    //                     setOpenColorId={setOpenColorId}
    //                     openNoteDetailId={openNoteDetailId}
    //                     setOpenNoteDetailId={setOpenNoteDetailId}
    //                     panelType={panelType}
    //                     setPanelType={setPanelType}
    //                 />
    //             </SortableContext>
    //         </DndContext>
    //     </>
    // ) : (
    //     // <DndContext  // DndContextは「drag&drop機能を有効化する範囲」。dragシステム全体管理。
    //     //     collisionDetection={closestCenter}
    //     //     onDragEnd={handleNormalDragEnd}  // ドラッグ修了時に実行される
    //     // >

    //     //     <SortableContext  // SortableContextは並び替え機能。
    //     //         items={notes.map((note) => note.id)}  // 並び替え対象はid一覧という意味。
    //     //         strategy={rectSortingStrategy}  // グリッド並び替え。カードUI向け。
    //     //     >

    //     //         <>

    //     //             {pinnedNotes.length > 0 && (

    //     //             <>
    //     //                 <h3>📌 固定済み</h3>

    //     //                 <NoteGrid
    //     //                     enableSort={enableSort}
    //     //                     notes={pinnedNotes}

    //     //                     openMenuId={openMenuId}
    //     //                     setOpenMenuId={setOpenMenuId}
    //     //                     openColorId={openColorId}
    //     //                     setOpenColorId={setOpenColorId}
    //     //                     openNoteDetailId={openNoteDetailId}
    //     //                     setOpenNoteDetailId={setOpenNoteDetailId}
    //     //                     panelType={panelType}
    //     //                     setPanelType={setPanelType}

    //     //                 />

    //     //                 <h3>その他</h3>

    //     //             </>

    //     //             )}

    //     //         <NoteGrid
    //     //             enableSort={enableSort}
    //     //             notes={normalNotes}
    //     //             openMenuId={openMenuId}
    //     //             setOpenMenuId={setOpenMenuId}
    //     //             openColorId={openColorId}
    //     //             setOpenColorId={setOpenColorId}
    //     //             openNoteDetailId={openNoteDetailId}
    //     //             setOpenNoteDetailId={setOpenNoteDetailId}
    //     //             panelType={panelType}
    //     //             setPanelType={setPanelType}

    //     //         />

    //     //         </>

    //     //     </SortableContext>

    //     // </DndContext>

    //     <>
    //         {pinnedNotes.length > 0 && (
    //             <>
    //                 <h3>📌 固定済み</h3>

    //                 <NoteGrid
    //                     enableSort={enableSort}
    //                     notes={pinnedNotes}
    //                     openMenuId={openMenuId}
    //                     setOpenMenuId={setOpenMenuId}
    //                     openColorId={openColorId}
    //                     setOpenColorId={setOpenColorId}
    //                     openNoteDetailId={openNoteDetailId}
    //                     setOpenNoteDetailId={setOpenNoteDetailId}
    //                     panelType={panelType}
    //                     setPanelType={setPanelType}
    //                 />

    //                 <h3>その他</h3>
    //             </>
    //         )}

    //         <NoteGrid
    //             enableSort={enableSort}
    //             notes={normalNotes}
    //             openMenuId={openMenuId}
    //             setOpenMenuId={setOpenMenuId}
    //             openColorId={openColorId}
    //             setOpenColorId={setOpenColorId}
    //             openNoteDetailId={openNoteDetailId}
    //             setOpenNoteDetailId={setOpenNoteDetailId}
    //             panelType={panelType}
    //             setPanelType={setPanelType}
    //         />
    //     </>
    // );
}
