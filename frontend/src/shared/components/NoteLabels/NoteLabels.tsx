

// import LabelItem from "../../../features/notes/components/LabelItem/LabelItem";
// import styles from "./NoteLabels.module.css";

// import type { Note } from "../../../types/api/note";



// type Props = {
//     labels:  Note["labels"];
//     onRemoveLabel: (labelId: number) => void;

// }



// export function NoteLabels({
//     labels,
//     onRemoveLabel,




// }: Props) {


//     return (


//         <div className={styles.labels}>

//             {labels.slice(0, 2).map((label) => (
//                 <LabelItem
//                     key={label.id}
//                         label={label}
//                         onRemoveLabel={handleRemoveNoteLabel}
//                     />
//                 ))}

//                 {labels.length > 2 && (
//                     <span className={styles.moreLabels}>
//                         他{labels.length - 2}件
//                     </span>
//                 )}

//             </div>
//     )


// }
