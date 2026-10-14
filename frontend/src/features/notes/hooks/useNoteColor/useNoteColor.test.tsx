import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useNoteColor } from "./useNoteColor";
import type { Note } from "../../../../types/api/note";



// Storeの関数をモックする
const mocks = vi.hoisted(() => ({
    updateNoteColor: vi.fn(),
}));



vi.mock("../../store/useNoteStore", () => ({
    useNoteStore: () => ({
        updateNoteColor: mocks.updateNoteColor,
    }),
}));



// テストごとに使うノートを作成する関数
const createNote = (
    overrides: Partial<Note> = {},    // Partial<Note>: Note 型のプロパティをすべて「省略してもOK」にする型。Partial<Note> は、createNote関数 にノートの一部だけを渡せるようにするために使っている。

): Note => ({

    id: 1,
    title: "テストタイトル",
    content: "テスト本文",
    color: "#ffffff",
    is_favorite: false,
    is_pinned: false,
    labels: [],
    images: [],
    view_count: 0,
    total_view_seconds: 0,
    created_at: "2026-10-10T00:00:00Z",
    order: 0,
    pinned_order: 0,
    ...overrides,

});



describe("useNoteColor", () => {

    beforeEach(() => {
        mocks.updateNoteColor.mockClear();
    });


    it("色を選択すると、tempColorが更新される", () => {

        const note = createNote();

        const { result } = renderHook(() => useNoteColor(note));

        act(() => {
            result.current.handleSelectColor("#f28b82");
        });

        expect(result.current.tempColor).toBe("#f28b82");

    });



    it("色を保存すると、ノートIDと選択した色をupdateNoteColorに渡す", async () => {

        const note = createNote();

        const { result } = renderHook(() => useNoteColor(note));

        act(() => {
            result.current.handleSelectColor("#f28b82");
        });

        await act(async () => {
            await result.current.saveColor();
        });

        expect(mocks.updateNoteColor).toHaveBeenCalledWith(
            1,
            "#f28b82",
        );

    });



    it("ノートの色が変わると、tempColorも更新される", () => {

        const note = createNote();

        const { result, rerender } = renderHook(

            ({ currentNote }: { currentNote: Note }) =>    // { currentNote }: 分割代入:。{ currentNote } は、受け取ったオブジェクトから currentNote プロパティを取り出す。つまり、noteが取得される。 : { currentNote: Note }: この部分は、取り出した currentNote の型を説明しているのではなく、関数が受け取るオブジェクト全体の型を説明している。initialProps から渡されるのがオブジェクトだから、受け取る側の型指定も {} で囲む。
                useNoteColor(currentNote),

            {
                initialProps: {   // initialProps: renderHook のオプションとして決まっている名前。({ currentNote }: { currentNote: Note })この引数に渡してる。
                    currentNote: note,
                },
            },

        );

        // 色だけ変更した新しいノートを作る。
        const updatedNote = createNote({  // createNote関数のoverriedsに、{color: #f28b82}が渡る。
            color: "#f28b82",
        });

        // 既存の note をコピーして、色だけ変更した新しいノートを作る。
        // const updatedNote = {
        //     ...note,
        //     color: "#f28b82",
        // };

        // const updatedNote = createNote({
        //     ...note,
        //     color: "#f28b82",
        // });

        rerender({   // renderHook に渡しているデータを、新しいノートに差し替えて、フックを再実行させる処理。
            currentNote: updatedNote,   // renderHook に渡す引数を、{currentNote: updatedNote}に更新する。
        });

        expect(result.current.tempColor).toBe("#f28b82");

    });

});
