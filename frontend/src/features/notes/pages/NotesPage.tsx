// ---- react ----
// import { useEffect, useState } from "react";




// ----api----
// import { getNotes,  } from "../api/noteApi";
// moveToTrash

// ----components----
import { useEffect } from "react";
import NoteForm from "../components/NoteForm/NoteForm";
import NoteList from "../components/NoteList/NoteList";
import { useNoteStore } from "../store/useNoteStore";




// ----css----
import styles from "./NotesPage.module.css";
import UndoSnackbar from "../components/UndoSnackbar/UndoSnackbar";
import Pagination from "../components/Pagination/Pagination";
import SortSelect from "../components/SortSelect/SortSelect";
import { Snackbar } from "../../../shared/ui/Snackbar/Snackbar";
import { useErrorStore } from "../../../shared/stores/useErrorStore";
import NoteListSkeleton from "../components/NoteListSkeleton/NoteListSkeleton";



// ---- types ----
// import type { Note } from "../../../types/note";







export default function NotesPage() {
    // const [notes, setNotes] = useState<Note[]>([]);
    // const [openMenuId, setOpenMenuId] = useState<number | null>(null);  // どのノートのメニューが開いているか」を全ノートで共有したいから、SortableNoteCardではなくて、このコンポーネントで定義する。


    const {
        notes,
        fetchNotes,
        isFetchtingNotes,

        pageSize,
        ordering,
        setPageSize,
        setOrdering,
    } = useNoteStore();


    const {
        errorMessage
    } = useErrorStore();


    // const errorMessage = useNoteStore(
    //     (state) => state.errorMessage
    // );



    useEffect(() => {
        fetchNotes();
    }, []);






    return (
        <>

            <Pagination
                onPageChange={(page) => fetchNotes(page, pageSize, ordering)}
                onPageSizeChange={ async (size) => {

                    setPageSize(size);

                    await fetchNotes(1, size, ordering);

                }}


            />

            <SortSelect
                onPageOrderChange={async (ordering) => {

                    setOrdering(ordering);

                    await fetchNotes(1, pageSize, ordering);

                }}
            />

            <div className={styles.container}>

                <NoteForm

                />


                {isFetchtingNotes ? (

                    <NoteListSkeleton

                    />

                ) : (

                    <NoteList
                        notes={notes}
                        enableSort={true}

                    />

                )}


                <Pagination
                    onPageChange={(page) => fetchNotes(page, pageSize, ordering)}
                    onPageSizeChange={ async (size) => {

                        setPageSize(size);

                        await fetchNotes(1, size, ordering);

                    }}
                />


                <UndoSnackbar


                />


                {errorMessage && (

                    <Snackbar
                        message={errorMessage}

                    />

                )}




            </div>
        </>
    )
}




// const handleMoveToTrash = async (id: number) => {
    //     try {
    //         await moveToTrash(id);
    //         setNotes((prev) =>
    //             prev.filter(
    //                 (note) => note.id !== id
    //             )
    //         );
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };



 // ドラッグ終了時に実行される関数
    // const handleDragEnd = (event: any) => {

    //     const { active, over } = event;  // event.active, event.overを分割代入で取得。active: ドラッグしてた要素。over: 上に乗った(移動先の)相手。

    //     if (!over) return;  // 上に乗った相手がいないなら終了
    //     if (active.id === over.id) return;  // 同じ場所なら何もしない

    //     setNotes((prev) => {  // prevは更新直前の最新のstate

    //         const oldIndex = prev.findIndex((note) => note.id === active.id);
    //         const newIndex = prev.findIndex((note) => note.id === over.id);

    //         return arrayMove(
    //             prev,  // 並び替え対象の配列
    //             oldIndex,  // 移動させたい要素の現在位置
    //             newIndex  // 移動先位置
    //         );
    //     });
    // };


{/* <DndContext  // DndContextは「drag&drop機能を有効化する範囲」。dragシステム全体管理。
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

                </DndContext> */}
