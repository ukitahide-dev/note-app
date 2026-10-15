
// ---- css ----
import styles from "./Menu.module.css";


type Props = {
    children: React.ReactNode;
    menuRef?: React.RefObject<HTMLDivElement | null>;
    "data-testid"?: string;
};



// 役割: ドロップダウンメニュー共通の見た目を作る。NoteFormMenu、NoteMenu共通の見た目。


export default function Menu({
    children,
    menuRef,
    "data-testid": testId,

}: Props) {


    return (

        <div
            ref={menuRef}   // このDOM要素を menuRef.current にしてという意味。
            className={styles.menu}
            data-testid={testId}
            onClick={(e) => e.stopPropagation()}  // これがないと、SortableNoteCard.tsxの、onClick={() => navigate(`/notes/${note.id}`)}が発動してしまう。
        >

            {children}

        </div>

    )




}
