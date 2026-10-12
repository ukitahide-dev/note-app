import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { useNoteImageViewer } from "../../features/notes/hooks/useNoteImageViewer";
import type { Note } from "../../types/api/note";




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



describe("useNoteImageViewer", () => {

    it("画像を選択すると、その画像のインデックスが設定される", () => {

        // useNoteImageViewer をテスト内で実行して、その結果を取りだす。renderHook() は、カスタムフックをテストするための関数。今回は NoteDetailModal 全体を動かしたいわけじゃない。フックだけを直接実行して、その動きを確かめたいから、renderHook() を使う
        const { result } = renderHook(

            () => useNoteImageViewer(note)

        );


        act(() => {
            result.current.handleSelectImage(202);   // result.current はフックから返された現在の値や関数にアクセスするためのもの
        });


        expect(result.current.selectedImageIndex).toBe(1);

    });






    it("存在しない画像IDを渡しても、選択状態は変わらない", () => {

        const { result } = renderHook(() => useNoteImageViewer(note));

        // 先に1枚目の画像を選択する
        act(() => {
            result.current.handleSelectImage(101);
        });

        // 存在しない画像IDを渡す
        act(() => {
            result.current.handleSelectImage(999);
        });

        // 1枚目の選択状態が維持される
        expect(result.current.selectedImageIndex).toBe(0);

    });





    it("次の画像に進むと、選択中のインデックスが1増える", () => {

        const { result } = renderHook(() => useNoteImageViewer(note));

        // 1枚目の画像を選択する（インデックスは0）
        act(() => {
            result.current.handleSelectImage(101);
        });

        // 次の画像に進む
        act(() => {
            result.current.handleNextImage();
        });

        // 2枚目の画像に進んでいることを確認する
        expect(result.current.selectedImageIndex).toBe(1);


    });




    it("最後の画像では、それ以上次へ進まない", () => {
        const { result } = renderHook(() => useNoteImageViewer(note));

        // 2枚目の画像を選択する（インデックスは1）
        act(() => {
            result.current.handleSelectImage(202);
        });

        // さらに次へ進もうとする
        act(() => {
            result.current.handleNextImage();
        });

        // 最後の画像なので、インデックスは1のまま
        expect(result.current.selectedImageIndex).toBe(1);

    });





    it("画像が未選択の状態では、次へ進んでも選択状態は変わらない", () => {

        const { result } = renderHook(() => useNoteImageViewer(note));

        // 最初は画像が未選択
        expect(result.current.selectedImageIndex).toBe(null);

        // 次へ進もうとする
        act(() => {
            result.current.handleNextImage();
        });

        // 未選択のまま変わらない
        expect(result.current.selectedImageIndex).toBe(null);

    });






    it("前の画像に戻ると、選択中のインデックスが1減る", () => {

        const { result } = renderHook(() => useNoteImageViewer(note));

        // 2枚目の画像を選択する（インデックスは1）
        act(() => {
            result.current.handleSelectImage(202);
        });

        // 前の画像に戻る
        act(() => {
            result.current.handlePrevImage();
        });

        // 1枚目に戻っていることを確認する
        expect(result.current.selectedImageIndex).toBe(0);

    });





    it("最初の画像では、それ以上前へ戻らない", () => {

        const { result } = renderHook(() => useNoteImageViewer(note));

        // 1枚目の画像を選択する（インデックスは0）
        act(() => {
            result.current.handleSelectImage(101);
        });

        // さらに前へ戻ろうとする
        act(() => {
            result.current.handlePrevImage();
        });

        // 最初の画像なので、インデックスは0のまま
        expect(result.current.selectedImageIndex).toBe(0);

    });




    it("画像が未選択の状態では、前へ戻っても選択状態は変わらない", () => {

        const { result } = renderHook(() => useNoteImageViewer(note));

        // 最初は画像が未選択
        expect(result.current.selectedImageIndex).toBe(null);

        // 前へ戻ろうとする
        act(() => {
            result.current.handlePrevImage();
        });

        // 未選択のまま変わらない
        expect(result.current.selectedImageIndex).toBe(null);

    });





    it("画像ビューアを閉じると、選択中のインデックスがnullになる", () => {
        
        const { result } = renderHook(() => useNoteImageViewer(note));

        // 1枚目の画像を選択する
        act(() => {
            result.current.handleSelectImage(101);
        });

        // 選択中であることを確認する
        expect(result.current.selectedImageIndex).toBe(0);

        // 画像ビューアを閉じる
        act(() => {
            result.current.handleCloseImageViewer();
        });

        // 未選択状態に戻ったことを確認する
        expect(result.current.selectedImageIndex).toBe(null);

    });

});
