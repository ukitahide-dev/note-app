



import styles from "./NoteListSkeleton.module.css";




export default function NoteListSkeleton() {

    return (

        <div className={styles.container}>

            {Array.from({ length: 6 }).map((_, index) => (

                <div
                    key={index}
                    className={styles.card}
                >

                    <div className={styles.title} />
                    <div className={styles.content} />
                    <div className={styles.contentShort} />

                </div>

            ))}

        </div>
    );
}
