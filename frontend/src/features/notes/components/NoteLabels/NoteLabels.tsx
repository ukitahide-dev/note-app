

import LabelItem from "../../../../features/notes/components/LabelItem/LabelItem";


import type { Note } from "../../../../types/api/note";



type Props = {
    labels:  Note["labels"];   // Note の中にある labels プロパティと同じ型を使うという意味。Indexed Access Type（インデックスアクセス型）。
    onRemoveLabel: (labelId: number) => void;

}


// 親：NoteCard, NoteDetailModal,


export function NoteLabels({
    labels,
    onRemoveLabel,




}: Props) {


    return (

        <>

            {labels.map((label) => (
                <LabelItem
                    key={label.id}
                    label={label}
                    onRemoveLabel={onRemoveLabel}
                />
            ))}

        </>

        // <div className={styles.labels}>

        //     {labels.map((label) => (
        //         <LabelItem
        //             key={label.id}
        //             label={label}
        //             onRemoveLabel={onRemoveLabel}
        //         />
        //     ))}

        // </div>



        // <div className={styles.labels}>

        //     {labels.slice(0, 2).map((label) => (
        //         <LabelItem
        //             key={label.id}
        //                 label={label}
        //                 onRemoveLabel={onRemoveLabel}
        //             />
        //         ))}

        //         {labels.length > 2 && (
        //             <span className={styles.moreLabels}>
        //                 他{labels.length - 2}件
        //             </span>
        //         )}

        //     </div>
    )


}
