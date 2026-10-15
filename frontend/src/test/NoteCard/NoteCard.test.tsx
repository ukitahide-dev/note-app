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
    moveToTrash: vi.fn(),
    createNote: vi.fn(),
    handleSelectLabel: vi.fn(),
    handleRemoveNoteLabel: vi.fn(),
    updateNoteColor: vi.fn(),

}));



vi.mock("../../features/notes/store/useNoteStore", () => ({  // NoteCardがuseNoteStoreを呼び出すと、ここで設定した偽物のuseNoteStoreが使われる。
    useNoteStore: () => ({
        createNote: mocks.createNote,
        moveToTrash: mocks.moveToTrash,
        toggleFavorite: mocks.toggleFavorite,
        togglePin: mocks.togglePin,
        updateNoteColor: mocks.updateNoteColor,
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




vi.mock(  // NoteCard.test.tsx のテスト中に HistoryPanel が使われると、本物の代わりにこの偽物が使われる。本物では、API通信してるから、テストではしないために、偽物使う。
    "../../features/notes/components/HistoryPanel/HistoryPanel",
    () => ({
        HistoryPanel: ({ onClose }: { onClose: () => void }) => (  // onClose 自体は、本物のNoteCardから渡された関数を受け取っている。だから、これは本物。クリックすると、このdivが消える。モックはコンポーネントを丸ごと置き換えるけど、親から渡される props まで勝手に偽物にするわけじゃない。
            <div data-testid="history-panel">
                <h1>変更履歴</h1>
                <button onClick={onClose}>閉じる</button>
            </div>
        ),
    }),
);



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
        <>
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

        {/* この <div> は本来のアプリの機能には必要ない。テストのためだけに追加したもの。 冗長ではある。*/}
        <div data-testid="panel-type">
            {panelType ?? "null"}
        </div>

        </>
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



    it("メニューの削除をクリックすると、moveToTrashにノートIDが渡されて実行される", () => {

        mocks.moveToTrash.mockClear();

        render(<NoteCardWithState />);

        // メニューを開く
        fireEvent.click(screen.getByRole("button", { name: "⋮" }));

        // 削除をクリックする
        fireEvent.click(screen.getByRole("button", { name: "削除" }));

        // ノートID「1」で削除処理が呼ばれたことを確認
        expect(mocks.moveToTrash).toHaveBeenCalledWith(1);

    });





    it("コピーを作成をクリックすると、元ノートの情報でcreateNoteが呼ばれる", () => {

        mocks.createNote.mockClear();

        render(<NoteCardWithState />);

        // メニューを開く
        fireEvent.click(screen.getByRole("button", { name: "⋮" }));

        // 「コピーを作成」をクリックする
        fireEvent.click(
            screen.getByRole("button", { name: "コピーを作成" })
        );

        // 元ノートの情報が渡されたことを確認する
        expect(mocks.createNote).toHaveBeenCalledWith(
            note.title,
            note.content,
            note.labels.map((label) => label.id),
            note.color,
        );

    });



    // ---- メニュー関連 ----

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





    it("メニューの外側をクリックすると、メニューが閉じてpanelTypeもリセットされる", () => {
        render(<NoteCardWithState />);

        // メニューボタンをクリックする
        fireEvent.click(screen.getByRole("button", { name: "⋮"}));

        // メニューが表示されたことを確認
        expect(screen.getByTestId("note-menu")).toBeInTheDocument();

        expect(screen.getByTestId("panel-type")).toHaveTextContent("null");


        fireEvent.click(screen.getByRole("button", { name: "ラベル追加"}));

        // ラベルパネルが表示されたことを確認する
        expect(
            screen.getByPlaceholderText("新しいラベル")
        ).toBeInTheDocument();

        // パネルタイプがラベルになったことを確認する。
        expect(screen.getByTestId("panel-type")).toHaveTextContent("label");


        // ノートや、ラベルパネルの外側をクリックする
        fireEvent.click(document.body);

         // メニューが閉じたことを確認
        expect(screen.queryByText("ラベル追加")).not.toBeInTheDocument();

        // ラベルパネルが閉じたことを確認
        expect(screen.queryByText("新しいラベル")).not.toBeInTheDocument();

        expect(screen.getByTestId("panel-type")).toHaveTextContent("null");


    });





    // ---- 色関係 ----

    it("色変更ボタンをクリックするとカラーパレットが表示される", () => {

        render(<NoteCardWithState />);

        fireEvent.click(screen.getByRole("button", { name: "🎨" }));

        expect(screen.getByTestId("color-palette")).toBeInTheDocument();

    });





    it("カラーパレットで色を選択するとノートの背景色が変わる", () => {

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






    it("カラーパレットの外側をクリックすると、色が保存されてパレットが閉じる", () => {

        mocks.updateNoteColor.mockClear();

        render(<NoteCardWithState />);

        // カラーボタンをクリックする
        fireEvent.click(screen.getByRole("button", { name: "🎨"}));

        const palette = screen.getByTestId("color-palette");

        // ピンク色を選択する
        const pinkButton = palette.querySelector(
            'button[style*="rgb(242, 139, 130)"]'
        );

        expect(pinkButton).not.toBeNull();

        fireEvent.click(pinkButton!);

        // カードの外側をクリックする
        fireEvent.click(document.body);

        // updateNoteColorが呼ばれる
        expect(mocks.updateNoteColor).toHaveBeenCalledWith(1, "#f28b82");


        // カラーパレットが閉じたことを確認する
        expect(screen.queryByTestId("color-palette")).not.toBeInTheDocument();




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

    it("ノートが所持しているラベルが表示される", () => {

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



    // ---- History関連 ----
    it("変更履歴をクリックすると、変更履歴パネルが表示される", () => {

        render(<NoteCardWithState />);

        // メニューを開く
        fireEvent.click(screen.getByRole("button", { name: "⋮" }));

        // 変更履歴をクリック
        fireEvent.click(screen.getByRole("button", { name: "変更履歴" }));

        // panelTypeがhistoryになったことを確認
        expect(screen.getByTestId("panel-type")).toHaveTextContent("history");

         // 変更履歴パネルが表示されたことを確認する
        expect(
            screen.getByTestId("history-panel")
        ).toBeInTheDocument();

    });






    it("変更履歴の閉じるボタンをクリックすると、Historyパネルが消える", () => {

        render(<NoteCardWithState />);

        // メニューを開く
        fireEvent.click(
            screen.getByRole("button", { name: "⋮" })
        );

        // 変更履歴を開く
        fireEvent.click(
            screen.getByRole("button", { name: "変更履歴" })
        );

        // パネルが表示されていることを確認
        expect(
            screen.getByTestId("history-panel")
        ).toBeInTheDocument();

        // 閉じるボタンをクリック
        fireEvent.click(
            screen.getByRole("button", { name: "閉じる" })
        );

        // パネルが消えたことを確認
        expect(
            screen.queryByTestId("history-panel")
        ).not.toBeInTheDocument();
    });












});
