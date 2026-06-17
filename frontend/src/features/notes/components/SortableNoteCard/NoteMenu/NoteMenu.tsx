import Menu from "../../../../../shared/ui/Menu/Menu";
import { useNoteLabels } from "../../../hooks/useNoteLabels";



type Props = {
    menuRef?: React.RefObject<HTMLDivElement | null>;

    // setIsLabelOpen: React.Dispatch<
    //     React.SetStateAction<boolean>
    // >;

    onOpenLabel: () => void;

    onMoveToTrash: () => void;

    // noteId: number;

    onDuplicateNote: (

    ) => void;
};






export default function NoteMenu({
    menuRef,
    onOpenLabel,
    onMoveToTrash,
    // noteId,

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

            <button>
                色変更
            </button>

            <button>
                ピン留め
            </button>

            <button
                onClick={onDuplicateNote}
            >
                コピーを作成
            </button>

            <button
                onClick={onMoveToTrash}
            >
                削除

            </button>


        </Menu>


    )



}
