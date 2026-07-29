import { useNoteStore } from "../../store/useNoteStore";
import getDisplayPages from "../../utils/pagination";


//  ---- css ----
import styles from "./Pagination.module.css";







export default function Pagination() {


    // Store
    const {
        currentPage,
        count,
        previous,
        next,
        fetchNotes,
    } = useNoteStore();






    const totalPages = Math.ceil(count / 20);


    // utils
    const displayPages =
        getDisplayPages(
            totalPages,
            currentPage,
        );


    // utilsに移した
    // const displayPages: (number | string)[] = [];

    // const start = Math.max(1, currentPage - 2);
    // const end = Math.min(totalPages, currentPage + 2);


    // for (let i = start; i <= end; i++) {
    //     displayPages.push(i);
    // }


    // if (start > 2) {
    //     displayPages.unshift("...");
    //     displayPages.unshift(1);
    // }


    // if (end < totalPages - 1) {
    //     displayPages.push("...");
    //     displayPages.push(totalPages);
    // }


    // if (start === 2) {
    //     displayPages.unshift(1);
    // }

    // if (end === totalPages - 1) {
    //     displayPages.push(totalPages);
    // }


    // console.log(displayPages);
    // displayPages.forEach((page, index) => {
    //     console.log(index, page);
    // });


    return (

        <div
            className={styles.pagination}
        >

            <button
                disabled={!previous}
                className={styles.arrowButton}
                onClick={() => fetchNotes(currentPage - 1)}
            >
                ←
            </button>


            {displayPages.map((page, index) => (

                page === "..." ? (
                    <span
                        key={`ellipsis-${index}`}　
                        // key={index} こっちだとバグる。button兄弟要素のkeyと重複する時があるから。
                        className={styles.ellipsis}
                    >
                        ...
                    </span>

                ) : (

                    <button
                        key={page}
                        className={
                            currentPage === page
                                ? styles.active
                                : styles.pageButton
                        }
                        onClick={() => fetchNotes(Number(page))}
                    >
                        {page}

                    </button>


                )




            ))}



            <button
                disabled={!next}
                className={styles.arrowButton}
                onClick={() => fetchNotes(currentPage + 1)}
            >
                →
            </button>

        </div>

    );



}
