// ---- react ----
import { useState } from "react";


// ---- Zustand ----
import { useLabelStore } from "../../../../labels/store/labelStore";


//  ---- css ----
import styles from "./LabelPanel.module.css";




type Props = {

    labelPanelRef?: React.RefObject<HTMLDivElement | null>;
    selectedLabels: number[];

    onSelectLabel: (
        labelId: number
    ) => void;

    onSelectLabelName?: (
        labelName: string
    ) => void;

};







// 親: NoteCard.tsx、NoteDetailModal.tsx、

export default function LabelPanel({
    labelPanelRef,
    selectedLabels,
    onSelectLabel,
    // onSelectLabelName,
}: Props) {

    console.log("LabelPanelマウントされた");

    const [newLabel, setNewLabel] = useState("");
    const isTyping = newLabel.trim() !== "";


    // Zustandで定義した。labelsを直接取得。
    const { labels, handleCreateLabel } = useLabelStore();




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
                        handleCreateLabel(newLabel);
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


                                onChange={() => {
                                    onSelectLabel(label.id);
                                    // onSelectLabel(label.id, label.name);
                                    // onSelectLabelName(label.name);
                                }}
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
