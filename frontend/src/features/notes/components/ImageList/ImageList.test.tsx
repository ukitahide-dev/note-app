import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ImageList } from "./ImageList";
import type { NoteImage } from "../../../../types/api/note";


// ImageItemのモック
const { mockImageItem } = vi.hoisted(() => ({
    mockImageItem: vi.fn(),

}));



vi.mock("../ImageItem/ImageItem", () => ({

    default: ({  // 分割代入で値を取得。分割代入は、オブジェクトのプロパティの値を取り出す。
        image,
        isLarge,   // isLargeはfalseという値そのもの。
        onDeleteImage,
        onSelectImage,

    }: {

        image: NoteImage;
        isLarge: boolean;
        onDeleteImage: (imageId: number) => void;
        onSelectImage: (imageId: number) => void;

    }) => {


        // 親からこういうデータを渡されて、コンポーネントが呼ばれたことを記録する。
        mockImageItem({  // 全体を {} で囲うのは、4つのデータを「1つのオブジェクト」として渡すため。
            image,
            isLarge,  // これは省略記法。isLargeというプロパティに、上の分割代入で取得したisLargeの値(false)をセットするという意味。省略せずに書くと、{isLarge: isLarge}になる。変数 isLarge の値である false を、isLarge という名前のプロパティにセットしている。
            onDeleteImage,
            onSelectImage,
        });


        return (
            <div data-testid={`image-${image.id}`}>
                <span>{image.image}</span>
                <span>{String(isLarge)}</span>
            </div>
        );
    },
}));



const images: NoteImage[] = [
    {
        id: 71,
        image: "image1.png",
        order: 0,
        note: 298,
    },
    {
        id: 72,
        image: "image2.png",
        order: 1,
        note: 298,
    },
];





describe("ImageList", () => {

    it("画像の数だけImageItemが表示される", () => {

        render(
            <ImageList
                images={images}
                isLarge={false}
                noteId={298}
                onDeleteImage={vi.fn()}
                onSelectImage={vi.fn()}
            />
        );

        expect(screen.getByTestId("image-71")).toBeInTheDocument();
        expect(screen.getByTestId("image-72")).toBeInTheDocument();

    });



    it("各画像のデータが対応するImageItemに渡される", () => {

        render(
            <ImageList
                images={images}
                isLarge={false}
                noteId={298}
                onDeleteImage={vi.fn()}
                onSelectImage={vi.fn()}
            />
        );

        expect(mockImageItem).toHaveBeenCalledTimes(2);

        expect(mockImageItem).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining({
                image: images[0],
                isLarge: false,
            }),
        );

        expect(mockImageItem).toHaveBeenNthCalledWith(
            2,  // 2回目の呼び出し
            expect.objectContaining({    // expect.objectContaining() は、オブジェクト全体が完全一致しなくても、指定したプロパティが一致すればよいという意味。
                image: images[1],
                isLarge: false,
            }),
        );

    });




    it("削除と選択のコールバックが各ImageItemに渡される", () => {

        const onDeleteImage = vi.fn();
        const onSelectImage = vi.fn();

        render(
            <ImageList
                images={images}
                isLarge={true}
                noteId={298}
                onDeleteImage={onDeleteImage}
                onSelectImage={onSelectImage}
            />
        );

        expect(mockImageItem).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining({
                onDeleteImage,
                onSelectImage,
            }),
        );

        expect(mockImageItem).toHaveBeenNthCalledWith(
            2,
            expect.objectContaining({
                onDeleteImage,
                onSelectImage,
            }),
        );
    });



    it("画像が空の場合、何も表示されない", () => {
        const { container } = render(
            <ImageList
                images={[]}
                isLarge={false}
                noteId={298}
                onDeleteImage={vi.fn()}
                onSelectImage={vi.fn()}
            />
        );

        expect(container).toBeEmptyDOMElement();
        expect(mockImageItem).not.toHaveBeenCalled();

    });




});
