// ---- css ----
import styles from "./LabelItem.module.css";

// ---- type ----
import type { Label } from "../../../../types/api/note";



type Props = {

    label: Label;

    onRemoveLabel: (labelId: number) => void;

};



// 親: NoteLabels,
// 各ノートが所持しているラベルを表示するUI

export default function LabelItem({
    label,
    onRemoveLabel,

}: Props)

    {

        return (

            <div key={label.id} className={styles.label}>

                <span className={styles.labelName}>{label.name}</span>

                <button
                    className={styles.removeLabel}
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemoveLabel(label.id);
                    }}
                >
                    ×
                </button>

            </div>
        );

    }
