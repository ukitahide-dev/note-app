// import { useEffect, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";

import {
    useSortable,
} from "@dnd-kit/sortable";

import {
    CSS,
} from "@dnd-kit/utilities";


// ---- components ----
// import LabelPanel from "./LabelPanel/LabelPanel";


// ---- shared ----
// import Card from "../../../../shared/ui/Card/Card";


// ---- api ----
// import { updateNoteColor, updateNoteFavorite, updateNoteLabels } from "../../api/noteApi";


// ---- shared ----
// import ColorPalette from "../../../../shared/ui/ColorPalette/ColorPalette";


//  ---- css ----
// import cardStyles from "./SortableNoteCard.module.css";
// import NoteMenu from "./NoteMenu/NoteMenu";
import NoteCard from "../NoteCard/NoteCard";



// ---- types ----
import type { Note } from "../../../../types/note";





// type Label = {
//     id: number;
//     name: string;
// };

// type Note = {
//     id: number;
//     title: string;
//     content: string;
//     color: string;
//     is_favorite: boolean;
//     labels:  Label[];  // labelsはLabel型の配列。ex) labels: [{id: 1, name: "ゲーム"}, {id: 2, name: "本"}]
// };




type Props = {
    note: Note;
    // setNotes: React.Dispatch<
    //     React.SetStateAction<Note[]>
    // >;

    openMenuId: number | null;

    openColorId: number | null;
    setOpenColorId: React.Dispatch<
            React.SetStateAction<
                number | null
            >
        >;

    // onMoveToTrash: (id: number) => void;

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

    // onSave: (
    //     id: number,
    //     title: string,
    //     content: string,
    // ) => Promise<void>;

    // onUpdateColor: (
    //     id: number,
    //     color: string,
    // ) => Promise<void>;


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


    // onDuplicateNote: (
    //     note: Note,
    // ) => Promise<void>
};





// 親: NoteList.tsx



export default function SortableNoteCard({
    note,
    // setNotes,
    openMenuId,
    setOpenMenuId,
    openColorId,
    setOpenColorId,
    openNoteDetailId,
    setOpenNoteDetailId,
    // onSave,
    // onUpdateColor,
    // onMoveToTrash,
    onToggleFavorite,
    onTogglePin,
    panelType,
    setPanelType,
    // onDuplicateNote
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
                // setNotes={setNotes}
                openMenuId={openMenuId}
                setOpenMenuId={setOpenMenuId}
                openColorId={openColorId}
                setOpenColorId={setOpenColorId}
                // onMoveToTrash={onMoveToTrash}
                openNoteDetailId={openNoteDetailId}
                setOpenNoteDetailId={setOpenNoteDetailId}
                // onSave={onSave}
                // onUpdateColor={onUpdateColor}

                dragHandleProps={{
                    ...attributes,
                    ...listeners,
                }}

                onToggleFavorite={onToggleFavorite}
                onTogglePin={onTogglePin}
                panelType={panelType}
                setPanelType={setPanelType}

                // onDuplicateNote={onDuplicateNote}
            />
        </div>


    );
}


