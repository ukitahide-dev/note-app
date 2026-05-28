import { useState, useRef, useEffect } from "react";
import { createNote } from "../../api/noteApi";


//  ---- css ----
import styles from "./NoteForm.module.css";
import NoteFormMenu from "./NoteFormMenu/NoteFormMenu";
import LabelPanel from "../SortableNoteCard/LabelPanel/LabelPanel";








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



// 親：NotesPage.jsx


export default function NoteForm({ onAddNote }: Props) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLabelOpen, setIsLabelOpen] = useState(false);
    const [selectedLabels, setSelectedLabels] = useState<number[]>([]);

    const textareaRef = useRef<HTMLTextAreaElement | null>(null);  // useRefは値を保存する箱を作る。ここでは、textarea要素を保存する箱を作っている。
    const formRef = useRef<HTMLFormElement | null>(null);



    const handleSubmit = async (
        e: React.SyntheticEvent
    ) => {

        e.preventDefault();

        try {

            const newNote = await createNote(title, content, selectedLabels);

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
        e: React.ChangeEvent<HTMLTextAreaElement>  // eはtextareaで発生したchangeイベントであるという型定義。
    ) => {

        setContent(e.target.value);

        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";  // autoはブラウザに自然な高さを決めてもらうという意味。これにより、文字を削除して行数が減っていくと、自動的に自然な高さになってくれる。
            textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";  // scrollHeightは中身を全部表示するのに必要な高さ(隠れてる部分も含めた本当の高さ)という意味。これにより、maxHeightを超えるまで、textarea自体の高さが伸びてくれる。
        }
    };



    const handleSelectLabel = (
        labelId: number
    ) => {
        if (selectedLabels.includes(labelId)) {

            setSelectedLabels(selectedLabels.filter((id) => id !== labelId));

        } else {

            setSelectedLabels([
                ...selectedLabels,
                labelId
            ]);
        }
    }


    // useEffectは画面レンダリング後(DOM要素完成後)に実行される。だから、ここにaddEventListenerなどの副作用処理を書く。
    useEffect(() => {

        const handleClickOutside = (
            e: MouseEvent
        ) => {

            // form存在する &&
            // クリック場所がform外
            if (
                formRef.current &&
                !formRef.current.contains(e.target as Node)
            ) {
                setIsExpanded(false);
                setIsMenuOpen(false);
                setIsLabelOpen(false);

                console.log(`formRef.current: ${formRef.current}`);
                console.log(e.target);
            }
            console.log(e.target);
        };



        document.addEventListener("mousedown", handleClickOutside);  // document全体でmousedownを監視する。mousedownはマウスを押した瞬間のこと。画面どこクリックしてもhandleClickOutsideを実行する。


        // useEffectのreturnはクリーンアップの役割。このコンポーネントが消えるときに実行される。mousedownイベントを解除する。これを書かないと、このNoteFormコンポーネントが消えた後も、mousedownイベントが登録されたままになってしまう。
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };

    }, []);  // []は初回レンダリング時の時だけ、useEffect内を実行するという意味。






    return (

        <form
            ref={formRef}
            className={styles.form}
            onSubmit={handleSubmit}
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
                onFocus={() => setIsExpanded(true)}
                onChange={handleContentChange}
                className={styles.contentInput}
            />


            {/* 投稿ボタン */}
            {isExpanded && (
                <div className={styles.bottom}>
                    <div className={styles.menus}>
                        <button
                            type="button"
                            onClick={() => setIsMenuOpen(true)}
                        >
                                ...
                        </button>

                    </div>
                    <div className={styles.actions}>

                        <button
                            type="submit"
                            className={styles.submitButton}
                        >
                            投稿
                        </button>

                    </div>

                    {isMenuOpen && (
                        <NoteFormMenu
                            setIsMenuOpen={setIsMenuOpen}
                            setIsLabelOpen={setIsLabelOpen}

                        />
                    )}

                    {isLabelOpen && (
                        <LabelPanel
                            selectedLabels={selectedLabels}
                            onSelectLabel={handleSelectLabel}
                        />
                    )}
                </div>
            )}

        </form>
    )


}
