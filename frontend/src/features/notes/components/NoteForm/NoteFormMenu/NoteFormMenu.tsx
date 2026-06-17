import Menu from "../../../../../shared/ui/Menu/Menu";


type Props = {
    // formRef:
    // setIsMenuOpen: React.Dispatch<
    //     React.SetStateAction<boolean>
    // >;
    // setIsLabelOpen: React.Dispatch<
    //     React.SetStateAction<boolean>
    // >;

    onOpenLabel: () => void;

    
}



// 親: NoteForm.tsx


export default function NoteFormMenu({
    onOpenLabel,
}: Props)
    {



    return (

        <Menu>
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

            {/* <button
                onClick={() => onMoveToTrash(noteId)}
            >
                削除

            </button> */}

        </Menu>


    )




}
