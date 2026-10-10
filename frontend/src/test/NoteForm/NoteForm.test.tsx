import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor,  } from "@testing-library/react";
import axios from "axios";

import NoteForm from "../../features/notes/components/NoteForm/NoteForm";


const mockCreateNote = vi.fn();    // テスト用の偽物の関数を1個作っている。createNote の代わりになる偽物の関数を作った


vi.mock("../../features/notes/store/useNoteStore", () => ({   // テスト中だけ、本物の useNoteStore の代わりに、mockCreateNote を使う、偽物の useNoteStore に差し替える
    useNoteStore: () => ({
        createNote: mockCreateNote,
    }),
}));




describe("NoteForm", () => {   // describe("NoteForm", ...): ここからNoteFormについてのテストをまとめるというグループ分け。

    // NoteFormが画面に存在することを保証するテスト
    it("NoteFormが表示される", () => {

        render(<NoteForm />);    // 実際にNoteFormをテスト対象として画面に出す。これでテスト対象がNoteFormになる。

        expect(
            screen.getByPlaceholderText("ノートを入力...")
        ).toBeInTheDocument();

    });



    // 本文欄にフォーカスすると、タイトル入力欄が表示されることを保証するテスト
    it("本文欄をクリックするとフォームが展開される", () => {

        render(<NoteForm />);

        const textarea = screen.getByPlaceholderText("ノートを入力...");

        fireEvent.focus(textarea);

        expect(screen.getByPlaceholderText("タイトル")).toBeInTheDocument();

    });




    it("タイトルと本文を入力して投稿すると、createNoteが呼ばれる", () => {

        render(<NoteForm />);

        const textarea = screen.getByPlaceholderText("ノートを入力...");

        fireEvent.focus(textarea);

        const titleInput = screen.getByPlaceholderText("タイトル");

        fireEvent.change(titleInput, {
            target: { value: "買い物メモ" },
        });

        fireEvent.change(textarea, {
            target: { value: "牛乳を買う" },
        });

        fireEvent.click(
            screen.getByRole("button", { name: "投稿" })   // 画面の中から「投稿」という名前のボタンを探す
        );


        expect(mockCreateNote).toHaveBeenCalledWith(   // mockCreateNote が、この4つの引数で呼ばれたことを確認する
            "買い物メモ",
            "牛乳を買う",
            [],
            "#ffffff"
        );


    });





    it("投稿に成功すると入力内容がリセットされる", async () => {

        render(<NoteForm />);

        const textarea = screen.getByPlaceholderText("ノートを入力...");

        fireEvent.focus(textarea);

        const titleInput = screen.getByPlaceholderText("タイトル");


        fireEvent.change(titleInput, {
            target: { value: "買い物メモ" },
        });

        fireEvent.change(textarea, {
            target: { value: "牛乳を買う" },
        });

        fireEvent.click(
            screen.getByRole("button", { name: "投稿" })
        );

        // textareaが空文字になるまで確認を繰り返して。空文字になったことを確認できるまで、このテストは先に進まないで。
        await waitFor(() => {   // await は、この waitFor が完了するまで、このテストを次に進めないという意味。
            expect(textarea).toHaveValue("");
        });

        expect(
            // titleInput
            screen.queryByPlaceholderText("タイトル")   // こっちは、もう一度取得しなおす。投稿後、タイトル欄はDOMから消えるから、投稿前に取得したtitleInputはDOMから消えてる。だから、改めて取得しなおす。
        ).not.toBeInTheDocument();

       


    });






    it("投稿中は投稿ボタンが無効になる", async () => {

        // mockCreateNote.mockReset();

        mockCreateNote.mockReturnValue(    // mockCreateNoteを呼んだら、絶対に完了しないPromiseを返して。このテストでは投稿したら、ボタンがdisabledになることを確認したい。だから、ずっと投稿中の状態にしたいため。
            new Promise(() => {})
        );

        render(<NoteForm />);

        const textarea = screen.getByPlaceholderText("ノートを入力...");

        fireEvent.focus(textarea);

        expect(
            screen.getByPlaceholderText("タイトル")
        ).toBeInTheDocument();

        const titleInput = screen.getByPlaceholderText("タイトル");

        fireEvent.change(titleInput, {
            target: { value: "買い物メモ" },
        });

        fireEvent.change(textarea, {
            target: { value: "牛乳を買う "},
        });


        fireEvent.click(
            screen.getByRole("button", { name: "投稿" })
        );

        await waitFor(() => {
            expect(
                screen.getByRole("button", { name: "投稿中" })
            ).toBeDisabled();
        });



    });






    it("タイトルが100文字なら投稿できる", () => {

        render(<NoteForm />);

        const textarea = screen.getByPlaceholderText("ノートを入力...");
        fireEvent.focus(textarea);

        const titleInput = screen.getByPlaceholderText("タイトル");

        const title = "あ".repeat(100);

        fireEvent.change(titleInput, {
            target: { value: title },
        });

        fireEvent.change(textarea, {
            target: { value: "牛乳を買う" },
        });

        fireEvent.click(
            screen.getByRole("button", { name: "投稿" })
        );

        expect(mockCreateNote).toHaveBeenCalledWith(
            title,
            "牛乳を買う",
            [],
            "#ffffff"
        );

    });




    // 空のまま投稿すると、エラーメッセージが表示されることを確認するテスト
    it("空のまま投稿するとエラーメッセージが表示される", () => {     // 空のまま投稿したとき、エラーメッセージが表示されることをテストします

        render(<NoteForm />);


        const textarea = screen.getByPlaceholderText("ノートを入力...");   // 画面の中から「ノートを入力...」というplaceholderを持っているtextareaを探して、その要素を取得する

        fireEvent.focus(textarea);    // このtextareaにフォーカスしたことにする。


        fireEvent.click(screen.getByRole("button", { name: "投稿" }));   // 画面にある『投稿』ボタンを取得し、取得した投稿ボタンをクリックしたことにする。

        // 画面から『タイトルを入力してください。』という要素を探して、それが画面に存在することを確認する。
        expect(
            screen.getByText("タイトルを入力してください。")
        ).toBeInTheDocument();

        expect(
            screen.getByText("本文を入力してください。")
        ).toBeInTheDocument();


    });




    it("投稿に失敗するとエラーメッセージが表示される", async () => {

        // Axiosで400エラーが発生したときの“偽物のエラーオブジェクト”を作っている。テストコードの中で自分でAxiosErrorを作ってる。実際のサーバー通信をせず、テストコードで作った偽物のAxiosエラー。
        const error = new axios.AxiosError(
            "Bad Request",
            "ERR_BAD_REQUEST",
            undefined,
            undefined,

            // サーバーから返ってきた偽物のレスポンスを作ってる。
            {
                status: 400,
                data: {
                    title: ["タイトルが不正です。"],
                },
            } as any
        );


        mockCreateNote.mockRejectedValue(error);   // createNoteをわざと失敗させて、↑のerrorを返す。


        render(<NoteForm />);

        const textarea = screen.getByPlaceholderText("ノートを入力...");

        fireEvent.focus(textarea);

        const titleInput = screen.getByPlaceholderText("タイトル");

        fireEvent.change(titleInput, {
            target: { value: "買い物メモ" },
        });

        fireEvent.change(textarea, {
            target: { value: "牛乳を買う" },
        });

        fireEvent.click(
            screen.getByRole("button", { name: "投稿" })
        );


        await waitFor(() => {
            expect(
                screen.getByText("タイトルが不正です。")
            ).toBeInTheDocument();
        });

    });






    it("タイトルが100文字を超えるとエラーメッセージが表示される", () => {

        render(<NoteForm />);

        const textarea = screen.getByPlaceholderText("ノートを入力...");

        fireEvent.focus(textarea);

        const titleInput = screen.getByPlaceholderText("タイトル");

        fireEvent.change(titleInput, {
            target: { value: "あ".repeat(101) },
        });

        fireEvent.change(textarea, {
            target: { value: "牛乳を買う" },
        });

        fireEvent.click(
            screen.getByRole("button", { name: "投稿" })
        );

        expect(
            screen.getByText("タイトルは100文字以内です。")
        ).toBeInTheDocument();


        expect(mockCreateNote).not.toHaveBeenCalled();   // 不正な入力なので、createNoteが呼ばれていない、つまり、サーバーに送信していないことまで確認する。



    });


});
