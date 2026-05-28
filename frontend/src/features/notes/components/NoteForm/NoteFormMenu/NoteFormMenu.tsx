import Menu from "../../../../../shared/ui/Menu/Menu";


type Props = {
    // formRef:
    setIsMenuOpen: React.Dispatch<
        React.SetStateAction<boolean>
    >;
    setIsLabelOpen: React.Dispatch<
        React.SetStateAction<boolean>
    >;
}



// 親: NoteForm.tsx


export default function NoteFormMenu({
    setIsMenuOpen,
    setIsLabelOpen,
}: Props)
    {



    return (

        <Menu>
            <button
                onClick={() => {
                    setIsMenuOpen(false);
                    setIsLabelOpen((prev) => !prev);
                }}
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
