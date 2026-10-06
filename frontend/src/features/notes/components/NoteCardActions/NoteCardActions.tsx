import type { Note } from "../../../../types/api/note";
import Tooltip from "../../../../shared/components/Tooltip/Tooltip";



import styles from "./NoteCardActions.module.css";

type Props = {
    note: Note;
    // selected: boolean;
    onToggleFavorite: () => void;   // 引数なしで、あとから呼び出せる関数をください
    onOpenColor: () => void;
    onOpenImage: () => void;
    onOpenMenu: () => void;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

};


// 親: NoteCard,
// 役割: ノートに対する操作ボタンを表示して、クリックされたら親に知らせる。

export default function NoteCardActions({
    note,
    onToggleFavorite,
    onOpenColor,
    onOpenImage,
    onOpenMenu,
    fileInputRef,
    onImageChange,

}: Props) {


    return (

        <div className={styles.buttons}>

            <div className={styles.leftButtons}>

                <Tooltip text="色を変更">

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onOpenColor();
                        }}
                    >
                        🎨
                    </button>

                </Tooltip>

                <Tooltip
                    text={
                        note.is_favorite
                            ? "お気に入りを解除"
                            : "お気に入りに登録"
                    }
                >
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite();
                        }}
                    >
                        {note.is_favorite ? "❤️" : "🤍"}
                    </button>

                </Tooltip>

                <Tooltip text="画像を追加">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onOpenImage();
                        }}
                    >
                        📷
                    </button>

                </Tooltip>

                <Tooltip text="閲覧数">
                    <span>👀 {note.view_count}</span>
                </Tooltip>

                <Tooltip text="閲覧時間">
                    <span>🕑 {note.total_view_seconds}秒</span>
                </Tooltip>

                <input
                    onClick={(e) => e.stopPropagation()}
                    ref={fileInputRef}
                    type="file"
                    hidden
                    onChange={onImageChange}

                />

            </div>

            <Tooltip text="その他">

                <button
                    className={styles.menuButton}
                    onClick={(e) => {
                        e.stopPropagation();
                        onOpenMenu();
                    }}
                >
                    ⋮
                </button>

            </Tooltip>

        </div>

    );
}
