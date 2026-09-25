
// ---- react ----
import { useEffect, useState } from "react";

import styles from "./SearchResultsPage.module.css";


// ----components ----
import NoteList from "../../../notes/components/NoteList/NoteList";





import { useNoteStore } from "../../../notes/store/useNoteStore";



// ----react-icons ----
// import { MdLabel } from "react-icons/md";
import { MdOutlineLabel } from "react-icons/md";
import { useLabelStore } from "../../../labels/store/labelStore";
import { getUsedColorsApi } from "../../../notes/api/noteApi";

import Pagination from "../../../notes/components/Pagination/Pagination";






export default function SearchResultsPage () {




    const [usedColors, setUsedColors] = useState<string[]>([]);


    // Store
    const {

        pinnedNotes,
        fetchPinnedNotes,
        searchNotes,
        searchResultNotes,

        currentPage,

        pageSize,
        setPageSize,
        ordering,

        searchParams,
        setSearchParams,

    } = useNoteStore();





    // Store
    const {
        usedLabels,
        fetchUsedLabels,

    } = useLabelStore();





    const [showAllLabels, setShowAllLabels] = useState(false);
    const [showAllColors, setShowAllColors] = useState(false);



    const displayLabels = showAllLabels
        ? usedLabels
        : usedLabels.slice(0, 4);


    const displayColors = showAllColors
        ? usedColors
        : usedColors.slice(0, 8);



    useEffect(() => {


        fetchPinnedNotes();
        fetchUsedLabels();


        const fetchUsedColors = async () => {

            try {
                const data = await getUsedColorsApi();
                // console.log(data);
                setUsedColors(data);

            } catch (error) {

                console.error(error);

            }
        };

        fetchUsedColors();

    }, []);




    useEffect(() => {

        if (!searchParams.query && !searchParams.labelName && !searchParams.color) {
            return;
        }

        searchNotes(
            searchParams.query,
            searchParams.labelName,
            searchParams.color,

            currentPage,
            pageSize,
            ordering,


        );

    }, [
        searchParams.query,
        searchParams.labelName,
        searchParams.color,
        ordering,
    ]);











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
                        searchParams.query,

                        searchParams.labelName,
                        searchParams.color,

                        page,
                        pageSize,
                        ordering,
                    )}

                    onPageSizeChange={ async (size) => {

                        setPageSize(size);

                        await searchNotes(
                            searchParams.query,

                            searchParams.labelName,
                            searchParams.color,

                            1,
                            pageSize,
                            ordering,
                        );

                    }}


                />

                <NoteList

                    notes={searchResultNotes}
                    pinnedNotes={pinnedNotes}
                    enableSort={false}

                />

                <Pagination

                    onPageChange={(page) => searchNotes(
                            searchParams.query,

                            searchParams.labelName,
                            searchParams.color,

                            page,
                            pageSize,
                            ordering,
                        )}

                    onPageSizeChange={ async (size) => {

                        setPageSize(size);

                        await searchNotes(
                            searchParams.query,
                            searchParams.labelName,
                            searchParams.color,

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
