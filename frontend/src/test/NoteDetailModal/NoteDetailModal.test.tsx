
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";


import type { Note } from "../../types/api/note";
import NoteDetailModal from "../../features/notes/components/NoteDetailModal/NoteDetailModal";




const mocks = vi.hoisted(() => ({
    handleClose: vi.fn(),
    moveToTrash: vi.fn(),
    createNote: vi.fn(),
    updateNoteColor: vi.fn(),
    handleCreateLabel: vi.fn(),
    handleSelectLabel: vi.fn(),
    handleRemoveNoteLabel: vi.fn(),
    deleteNoteImage: vi.fn(),
    handleSelectImage: vi.fn(),

}));


vi.mock(
    "../../features/notes/hooks/useNoteDetailSession",
    () => ({
        default: () => ({
            handleClose: mocks.handleClose,
        }),
    }),
);


vi.mock(
    "../../features/notes/store/useNoteStore",
    () => ({
        useNoteStore: () => ({
            createNote: mocks.createNote,
            moveToTrash: mocks.moveToTrash,
            deleteNoteImage: mocks.deleteNoteImage,
            updateNoteColor: mocks.updateNoteColor,
        }),
    }),
);






vi.mock(
    "../../features/labels/store/labelStore",   // 本物の labelStore をテストでは使わず、偽物に置き換える。偽物の useLabelStore() を呼ぶと、ラベル3件と handleCreateLabel を返す。
    () => ({
        useLabelStore: () => ({
            labels: [   // labels という名前のプロパティに、ラベル3件の配列を入れている。テスト用に自分で適当にセットする。
                { id: 10, name: "仕事" },
                { id: 20, name: "勉強" },
                { id: 30, name: "プライベート" },
            ],
            handleCreateLabel: mocks.handleCreateLabel,   // handleCreateLabelというプロパティに、mocks.handleCreateLabelを入れる。
        }),
    }),
);




vi.mock(
    "../../features/notes/hooks/useNoteLabels",
    () => ({
        useNoteLabels: () => ({
            labelStates: [
                { id: 10, state: "unchecked" },
                { id: 20, state: "unchecked" },
                { id: 30, state: "unchecked" },
            ],
            handleSelectLabel: mocks.handleSelectLabel,
            handleRemoveNoteLabel: mocks.handleRemoveNoteLabel,
        }),
    }),
);



vi.mock(  // NoteDetailModalImagesコンポ を、テスト用の偽物に置き換える。本物のNoteDetailModalImagesコンポに書いているコードはすべて無視される。だから、削除や、選択ボタンを自分でテスト内に書いてる。そうしないと、偽物のＮoteDetailModalImages内でボタン操作ができない。
    "../../features/notes/components/NoteDetailModal/NoteDetailModalImages/NoteDetailModalImages",
    () => ({

        default: ({   // 本物のコンポーネントが export default で公開されているので、モック側も default として偽物のコンポーネントを用意する。
            // 親コンポーネントから渡された props を受け取っている。
            // note,  テストでは、子が使わないpropsは書かなくても良い。
            onDeleteImage,  // 親から渡される名前と一致させる。
            onSelectImage,
        }: {
            // 受け取る props の型定義。
            // note: Note;
            onDeleteImage: (imageId: number) => void;
            onSelectImage: (imageId: number) => void;
        }) => (

            <div>
                <span>画像テスト用コンポーネント</span>

                <button onClick={() => onDeleteImage(101)}>
                    画像を削除
                </button>

                {/* クリックすると、本物のNoteDetailModalのhandleSelectImageが実行される。偽物なのはあくまで、 NoteDetailModalImagesコンポだけ。*/}
                <button onClick={() => onSelectImage(101)}>
                    画像を選択
                </button>
            </div>
        ),
    }),
);






describe("NoteDetailModal", () => {

    it("ノートのタイトルと本文を表示する", () => {

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

        render(    // render() は、指定したコンポーネントをテスト環境の画面（DOM）に描画する処理。
            <NoteDetailModal
                note={note}
                onClose={vi.fn()}
            />
        );

        expect(screen.getByDisplayValue("テストタイトル")).toBeInTheDocument();
        expect(screen.getByDisplayValue("テスト本文")).toBeInTheDocument();

    });





    it("タイトルを入力すると、入力した文字が表示される", () => {

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

        render(<NoteDetailModal note={note} onClose={vi.fn()} />);

        const titleInput = screen.getByDisplayValue("テストタイトル");    // テスト対象のタイトル入力欄を取得。

        fireEvent.change(titleInput, {   // 入力欄の内容が変更されたというイベントを発生させる。
            target: { value: "変更後のタイトル" },   // 変更後の入力欄の値を指定。
        });

        expect(screen.getByDisplayValue("変更後のタイトル")).toBeInTheDocument();
    });






    it("本文を入力すると、入力した文字が表示される", () => {

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

        render(<NoteDetailModal note={note} onClose={vi.fn()} />);

        const contentInput = screen.getByDisplayValue("テスト本文");

        fireEvent.change(contentInput, {
            target: { value: "変更後の本文" },
        });

        expect(screen.getByDisplayValue("変更後の本文")).toBeInTheDocument();


    });





    it("モーダルの外側をクリックすると、閉じる処理が呼ばれる", () => {

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

        const { container } = render(   // container: 描画した HTML 全体を取得する。分割代入。<div className={styles.overlay}></div>から始まる全部。
            <NoteDetailModal note={note} onClose={vi.fn()} />,
        );

        fireEvent.click(container.firstChild as HTMLElement);    // firstChild： 取得したHTML全体から、最初の子要素を取得する。今回は外側の overlay。

        expect(mocks.handleClose).toHaveBeenCalledOnce();

    });







    it("モーダルの内側をクリックしても、閉じる処理は呼ばれない", () => {

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

        const { container } = render(
            <NoteDetailModal note={note} onClose={vi.fn()} />,
        );

        const modal = container.querySelector("[class*='modal']");    // 描画された HTML の中から、クラス名に modal を含む要素を取得。

        fireEvent.click(modal!);

        expect(mocks.handleClose).not.toHaveBeenCalled();   // handleClose が 一度も呼ばれていないこと を確認。

    });







    it("ゴミ箱へ移動すると、ノートIDを渡して処理を呼び出す", () => {

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

        render(<NoteDetailModal note={note} onClose={vi.fn()} />);


        fireEvent.click(screen.getByText("⋮"));

        fireEvent.click(screen.getByText("削除"));

        expect(mocks.moveToTrash).toHaveBeenCalledWith(1);


    });





    it("ノートを複製すると、元のノートの情報を渡してcreateNoteを呼ぶ", () => {

        const note: Note = {
            id: 1,
            title: "テストタイトル",
            content: "テスト本文",
            color: "#ffffff",
            is_favorite: false,
            is_pinned: false,
            labels: [
                { id: 10, name: "仕事" },
                { id: 20, name: "勉強" },
            ],
            images: [],
            view_count: 0,
            total_view_seconds: 0,
            created_at: "2026-10-10T00:00:00Z",
            order: 0,
            pinned_order: 0,
        };

        render(<NoteDetailModal note={note} onClose={vi.fn()} />);

        // メニューを開く
        fireEvent.click(screen.getByText("⋮"));

        // 複製を実行する
        fireEvent.click(screen.getByText("コピーを作成"));

        // 元のノートの情報が正しく渡されたか確認する
        expect(mocks.createNote).toHaveBeenCalledWith(
            note.title,
            "テスト本文",
            [10, 20],
            "#ffffff",
        );

    });





    it("色ボタンを押すと、色パネルが表示される", () => {

        const note: Note = {
            id: 1,
            title: "テストタイトル",
            content: "テスト本文",
            color: "#ffffff",
            is_favorite: false,
            is_pinned: false,
            labels: [
                { id: 10, name: "仕事" },
                { id: 20, name: "勉強" },
            ],
            images: [],
            view_count: 0,
            total_view_seconds: 0,
            created_at: "2026-10-10T00:00:00Z",
            order: 0,
            pinned_order: 0,
        };

        render(
            <NoteDetailModal
                note={note}
                onClose={vi.fn()}
            />
        );

        // 🎨 ボタンを押す
        fireEvent.click(screen.getByText("🎨"));

        // 色パネルが表示されていることを確認
        expect(screen.getByTestId("color-palette")).toBeInTheDocument();

    });




    it("色を選択すると、モーダルの背景色が変わる", () => {

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

        const { container } = render(
            <NoteDetailModal
                note={note}
                onClose={vi.fn()}
            />
        );


        fireEvent.click(screen.getByText("🎨"));


        const colorButton = container.querySelector(
            'button[style*="rgb(242, 139, 130)"]'   // この色は本物のColorPalette内で定義しているものと一致させる。
        );

        expect(colorButton).not.toBeNull();

        // 本物のcolorPaletteのボタンをクリックする。つまり、本物の onSelectColor(color); が実行される。
        fireEvent.click(colorButton!);   // このクリックで、本物の useNoteColor に書いた handleSelectColorが呼ばれる。本物のNoteDetailModal内で使ってるから。テストに直接useNoteColorを使うコードを明記してなくても、実行される。


        const modal = container.querySelector(
            '[class*="modal"]'
        );

        expect(modal).toHaveStyle({
            backgroundColor: "#f28b82",
        });


    });




    it("メニューからラベルを選ぶと、登録済みの全ラベルが表示される", () => {

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

        render(
            <NoteDetailModal
                note={note}
                onClose={vi.fn()}
            />
        );

        // メニューを開く
        fireEvent.click(screen.getByText("⋮"));

        // ラベルパネルを開く
        fireEvent.click(screen.getByText("ラベル追加"));


        expect(screen.getByText("仕事")).toBeInTheDocument();
        expect(screen.getByText("勉強")).toBeInTheDocument();
        expect(screen.getByText("プライベート")).toBeInTheDocument();

    });





    it("ラベルをクリックすると、ラベルIDを渡して選択処理を呼ぶ", () => {

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

        render(
            <NoteDetailModal note={note} onClose={vi.fn()} />,
        );


        fireEvent.click(screen.getByText("⋮"));


        fireEvent.click(screen.getByText("ラベル追加"));

        fireEvent.click(screen.getByRole("checkbox", { name: "仕事" }));


        expect(mocks.handleSelectLabel).toHaveBeenCalledWith(10);


    });





    it("ラベルの削除ボタンをクリックすると、ラベルIDを指定して削除処理が呼ばれる", () => {

        const note: Note = {
            id: 1,
            title: "テストタイトル",
            content: "テスト本文",
            color: "#ffffff",
            is_favorite: false,
            is_pinned: false,
            labels: [  // 本物のNoteDetailModalでNoteLabelsにnote.labelsを渡している。だから、適当にテスト用のデータをセットする。
                { id: 10, name: "仕事" },
                { id: 20, name: "勉強" },
            ],
                images: [],
                view_count: 0,
                total_view_seconds: 0,
                created_at: "2026-10-10T00:00:00Z",
                order: 0,
                pinned_order: 0,

            };

            render(
                <NoteDetailModal
                    note={note}
                    onClose={mocks.handleClose}
                />
            );


            const label = screen.getByText("仕事").parentElement;
            const removeButton = label?.querySelector("button");

            expect(removeButton).not.toBeNull();

            fireEvent.click(removeButton!);

            expect(mocks.handleRemoveNoteLabel).toHaveBeenCalledWith(10);

        });







        it("画像を削除すると、ノートIDと画像IDを渡して削除処理を呼ぶ", () => {

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

            render(
                <NoteDetailModal note={note} onClose={vi.fn()} />,
            );

            fireEvent.click(screen.getByRole("button", { name: "画像を削除" }));

            expect(mocks.deleteNoteImage).toHaveBeenCalledWith(1, 101);
        });




    // ---- viewer関連 -----

    it("画像を選択すると、ImageViewerが選択した画像の位置で表示される", () => {

        const note: Note = {
            id: 1,
            title: "テストタイトル",
            content: "テスト本文",
            color: "#ffffff",
            is_favorite: false,
            is_pinned: false,
            labels: [],
            images: [
                { id: 101, note: 1, image: "/image1.jpg" },
                { id: 202, note: 1, image: "/image2.jpg" },
            ],
            view_count: 0,
            total_view_seconds: 0,
            created_at: "2026-10-10T00:00:00Z",
            order: 0,
            pinned_order: 0,
        };

        render(<NoteDetailModal note={note} onClose={vi.fn()} />);

        fireEvent.click(screen.getByRole("button", { name: "画像を選択" }));   // これはこのファイルの上の方で定義した、偽物のNoteDetailModalImagesのボタン。これを押すと、本物のNoteDetailModalのhandleSelectImageが実行される。


        expect(document.querySelector('img[src="/image1.jpg"]')).toBeInTheDocument();


    });





    it("次へボタンを押すと、次の画像が表示される", () => {

        const note: Note = {
            id: 1,
            title: "テストタイトル",
            content: "テスト本文",
            color: "#ffffff",
            is_favorite: false,
            is_pinned: false,
            labels: [],
            images: [
                { id: 101, note: 1, image: "/image1.jpg" },
                { id: 202, note: 1, image: "/image2.jpg" },
            ],
            view_count: 0,
            total_view_seconds: 0,
            created_at: "2026-10-10T00:00:00Z",
            order: 0,
            pinned_order: 0,
        };

        render(<NoteDetailModal note={note} onClose={vi.fn()} />);

        // ① 1枚目の画像を選択して、本物のImageViewerを開く
        fireEvent.click(
            screen.getByRole("button", { name: "画像を選択" })
        );

        // ② ImageViewer内にある次へボタンを押す。本物のuseNoteImageViewer内の、handleNextImageが呼ばれる。selectedImageIndex が +1され、本物のNoteDetailModal, ImageViewerが再レンダリングされる。
        fireEvent.click(
            screen.getByRole("button", { name: "→" })
        );

        // ③ 2枚目の画像が表示されたことを確認
        expect(
            document.querySelector('img[src="/image2.jpg"]')
        ).toBeInTheDocument();

    });





    it("前へボタンを押すと、一つ前の画像が表示される", () => {

        const note: Note = {
            id: 1,
            title: "テストタイトル",
            content: "テスト本文",
            color: "#ffffff",
            is_favorite: false,
            is_pinned: false,
            labels: [],
            images: [
                { id: 101, note: 1, image: "/image1.jpg" },
                { id: 202, note: 1, image: "/image2.jpg" },
            ],
            view_count: 0,
            total_view_seconds: 0,
            created_at: "2026-10-10T00:00:00Z",
            order: 0,
            pinned_order: 0,
        };


        render(<NoteDetailModal note={note} onClose={vi.fn()} />);


        fireEvent.click(
            screen.getByRole("button", { name: "画像を選択" })
        );

        // ② 「次へ」を押して、2枚目に移動する
        fireEvent.click(
            screen.getByRole("button", { name: "→" })
        );

        // ③ 「前へ」を押す
        fireEvent.click(
            screen.getByRole("button", { name: "←" })
        );

        // ④ 1枚目の画像に戻ったことを確認する
        expect(
            document.querySelector('img[src="/image1.jpg"]')
        ).toBeInTheDocument();

    });





    it("閉じるボタンを押すと、ImageViewerが非表示になる", () => {

        const note: Note = {
            id: 1,
            title: "テストタイトル",
            content: "テスト本文",
            color: "#ffffff",
            is_favorite: false,
            is_pinned: false,
            labels: [],
            images: [
                { id: 101, note: 1, image: "/image1.jpg" },
                { id: 202, note: 1, image: "/image2.jpg" },
            ],
            view_count: 0,
            total_view_seconds: 0,
            created_at: "2026-10-10T00:00:00Z",
            order: 0,
            pinned_order: 0,
        };


        render(<NoteDetailModal note={note} onClose={vi.fn()} />);


        // ① 画像を選択して、ImageViewerを開く
        fireEvent.click(
            screen.getByRole("button", { name: "画像を選択" })
        );

        // ② ✕ボタンを押す
        fireEvent.click(
            screen.getByRole("button", { name: "✕" })
        );

        // ③ ImageViewerが非表示になったことを確認する
        expect(
            document.querySelector('img[src="/image1.jpg"]')
        ).not.toBeInTheDocument();

    });


});
