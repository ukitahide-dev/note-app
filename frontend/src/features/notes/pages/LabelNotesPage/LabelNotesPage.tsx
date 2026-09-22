import { useParams } from "react-router-dom";

import { useEffect } from "react";

import styles from "./LabelNotesPage.module.css";
import NoteList from "../../components/NoteList/NoteList";
import NoteForm from "../../components/NoteForm/NoteForm";

import { useNoteStore } from "../../store/useNoteStore";
import Pagination from "../../components/Pagination/Pagination";
import NoteListSkeleton from "../../components/NoteListSkeleton/NoteListSkeleton";




export default function LabelNotesPage() {

    const { labelName } = useParams();   // 分割代入で取得。useParams() は、{ labelName: "筋トレ" }みたいなオブジェクトを返す。型は、string | undefinedになる。

    // Store
    const {
        notes,
        pinnedNotes,
        fetchPinnedNotes,
        // fetchNotes,
        fetchLabelNotes,

        pageSize,
        ordering,
        pinnedOrdering,
        isFetchtingNotes,

        setPageSize,

    } = useNoteStore();


    useEffect(() => {

        if (!labelName) return;

        fetchLabelNotes(labelName);
        
    }, [labelName, ordering]);



    useEffect(() => {

        fetchPinnedNotes(pinnedOrdering);

    }, [pinnedOrdering]);



    // const filteredNotes = notes.filter((note) =>
    //     note.labels.some((label) => label.name === labelName),
    // );




    return (
        <>

            <Pagination
                onPageChange={(page) => fetchLabelNotes(labelName!, page, pageSize, ordering)}

                onPageSizeChange={async (size) => {
                    setPageSize(size);

                    await fetchLabelNotes(labelName!, 1, size, ordering);

                }}
            />

            <div className={styles.container}>

                <NoteForm labelName={labelName} />

                {isFetchtingNotes ? (

                    <NoteListSkeleton />

                ) : (

                    <NoteList
                        notes={notes}
                        pinnedNotes={pinnedNotes}
                        enableSort={false}
                    />

                )}

                <Pagination

                    onPageChange={(page) =>
                        fetchLabelNotes(labelName!, page, pageSize, ordering)
                    }

                    onPageSizeChange={async (size) => {

                        setPageSize(size);

                        await fetchLabelNotes(labelName!, 1, size, ordering);

                    }}

                />


            </div>

        </>

    );
}
