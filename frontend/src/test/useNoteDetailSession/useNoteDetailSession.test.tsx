
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

import type { Note } from "../../types/api/note";


import useNoteDetailSession from "../../features/notes/hooks/useNoteDetailSession";


// ここでやっているテスト：フックの単体テスト



// テストが1つ終わるたびに実行される。
afterEach(() => {
    vi.restoreAllMocks();
});


// テストで使う「偽物の関数4つ」を作って、mocks というオブジェクトにまとめる。
const mocks = vi.hoisted(() => ({   // vi.hoisted(): vi.mock()より先に実行するために書く。
    incrementNoteView: vi.fn(),    // vi.fn() は、テスト用の偽物の関数を作るもの。
    updateNote: vi.fn(),
    updateNoteColor: vi.fn(),
    updateNoteViewTime: vi.fn(),

}));



// 本物の useNoteStore を使わずに、テスト用の偽物に差し替えている。
vi.mock("../../features/notes/store/useNoteStore", () => ({

    useNoteStore: () => ({
        incrementNoteView: mocks.incrementNoteView,
        updateNote: mocks.updateNote,
        updateNoteColor: mocks.updateNoteColor,
        updateNoteViewTime: mocks.updateNoteViewTime,
    }),

}));







describe("useNoteDetailSession", () => {   // describe("useNoteDetailSession", () => {: このグループは useNoteDetailSession に関するテストだとわかるようにしているだけ。

    // それぞれのテストを始める前に、テスト用の関数を初期状態に戻して、正常に動くように準備する。
    beforeEach(() => {  // beforeEach: 個々のテストを実行する前に、決めておいた処理を実行する関数。

        vi.clearAllMocks();  // モック関数が記録している呼び出し履歴を消す。

        // テスト用の incrementNoteView が呼ばれたら、実際の更新処理はせず、正常に完了する Promise を返して。返す値は特になくていい、という意味。
        mocks.incrementNoteView.mockResolvedValue(undefined);  // mocks.incrementNoteView: 用意したテスト用の関数。このモック関数が呼ばれたら、undefined で正常に完了する Promise を返すという設定をしている。
        mocks.updateNote.mockResolvedValue(undefined);
        mocks.updateNoteColor.mockResolvedValue(undefined);
        mocks.updateNoteViewTime.mockResolvedValue(undefined);

    });



    it("ノートのタイトルや本文が変更されたら、useNoteDetailSession が保存処理を呼び出すか", async () => {

        // テスト用のノートを定義
        const note = {
            id: 1,
            title: "元のタイトル",
            content: "元の本文",
            color: "#ffffff",
        } as Note;


        const onClose = vi.fn();


        // useNoteDetailSession というカスタムフックを、テストの中で動かすためのコード。
        const { result } = renderHook(() =>   // renderHook: React のカスタムフックをテスト環境で実行するための関数。
            useNoteDetailSession({   // 本物のuseNoteDetailSessionを呼び出している。
                note,  // 保存前のノート
                title: "変更後のタイトル",
                content: "変更後の本文",
                tempColor: "#ffffff",
                onClose,  // 閉じる処理を確認するためのテスト用関数
            }),
        );


        await act(async () => {
            await result.current.handleClose();   // ノートを閉じるときの処理を実際に実行する。本物の handleClose() が実行される。
        });


        expect(mocks.updateNote).toHaveBeenCalledWith(
            1,
            "変更後のタイトル",
            "変更後の本文",
        );


        expect(onClose).toHaveBeenCalledOnce();   // onClose が1回だけ呼び出されたこと」を確認するコード。

    });




    it("タイトルや本文が変更されていなければ、保存処理を呼び出さない", async () => {

        const note = {
            id: 1,
            title: "元のタイトル",
            content: "元の本文",
            color: "#ffffff",
        } as Note;

        const onClose = vi.fn();


        const { result } = renderHook(() =>
            useNoteDetailSession({
                note,
                title: "元のタイトル",
                content: "元の本文",
                tempColor: "#ffffff",
                onClose,
            }),
        );

        await act(async () => {
            await result.current.handleClose();
        });

        expect(mocks.updateNote).not.toHaveBeenCalled();
        expect(onClose).toHaveBeenCalledOnce();


    });





    it("ノートの色が変更されたら、色の更新処理を呼び出す", async () => {

        const note = {
            id: 1,
            title: "元のタイトル",
            content: "元の本文",
            color: "#ffffff",
        } as Note;

        const onClose = vi.fn();

        const { result } = renderHook(() =>
            useNoteDetailSession({
                note,
                title: "元のタイトル",
                content: "元の本文",
                tempColor: "#ff0000",
                onClose,
            }),
        );

        await act(async () => {
            await result.current.handleClose();
        });

        expect(mocks.updateNoteColor).toHaveBeenCalledWith(
            1,
            "#ff0000",
        );

        expect(onClose).toHaveBeenCalledOnce();

    });




    it("ノートの色が変更されていなければ、色の更新処理を呼び出さない", async () => {

        const note = {
            id: 1,
            title: "元のタイトル",
            content: "元の本文",
            color: "#ffffff",
        } as Note;

        const onClose = vi.fn();

        const { result } = renderHook(() =>
            useNoteDetailSession({
                note,
                title: "元のタイトル",
                content: "元の本文",
                tempColor: "#ffffff",
                onClose,
            }),
        );

        await act(async () => {
            await result.current.handleClose();
        });

        expect(mocks.updateNoteColor).not.toHaveBeenCalled();
        expect(onClose).toHaveBeenCalledOnce();

    });




    it("ノートを閉じたら、閲覧時間の更新処理を呼び出す", async () => {

        const note = {
            id: 1,
            title: "元のタイトル",
            content: "元の本文",
            color: "#ffffff",
        } as Note;

        const onClose = vi.fn();

        const nowSpy = vi.spyOn(Date, "now")    // vi.spyOn(Date, "now")：本物の Date.now() を監視する。
            .mockReturnValue(1000);    // 返り値を変更するまで、毎回 1000 を返すように設定。

        const { result } = renderHook(() =>
            useNoteDetailSession({
                note,
                title: "元のタイトル",
                content: "元の本文",
                tempColor: "#ffffff",
                onClose,
            }),
        );

        
        expect(nowSpy).toHaveBeenCalled();

        // ノートを閉じた時刻を6000にする。次に Date.now() が呼ばれたら 6000 が返るようになる。
        nowSpy.mockReturnValue(6000);

        await act(async () => {
            await result.current.handleClose();
        });

        expect(mocks.updateNoteViewTime).toHaveBeenCalledWith(1, 5);
        expect(onClose).toHaveBeenCalledOnce();

    });




    // it("ノートを閉じたら、閲覧時間の更新処理を呼び出す", async () => {

    //     const note = {
    //         id: 1,
    //         title: "元のタイトル",
    //         content: "元の本文",
    //         color: "#ffffff",
    //     } as Note;

    //     const onClose = vi.fn();

    //     // 本物の Date.now() を一時的に偽物に置き換えて、「Date.now()が最初に呼ばれたら1000、次に呼ばれたら6000を返す」と設定している
    //     vi.spyOn(Date, "now")   // vi.spyOn(Date, "now"): Date.now() を監視し、返す値を変更できるようにする。
    //         .mockReturnValueOnce(1000)   // 次の呼び出しで 1000 を返す
    //         .mockReturnValueOnce(6000);  // その次の呼び出しで 6000 を返す


    //     const { result } = renderHook(() =>
    //         useNoteDetailSession({
    //             note,
    //             title: "元のタイトル",
    //             content: "元の本文",
    //             tempColor: "#ffffff",
    //             onClose,
    //         }),
    //     );

    //     await act(async () => {
    //         await result.current.handleClose();
    //     });

    //     expect(mocks.updateNoteViewTime).toHaveBeenCalledWith(
    //         1,
    //         5,
    //     );

    //     expect(onClose).toHaveBeenCalledOnce();


    // });





    it("ノートを閉じる処理が2回呼ばれても、更新処理とonCloseは1回だけ実行される", async () => {

        const note = {
            id: 1,
            title: "元のタイトル",
            content: "元の本文",
            color: "#ffffff",
        } as Note;

        const onClose = vi.fn();

        const { result } = renderHook(() =>
            useNoteDetailSession({
                note,
                title: "元のタイトル",
                content: "元の本文",
                tempColor: "#ffffff",
                onClose,
            }),
        );

        await act(async () => {
            await result.current.handleClose();
            await result.current.handleClose();
        });

        expect(mocks.updateNoteViewTime).toHaveBeenCalledTimes(1);    // テスト用の偽物 mocks.updateNoteViewTime が、ちょうど1回だけ呼ばれたかを確認している。
        expect(mocks.updateNote).not.toHaveBeenCalled();
        expect(mocks.updateNoteColor).not.toHaveBeenCalled();
        expect(onClose).toHaveBeenCalledOnce();


    });





    it("ノートを開いたら、閲覧回数の更新処理を呼び出す", () => {

        const note = {
            id: 1,
            title: "元のタイトル",
            content: "元の本文",
            color: "#ffffff",
        } as Note;

        const onClose = vi.fn();

        renderHook(() =>
            useNoteDetailSession({
                note,
                title: "元のタイトル",
                content: "元の本文",
                tempColor: "#ffffff",
                onClose,
            }),
        );

        expect(mocks.incrementNoteView).toHaveBeenCalledOnce();
        expect(mocks.incrementNoteView).toHaveBeenCalledWith(1);  // ノートIDの 1 が正しく渡されたか確認する。


    });





    it("ノートが切り替わっても、閲覧回数の更新処理は1回だけ", () => {

        const noteA = {
            id: 1,
            title: "ノートA",
            content: "本文A",
            color: "#ffffff",
        } as Note;


        const noteB = {
            id: 2,
            title: "ノートB",
            content: "本文B",
            color: "#ffffff",
        } as Note;

        const onClose = vi.fn();

        const { rerender } = renderHook(
            ({ note }) =>
                useNoteDetailSession({
                    note,
                    title: note.title,
                    content: note.content,
                    tempColor: note.color,
                    onClose,
                }),
            {
                initialProps: { note: noteA },
            },
        );

        // ノートAからノートBに切り替える
        rerender({ note: noteB });

        // 閲覧回数の更新処理は1回しか呼ばれていない
        expect(mocks.incrementNoteView).toHaveBeenCalledOnce();
        expect(mocks.incrementNoteView).toHaveBeenCalledWith(1);
    });



    // it("再レンダリングされても、閲覧回数の更新処理は1回だけ呼び出す", () => {

    //     const note = {
    //         id: 1,
    //         title: "元のタイトル",
    //         content: "元の本文",
    //         color: "#ffffff",
    //     } as Note;

    //     const onClose = vi.fn();

    //     const { rerender } = renderHook(() =>   // rerender: renderHookが返すフックを再描画する関数のこと。分割代入で取得してる。
    //         useNoteDetailSession({
    //             note,
    //             title: "元のタイトル",
    //             content: "元の本文",
    //             tempColor: "#ffffff",
    //             onClose,
    //         }),
    //     );

    //     rerender();

    //     expect(mocks.incrementNoteView).toHaveBeenCalledOnce();
    //     expect(mocks.incrementNoteView).toHaveBeenCalledWith(1);


    // });


});
