import { renderHook, act } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useSelectedNoteActions } from "./useSelectedNoteActions";

import { useNoteStore } from "../../store/useNoteStore";
import { useNoteSelectionStore } from "../../store/useNoteSelectionStore";



vi.mock("../../store/useNoteStore", () => ({
    useNoteStore: vi.fn(),
}));


vi.mock("../../store/useNoteSelectionStore", () => ({
    useNoteSelectionStore: vi.fn(),
}));




describe("useSelectedNoteActions", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });


    it("選択中のノートをゴミ箱に移動する", async () => {

        const selectedNoteIds = [1, 3];
        const moveSelectedToTrash = vi.fn().mockResolvedValue(undefined);
        const duplicateSelectedNotes = vi.fn();

        vi.mocked(useNoteStore).mockReturnValue({
            moveSelectedToTrash,
            duplicateSelectedNotes,
        } as ReturnType<typeof useNoteStore>);

        vi.mocked(useNoteSelectionStore).mockReturnValue({
            selectedNoteIds,
        } as ReturnType<typeof useNoteSelectionStore>);


        const { result } = renderHook(() => useSelectedNoteActions());


        await act(async () => {
            await result.current.handleMoveToTrash();
        });

        expect(moveSelectedToTrash).toHaveBeenCalledWith(selectedNoteIds);

    });




    it("選択中のノートを複製する", async () => {

        const selectedNoteIds = [1, 3];
        const moveSelectedToTrash = vi.fn();
        const banana = vi.fn().mockResolvedValue(undefined);

        vi.mocked(useNoteStore).mockReturnValue({
            moveSelectedToTrash,
            duplicateSelectedNotes: banana,
        } as ReturnType<typeof useNoteStore>);

        vi.mocked(useNoteSelectionStore).mockReturnValue({
            selectedNoteIds,
        } as ReturnType<typeof useNoteSelectionStore>);


        const { result } = renderHook(() => useSelectedNoteActions());

        await act(async () => {
            await result.current.handleDuplicateNotes();
        });

        expect(banana).toHaveBeenCalledWith(selectedNoteIds);

    });
});
