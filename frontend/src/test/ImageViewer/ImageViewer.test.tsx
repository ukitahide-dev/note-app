import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ImageViewer from "../../features/notes/components/ImageViewer/ImageViewer";
import type { NoteImage } from "../../types/api/note";



// ② テスト用の画像データ
const images: NoteImage[] = [
    { id: 101, note: 1, image: "/image1.jpg" },
    { id: 202, note: 1, image: "/image2.jpg" },
];






describe("ImageViewer", () => {



    it("現在のインデックスに対応する画像が表示される", () => {

        render(
            <ImageViewer
                images={images}
                currentIndex={0}
                onNext={vi.fn()}
                onPrev={vi.fn()}
                onClose={vi.fn()}
            />,
        );

       expect(document.querySelector('img[src="/image1.jpg"]')).not.toBeNull();


    });



    it("次へボタンを押すと、onNextが呼ばれる", () => {   // 画像が実際に切り替わることではなく、ImageViewer が親から渡された onNext を呼び出すことをテストしている。

        const onNext = vi.fn();

        render(
            <ImageViewer
                images={images}
                currentIndex={0}
                onNext={onNext}
                onPrev={vi.fn()}
                onClose={vi.fn()}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: "→" }));

        expect(onNext).toHaveBeenCalledTimes(1);

    });





    it("前へボタンを押すと、onPrevが呼ばれる", () => {
        const onPrev = vi.fn();

        render(
            <ImageViewer
                images={images}
                currentIndex={1}
                onNext={vi.fn()}
                onPrev={onPrev}
                onClose={vi.fn()}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: "←" }));

        expect(onPrev).toHaveBeenCalledTimes(1);

    });




    it("閉じるボタンを押すと、onCloseが一度だけ呼ばれる", () => {

        const onClose = vi.fn();

        render(
            <ImageViewer
                images={images}
                currentIndex={0}
                onNext={vi.fn()}
                onPrev={vi.fn()}
                onClose={onClose}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: "✕" }));

        expect(onClose).toHaveBeenCalledTimes(1);
    });




    it("画像をクリックしても、onCloseは呼ばれない", () => {
        const onClose = vi.fn();

        render(
            <ImageViewer
                images={images}
                currentIndex={0}
                onNext={vi.fn()}
                onPrev={vi.fn()}
                onClose={onClose}
            />
        );

        fireEvent.click(document.querySelector('img[src="/image1.jpg"]')!);

        expect(onClose).not.toHaveBeenCalled();

    });




    it("背景をクリックすると、onCloseが呼ばれる", () => {
        const onClose = vi.fn();

        const { container } = render(   // container: HTNL要素全体
            <ImageViewer
                images={images}
                currentIndex={0}
                onNext={vi.fn()}
                onPrev={vi.fn()}
                onClose={onClose}
            />
        );

        fireEvent.click(container.firstElementChild!);

        expect(onClose).toHaveBeenCalledTimes(1);

    });




    it("1枚目の画像では、前へボタンが表示されない", () => {

        render(
            <ImageViewer
                images={images}
                currentIndex={0}
                onNext={vi.fn()}
                onPrev={vi.fn()}
                onClose={vi.fn()}
            />
        );

        expect(
            screen.queryByRole("button", { name: "←" })
        ).not.toBeInTheDocument();

    });




    it("最後の画像では、次へボタンが表示されない", () => {

        render(
            <ImageViewer
                images={images}
                currentIndex={1}
                onNext={vi.fn()}
                onPrev={vi.fn()}
                onClose={vi.fn()}
            />
        );

        expect(
            screen.queryByRole("button", { name: "→" })
        ).not.toBeInTheDocument();
    });



});
