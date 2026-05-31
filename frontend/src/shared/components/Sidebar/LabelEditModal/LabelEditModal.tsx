import { useEffect, useState } from "react";
import useLabels from "../../../../features/labels/hooks/useLabels";
import { useLabelStore } from "../../../../features/labels/store/labelStore";


import styles from "./LabelEditModal.module.css"




// 親: Sidebar.tsx


export default function LabelEditModal() {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editedNames, setEditedNames] = useState<Record<number, string>>({});

    const {
        labels,

    } = useLabelStore();




    useEffect(() => {
        setEditedNames(
            Object.fromEntries(
                labels.map((label) => [
                    label.id,
                    label.name
                ])
            )
        );


    }, [labels])




    const handleSave = async () => {

        for (const label of labels) {

            const newName = editedNames[label.id];

            if (newName !== label.name) {

                await

            }


        }
    }





    return (
        <div className={styles.modalOverlay}>

            <div className={styles.modal}>

                <h2>ラベルの編集</h2>

                {labels.map((label) => (
                    <div
                        key={label.id}
                        className={styles.labelRow}
                    >
                        <button
                            className={styles.iconButton}

                        >
                            <span className={styles.note}>
                                📝
                            </span>

                            <span className={styles.trash}>
                                🗑
                            </span>

                        </button>


                        {editingId === label.id ? (
                            <input
                                autoFocus
                                className={styles.input}
                                value={editedNames[label.id]}
                                onChange={(e) =>
                                    setEditedNames({
                                        ...editedNames,
                                        [label.id]: e.target.value
                                    })
                                }
                            />
                        ) : (

                            <div
                                className={styles.labelName}
                                onClick={() => setEditingId(label.id)}
                            >
                                {editedNames[label.id]}
                            </div>
                            )
                        }

                        <button
                            onClick={() => setEditingId(label.id)}
                        >
                            {
                                editingId === label.id ? (
                                    "✔️"
                                ) : (
                                     "✏️"
                                )
                            }

                        </button>

                    </div>



                ))}

                <div
                    className={styles.bottom}
                >
                    <button
                        className={styles.save}
                        onClick={handleSave}
                    >
                        完了
                    </button>
                </div>

            </div>

        </div>
    )





}
