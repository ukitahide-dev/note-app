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


// ---- api ----
import { createLabel, getLabels } from "../../api/labelApi";
import { updateNoteLabels } from "../../api/noteApi";

//  ---- css ----
import cardStyles from "./SortableNoteCard.module.css";
import useLabels from "../../../labels/hooks/useLabels";









type Label = {
    id: number;
    name: string;
};

type Note = {
    id: number;
    title: string;
    content: string;
    labels:  Label[];  // labelsはLabel型の配列。ex) labels: [{id: 1, name: "ゲーム"}, {id: 2, name: "本"}]
};




type Props = {
    note: Note;
    openMenuId: number | null;
    onMoveToTrash: (id: number) => void;

    setOpenMenuId:
        React.Dispatch<
            React.SetStateAction<
                number | null
            >
        >;
};



// 親: NotesPage.tsx

export default function SortableNoteCard({ note, openMenuId, onMoveToTrash, setOpenMenuId}: Props) {
    const [isLabelOpen, setIsLabelOpen] = useState(false);
    // const [labels, setLabels] = useState<Label[]>([]);  // labelsはLabel型の配列。初期値は空の配列。
    // const [selectedLabels, setSelectedLabels] = useState<number[]>(
    //     note.labels.map(
    //         (label) => label.id
    //     )  // ex) selectedLabels = [1, 2, 3] チェックボックスの選択状態を管理するだけだから、id配列で取り出す。nameとか不要な情報は除く。
    // );

    const navigate = useNavigate();
    const cardRef = useRef<HTMLDivElement | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const labelPanelRef = useRef<HTMLDivElement | null>(null);

    const {
        labels,
        selectedLabels,
        handleCreateLabel,
        handleSelectLabel,
    } = useLabels(
        note.id,
        note.labels
    );



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




    // useEffect(() => {
    //     const fetchLabels = async () => {
    //         try {

    //             const data = await getLabels();
    //             setLabels(data);

    //         } catch (error) {

    //             console.error(error);

    //         }
    //     };

    //     fetchLabels();

    // }, []);




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




    // const handleCreateLabel = async (
    //     name: string
    // ) => {

    //     try {

    //         const newLabel = await createLabel(name);

    //         setLabels((prev) => [
    //             ...prev,
    //             newLabel,
    //         ]);

    //     } catch (error) {

    //         console.error(error);

    //     }
    // };


    // const handleSelectLabel = async (labelId: number) => {

    //     try {

    //         let newIds;

    //         if (selectedLabels.includes(labelId)) {

    //             newIds = selectedLabels.filter((id) => id !== labelId);

    //         } else {

    //             newIds = [...selectedLabels, labelId];
    //         }

    //         setSelectedLabels(newIds);

    //         await updateNoteLabels(note.id, newIds);

    //     } catch (error) {

    //         console.error(error);

    //     }

    // };






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
                // ref={cardRef}
                // className={cardStyles.card}
                onClick={() => navigate(`/notes/${note.id}`)}
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

                <button
                    className={cardStyles.menuButton}
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsLabelOpen(false);
                        setOpenMenuId((prev) =>
                            prev === note.id ? null : note.id
                        );
                    }}
                >
                    ⋮
                </button>

                {/* menu */}
                {openMenuId === note.id && (
                    isLabelOpen ? (
                        <LabelPanel
                            labels={labels}
                            labelPanelRef={labelPanelRef}
                            selectedLabels={selectedLabels}
                            onCreateLabel={handleCreateLabel}
                            onSelectLabel={handleSelectLabel}
                        />
                    ) : (

                    // ---- menu ----
                    <div
                        ref={menuRef}
                        className={cardStyles.menu}
                        onClick={(e) => e.stopPropagation()}
                    >

                        <button

                            onClick={() => {
                                // e.stopPropagation();
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

                        <button  onClick={() => onMoveToTrash(note.id)}>
                            削除
                        </button>

                    </div>
                    )
                )}
            </Card>
        </div>

    );
}
