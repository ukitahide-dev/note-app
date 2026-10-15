

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach,  } from "vitest";
import NoteCardActions from "../NoteCardActions/NoteCardActions";
import type { Note } from "../../../../types/api/note";


// ---- 共通データ ----
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

// ---- 共通モック関数 ----
const onToggleFavorite = vi.fn();
const onOpenColor = vi.fn();
const onOpenImage = vi.fn();
const onOpenMenu = vi.fn();
const onImageChange = vi.fn();

// ---- 共通 ref ----
const fileInputRef = { current: null };


// ---- 共通レンダー関数 ----
const renderNoteCardActions = (customNote: Note = note) => {
    return render(
        <NoteCardActions
            note={customNote}
            onToggleFavorite={onToggleFavorite}
            onOpenColor={onOpenColor}
            onOpenImage={onOpenImage}
            onOpenMenu={onOpenMenu}
            fileInputRef={fileInputRef}
            onImageChange={onImageChange}
        />
    );
};


describe("NoteCardActions", () => {

    // 各テストの開始前にモック関数の呼び出し履歴をリセット
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("色変更ボタンをクリックすると、onOpenColorが呼ばれる", () => {

        renderNoteCardActions();

        fireEvent.click(screen.getByRole("button", { name: "🎨" }));

        expect(onOpenColor).toHaveBeenCalledTimes(1);

    });



    it("お気に入りボタンをクリックすると、onToggleFavoriteが呼ばれる", () => {

        renderNoteCardActions();

        fireEvent.click(screen.getByRole("button", { name: "🤍" }));

        expect(onToggleFavorite).toHaveBeenCalledTimes(1);

    });



    it("お気に入り登録済みのボタンをクリックすると、onToggleFavoriteが呼ばれる", () => {

        renderNoteCardActions({
            ...note,
            is_favorite: true,
        });

        fireEvent.click(screen.getByRole("button", { name: "❤️" }));

        expect(onToggleFavorite).toHaveBeenCalledTimes(1);

    });



    it("お気に入り登録済みの場合、解除用のボタンが表示される", () => {

        renderNoteCardActions({
            ...note,
            is_favorite: true,
        });

        expect(
            screen.getByRole("button", { name: "❤️" })
        ).toBeInTheDocument();

    });



    it("画像追加ボタンをクリックすると、onOpenImageが呼ばれる", () => {

        renderNoteCardActions();

        fireEvent.click(screen.getByRole("button", { name: "📷" }));

        expect(onOpenImage).toHaveBeenCalledTimes(1);

    });



    
    it("メニューボタンをクリックすると、onOpenMenuが呼ばれる", () => {

        renderNoteCardActions();

        fireEvent.click(screen.getByRole("button", { name: "⋮" }));

        expect(onOpenMenu).toHaveBeenCalledTimes(1);

    });




    it("閲覧数が表示される", () => {

        renderNoteCardActions({
            ...note,
            view_count: 5,
        });

        expect(screen.getByText("👀 5")).toBeInTheDocument();

    });



    it("閲覧時間が表示される", () => {

        renderNoteCardActions({
            ...note,
            total_view_seconds: 120,
        });

        expect(screen.getByText("🕑 120秒")).toBeInTheDocument();

    });


    it("ファイル入力を変更すると、onImageChangeが呼ばれる", () => {

        renderNoteCardActions();

        const fileInput = document.querySelector(
            'input[type="file"]'
        ) as HTMLInputElement;

        // テストのために偽物の画像ファイルを作る
        const file = new File(["test"], "test.png", {
            type: "image/png",
        });

        fireEvent.change(fileInput, {
            target: {
                files: [file],
            },
        });

        expect(onImageChange).toHaveBeenCalledTimes(1);
    });



    it("色変更ボタンをクリックしても、親要素のクリックイベントは発生しない", () => {

        const onParentClick = vi.fn();

        render(
            <div onClick={onParentClick}>
                <NoteCardActions
                    note={note}
                    onToggleFavorite={onToggleFavorite}
                    onOpenColor={onOpenColor}
                    onOpenImage={onOpenImage}
                    onOpenMenu={onOpenMenu}
                    fileInputRef={fileInputRef}
                    onImageChange={onImageChange}
                />
            </div>
        );

        fireEvent.click(screen.getByRole("button", { name: "🎨" }));

        expect(onOpenColor).toHaveBeenCalledTimes(1);
        expect(onParentClick).not.toHaveBeenCalled();
    });



    it("メニューボタンをクリックしても、親要素のクリックイベントは発生しない", () => {
        const onParentClick = vi.fn();

        render(
            <div onClick={onParentClick}>
                <NoteCardActions
                    note={note}
                    onToggleFavorite={onToggleFavorite}
                    onOpenColor={onOpenColor}
                    onOpenImage={onOpenImage}
                    onOpenMenu={onOpenMenu}
                    fileInputRef={fileInputRef}
                    onImageChange={onImageChange}
                />
            </div>
        );

        fireEvent.click(screen.getByRole("button", { name: "⋮" }));

        expect(onOpenMenu).toHaveBeenCalledTimes(1);
        expect(onParentClick).not.toHaveBeenCalled();

    });





    it("画像入力をクリックしても、親要素のクリックイベントは発生しない", () => {

        const onParentClick = vi.fn();

        render(
            <div onClick={onParentClick}>
                <NoteCardActions
                    note={note}
                    onToggleFavorite={onToggleFavorite}
                    onOpenColor={onOpenColor}
                    onOpenImage={onOpenImage}
                    onOpenMenu={onOpenMenu}
                    fileInputRef={fileInputRef}
                    onImageChange={onImageChange}
                />
            </div>
        );

        const fileInput = document.querySelector(
            'input[type="file"]'
        ) as HTMLInputElement;

        fireEvent.click(fileInput);

        expect(onParentClick).not.toHaveBeenCalled();

    });

});
