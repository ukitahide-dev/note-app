
// ---- react ----
import { useEffect, useState } from "react";

import styles from "./SearchResultsPage.module.css";

// ----notes/components ----
import NoteList from "../../../notes/components/NoteList/NoteList";

// ---- searchStrore ----
import { useSearchStore } from "../../store/SearchStore";

// ---- notes/api ----
import { getNotes } from "../../../notes/api/noteApi";




type Label = {
    name: string,

}


type Note = {
    title: string,
    content: string,
    color: string,
    labels: Label[],
}



export default function SearchResultsPage () {

    const [notes, setNotes] = useState<Note[]>([]);
    const [selectedLabel, setSelectedLabel] = useState<string | null >(null);


    const { searchText } = useSearchStore();

    const showLabels = searchText.trim() === "" && selectedLabel === null;



    useEffect(() => {

        const fetchNotes = async () => {

            try {

                const data = await getNotes();
                setNotes(data);

            } catch (error) {

                console.error(error);

            }
        }

        fetchNotes();

    }, [])


    // すでに使われているラベルだけを取得する
    const usedLabels = notes.flatMap((note) => note.labels);

    const uniqueLabels = [
        ...new Set(usedLabels.map((label) => label.name))  // ...はスプレッド構文。Setの中身を1つずつ展開している。
    ];





    // ノートをラベルで絞る
    const targetNotes =
        selectedLabel
            ? notes.filter((note) =>
                note.labels.some(
                    (label) => label.name === selectedLabel
                )
            )
            : notes;



    // ノートをラベルで絞った後に、検索で絞る
    const filteredNotes =
        targetNotes.filter(
            (note) =>
                note.title.includes(searchText) ||
                note.content.includes(searchText)
        );






    return (


        showLabels ? (

            <div>
                <div className={styles.top}>

                    <div className={styles.labels}>
                        {uniqueLabels.map((label) => (

                            <div
                                key={label}
                                className={styles.item}
                                onClick={() => setSelectedLabel(label)}
                            >
                                {label}

                            </div>

                        ))}
                    </div>

                </div>
            </div>

        ) : (

            <NoteList
                notes={filteredNotes}
                setNotes={setNotes}
                enableSort={false}

            />


        )



    )


}
