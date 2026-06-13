// // ---- react ----
// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";

// //

// // ---- api ----
// import { getNote, updateNote } from "../api/noteApi";


// //  ---- css ----
// import styles from "./NoteDetailPage.module.css";



// type Note = {
//     id: number;
//     title: string;
//     content: string;
// };






// export default function NoteDetail() {

//     const { id } = useParams();
//     console.log(`id: ${id}`);

//     const navigate = useNavigate();

//     const [note, setNote] = useState<Note | null>(null);
//     const [title, setTitle] = useState("");
//     const [content, setContent] = useState("");


//     useEffect(() => {
//         const fetchNote = async () => {
//             const data = await getNote(Number(id));
//             setNote(data);
//             setTitle(data.title);
//             setContent(data.content);
//         };

//         fetchNote();
//     }, [id]);


//     if (!note) return null;



//     const handleClose = async () => {
//         try {
//             await updateNote(Number(id), title, content);
//             navigate("/notes");  // NotesPage.tsxへ飛ばす。保存後にノート一覧画面を見せるため。
//         } catch (error) {
//             console.error(error);
//             alert("保存失敗");
//         }

//     }



//     return (
//         <div
//             className={styles.overlay}
//             onClick={handleClose}
//         >

//             <div
//                 className={styles.modal}
//                 onClick={(e) => e.stopPropagation()}
//             >

//                 <input
//                     className={styles.titleInput}
//                     value={title}
//                     onChange={(e) => setTitle(e.target.value)}
//                 />

//                 <textarea
//                     className={styles.contentInput}
//                     value={content}
//                     onChange={(e) => setContent(e.target.value)}
//                 />


//                 <button
//                     className={styles.button}
//                     onClick={handleClose}
//                 >
//                     閉じる
//                 </button>

//             </div>

//         </div>
//     );
// }
