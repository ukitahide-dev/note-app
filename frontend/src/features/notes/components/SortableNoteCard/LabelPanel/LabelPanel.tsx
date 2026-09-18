// ---- react ----
import { useState } from "react";

// ---- Zustand ----
import { useLabelStore } from "../../../../labels/store/labelStore";

//  ---- css ----
import styles from "./LabelPanel.module.css";
import LabelPanelItem from "./LabelPanelItem/LabelPanelItem";


// ---- type ----
import type { LabelState } from "../../../../../types/ui/label";

// type LabelState = {
//     id: number;
//     state: "checked" | "unchecked" | "indeterminate";
// };


type Props = {

    labelPanelRef?: React.RefObject<HTMLDivElement | null>;

    labelStates?: LabelState[];

    onSelectLabel: (labelId: number) => void;


};



// 親: NoteCard.tsx、NoteDetailModal.tsx、Header.tsx

export default function LabelPanel({
    labelPanelRef,
    labelStates,
    onSelectLabel,

}: Props) {


    const [newLabel, setNewLabel] = useState("");
    const isTyping = newLabel.trim() !== "";


    // Store
    const {
        labels,
        handleCreateLabel,

    } = useLabelStore();



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

                    {labels.map((label) => {

                        let labelState;

                        if (labelStates) {
                            labelState = labelStates.find(
                                (l) => l.id === label.id, // 今見ているラベルの状態だけを抽出する
                            );
                        }

                        return (
                            <LabelPanelItem
                                key={label.id}
                                label={label}
                                labelState={labelState}
                                onSelectLabel={onSelectLabel}
                            />
                        );


                    })}


                </div>
            )}

        </div>

    );
}
