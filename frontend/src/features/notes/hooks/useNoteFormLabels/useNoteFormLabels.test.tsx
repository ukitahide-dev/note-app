import { renderHook, act, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useNoteFormLabels } from "./useNoteFormLabels";
import { useLabelStore } from "../../../labels/store/labelStore";


vi.mock("../../../labels/store/labelStore", () => ({
    useLabelStore: vi.fn(),
}));




describe("useNoteFormLabels", () => {

    const labels = [
        { id: 1, name: "仕事" },
        { id: 2, name: "勉強" },
        { id: 3, name: "趣味" },
    ];

    beforeEach(() => {

        vi.clearAllMocks();

        vi.mocked(useLabelStore).mockReturnValue({
            labels,
        } as ReturnType<typeof useLabelStore>);

    });



    it("初期状態ではラベルが選択されていない", () => {

        const { result } = renderHook(() => useNoteFormLabels());

        expect(result.current.selectedLabels).toEqual([]);

    });




    it("labelNameに一致するラベルを自動選択する", async () => {

        const { result } = renderHook(() =>
            useNoteFormLabels("勉強")
        );

        await waitFor(() => {
            expect(result.current.selectedLabels).toEqual([2]);
        });

    });



    it("未選択のラベルを選択する", () => {

        const { result } = renderHook(() => useNoteFormLabels());

        act(() => {
            result.current.handleSelectLabel(1);
        });

        expect(result.current.selectedLabels).toEqual([1]);

    });



    it("選択済みのラベルを解除する", () => {

        const { result } = renderHook(() =>
            useNoteFormLabels("仕事")
        );

        act(() => {
            result.current.handleSelectLabel(1);
        });

        expect(result.current.selectedLabels).toEqual([]);

    });




    it("選択中のラベル名とチェック状態を返す", async () => {

        const { result } = renderHook(() =>
            useNoteFormLabels("勉強")
        );

        await waitFor(() => {

            expect(result.current.selectedLabelNames).toEqual(["勉強"]);

            expect(result.current.labelStates).toEqual([
                { id: 1, state: "unchecked" },
                { id: 2, state: "checked" },
                { id: 3, state: "unchecked" },
            ]);

        });

    });






    it("存在しないlabelNameではラベルを選択しない", async () => {
        
        const { result } = renderHook(() =>
            useNoteFormLabels("存在しないラベル")
        );

        await waitFor(() => {
            expect(result.current.selectedLabels).toEqual([]);
        });

    });




});
