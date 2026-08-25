import Menu from "../../../../../shared/ui/Menu/Menu";


type Props = {


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

            

        </Menu>


    )




}
