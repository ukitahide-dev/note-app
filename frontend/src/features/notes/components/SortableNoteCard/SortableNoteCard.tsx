import { useNavigate } from "react-router-dom";

import {
    useSortable,
} from "@dnd-kit/sortable";

import {
    CSS,
} from "@dnd-kit/utilities";

import styles from "../../pages/NotesPage.module.css";
import cardStyles from "./SortableNoteCard.module.css";


type Note = {
    id: number;
    title: string;
    content: string;
};

type Props = {
    note: Note;
};



export default function SortableNoteCard({ note }: Props) {
    const navigate = useNavigate();

    // 分割代入で、useSortableが取得したものを取り出している。
    const {
        attributes,  // drag用HTML属性
        listeners,  // dragイベント
        setNodeRef,  //「drag対象DOM教えて」
        transform,  // 移動量
        transition,  // アニメーション設定
    } = useSortable({  // useSortableは、この要素はsortableだとdnd-kitへ登録するhook。
        id: note.id,  // ex) id=1のノートはドラッグできる。
    });



    const style = {
        transform: CSS.Transform.toString(
            transform
        ),
        transition,
    };



    return (
        <div
            ref={setNodeRef}
            style={style}
            className={styles.card}
            onClick={() => navigate(`/notes/${note.id}`)}
        >

            <div
                {...attributes}
                {...listeners}  // drag開始用イベントまとめ。☰を掴んだ時だけdrag開始
                className={cardStyles.dragHandle}
            >
                ☰
            </div>

            <h3>{note.title}</h3>
            <p>{note.content}</p>

        </div>

    );
}
