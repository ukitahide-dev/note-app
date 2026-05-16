import { useState } from "react";



export default function NoteForm() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");




    const handleSubmit = async (
        e: React.SyntheticEvent
    ) => {

        e.preventDefault();

        console.log(title);
        console.log(content);

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
