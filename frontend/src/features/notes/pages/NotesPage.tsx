// ---- react ----
import { useEffect, useState } from "react";



// ---- drag & drop ----
// import {DndContext, closestCenter,} from "@dnd-kit/core";
// import {arrayMove, SortableContext, rectSortingStrategy,} from "@dnd-kit/sortable";


// ----api----
import { getNotes,  } from "../api/noteApi";
// moveToTrash

// ----components----
import NoteForm from "../components/NoteForm/Noteform";
import NoteList from "../components/NoteList/NoteList";
// import SortableNoteCard from "../components/SortableNoteCard/SortableNoteCard";



// ----css----
import styles from "./NotesPage.module.css";


type Label = {
    id: number;
    name: string;
};


type Note = {
        id: number,
        title: string,
        content: string,
        labels:  Label[]
    };




export default function NotesPage() {

    const [notes, setNotes] = useState<Note[]>([]);
    // const [openMenuId, setOpenMenuId] = useState<number | null>(null);  // どのノートのメニューが開いているか」を全ノートで共有したいから、SortableNoteCardではなくて、このコンポーネントで定義する。




    const handleAddNote = (
        newNote: Note
    ) => {

        setNotes((prev) => [
            newNote,
            ...prev
        ]);
    };


    useEffect(() => {
        const fetchNotes = async () => {

            try {
                const data = await getNotes();
                setNotes(data);
            } catch (error) {
                console.error("ノート取得に失敗");
            }
        }

        fetchNotes();

    }, [])


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




    return (

        <>

            <div className={styles.container}>
                <NoteForm onAddNote={handleAddNote}/>

                <NoteList
                    notes={notes}
                    setNotes={setNotes}
                    // onMoveToTrash={handleMoveToTrash}
                />



                
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

            </div>
        </>
    )

}
