

import { useEffect, useRef } from "react";
import styles from "./NoteDetailModalEditor.module.css";



type Props = {
    title: string;
    // titleRef: React.RefObject<HTMLTextAreaElement | null>;

    content: string;
    // contentRef: React.RefObject<HTMLTextAreaElement | null>;

    onChangeTitle: (value: string) => void;
    onChangeContent: (value: string) => void;

    backgroundColor: string;


}


// 親: NoteDetailModal

export default function ({
    title,
    // titleRef,

    content,
    // contentRef,

    onChangeTitle,
    onChangeContent,

    backgroundColor,



}: Props) {


    const titleRef = useRef<HTMLTextAreaElement>(null);
    const contentRef = useRef<HTMLTextAreaElement>(null);



    // モーダルが最初に表示されたときにも、textareaの高さを内容に合わせる。
    useEffect(() => {

        if (titleRef.current) {
            titleRef.current.style.height = "auto";   // auto にする理由は、「前回設定した高さを一度消してから、今の文章に必要な高さを測り直すため」。
            titleRef.current.style.height =
                `${titleRef.current.scrollHeight}px`;   // 中身を全部表示するのに必要な高さを調べて、その高さをtextarea自身の高さに設定する。titleRef.current.scrollHeight: この textarea の中身を全部表示するには、何pxの高さが必要かを表す。
        }

        if (contentRef.current) {
            contentRef.current.style.height = "auto";
            contentRef.current.style.height =
                `${contentRef.current.scrollHeight}px`;
        }

    }, []);






    return (

        <div className={styles.content}>

            <textarea
                ref={titleRef}
                className={styles.titleInput}
                style={{ backgroundColor: backgroundColor }}
                value={title}
                onChange={(e) => {

                    onChangeTitle(e.target.value);

                    e.target.style.height = "auto";
                    e.target.style.height = `${e.target.scrollHeight}px`;
                }}
            />

            <textarea
                ref={contentRef}
                className={styles.contentInput}
                style={{ backgroundColor: backgroundColor }}
                value={content}
                onChange={(e) => {
                    onChangeContent(e.target.value);

                    e.target.style.height = "auto";
                    e.target.style.height = `${e.target.scrollHeight}px`;
                }}
            />
        </div>
    );
}
