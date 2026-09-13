

import {
    useSortable,
} from "@dnd-kit/sortable";

import {
    CSS,
} from "@dnd-kit/utilities";


import NoteCard from "../NoteCard/NoteCard";



// ---- types ----
import type { Note } from "../../../../types/note";







type Props = {
    note: Note;


    openMenuId: number | null;

    openColorId: number | null;
    setOpenColorId: React.Dispatch<
            React.SetStateAction<
                number | null
            >
        >;



    setOpenMenuId:
        React.Dispatch<
            React.SetStateAction<
                number | null
            >
        >;

    openNoteDetailId: number | null;
    setOpenNoteDetailId: React.Dispatch<
            React.SetStateAction<
                number | null
            >
        >;




    onToggleFavorite: (
        id: number,
        is_favorite: boolean,
    ) => Promise<void>;


    onTogglePin: (
        id: number,
        is_pinned: boolean,
    ) => Promise<void>;

    panelType: "label" | null;

    setPanelType: React.Dispatch<
            React.SetStateAction<
                "label" | null
            >
        >;



};





// 親: NoteList.tsx



export default function SortableNoteCard({
    note,

    openMenuId,
    setOpenMenuId,
    openColorId,
    setOpenColorId,
    openNoteDetailId,
    setOpenNoteDetailId,

    onToggleFavorite,
    onTogglePin,
    panelType,
    setPanelType,

}: Props)
{

    // const [isLabelOpen, setIsLabelOpen] = useState(false);
    // const [tempColor, setTempColor] = useState(note.color);
    // const [selectedLabels, setSelectedLabels] = useState<number[]>(  // selectedLabels は「各ノート固有の状態」だから、このコンポーネント(各ノートのコンポ)に書く
    //     note.labels.map(
    //         (label) => label.id
    //     )  // ex) selectedLabels = [1, 2, 3] チェックボックスの選択状態を管理するだけだから、id配列で取り出す。nameとか不要な情報は除く。
    // );

    // const navigate = useNavigate();






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
        >

            <NoteCard
                note={note}

                openMenuId={openMenuId}
                setOpenMenuId={setOpenMenuId}
                openColorId={openColorId}
                setOpenColorId={setOpenColorId}

                openNoteDetailId={openNoteDetailId}
                setOpenNoteDetailId={setOpenNoteDetailId}


                dragHandleProps={{
                    ...attributes,
                    ...listeners,
                }}

                onToggleFavorite={onToggleFavorite}
                onTogglePin={onTogglePin}
                panelType={panelType}
                setPanelType={setPanelType}


            />

        </div>


    );
}


