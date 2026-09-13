import { useParams } from "react-router-dom";

import { useEffect,} from "react";


import styles from "./LabelNotesPage.module.css"
import NoteList from "../../components/NoteList/NoteList";
import NoteForm from "../../components/NoteForm/NoteForm";




import { useNoteStore } from "../../store/useNoteStore";






export default function LabelNotesPage() {
    const { labelName } = useParams();   // 分割代入で取得。useParams() は、{ labelName: "筋トレ" }みたいなオブジェクトを返す。



    // useNoteStore
    const {
        notes,
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
                labelName={labelName}
                // onAddNote={handleAddNote}
            />
            <NoteList
                notes={filteredNotes}
                enableSort={false}
                // setNotes={setNotes}
                // onMoveToTrash={handleMoveToTrash}
            />
        </div>


    )

}





