
// ---- react ----
import { useEffect, useState } from "react";



// ---- api ----
import { createLabel, getLabels } from "../../notes/api/labelApi";





type Label = {
    id: number;
    name: string;
};



// 役割: ラベル一覧管理　Sidebar、NoteForm、SortableNoteCard、LabelPanelでも使う。だから共通データとしてここにまとめて、使いたいファイルから呼び出す形にする。


export default function useLabels(
    // noteId: number,
    // initialLabels: Label[]
) {


    // ---- 全ラベル一覧 ----
    const [labels, setLabels] = useState<Label[]>([]);


    // ラベル一覧取得
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




    // ラベル作成
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



    return {

        labels,
        handleCreateLabel,

    };
}
