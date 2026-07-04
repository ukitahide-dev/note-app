import { useParams } from "react-router-dom";
import { getNotes } from "../../api/noteApi";
import { useEffect, useState } from "react";


import styles from "./LabelNotesPage.module.css"
import NoteList from "../../components/NoteList/NoteList";
import NoteForm from "../../components/NoteForm/NoteForm";



// ---- types ----
import type { Note } from "../../../../types/note";
import { useNoteStore } from "../../store/useNoteStore";






export default function LabelNotesPage() {
    const { labelName } = useParams();   // 分割代入で取得。useParams() は、{ labelName: "筋トレ" }みたいなオブジェクトを返す。
    // const [notes, setNotes] = useState<Note[]>([]);



    // useNoteStore
    const {
        notes,
        // setNotes,
        fetchNotes,
    } = useNoteStore();


    useEffect(() => {
        fetchNotes();
    }, []);



    const filteredNotes = notes
        .filter((note) => note.labels
        .some((label) => label.name === labelName)
    );



    return (
        <div className={styles.container}>


            <NoteForm
                // onAddNote={handleAddNote}
            />
            <NoteList
                notes={filteredNotes}
                // setNotes={setNotes}
                // onMoveToTrash={handleMoveToTrash}
            />
        </div>


    )

}





 // useEffect(() => {

    //     const fetchNotes = async () => {

    //         try {

    //             const data = await getNotes();
    //             const filteredNotes = data.filter((note: Note) =>  // filterは配列を返す。someはtrue/falseを返す。
    //                 note.labels.some((label) =>
    //                     label.name === labelName
    //                 )
    //             );

    //             setNotes(filteredNotes);

    //         } catch (error) {

    //             console.error(error);
    //         }

    //     }

    //     fetchNotes();

    // }, [labelName])





    // const handleAddNote = (
    //     newNote: Note
    // ) => {

    //     const hasCurrentLabel = newNote.labels.some(
    //         (label) => label.name === labelName
    //     );

    //     if(!hasCurrentLabel) return;

    //     setNotes((prev) => [
    //         ...prev,
    //         newNote
    //     ]);


    // }

