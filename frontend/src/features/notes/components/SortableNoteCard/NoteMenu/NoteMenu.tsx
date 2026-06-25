import Menu from "../../../../../shared/ui/Menu/Menu";
import { useNoteLabels } from "../../../hooks/useNoteLabels";



type Props = {
    menuRef?: React.RefObject<HTMLDivElement | null>;


    onOpenLabel: () => void;

    onMoveToTrash: () => void;

    onDuplicateNote: (

    ) => void;
};






export default function NoteMenu({
    menuRef,
    onOpenLabel,
    onMoveToTrash,
    onDuplicateNote,

}: Props) {




    return (
        <Menu
            menuRef={menuRef}
        >
            <button
                onClick={onOpenLabel}
            >
                ラベル追加
            </button>


            <button
                onClick={onDuplicateNote}  // 複製したことを親に通知するだけ。親がどんな状態を持っているかとかは、子は把握していない。
            >
                コピーを作成
            </button>

            <button
                onClick={onMoveToTrash}  // 削除したことを親に通知するだけ。
            >
                削除

            </button>


        </Menu>


    )



}
