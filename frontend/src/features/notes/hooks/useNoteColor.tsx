

import { useEffect, useState } from "react";
import type { Note } from "../../../types/note";
// import { updateNoteColor } from "../api/noteApi";
import { useNoteStore } from "../store/useNoteStore";



export function useNoteColor(
    note: Note,
) {


    const [tempColor, setTempColor] = useState(note.color);


    const {
        updateNoteColor,
    } = useNoteStore();



    // useStateで定義したtempColorは初回マウント時しか値を取得しない。だから、これを書くことで、モーダルから色を変更し、setNotesを更新したときに、tempColorが変更後の色を取得できるようになる。
    useEffect(() => {
        setTempColor(note.color);
    }, [note.color]);




    const handleSelectColor = (
        color: string,
    ) => {
        console.log("選択", note.id, color);
        // console.log("選択", color);
        setTempColor(color);
        // console.log(`handleSelectColor内のtempColor: ${tempColor}`);

    }



    const saveColor = async () => {
        console.log("保存", note.id, tempColor);

        // console.log(`saveColor内のtempColor: ${tempColor}`);

        await updateNoteColor(note.id, tempColor);

        // try {

        //     await updateNoteColor(note.id, tempColor);
        //     // const updatedNote = await updateNoteColor(note.id, tempColor);
        //     // updateNote(updatedNote);


        // } catch (error) {

        //     console.error(error);
        // }


    }




    return {
        tempColor,
        handleSelectColor,
        saveColor,
    }



}
