import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
    useSortable,
} from "@dnd-kit/sortable";

import {
    CSS,
} from "@dnd-kit/utilities";


// ---- components ----
import LabelPanel from "./LabelPanel/LabelPanel";


// ---- shared ----
import Card from "../../../../shared/ui/Card/Card";


// // ---- Zustand ----
// import { useLabelStore } from "../../../labels/store/labelStore";


// ---- api ----
// import { createLabel, getLabels } from "../../api/labelApi";
import { updateNoteColor, updateNoteLabels } from "../../api/noteApi";

//  ---- css ----
import cardStyles from "./SortableNoteCard.module.css";
import NoteMenu from "./NoteMenu/NoteMenu";
import ColorPalette from "../../../../shared/ui/ColorPalette/ColorPalette";
// import useLabels from "../../../labels/hooks/useLabels";







type Label = {
    id: number;
    name: string;
};

type Note = {
    id: number;
    title: string;
    content: string;
    color: string;
    labels:  Label[];  // labelsはLabel型の配列。ex) labels: [{id: 1, name: "ゲーム"}, {id: 2, name: "本"}]
};




type Props = {
    note: Note;
    setNotes: React.Dispatch<
        React.SetStateAction<Note[]>
    >;

    openMenuId: number | null;

    openColorId: number | null;
    setOpenColorId: React.Dispatch<
            React.SetStateAction<
                number | null
            >
        >;

    onMoveToTrash: (id: number) => void;

    setOpenMenuId:
        React.Dispatch<
            React.SetStateAction<
                number | null
            >
        >;
};





// 親: NotesPage.tsx

export default function SortableNoteCard({
    note,
    setNotes,
    openMenuId,
    openColorId,
    setOpenColorId,
    onMoveToTrash,
    setOpenMenuId}: Props)
{

    const [isLabelOpen, setIsLabelOpen] = useState(false);
    const [tempColor, setTempColor] = useState(note.color);
    const [selectedLabels, setSelectedLabels] = useState<number[]>(  // selectedLabels は「各ノート固有の状態」だから、このコンポーネント(各ノートのコンポ)に書く
        note.labels.map(
            (label) => label.id
        )  // ex) selectedLabels = [1, 2, 3] チェックボックスの選択状態を管理するだけだから、id配列で取り出す。nameとか不要な情報は除く。
    );

    const navigate = useNavigate();

    const cardRef = useRef<HTMLDivElement | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const labelPanelRef = useRef<HTMLDivElement | null>(null);




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



    useEffect(() => {

        const handleClickOutside = (
            event: MouseEvent
        ) => {


            if (
                cardRef.current &&
                !cardRef.current.contains(event.target as Node) &&  // event.targetは実際にクリックされた要素。ex) <button>ラベル追加</button>
                (!menuRef.current || !menuRef.current.contains(event.target as Node)) &&
                (!labelPanelRef.current || !labelPanelRef.current.contains(event.target as Node))
            ) {
                setOpenMenuId(null);
                setIsLabelOpen(false);
            }

        };

        document.addEventListener(
            "click",
            // "mousedown",  mousedownにすると、LabelPanelが開かなくなる。reactのクリックイベントよりも先に実行され、LabelPanelRefが存在しない状態になり、handleClickOutsideの条件に引っかかるから。
            handleClickOutside
        );


        return () => {
            document.removeEventListener(
                "click",
                // "mousedown",
                handleClickOutside
            );
        };

    }, [setOpenMenuId]);




    const updateLabels = async (
        newIds: number[]
    ) => {

        setSelectedLabels(newIds);

        const updatedNote = await updateNoteLabels(note.id, newIds);

        // これで、ラベル追加・削除と同時に、各ノートのラベル名表示も反映される。
        setNotes((prev) =>
            prev.map((n) =>
                n.id === note.id ? updatedNote : n
            )
        );

    }




    const handleSelectLabel = async (labelId: number) => {

        try {

            let newIds;

            if (selectedLabels.includes(labelId)) {

                newIds = selectedLabels.filter((id) => id !== labelId);

            } else {

                newIds = [...selectedLabels, labelId];
            }

            updateLabels(newIds);

        } catch (error) {

            console.error(error);

        }

    };




    const handleRemoveLabel = async (
        labelId: number
    ) => {

        try {

            const newIds = selectedLabels.filter((id) => id !== labelId);

            updateLabels(newIds);

        } catch (error) {

            console.error(error);

        }
    };


    const handleSelectColor = (
        color: string
    ) => {
        setTempColor(color);
    }



    const handleClosePalette = async () => {

        try {

            const updatedNote = await updateNoteColor(note.id, tempColor);

            setNotes((prev) => (
                prev.map((n) =>
                    n.id === note.id ? updatedNote : n
                )
            ));

            setOpenColorId(null);

        } catch (error) {

            console.error(error);

        }

    }




    return (
        <div
            style={style}
            ref={(node) => {
                setNodeRef(node);
                cardRef.current = node;
            }}
            // ref={setNodeRef}
        >
            <Card
                style={{ backgroundColor: tempColor, }}
                onClick={() => navigate(`/notes/${note.id}`)}
                // ref={cardRef}
                // className={cardStyles.card}
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

                <div className={cardStyles.labels}>
                    {note.labels.map((label) => (
                        <div
                            key={label.id}
                            className={cardStyles.label}
                        >
                            <span

                            >
                                {label.name}
                            </span>

                            <button
                                className={cardStyles.removeLabel}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveLabel(
                                        label.id
                                    );
                                }}
                            >
                                ×
                            </button>

                        </div>
                    ))}

                </div>

                <div className={cardStyles.buttons}>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(null);
                            setOpenColorId((prev) => prev === note.id ? null : note.id);
                        }}
                    >
                        🎨
                    </button>

                    <button
                        className={cardStyles.menuButton}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsLabelOpen(false);
                            setOpenColorId(null);
                            setOpenMenuId((prev) => prev === note.id ? null : note.id);
                        }}
                    >
                        ⋮
                    </button>

                </div>


                {openMenuId === note.id && (
                    isLabelOpen ? (
                        <LabelPanel
                            // labels={labels}
                            labelPanelRef={labelPanelRef}
                            selectedLabels={selectedLabels}
                            // onCreateLabel={handleCreateLabel}
                            onSelectLabel={handleSelectLabel}
                        />
                    ) : (

                    // ---- menu ----
                    <NoteMenu
                        menuRef={menuRef}
                        setIsLabelOpen={setIsLabelOpen}
                        onMoveToTrash={onMoveToTrash}
                        noteId={note.id}
                    />

                    )
                )}


                {/* 背景色 */}
                {openColorId === note.id && (
                    <ColorPalette
                        onSelectColor={handleSelectColor}
                        onClose={handleClosePalette}

                    />


                )}


            </Card>
        </div>

    );
}


