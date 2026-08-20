import { useNoteStore } from "../../store/useNoteStore";
import getDisplayPages from "../../utils/pagination";


//  ---- css ----
import styles from "./Pagination.module.css";




type Props = {
    onPageChange: (
        page: number,
    ) => void;

    onPageSizeChange: (
        size: number,
    ) => void;



}


// 親: NotePage.tsx


export default function Pagination({
    onPageChange,
    onPageSizeChange,


}: Props) {


    // Store
    const {
        currentPage,
        count,
        previous,
        next,
        // fetchNotes,
        pageSize,
        ordering,
        setPageSize,
    } = useNoteStore();




    const totalPages = Math.ceil(count / pageSize);


    // utils
    const displayPages =
        getDisplayPages(
            totalPages,
            currentPage,
        );





    return (

        <>

        <div
            className={styles.pagination}
        >

            <button
                disabled={!previous}
                className={styles.arrowButton}
                onClick={() => onPageChange(currentPage - 1)}
                // onClick={() => fetchNotes(currentPage - 1, pageSize, ordering)}
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
                        onClick={() => onPageChange(Number(page))}
                        // onClick={() => fetchNotes(Number(page), pageSize, ordering)}
                    >
                        {page}

                    </button>


                )




            ))}



            <button
                disabled={!next}
                className={styles.arrowButton}
                onClick={() => onPageChange(currentPage + 1)}
                // onClick={() => fetchNotes(currentPage + 1, pageSize, ordering)}
            >
                →
            </button>

        </div>

        <div className={styles.pageSizeButtons}>

            <span className={styles.pageSizeLabel}>
                1ページの表示数
            </span>

            {[20, 30, 60, 120].map((size) => (

                <button
                    key={size}
                    className={
                        pageSize === size
                            ? styles.activeSize
                            : styles.sizeButton
                    }
                    onClick={() => onPageSizeChange(size)}
                    // onClick={() => setPageSize(size)}
                >
                    {size}
                </button>

            ))}

        </div>

        </>

    );



}




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
