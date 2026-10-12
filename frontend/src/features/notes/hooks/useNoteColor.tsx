import { useEffect, useState } from "react";
import type { Note } from "../../../types/api/note";

import { useNoteStore } from "../store/useNoteStore";

// ノートの色を変更するために必要な状態・操作・保存処理を、ひとまとまりの機能として管理する
// 色変更機能のロジックを担当する hook
// NoteCardから色変更に関する状態・処理を切り離して、色変更という1つの機能としてまとめるためのhook
// 「色変更という機能のロジックを、UIから分離する」ことが目的。



export function useNoteColor(
    note: Note,

) {


    const [tempColor, setTempColor] = useState(note.color);


    // store
    const { updateNoteColor } = useNoteStore();


    // useStateで定義したtempColorは初回マウント時しか値を取得しない。だから、これを書くことで、モーダルから色を変更し、setNotesを更新したときに、tempColorが変更後の色を取得できるようになる。
    useEffect(() => {
        setTempColor(note.color);
    }, [note.color]);



    const handleSelectColor = (
        color: string

    ) => {

        setTempColor(color);

    };


    const saveColor = async () => {

        await updateNoteColor(note.id, tempColor);

    };


    return {
        tempColor,
        handleSelectColor,
        saveColor,
        
    };
}
