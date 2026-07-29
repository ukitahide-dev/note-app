import { useNoteStore } from "../../store/useNoteStore";


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

    const pages = Array.from(
        {length: totalPages},
        (_, index) => index + 1
    );

    console.log(pages);



    return (

        <div>

            <button
                disabled={!previous}
                onClick={() => fetchNotes(currentPage - 1)}
            >
                ←
            </button>


            {pages.map((page) => (

                <button
                    key={page}
                    className={
                        currentPage === page
                            ? styles.active
                            : styles.pageButton
                    }
                    onClick={() => fetchNotes(page)}
                >
                    {page}
                    
                </button>

            ))}

            <button
                disabled={!next}
                onClick={() => fetchNotes(currentPage + 1)}
            >
                →
            </button>

        </div>

    );



}
