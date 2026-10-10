
import { useEffect, useRef } from "react";
import { useNoteStore } from "../store/useNoteStore";
import type { Note } from "../../../types/api/note";



type Props = {
    note: Note;
    title: string;
    content: string;
    tempColor: string;
    onClose: () => void;
};


// 呼び出し元: NoteDetailModal
// ノート詳細画面を開いてから閉じるまでの処理 を一つの機能としてまとめた


export default function useNoteDetailSession({
    note,
    title,
    content,
    tempColor,
    onClose,


}: Props) {


    // useRefの理由: 値を保存しておきたいけど、その値が変わったことで再レンダリングする必要はないから。
    const closed = useRef(false);   // { current: false }

    const viewed = useRef(false);   // このモーダルはもう閲覧数加算処理を実行したか？を記録する箱。{ current: false }
    const startTime = useRef(0);    // ノート詳細を開いた瞬間の時刻を保存しておく箱。{ current: 0 }という箱ができる。


    // Store
    const {
        incrementNoteView,
        updateNote,
        updateNoteColor,
        updateNoteViewTime,

    } = useNoteStore();






    useEffect(() => {

        console.log(viewed);

        if (viewed.current) {  // 開発環境で StrictMode が有効だと、React はマウント時の useEffect を意図的にもう一度実行することがある。
            // Reactの開発環境で StrictMode が有効のせいで、useEffectが2回実行され、閲覧数が+2される。それを防ぐためのコード。
            return;
        }

        startTime.current = Date.now();   // 「ノートを開いた時刻を記録する」

        viewed.current = true;

        incrementNoteView(note.id);

    }, [note.id]); // note.id が変わったときに、この処理を実行する





    const handleClose = async () => {

        if (closed.current) return;

        closed.current = true;

        const seconds = Math.floor(
            (Date.now() - startTime.current) / 1000,
        );

        await updateNoteViewTime(note.id, seconds);

        if (title !== note.title || content !== note.content) {
            await updateNote(note.id, title, content);
        }

        if (tempColor !== note.color) {
            await updateNoteColor(note.id, tempColor);
        }

        onClose();


    };



    return {
        handleClose,
    };


}
