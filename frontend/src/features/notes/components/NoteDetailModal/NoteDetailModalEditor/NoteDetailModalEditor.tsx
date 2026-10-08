

import styles from "./NoteDetailModalEditor.module.css";



type Props = {
    title: string;
    titleRef: React.RefObject<HTMLTextAreaElement | null>;

    content: string;
    contentRef: React.RefObject<HTMLTextAreaElement | null>;

    onChangeTitle: (value: string) => void;
    onChangeContent: (value: string) => void;

    backgroundColor: string;


}


// 親: NoteDetailModal

export default function ({
    title,
    titleRef,

    content,
    contentRef,

    onChangeTitle,
    onChangeContent,

    backgroundColor,



}: Props) {

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
