import Menu from "../../../../../shared/ui/Menu/Menu";
import { useNoteLabels } from "../../../hooks/useNoteLabels";



type Props = {
    menuRef?: React.RefObject<HTMLDivElement | null>;

    // setIsLabelOpen: React.Dispatch<
    //     React.SetStateAction<boolean>
    // >;

    onOpenLabel: () => void;

    onMoveToTrash: (id: number) => void;

    noteId: number;
};




export default function NoteMenu({
    menuRef,
    onOpenLabel,
    onMoveToTrash,
    noteId,

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
                onClick={() => onMoveToTrash(noteId)}
            >
                削除

            </button>


        </Menu>


    )



}
