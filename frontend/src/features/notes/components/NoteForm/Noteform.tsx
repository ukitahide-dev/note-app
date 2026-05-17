import { useState } from "react";
import { createNote } from "../../api/noteApi";



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



export default function NoteForm({onAddNote}: Props) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");





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

    } catch (error) {

            console.error(error.response.data)

            alert("投稿失敗");
        }

    }




    return (

        <form onSubmit={handleSubmit}>
            <div>
                <input
                    type="text"
                    placeholder="タイトル"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            <div>
                <input
                    type="text"
                    placeholder="テキスト"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </div>

            <button type="submit">
                投稿
            </button>
        </form>
    )




}
