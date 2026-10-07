import Tooltip from "../../../../shared/components/Tooltip/Tooltip";

import type { Note } from "../../../../types/api/note";
import styles from "./NoteCardHeader.module.css";


type Props = {
    note: Note;
    selected: boolean;
    onToggleSelect: () => void;   // void: このコンポーネントは、関数の戻り値を使わないという意味。
    onTogglePin: () => void;
    dragHandleProps?: any;

};



// 親: NoteCard,


export default function ({
    note,
    selected,
    onToggleSelect,
    onTogglePin,
    dragHandleProps,

}: Props) {

    return (

        <div className={styles.cardHeader}>

            <Tooltip text={selected ? "ノートの選択を解除" : "ノートを選択"}>

                <button
                    className={`${styles.selectButton}
                                ${styles.headerButton}
                                ${selected ? styles.selected : ""}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleSelect();   // 親が「何をするか」を準備して、子は「クリックされたらそれを実行する」だけ。
                    }}
                >
                    {selected ? "✓" : "○"}
                </button>

            </Tooltip>


            <div {...dragHandleProps} className={styles.dragArea} />


            <Tooltip text={note.is_pinned ? "ピン留めを外す" : "ピン留めする"}>

                <button
                    className={`${styles.headerButton}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        onTogglePin();
                    }}
                >
                    {note.is_pinned ? "📌" : "📍"}
                </button>

            </Tooltip>

        </div>
    );
}
