// ---- react ----
import { useEffect, useRef, useState } from "react";


// ---- Zustand ----
import { useLabelStore } from "../../../../labels/store/labelStore";


//  ---- css ----
import styles from "./LabelPanel.module.css";
import LabelItem from "./LabelItem/LabelItem";



type LabelState = {
    id: number,
    state: "checked" | "unchecked" | "indeterminate",
}




type Props = {

    labelPanelRef?: React.RefObject<HTMLDivElement | null>;
    
    selectedLabels: number[];

    labelStates?: LabelState[];

    onSelectLabel: (
        labelId: number
    ) => void;

    onSelectLabelName?: (
        labelName: string
    ) => void;

};







// 親: NoteCard.tsx、NoteDetailModal.tsx、Header.tsx

export default function LabelPanel({
    labelPanelRef,
    selectedLabels,
    labelStates,
    onSelectLabel,
    // onSelectLabelName,
}: Props) {

    // console.log("LabelPanelマウントされた");

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

                    {labels.map((label) => {

                        let labelState;

                        if (labelStates) {
                            labelState = labelStates.find(
                                (l) => l.id === label.id  // 今見ているラベルの状態だけを抽出する
                            );
                        }

                        return (
                            <LabelItem
                                key={label.id}
                                label={label}
                                labelState={labelState}
                                onSelectLabel={onSelectLabel}
                            />
                        );


                        // return (

                        //     <label
                        //         key={label.id}
                        //         className={styles.labelItem}
                        //     >

                        //         <input
                        //             type="checkbox"

                        //             checked={labelState?.state === "checked"}

                        //             onChange={() => onSelectLabel(label.id)}
                        //         />

                        //         <span>{label.name}</span>

                        //     </label>

                        // );

                    })}


                    {/* {labels.map((label) => (



                        <label
                            key={label.id}
                            className={styles.labelItem}
                        >

                            <input
                                type="checkbox"
                                checked={selectedLabels.includes(label.id)}


                                onChange={() => {
                                    onSelectLabel(label.id);

                                }}
                            />

                            <span>
                                {label.name}
                            </span>

                        </label>

                    ))} */}

                </div>

            )}

        </div>
    );
}
