// ---- react ----
import { useEffect, useState } from "react";



// ---- labelStore ----
import { useLabelStore } from "../../../../features/labels/store/labelStore";



// ---- css ----
import styles from "./LabelEditModal.module.css"



type Props = {
    onClose: () => void
}


// 親: Sidebar.tsx


export default function LabelEditModal({
    onClose
}: Props) {

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editedNames, setEditedNames] = useState<Record<number, string>>({});  // ID（number）をキーにして、ラベル名（string）を保存するオブジェクトの型

    const {
        labels,
        handleUpdateLabel,
        handleDeleteLabel,
    } = useLabelStore();




    useEffect(() => {
        setEditedNames(
            Object.fromEntries(  // Object.fromEntriesはキーと値のペアの二次元配列を、オブジェクトに変換するメソッド。
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

                await handleUpdateLabel(label.id, newName);

            }
        }

        setEditingId(null);
        onClose();
    }





    return (
        <div className={styles.modalOverlay}
            onClick={onClose}
        >

            <div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
            >

                <h2>ラベルの編集</h2>

                {labels.map((label) => (
                    <div
                        key={label.id}
                        className={styles.labelRow}
                    >
                        <button
                            className={styles.iconButton}
                            onClick={() => handleDeleteLabel(label.id)}

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
