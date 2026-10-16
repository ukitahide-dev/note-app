

import LabelItem from "../../../../features/notes/components/LabelItem/LabelItem";


import type { Note } from "../../../../types/api/note";



type Props = {
    labels:  Note["labels"];   // Note の中にある labels プロパティと同じ型を使うという意味。Indexed Access Type（インデックスアクセス型）。
    onRemoveLabel: (labelId: number) => void;

}


// 親：NoteCard, NoteDetailModal,
// 役割: 各ノートが所持しているラベルを、ノートカードに表示する。


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

        
    )


}
