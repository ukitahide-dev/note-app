





import { render, screen, waitFor, fireEvent,  } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { HistoryPanel } from "./HistoryPanel";
import type { Note, History } from "../../../../types/api/note";



// APIをモックするための関数
// const { getNoteHistoryApi } = vi.hoisted(() => ({    // returnなしの書き方。() は、オブジェクトを式として扱うためのもの。オブジェクトを返している。
//     getNoteHistoryApi: vi.fn(),    // getNoteHistoryApi という名前のプロパティに、偽物の関数を設定。

// }));


const { getNoteHistoryApi } = vi.hoisted(() => {    // { getNoteHistoryApi }: 分割代入で、getNoteHistoryApiプロパティの値を取り出してる。

    return {
        getNoteHistoryApi: vi.fn(),   // getNoteHistoryApi という名前のプロパティに、偽物の関数を設定。
    };

});


// vi.mock("../../api/noteApi", () => ({
//     getNoteHistoryApi,

// }));

vi.mock("../../api/noteApi", () => {

    return {
        getNoteHistoryApi: getNoteHistoryApi,
    };

});



// 共通のノートデータ
const note: Note = {
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
};


// 共通の変更履歴データ
const histories: History[] = [
    {
        id: 1,
        action: "ノートを作成しました",
        created_at: "2026-10-10T09:30:00Z",
        note: 1,
    },
];


describe("HistoryPanel", () => {

    it("APIから取得した変更履歴が表示される", async () => {

        // APIのモックが返すデータを設定する。偽物のgetNoteHistoryApi関数の返り値を設定する。
        getNoteHistoryApi.mockResolvedValue(histories);   // テスト中に getNoteHistoryApi が呼ばれたら、histories を返すように設定する。偽物の getNoteHistoryApi を呼び出しているわけではない。

        render(
            <HistoryPanel
                note={note}
                onClose={vi.fn()}
            />
        );

        // APIがノートID「1」で呼び出されたことを確認
        await waitFor(() => {
            expect(getNoteHistoryApi).toHaveBeenCalledWith(1);
        });

        // APIから取得した履歴が表示されたことを確認
        expect(
            await screen.findByText("ノートを作成しました")   // awaitつける理由: findByText() が、指定したテキストが画面に表示されるまで待つ非同期処理だから。
        ).toBeInTheDocument();

    });






    it("日付が正しく整形される", async () => {

        getNoteHistoryApi.mockResolvedValue(histories);

        render(
            <HistoryPanel
                note={note}
                onClose={vi.fn()}
            />
        );

        expect(
            await screen.findByText("2026年 10月10日(土) 18時30分")
        ).toBeInTheDocument();

    });





    it("×ボタンをクリックすると、onCloseが呼ばれる", async () => {

        getNoteHistoryApi.mockResolvedValue(histories);

        const onClose = vi.fn();

        render(
            <HistoryPanel
                note={note}
                onClose={onClose}
            />
        );

        fireEvent.click(
            screen.getByRole("button", { name: "×" })
        );

        expect(onClose).toHaveBeenCalled();

    });





    it("閉じるボタンをクリックすると、onCloseが呼ばれる", async () => {

        getNoteHistoryApi.mockResolvedValue(histories);

        const onClose = vi.fn();

        render(
            <HistoryPanel
                note={note}
                onClose={onClose}
            />
        );

        fireEvent.click(
            screen.getByRole("button", { name: "閉じる" })
        );

        expect(onClose).toHaveBeenCalled();

    });









});
