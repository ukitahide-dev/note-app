import { useState, useRef } from "react";
import { createNote } from "../../api/noteApi";


//  ---- css ----
import styles from "./NoteForm.module.css";




// 親: NotesPage.tsx



type Note = {
        id: number;
        title: string;
        content: string;
    };


// Propsオブジェクトの型定義   onAddNoteというプロパティにはnewNoteを引数に受け取る関数が入るという意味
type Props = {
    onAddNote: (
        newNote: Note   // newNoteという変数はNote型という意味
    ) => void;
};



export default function NoteForm({ onAddNote }: Props) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);

    const textareaRef = useRef<HTMLTextAreaElement | null>(null);  // textarea要素を保存する箱を作る




    const handleSubmit = async (
        e: React.SyntheticEvent
    ) => {

        e.preventDefault();

        try {

            const newNote = await createNote(title, content);

            onAddNote(newNote);

            alert("投稿成功");

            setTitle("");
            setContent("");
            setIsExpanded(false);

    } catch (error) {

            console.error(error.response.data)

            alert("投稿失敗");
        }
    }


    const handleContentChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {

        setContent(e.target.value);

        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";  // autoはブラウザに自然な高さを決めてもらうという意味。これにより、文字を削除して行数が減っていくと、自動的に自然な高さになってくれる。
            textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";  // scrollHeightは中身を全部表示するのに必要な高さ(隠れてる部分も含めた本当の高さ)という意味。これにより、maxHeightを超えるまで、textarea自体の高さが伸びてくれる。
        }
    };







    return (

        <form
            onSubmit={handleSubmit}
            className={styles.form}
        >

            {isExpanded && (
                <input
                    type="text"
                    placeholder="タイトル"
                    value={title}
                    onChange={(e) =>
                        setTitle(e.target.value)
                    }
                    className={styles.titleInput}
                />
            )}


            {/* ノート内容 */}
            <textarea
                ref={textareaRef}   // こう書くと、textarea実物をtextareaRef.currentで取得できる
                placeholder="ノートを入力..."
                value={content}
                onFocus={() =>
                    setIsExpanded(true)
                }
                onChange={handleContentChange}
                className={styles.contentInput}
            />


            {/* 投稿ボタン */}
            {isExpanded && (
                <div className={styles.actions}>

                    <button
                        type="submit"
                        className={styles.submitButton}
                    >
                        投稿
                    </button>

                </div>
            )}

        </form>
    )




}
