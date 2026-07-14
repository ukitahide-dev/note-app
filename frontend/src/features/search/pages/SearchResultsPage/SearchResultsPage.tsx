
// ---- react ----
import { useEffect, useState } from "react";

import styles from "./SearchResultsPage.module.css";

// ----notes/components ----
import NoteList from "../../../notes/components/NoteList/NoteList";

// ---- searchStrore ----
import { useSearchStore } from "../../store/SearchStore";

// ---- notes/api ----
// import { getNotes } from "../../../notes/api/noteApi";


// import type { Note } from "../../../../types/note";
import { useNoteStore } from "../../../notes/store/useNoteStore";
import { useNoteFilter } from "../../hooks/useNoteFilter";


// ----react-icons ----
// import { MdLabel } from "react-icons/md";
import { MdOutlineLabel } from "react-icons/md";






export default function SearchResultsPage () {


    const [selectedLabel, setSelectedLabel] = useState<string | null >(null);

    const [selectedColor, setSelectedColor] = useState<string | null>(null);


    // useNoteStore
    const {
        notes,
        fetchNotes,
    } = useNoteStore();


    useEffect(() => {
        fetchNotes();
    }, [])


    // useSearchStore
    const { searchText } = useSearchStore();


    // const showLabels = searchText.trim() === "" && selectedLabel === null;




    // useNoteFilter hook
    const {
        uniqueLabels,
        filteredNotes,
        uniqueColors,
    } = useNoteFilter(
        notes,
        searchText,
        selectedLabel,
        selectedColor,
    );



    const [showAllLabels, setShowAllLabels] = useState(false);

    const displayLabels = showAllLabels
        ? uniqueLabels
        : uniqueLabels.slice(0, 4);



    const [showAllColors, setShowAllColors] = useState(false);

    const displayColors = showAllColors
        ? uniqueColors
        : uniqueColors.slice(0, 8);





    return (


        !selectedLabel && !selectedColor && !searchText ? (

            <>
                <div className={styles.container}>
                    <div className={styles.top}>
                        <p>ラベル</p>

                        {uniqueLabels.length > 4 && (

                            <button
                                onClick={() =>
                                    setShowAllLabels(prev => !prev)
                                }
                            >
                                {showAllLabels
                                    ? "閉じる"
                                    : "その他を表示"
                                }

                            </button>
                        )}


                    </div>

                    <div className={`${styles.content} ${styles.labels}`}>
                        {displayLabels.map((label) => (

                            <div
                                key={label}
                                className={styles.label}
                                onClick={() => setSelectedLabel(label)}
                            >
                                <MdOutlineLabel size={18} />
                                {/* <MdLabel /> */}
                                <p>{label}</p>

                            </div>

                        ))}
                    </div>


                </div>


                <div className={`${styles.container} ${styles.colorContainer}`}>

                    <div className={styles.top}>
                        <p>色</p>

                        {uniqueColors.length > 8 && (

                            <button
                                onClick={() =>
                                    setShowAllColors(prev => !prev)
                                }
                            >
                                {showAllColors
                                    ? "閉じる"
                                    : "その他を表示"
                                }

                            </button>
                        )}


                    </div>

                    <div className={`${styles.content} ${styles.colors}`}>
                        {displayColors.map((color) => (

                            <div
                                key={color}
                                className={styles.color}
                                style={{backgroundColor: color}}
                                onClick={() => setSelectedColor(color)}
                            >

                            </div>

                        ))}
                    </div>

                </div>

            </>



        ) : (

            <NoteList
                notes={filteredNotes}
                // setNotes={setNotes}
                enableSort={false}

            />


        )



    )


}





// useNoteStoreで不要に
    // useEffect(() => {

    //     const fetchNotes = async () => {

    //         try {

    //             const data = await getNotes();
    //             setNotes(data);

    //         } catch (error) {

    //             console.error(error);

    //         }
    //     }

    //     fetchNotes();

    // }, [])





// useNoteFilter hookに移した
    // すでに使われているラベルだけを取得する
    // const usedLabels = notes.flatMap((note) => note.labels);

    // const uniqueLabels = [
    //     ...new Set(usedLabels.map((label) => label.name))  // ...はスプレッド構文。Setの中身を1つずつ展開している。
    // ];





    // ノートをラベルで絞る
    // const targetNotes =
    //     selectedLabel
    //         ? notes.filter((note) =>
    //             note.labels.some(
    //                 (label) => label.name === selectedLabel
    //             )
    //         )
    //         : notes;



    //  ノートをラベルで絞った後に、検索で絞る
    // const filteredNotes =
    //     targetNotes.filter(
    //         (note) =>
    //             note.title.includes(searchText) ||
    //             note.content.includes(searchText)
    //     );
