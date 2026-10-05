import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, } from "@testing-library/react";

import NoteCard from "../../features/notes/components/NoteCard/NoteCard";


// Store
import { useNoteSelectionStore } from "../../features/notes/store/useNoteSelectionStore";


import type { Note } from "../../types/api/note";

import { useState } from "react";
import type { NoteContext } from "../../types/ui/noteContext";

// 自分で用意したテスト用データ
const note: Note = {
    id: 1,
    title: "買い物メモ",
    content: "牛乳を買う",
    color: "#ffffff",
    is_pinned: false,
    is_favorite: false,
    view_count: 0,
    total_view_seconds: 0,
    labels: [],
    images: [],
    created_at: "2026-10-04T00:00:00Z",
    order: 1,
    pinned_order: 1,

};





describe("NoteCard", () => {

    it("ノートのタイトルと本文が表示される", () => {

        render(    // 実際の NoteCard をテスト画面にレンダリング。
            <NoteCard
                note={note}
                context="normal"
                openColor={null}
                setOpenColor={() => {}}
                openMenu={null}
                setOpenMenu={() => {}}
                selectedNote={null}
                setSelectedNote={() => {}}
                panelType={null}
                setPanelType={() => {}}
            />
        );

        expect(
            screen.getByText("買い物メモ")
        ).toBeInTheDocument();

        expect(
            screen.getByText("牛乳を買う")
        ).toBeInTheDocument();

    });





    it("選択ボタンをクリックするとノートが選択状態になる", () => {

        render(
            <NoteCard
                note={note}
                context="normal"
                openColor={null}
                setOpenColor={() => {}}
                openMenu={null}
                setOpenMenu={() => {}}
                selectedNote={null}
                setSelectedNote={() => {}}
                panelType={null}
                setPanelType={() => {}}
            />
        );

        // 最初は未選択
        expect(
            screen.getByRole("button", { name: "○" })
        ).toBeInTheDocument();

        // 選択ボタンをクリック
        fireEvent.click(
            screen.getByRole("button", { name: "○" })
        );

        // 実際にZustandの状態が変わったことを確認
        expect(
            useNoteSelectionStore.getState().selectedNoteIds
        ).toContain(1);   // 1 は突然出てきた数字じゃなくて、テスト用ノートのID。自分で上で定義したやつ。

        // UIも「✓」に変わったことを確認
        expect(
            screen.getByRole("button", { name: "✓" })
        ).toBeInTheDocument();
    });





    it("色変更ボタンをクリックするとカラーパレットを開く", () => {

        function TestComponent() {

            const [openColor, setOpenColor] = useState<{
                noteId: number;
                context: NoteContext;
            } | null>(null);


            return (
                <NoteCard
                    note={note}
                    context="normal"
                    openColor={openColor}
                    setOpenColor={setOpenColor}
                    openMenu={null}
                    setOpenMenu={() => {}}
                    selectedNote={null}
                    setSelectedNote={() => {}}
                    panelType={null}
                    setPanelType={() => {}}
                />
            )

        }


        render(<TestComponent />);


        expect(
            screen.queryByTestId("color-palette")
        ).not.toBeInTheDocument();


        fireEvent.click(
            screen.getByRole("button", { name: "🎨" })
        );


        expect(
            screen.getByTestId("color-palette")   // ColorPaletteに書いた、data-testid="color-palette"のこと。
        ).toBeInTheDocument();





    });



    // it("色変更ボタンを押すと、カラーパレットを開くためのstate setterが正しく呼ばれる", () => {

    //     const mockSetOpenColor = vi.fn();    // setOpenColor が呼ばれたかを記録するための偽物

    //     render(
    //         <NoteCard
    //             note={note}
    //             context="normal"
    //             openColor={null}
    //             setOpenColor={mockSetOpenColor}
    //             openMenu={null}
    //             setOpenMenu={() => {}}
    //             selectedNote={null}
    //             setSelectedNote={() => {}}
    //             panelType={null}
    //             setPanelType={() => {}}
    //         />
    //     );

    //     fireEvent.click(
    //         screen.getByRole("button", { name: "🎨" })
    //     );

    //     // 🎨をクリックしたとき、NoteCardが setOpenColor に正しい値を渡して呼び出したかを確認。
    //     expect(mockSetOpenColor).toHaveBeenCalledWith({
    //         noteId: 1,
    //         context: "normal",
    //     });

    // });











});
