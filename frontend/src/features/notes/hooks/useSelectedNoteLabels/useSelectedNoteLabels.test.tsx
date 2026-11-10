import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useSelectedNoteLabels } from "./useSelectedNoteLabels";

import { useNoteStore } from "../../store/useNoteStore";
import { useNoteSelectionStore } from "../../store/useNoteSelectionStore";
import { useLabelStore } from "../../../labels/store/labelStore";





vi.mock("../../store/useNoteStore", () => ({
    useNoteStore: vi.fn(),
}));

vi.mock("../../store/useNoteSelectionStore", () => ({
    useNoteSelectionStore: vi.fn(),
}));

vi.mock("../../../labels/store/labelStore", () => ({
    useLabelStore: vi.fn(),
}));




describe("useSelectedNoteLabels", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });






    it("どの選択中のノートにも付いていないラベルはuncheckedになる", () => {

        const notes = [
            { id: 1, labels: [] },
            { id: 2, labels: [] },
        ];

        const selectedNoteIds = [1, 2];

        const labels = [
            { id: 10, name: "仕事" },
        ];

        vi.mocked(useNoteStore).mockReturnValue({
            notes,
            pinnedNotes: [],
            searchResultNotes: [],
            calendarDayNotes: [],
            updateSelectedNoteLabels: vi.fn(),
        } as ReturnType<typeof useNoteStore>);


        // vi.mocked(useNoteStore).mockReturnValue({
        //     notes,
        //     updateSelectedNoteLabels: vi.fn(),
        // } as ReturnType<typeof useNoteStore>);


        vi.mocked(useNoteSelectionStore).mockReturnValue({
            selectedNoteIds,
        } as ReturnType<typeof useNoteSelectionStore>);

        vi.mocked(useLabelStore).mockReturnValue({
            labels,
        } as ReturnType<typeof useLabelStore>);


        const { result } = renderHook(() => useSelectedNoteLabels());

        expect(result.current.labelStates).toEqual([
            { id: 10, state: "unchecked" },
        ]);

    });





    it("選択中のすべてのノートに付いているラベルはcheckedになる", () => {

        const notes = [
            { id: 1, labels: [{ id: 10 }] },
            { id: 2, labels: [{ id: 10 }] },
        ];

        const selectedNoteIds = [1, 2];

        const labels = [
            { id: 10, name: "仕事" },
        ];

        vi.mocked(useNoteStore).mockReturnValue({
            notes,
            pinnedNotes: [],
            searchResultNotes: [],
            calendarDayNotes: [],
            updateSelectedNoteLabels: vi.fn(),
        } as ReturnType<typeof useNoteStore>);

        // vi.mocked(useNoteStore).mockReturnValue({
        //     notes,
        //     updateSelectedNoteLabels: vi.fn(),
        // } as ReturnType<typeof useNoteStore>);

        vi.mocked(useNoteSelectionStore).mockReturnValue({
            selectedNoteIds,
        } as ReturnType<typeof useNoteSelectionStore>);

        vi.mocked(useLabelStore).mockReturnValue({
            labels,
        } as ReturnType<typeof useLabelStore>);


        const { result } = renderHook(() => useSelectedNoteLabels());

        expect(result.current.labelStates).toEqual([
            { id: 10, state: "checked" },
        ]);

    });



    it("一部の選択中のノートにだけ付いているラベルはindeterminateになる", () => {

        const notes = [
            { id: 1, labels: [{ id: 10 }] },
            { id: 2, labels: [] },
        ];

        const selectedNoteIds = [1, 2];

        const labels = [
            { id: 10, name: "仕事" },
        ];

        vi.mocked(useNoteStore).mockReturnValue({
            notes,
            pinnedNotes: [],
            searchResultNotes: [],
            calendarDayNotes: [],
            updateSelectedNoteLabels: vi.fn(),
        } as ReturnType<typeof useNoteStore>);

        // vi.mocked(useNoteStore).mockReturnValue({
        //     notes,
        //     updateSelectedNoteLabels: vi.fn(),
        // } as ReturnType<typeof useNoteStore>);

        vi.mocked(useNoteSelectionStore).mockReturnValue({
            selectedNoteIds,
        } as ReturnType<typeof useNoteSelectionStore>);

        vi.mocked(useLabelStore).mockReturnValue({
            labels,
        } as ReturnType<typeof useLabelStore>);

        const { result } = renderHook(() => useSelectedNoteLabels());

        expect(result.current.labelStates).toEqual([
            { id: 10, state: "indeterminate" },
        ]);

    });





    it("checkedのラベルを選択するとラベルを削除する", () => {

        const notes = [
            { id: 1, labels: [{ id: 10 }] },
            { id: 2, labels: [{ id: 10 }] },
        ];

        const selectedNoteIds = [1, 2];

        const labels = [
            { id: 10, name: "仕事" },
        ];

        const updateSelectedNoteLabels = vi.fn();

        vi.mocked(useNoteStore).mockReturnValue({
            notes,
            pinnedNotes: [],
            searchResultNotes: [],
            calendarDayNotes: [],
            updateSelectedNoteLabels,
        } as ReturnType<typeof useNoteStore>);

        // vi.mocked(useNoteStore).mockReturnValue({
        //     notes,
        //     updateSelectedNoteLabels,
        // } as ReturnType<typeof useNoteStore>);


        vi.mocked(useNoteSelectionStore).mockReturnValue({
            selectedNoteIds,
        } as ReturnType<typeof useNoteSelectionStore>);

        vi.mocked(useLabelStore).mockReturnValue({
            labels,
        } as ReturnType<typeof useLabelStore>);


        const { result } = renderHook(() => useSelectedNoteLabels());

        result.current.handleSelectLabel(10);

        expect(updateSelectedNoteLabels).toHaveBeenCalledWith(
            selectedNoteIds,
            10,
            "remove",
        );

    });







    it("uncheckedのラベルを選択するとラベルを追加する", () => {

        const notes = [
            { id: 1, labels: [] },
            { id: 2, labels: [] },
        ];

        const selectedNoteIds = [1, 2];

        const labels = [
            { id: 10, name: "仕事" },
        ];

        const updateSelectedNoteLabels = vi.fn();

        vi.mocked(useNoteStore).mockReturnValue({
            notes,
            pinnedNotes: [],
            searchResultNotes: [],
            calendarDayNotes: [],
            updateSelectedNoteLabels,
        } as ReturnType<typeof useNoteStore>);

        // vi.mocked(useNoteStore).mockReturnValue({
        //     notes,
        //     updateSelectedNoteLabels,
        // } as ReturnType<typeof useNoteStore>);

        vi.mocked(useNoteSelectionStore).mockReturnValue({
            selectedNoteIds,
        } as ReturnType<typeof useNoteSelectionStore>);

        vi.mocked(useLabelStore).mockReturnValue({
            labels,
        } as ReturnType<typeof useLabelStore>);

        const { result } = renderHook(() => useSelectedNoteLabels());

        result.current.handleSelectLabel(10);

        expect(updateSelectedNoteLabels).toHaveBeenCalledWith(
            selectedNoteIds,
            10,
            "add",
        );
    });





    it("indeterminateのラベルを選択するとラベルを追加する", () => {

        const notes = [
            { id: 1, labels: [{ id: 10 }] },
            { id: 2, labels: [] },
        ];

        const selectedNoteIds = [1, 2];

        const labels = [
            { id: 10, name: "仕事" },
        ];

        const updateSelectedNoteLabels = vi.fn();

        vi.mocked(useNoteStore).mockReturnValue({
            notes,
            pinnedNotes: [],
            searchResultNotes: [],
            calendarDayNotes: [],
            updateSelectedNoteLabels,
        } as ReturnType<typeof useNoteStore>);

        // vi.mocked(useNoteStore).mockReturnValue({
        //     notes,
        //     updateSelectedNoteLabels,
        // } as ReturnType<typeof useNoteStore>);

        vi.mocked(useNoteSelectionStore).mockReturnValue({
            selectedNoteIds,
        } as ReturnType<typeof useNoteSelectionStore>);

        vi.mocked(useLabelStore).mockReturnValue({
            labels,
        } as ReturnType<typeof useLabelStore>);

        const { result } = renderHook(() => useSelectedNoteLabels());

        result.current.handleSelectLabel(10);

        expect(updateSelectedNoteLabels).toHaveBeenCalledWith(
            selectedNoteIds,
            10,
            "add",
        );
    });






    it("選択中のノートがない場合はラベルがcheckedにならない", () => {

        const notes = [
            { id: 1, labels: [] },
        ];

        const selectedNoteIds: number[] = [];

        const labels = [
            { id: 10, name: "仕事" },
        ];

        vi.mocked(useNoteStore).mockReturnValue({
            notes,
            pinnedNotes: [],
            searchResultNotes: [],
            calendarDayNotes: [],
            updateSelectedNoteLabels: vi.fn(),
        } as ReturnType<typeof useNoteStore>);

        // vi.mocked(useNoteStore).mockReturnValue({
        //     notes,
        //     updateSelectedNoteLabels: vi.fn(),
        // } as ReturnType<typeof useNoteStore>);

        vi.mocked(useNoteSelectionStore).mockReturnValue({
            selectedNoteIds,
        } as ReturnType<typeof useNoteSelectionStore>);

        vi.mocked(useLabelStore).mockReturnValue({
            labels,
        } as ReturnType<typeof useLabelStore>);

        const { result } = renderHook(() => useSelectedNoteLabels());

        expect(result.current.labelStates).toEqual([
            { id: 10, state: "unchecked" },
        ]);
    });




    it("存在しないラベルIDを渡した場合は更新しない", () => {

        const notes = [
            { id: 1, labels: [] },
        ];

        const selectedNoteIds = [1];

        const labels = [
            { id: 10, name: "仕事" },
        ];

        const updateSelectedNoteLabels = vi.fn();

        vi.mocked(useNoteStore).mockReturnValue({
            notes,
            pinnedNotes: [],
            searchResultNotes: [],
            calendarDayNotes: [],
            updateSelectedNoteLabels,
        } as ReturnType<typeof useNoteStore>);

        // vi.mocked(useNoteStore).mockReturnValue({
        //     notes,
        //     updateSelectedNoteLabels,
        // } as ReturnType<typeof useNoteStore>);

        vi.mocked(useNoteSelectionStore).mockReturnValue({
            selectedNoteIds,
        } as ReturnType<typeof useNoteSelectionStore>);

        vi.mocked(useLabelStore).mockReturnValue({
            labels,
        } as ReturnType<typeof useLabelStore>);

        const { result } = renderHook(() => useSelectedNoteLabels());

        expect(() => result.current.handleSelectLabel(999)).not.toThrow();

        expect(updateSelectedNoteLabels).not.toHaveBeenCalled();

    });


});
