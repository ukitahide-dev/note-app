
// ---- react ----
import { useEffect, useState } from "react";

import styles from "./SearchResultsPage.module.css";


// ----components ----
import NoteList from "../../../notes/components/NoteList/NoteList";


// ---- searchStrore ----
// import { useSearchStore } from "../../store/SearchStore";

// ---- /api ----
// import { getNotes } from "../../../notes/api/noteApi";



import { useNoteStore } from "../../../notes/store/useNoteStore";
// import { useNoteFilter } from "../../hooks/useNoteFilter";


// ----react-icons ----
// import { MdLabel } from "react-icons/md";
import { MdOutlineLabel } from "react-icons/md";
import { useLabelStore } from "../../../labels/store/labelStore";
import { getUsedColorsApi } from "../../../notes/api/noteApi";
// import type { Note } from "../../../../types/api/note";
import Pagination from "../../../notes/components/Pagination/Pagination";






export default function SearchResultsPage () {


    // const [selectedLabel, setSelectedLabel] = useState<string | null >(null);

    // const [selectedColor, setSelectedColor] = useState<string | null>(null);

    const [usedColors, setUsedColors] = useState<string[]>([]);


    // Store
    const {
        // notes,
        // fetchNotes,

        pinnedNotes,
        fetchPinnedNotes,
        searchNotes,
        searchResultNotes,

        pageSize,
        setPageSize,

        ordering,

        searchParams,
        setSearchParams,

    } = useNoteStore();


    // Store
    const { searchText } = useSearchStore();


    // Store
    const {
        usedLabels,
        fetchUsedLabels,

    } = useLabelStore();



    // hook
    // const {
    //     // uniqueLabels,
    //     // uniqueColors,
    //     filteredNotes,

    // } = useNoteFilter(
    //     notes,
    //     searchText,
    //     selectedLabel,
    //     selectedColor,

    // );


    const [showAllLabels, setShowAllLabels] = useState(false);
    const [showAllColors, setShowAllColors] = useState(false);

    // const [searchResultNotes, setSearchResultNotes] = useState<Note[]>([]);


    const displayLabels = showAllLabels
        ? usedLabels
        : usedLabels.slice(0, 4);


    const displayColors = showAllColors
        ? usedColors
        : usedColors.slice(0, 8);



    useEffect(() => {

        // fetchNotes();
        fetchPinnedNotes();
        fetchUsedLabels();


        const fetchUsedColors = async () => {

            try {
                const data = await getUsedColorsApi();
                console.log(data);
                setUsedColors(data);

            } catch (error) {

                console.error(error);

            }
        };

        fetchUsedColors();

    }, []);


    useEffect(() => {

        if (!searchText && !searchParams.labelName && !searchParams.color) {
            return;
        }

        searchNotes(
            searchParams.query,
            // searchText,
            searchParams.labelName,
            searchParams.color,
            // selectedLabel,
            // selectedColor,

        );

    }, [
        searchParams.query,
        // searchText,
        searchParams.labelName,
        searchParams.color,
        // selectedLabel,
        // selectedColor,
    ]);

    // useEffect(() => {

    //     const searchNotes = async () => {

    //         if (!searchText && !selectedLabel && !selectedColor) {
    //             setSearchResultNotes([]);
    //             return;
    //         }

    //         try {

    //             const data = await getSearchNotesApi(
    //                 searchText,
    //                 selectedLabel,
    //                 selectedColor,
    //                 1,
    //                 20,
    //             );

    //             setSearchResultNotes(data.results);

    //         } catch (error) {

    //             console.error(error);

    //         }
    //     };

    //     searchNotes();

    // }, [searchText, selectedLabel, selectedColor]);














    return (


        !searchParams.labelName && !searchParams.color && !searchParams.query ? (

            <>

                <div className={styles.container}>

                    <div className={styles.top}>

                        <p>ラベル</p>

                        {usedLabels.length > 4 && (

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
                                key={label.id}
                                className={styles.label}
                                onClick={() => {
                                    setSearchParams({
                                        ...searchParams,
                                        labelName: label.name,
                                    })
                                }}
                                // onClick={() => setSelectedLabel(label.name)}
                            >
                                <MdOutlineLabel size={18} />

                                <p>{label.name}</p>

                            </div>

                        ))}

                    </div>


                </div>


                <div className={`${styles.container} ${styles.colorContainer}`}>

                    <div className={styles.top}>

                        <p>色</p>

                        {usedColors.length > 8 && (

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
                                onClick={() => {
                                    setSearchParams({
                                        ...searchParams,
                                        color: color,
                                    })
                                }}
                                // onClick={() => setSelectedColor(color)}
                            >

                            </div>

                        ))}
                    </div>

                </div>

            </>



        ) : (

            <>

                <Pagination

                    onPageChange={(page) => searchNotes(
                        searchText,
                        searchParams.labelName,
                        searchParams.color,
                        // selectedLabel,
                        // selectedColor,
                        page,
                        pageSize,
                        ordering,
                    )}

                    onPageSizeChange={ async (size) => {

                        setPageSize(size);

                        await searchNotes(
                            searchText,
                            searchParams.labelName,
                            searchParams.color,
                            // selectedLabel,
                            // selectedColor,
                            1,
                            pageSize,
                            ordering,
                        );

                    }}


                />

                <NoteList
                    // notes={filteredNotes}
                    notes={searchResultNotes}
                    pinnedNotes={pinnedNotes}
                    enableSort={false}

                />

                <Pagination

                    onPageChange={(page) => searchNotes(
                            searchText,
                            searchParams.labelName,
                            searchParams.color,
                            // selectedLabel,
                            // selectedColor,
                            page,
                            pageSize,
                            ordering,
                        )}

                    onPageSizeChange={ async (size) => {

                        setPageSize(size);

                        await searchNotes(
                            searchText,
                            searchParams.labelName,
                            searchParams.color,
                            // selectedLabel,
                            // selectedColor,
                            1,
                            size,
                            ordering,
                        );

                    }}


                />

            </>


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
