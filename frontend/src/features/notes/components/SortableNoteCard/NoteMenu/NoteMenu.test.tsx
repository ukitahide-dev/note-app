import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import NoteMenu from "./NoteMenu";



describe("NoteMenu", () => {

    it("ラベル追加をクリックすると、onOpenLabelが呼ばれる", () => {

        const onOpenLabel = vi.fn();

        render(
            <NoteMenu onOpenLabel={onOpenLabel} />
        );

        fireEvent.click(screen.getByRole("button", { name: "ラベル追加" }));

        expect(onOpenLabel).toHaveBeenCalledTimes(1);

    });

    it("コピーを作成をクリックすると、onDuplicateNoteが呼ばれる", () => {
        const onDuplicateNote = vi.fn();

        render(
            <NoteMenu onDuplicateNote={onDuplicateNote} />
        );

        fireEvent.click(screen.getByRole("button", { name: "コピーを作成" }));

        expect(onDuplicateNote).toHaveBeenCalledTimes(1);

    });


    it("削除をクリックすると、onMoveToTrashが呼ばれる", () => {

        const onMoveToTrash = vi.fn();

        render(
            <NoteMenu onMoveToTrash={onMoveToTrash} />
        );

        fireEvent.click(screen.getByRole("button", { name: "削除" }));

        expect(onMoveToTrash).toHaveBeenCalledTimes(1);

    });



    it("変更履歴をクリックすると、onOpenHistoryが呼ばれる", () => {
        
        const onOpenHistory = vi.fn();

        render(
            <NoteMenu onOpenHistory={onOpenHistory} />
        );

        fireEvent.click(screen.getByRole("button", { name: "変更履歴" }));

        expect(onOpenHistory).toHaveBeenCalledTimes(1);

    });


});
