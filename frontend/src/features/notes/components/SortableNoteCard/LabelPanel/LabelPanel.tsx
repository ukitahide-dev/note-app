// ---- react ----
import { useState } from "react";


//  ---- css ----
import styles from "./LabelPanel.module.css";



type Label = {
    id: number;
    name: string;
};


type Props = {
    labels: Label[];
    labelPanelRef: React.RefObject<HTMLDivElement | null>;
    selectedLabels: number[];
    // onBack: () => void;
    onCreateLabel: (
        name: string
    ) => void;
    onSelectLabel: (
        labelId: number
    ) => void;
};







// 親: SortableNoteCard.tsx

export default function LabelPanel({
    labels,
    labelPanelRef,
    selectedLabels,
    onCreateLabel,
    onSelectLabel,
}: Props) {

    const [newLabel, setNewLabel] = useState("");
    const isTyping = newLabel.trim() !== "";






    return (

        <div
            ref={labelPanelRef}
            className={styles.panel}
            onClick={(e) => e.stopPropagation()}
        >
            <input
                className={styles.input}
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="新しいラベル"
            />

            {isTyping ? (

                <button
                    className={styles.createButton}
                    onClick={() => {
                        onCreateLabel(newLabel);
                        setNewLabel("");
                    }}
                >
                    「{newLabel}」を作成
                </button>

            ) : (

                <div className={styles.labelList}>

                    {labels.map((label) => (

                        <label
                            key={label.id}
                            className={styles.labelItem}
                        >

                            <input
                                type="checkbox"
                                checked={selectedLabels.includes(label.id)}
                                onChange={() => onSelectLabel(label.id)}
                            />
                            <span>
                                {label.name}
                            </span>

                        </label>

                    ))}

                </div>

            )}

        </div>
    );
}
