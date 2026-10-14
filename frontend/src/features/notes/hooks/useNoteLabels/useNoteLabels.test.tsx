import { describe, it, expect, vi } from "vitest";
import { renderHook, act  } from "@testing-library/react";


import type { Note } from "../../../../types/api/note";
import { useNoteLabels } from "./useNoteLabels";

// import { useNoteStore } from "../../store/useNoteStore";


const mocks = vi.hoisted(() => ({
    updateNoteLabels: vi.fn(),

}));


vi.mock("../../store/useNoteStore", () => ({
    useNoteStore: () => ({
        updateNoteLabels: mocks.updateNoteLabels,
    }),
}));



vi.mock("../../../labels/store/labelStore", () => ({
    useLabelStore: () => ({
        labels: [
            { id: 10, name: "仕事" },
            { id: 20, name: "勉強" },
            { id: 30, name: "プライベート" },
        ],
    }),
}));



const createNote = (
    labels: Note["labels"] = [],

): Note => ({   //  => ({ ... }) の {} はオブジェクト。アロー関数で => の直後に () で囲んだ式を書くと、return が省略される。

    id: 1,
    title: "テストタイトル",
    content: "テスト本文",
    color: "#ffffff",
    is_favorite: false,
    is_pinned: false,
    labels,
    images: [],
    view_count: 0,
    total_view_seconds: 0,
    created_at: "2026-10-10T00:00:00Z",
    order: 0,
    pinned_order: 0,

});




describe("useNoteLabels", () => {


    it("ノートに付いているラベルはチェック済みになる", () => {

        const note = createNote([
            { id: 10, name: "仕事"},
            { id: 30, name: "プライベート"},
        ]);



        const { result } = renderHook(() => useNoteLabels({ note }));

        expect(result.current.labelStates).toEqual([
            { id: 10, state: "checked" },
            { id: 20, state: "unchecked" },
            { id: 30, state: "checked" },
        ]);
    });






    it("ラベルを選択すると、選択したラベルIDを追加して、updateNoteLabelsが呼ばれる", async () => {

        const note = createNote([
            { id: 10, name: "仕事"},
        ]);


        const { result } = renderHook(() => useNoteLabels({ note }));

        await result.current.handleSelectLabel(20);

        expect(mocks.updateNoteLabels).toHaveBeenCalledWith(1, [10, 20]);

    });



    it("ラベルを選択すると、selectedLabelsにラベルIDが追加される", async () => {
        const note = createNote([
            { id: 10, name: "仕事" },
        ]);

        const { result } = renderHook(() => useNoteLabels({ note }));

        await act(async () => {
            await result.current.handleSelectLabel(20);
        });

        expect(result.current.selectedLabels).toEqual([10, 20]);

    });




    it("ラベルを選択すると、チェック済みになる", async () => {

        const note = createNote();

        const { result } = renderHook(() => useNoteLabels({ note }));

        await act(async () => {
            await result.current.handleSelectLabel(10);
        });

        expect(result.current.labelStates).toEqual([
            { id: 10, state: "checked" },
            { id: 20, state: "unchecked" },
            { id: 30, state: "unchecked" },
        ]);

    });




    it("選択済みのラベル(既にノートが所持しているラベル)を選択すると、そのラベルIDを取り除いて、updateNoteLabelsが呼ばれる", async () => {

        const note = createNote([
            { id: 10, name: "仕事"},
            { id: 20, name: "勉強"},
        ]);

        const { result } = renderHook(() => useNoteLabels({ note }));

        await result.current.handleSelectLabel(10);

        expect(mocks.updateNoteLabels).toHaveBeenCalledWith(1, [20]);

    });





    it("選択済みのラベル(既にノートが所持しているラベル)を選択すると、labelStatesがuncheckedになる", async () => {

        const note = createNote([
            { id: 10, name: "仕事" },
        ]);

        const { result } = renderHook(() => useNoteLabels({ note }));

        await act(async () => {
            await result.current.handleSelectLabel(10);
        });

        expect(result.current.labelStates).toEqual([
            { id: 10, state: "unchecked" },
            { id: 20, state: "unchecked" },
            { id: 30, state: "unchecked" },
        ]);

    });




    it("ラベル削除を実行すると、そのラベルIDを取り除いて、updateNoteLabelsが呼ばれる", async () => {

        const note = createNote([
            { id: 10, name: "仕事" },
            { id: 20, name: "勉強" },
        ]);


        const { result } = renderHook(() => useNoteLabels({ note }));

        await result.current.handleRemoveNoteLabel(10);

        expect(mocks.updateNoteLabels).toHaveBeenCalledWith(1, [20]);

    });




    it("ラベルを削除すると、selectedLabelsからも削除される", async () => {

        const note = createNote([
            { id: 10, name: "仕事" },
            { id: 20, name: "勉強" },
        ]);


        const { result } = renderHook(() => useNoteLabels({ note }));

        await act(async () => {
            await result.current.handleRemoveNoteLabel(10);
        });

        expect(result.current.selectedLabels).toEqual([20]);

    });




    it("ラベルを削除すると、labelStatesがuncheckedになる", async () => {

        const note = createNote([
            { id: 10, name: "仕事" },
        ]);

        const { result } = renderHook(() => useNoteLabels({ note }));

        await act(async () => {
            await result.current.handleRemoveNoteLabel(10);
        });

        expect(result.current.labelStates).toEqual([
            { id: 10, state: "unchecked" },
            { id: 20, state: "unchecked" },
            { id: 30, state: "unchecked" },
        ]);

    });

});
