import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    useSortable,
} from "@dnd-kit/sortable";

import {
    CSS,
} from "@dnd-kit/utilities";


// ---- components ----
import LabelPanel from "./LabelPanel/LabelPanel";


//  ---- css ----
// import styles from "../../pages/NotesPage.module.css";
import cardStyles from "./SortableNoteCard.module.css";
import Card from "../../../../shared/ui/Card/Card";
import { createLabel, getLabels } from "../../api/labelApi";
import { updateNoteLabels } from "../../api/noteApi";






// 親: NotesPage.tsx


type Note = {
    id: number;
    title: string;
    content: string;
};


type Label = {
    id: number;
    name: string;
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





export default function SortableNoteCard({ note, openMenuId, onMoveToTrash, setOpenMenuId}: Props) {
    const [isLabelOpen, setIsLabelOpen] = useState(false);
    const [labels, setLabels] = useState<Label[]>([]);
    const navigate = useNavigate();


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
        const fetchLabels = async () => {
            try {

                const data = await getLabels();
                setLabels(data);

            } catch (error) {

                console.error(error);

            }
        };

        fetchLabels();

    }, []);




    const handleCreateLabel = async (
        name: string
    ) => {

        try {

            const newLabel = await createLabel(name);

            setLabels((prev) => [
                ...prev,
                newLabel,
            ]);

        } catch (error) {

            console.error(error);

        }
    };


    const handleSelectLabel = async (
        labelId: number
    ) => {

        try {

            await updateNoteLabels(note.id,[labelId]);

        } catch (error) {

            console.error(error);

        }
    };






    return (
        <div
            ref={setNodeRef}
            style={style}
        >
            <Card
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
                            onBack={() => setIsLabelOpen(false)}
                            onCreateLabel={handleCreateLabel}
                            onSelectLabel={handleSelectLabel}
                            // onSelectLabel={() => console.log('hoge')}
                        />
                    ) : (

                    <div
                        className={cardStyles.menu}
                        onClick={(e) =>e.stopPropagation()}
                    >

                        <button onClick={() => setIsLabelOpen(true)}>
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
