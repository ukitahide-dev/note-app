import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, } from "@testing-library/react";

import NoteCard from "../../features/notes/components/NoteCard/NoteCard";


// Store
import { useNoteSelectionStore } from "../../features/notes/store/useNoteSelectionStore";


import type { Note } from "../../types/api/note";

import { useState } from "react";
import type { NoteContext } from "../../types/ui/noteContext";
import { useNoteLabels } from "../../features/notes/hooks/useNoteLabels/useNoteLabels";



const mocks = vi.hoisted(() => ({  // vi.hoisted(): vi.mock() より先に準備しておきたい変数を作るために使う。
    togglePin: vi.fn(),   // vi.fn(): 呼び出しを記録できる、テスト用の偽物の関数を作る。
    toggleFavorite: vi.fn(),
    handleSelectLabel: vi.fn(),
    handleRemoveNoteLabel: vi.fn(),

}));



vi.mock("../../features/notes/store/useNoteStore", () => ({  // NoteCardがuseNoteStoreを呼び出すと、ここで設定した偽物のuseNoteStoreが使われる。
    useNoteStore: () => ({
        createNote: vi.fn(),
        moveToTrash: vi.fn(),
        toggleFavorite: mocks.toggleFavorite,
        togglePin: mocks.togglePin,
        searchParams: {
            query: "",
        },
        uploadNoteImage: vi.fn(),
    }),
}));





vi.mock("../../features/labels/store/labelStore", () => ({
    useLabelStore: () => ({
        labels: [
            { id: 10, name: "仕事" },
            { id: 20, name: "勉強" },
        ],
        handleCreateLabel: vi.fn(),
    }),
}));


useNoteLabels
vi.mock("../../features/notes/hooks/useNoteLabels/useNoteLabels", () => ({
    useNoteLabels: () => ({
        labelStates: [],
        handleSelectLabel: mocks.handleSelectLabel,
        handleRemoveNoteLabel: mocks.handleRemoveNoteLabel,

    }),
}));



// 自分で用意したテスト用データ
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



// テスト用に作った親。このテストファイルで確認しなくていい、親コンポーネントの事情を持ち込まないため。
function NoteCardWithState({
    noteOverride,

}: {
    noteOverride?: Note;

}) {

    const [openColor, setOpenColor] = useState<{
        noteId: number;
        context: NoteContext;
    } | null>(null);

    const [openMenu, setOpenMenu] = useState<{
        noteId: number;
        context: NoteContext;
    } | null>(null);

    const [panelType, setPanelType] = useState<
        "label" | "history" | null
    >(null);

    const [selectedNoteId, setSelectedNoteId] = useState<number | null>(
        null
    );


    return (

        <NoteCard
            note={noteOverride ?? note}
            context="notes"
            openColor={openColor}
            setOpenColor={setOpenColor}
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
            setSelectedNoteId={setSelectedNoteId}
            panelType={panelType}
            setPanelType={setPanelType}
        />
    );
}




describe("NoteCard", () => {


    describe("NoteCard", () => {


        it("NoteCardが描画されると、ノートのタイトルと本文が表示される", () => {

            const setOpenColor = vi.fn();
            const setOpenMenu = vi.fn();
            const setSelectedNoteId = vi.fn();
            const setPanelType = vi.fn();

            render(
                <NoteCard
                    note={note}
                    context="notes"
                    openColor={null}
                    setOpenColor={setOpenColor}
                    openMenu={null}
                    setOpenMenu={setOpenMenu}
                    setSelectedNoteId={setSelectedNoteId}
                    panelType={null}
                    setPanelType={setPanelType}
                />
            );

            expect(screen.getByText("テストタイトル")).toBeInTheDocument();
            expect(screen.getByText("テスト本文")).toBeInTheDocument();
        });

    });




    it("カードをクリックするとノートIDが選択される", () => {

        const setOpenColor = vi.fn();
        const setOpenMenu = vi.fn();
        const setSelectedNoteId = vi.fn();
        const setPanelType = vi.fn();

        render(
            <NoteCard
                note={note}
                context="notes"
                openColor={null}
                setOpenColor={setOpenColor}
                openMenu={null}
                setOpenMenu={setOpenMenu}
                setSelectedNoteId={setSelectedNoteId}
                panelType={null}
                setPanelType={setPanelType}
            />
        );

        fireEvent.click(screen.getByText("テストタイトル"));

        expect(setSelectedNoteId).toHaveBeenCalledWith(1);

    });





    it("ピン留めボタンをクリックするとtogglePinが呼ばれる", () => {

        const setOpenColor = vi.fn();
        const setOpenMenu = vi.fn();
        const setSelectedNoteId = vi.fn();
        const setPanelType = vi.fn();

        render(
            <NoteCard
                note={note}
                context="notes"
                openColor={null}
                setOpenColor={setOpenColor}
                openMenu={null}
                setOpenMenu={setOpenMenu}
                setSelectedNoteId={setSelectedNoteId}
                panelType={null}
                setPanelType={setPanelType}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: "📍" }));   // これはNoteCardHeader内のボタン

        expect(mocks.togglePin).toHaveBeenCalledWith(1, false);

    });





    it("お気に入りボタンをクリックするとtoggleFavoriteが呼ばれる", () => {

        const setOpenColor = vi.fn();
        const setOpenMenu = vi.fn();
        const setSelectedNoteId = vi.fn();
        const setPanelType = vi.fn();

        render(
            <NoteCard
                note={note}
                context="notes"
                openColor={null}
                setOpenColor={setOpenColor}
                openMenu={null}
                setOpenMenu={setOpenMenu}
                setSelectedNoteId={setSelectedNoteId}
                panelType={null}
                setPanelType={setPanelType}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: "🤍" }));

        expect(mocks.toggleFavorite).toHaveBeenCalledWith(1, false);

    });






    it("メニューボタンをクリックするとsetOpenMenuが呼ばれる", () => {
        const setOpenColor = vi.fn();
        const setOpenMenu = vi.fn();
        const setSelectedNoteId = vi.fn();
        const setPanelType = vi.fn();

        render(
            <NoteCard
                note={note}
                context="notes"
                openColor={null}
                setOpenColor={setOpenColor}
                openMenu={null}
                setOpenMenu={setOpenMenu}
                setSelectedNoteId={setSelectedNoteId}
                panelType={null}
                setPanelType={setPanelType}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: "⋮" }));

        expect(setOpenMenu).toHaveBeenCalled();

    });





    it("メニューボタンをクリックするとメニューの内容が表示される", () => {

        render(<NoteCardWithState />);  // テスト用に作った親をレンダリング。


        fireEvent.click(screen.getByRole("button", { name: "⋮" }));   // 親である本物のNoteListとかはレンダーされない。

        expect(screen.getByText("削除")).toBeInTheDocument();

    });





    // ---- 色関係 ----

    it("色変更ボタンをクリックすると色パレットが表示される", () => {

        render(<NoteCardWithState />);

        fireEvent.click(screen.getByRole("button", { name: "🎨" }));

        expect(screen.getByTestId("color-palette")).toBeInTheDocument();

    });





    it("色パレットで色を選択するとノートの背景色が変わる", () => {

        render(<NoteCardWithState />);

        // カラーパレットを開く
        fireEvent.click(screen.getByRole("button", { name: "🎨" }));


        // カラーパレット内から、色が #f28b82 のボタンを取得する
        const palette = screen.getByTestId("color-palette");
        const pinkButton = palette.querySelector(
            'button[style*="rgb(242, 139, 130)"]'
        );

        expect(pinkButton).not.toBeNull();

        fireEvent.click(pinkButton!);

        expect(screen.getByTestId("note-card")).toHaveStyle({
            backgroundColor: "#f28b82",
        });

    });








    // ---- ラベル関連 ----

    it("メニューのラベル追加をクリックするとラベルパネルが表示される", () => {

        render(<NoteCardWithState />);

        // ① メニューを開く
        fireEvent.click(screen.getByRole("button", { name: "⋮" }));

        // ② 「ラベル追加」をクリックする
        fireEvent.click(screen.getByRole("button", { name: "ラベル追加" }));

        // ③ ラベルパネルが表示されたことを確認する
        expect(
            screen.getByPlaceholderText("新しいラベル")
        ).toBeInTheDocument();

    });





    it("ラベルをクリックするとラベル選択処理が呼ばれる", () => {

        // テスト用の親をレンダリング
        render(<NoteCardWithState />);

        // メニューを開く
        fireEvent.click(screen.getByRole("button", { name: "⋮" }));

        // ラベルパネルを開く
        fireEvent.click(screen.getByRole("button", { name: "ラベル追加" }));

        // 「仕事」のチェックボックスをクリック
        fireEvent.click(
            screen.getByRole("checkbox", { name: "仕事" })  // LabelPanelItemのボタン
        );

        // ラベルID「10」を引数にして呼び出されたことを確認
        expect(mocks.handleSelectLabel).toHaveBeenCalledWith(10);

    });




    // ---- ノートが所持しているラベル関連 ----

    it("ノートに設定されたラベルが表示される", () => {

        const noteWithLabel: Note = {
            ...note,
            labels: [
                { id: 10, name: "仕事" },
            ],
        };

        render(
            <NoteCardWithState noteOverride={noteWithLabel} />
        );

        expect(screen.getByText("仕事")).toBeInTheDocument();

    });




    it("ラベルが2件ある場合、両方のラベルが表示される", () => {

        const noteWithTwoLabels: Note = {
            ...note,
            labels: [
                { id: 10, name: "仕事" },
                { id: 20, name: "勉強" },
            ],
        };

        render(
            <NoteCardWithState noteOverride={noteWithTwoLabels} />
        );

        expect(screen.getByText("仕事")).toBeInTheDocument();
        expect(screen.getByText("勉強")).toBeInTheDocument();

    });







    it("ラベルが0件の場合でも正常にノートが表示される", () => {

        const noteWithoutLabels: Note = {
            ...note,
            labels: [],
        };

        render(
            <NoteCardWithState noteOverride={noteWithoutLabels} />
        );

        // ノート自体が表示されている
        expect(screen.getByText("テストタイトル")).toBeInTheDocument();

        // ラベルがないので、ラベル名は表示されない
        expect(screen.queryByText("仕事")).not.toBeInTheDocument();
        expect(screen.queryByText("勉強")).not.toBeInTheDocument();

    });



    it("ノートが所持しているラベルが3件以上ある場合、残りの件数(note.labels.length - 2)が表示される", () => {

        const noteWithThreeLabels: Note = {
            ...note,
            labels: [
                { id: 10, name: "仕事" },
                { id: 20, name: "勉強" },
                { id: 30, name: "プライベート" },
            ],
        };

        render(
            <NoteCardWithState noteOverride={noteWithThreeLabels} />
        );

        expect(screen.getByText("他1件")).toBeInTheDocument();

    });





    it("ラベルの削除ボタンを押すと、ラベルIDを指定して削除処理が呼ばれる", () => {

        const noteWithLabel: Note = {
            ...note,
            labels: [
                { id: 10, name: "仕事" },
            ],
        };

        render(
            <NoteCardWithState noteOverride={noteWithLabel} />
        );

        // 「仕事」のラベルが表示されていることを確認
        expect(screen.getByText("仕事")).toBeInTheDocument();

        // ラベルの削除ボタン「×」を取得
        const removeButton = screen.getByRole("button", { name: "×" });

        // 削除ボタンをクリック
        fireEvent.click(removeButton);

        // ラベルID「10」を指定して削除処理が呼ばれたことを確認
        expect(mocks.handleRemoveNoteLabel).toHaveBeenCalledWith(10);

    });





    it("複数のラベルで、それぞれ正しいラベルIDを削除処理に渡す", () => {

        const noteWithLabels: Note = {
            ...note,
            labels: [
                { id: 10, name: "仕事" },
                { id: 20, name: "勉強" },
            ],
        };

        render(
            <NoteCardWithState noteOverride={noteWithLabels} />
        );

        // 「仕事」のラベルにある × ボタンを取得
        const workLabel = screen.getByText("仕事");
        const workRemoveButton = workLabel.parentElement?.querySelector("button");

        expect(workRemoveButton).not.toBeNull();

        fireEvent.click(workRemoveButton!);

        expect(mocks.handleRemoveNoteLabel).toHaveBeenCalledWith(10);

        // いったん呼び出し履歴をリセット
        mocks.handleRemoveNoteLabel.mockClear();

        // 「勉強」のラベルにある × ボタンを取得
        const studyLabel = screen.getByText("勉強");
        const studyRemoveButton = studyLabel.parentElement?.querySelector("button");

        expect(studyRemoveButton).not.toBeNull();

        fireEvent.click(studyRemoveButton!);

        expect(mocks.handleRemoveNoteLabel).toHaveBeenCalledWith(20);

    });


















});
