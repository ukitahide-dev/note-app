import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import ImageItem from "./ImageItem";

import styles from "./ImageItem.module.css";

import { useSortable } from "@dnd-kit/sortable";
import type { NoteImage } from "../../../../types/api/note";



vi.mock("@dnd-kit/sortable", () => ({
    useSortable: vi.fn(() => ({
        attributes: {},
        listeners: {},
        setNodeRef: vi.fn(),
        transform: null,
        transition: undefined,
    })),
}));

vi.mock("@dnd-kit/utilities", () => ({
    CSS: {
        Transform: {
            toString: vi.fn(() => undefined),
        },
    },
}));




const image: NoteImage = {
    id: 71,
    image: "image1.png",
    order: 0,
    note: 298,
};



describe("ImageItem", () => {

    it("画像を表示する", () => {

        render(
            <ImageItem
                image={image}
                isLarge={false}
                onDeleteImage={vi.fn()}
                onSelectImage={vi.fn()}
            />
        );

        const img = screen.getByRole("img");

        expect(img).toHaveAttribute("src", "image1.png");
        expect(img).toHaveClass(styles.image);

    });



    it("画像をクリックすると、正しい画像IDでonSelectImageが呼ばれる", () => {

        const onSelectImage = vi.fn();

        render(
            <ImageItem
                image={image}
                isLarge={false}
                onDeleteImage={vi.fn()}
                onSelectImage={onSelectImage}
            />
        );

        fireEvent.click(screen.getByRole("img"));

        expect(onSelectImage).toHaveBeenCalledWith(71);

    });




    it("削除ボタンをクリックすると、正しい画像IDでonDeleteImageが呼ばれる", () => {

        const onDeleteImage = vi.fn();

        render(
            <ImageItem
                image={image}
                isLarge={false}
                onDeleteImage={onDeleteImage}
                onSelectImage={vi.fn()}
            />
        );

        fireEvent.click(screen.getByRole("button"));

        expect(onDeleteImage).toHaveBeenCalledWith(71);

    });






    it("isLargeがfalseの場合、通常サイズのクラスを設定する", () => {

        const { container } = render(
            <ImageItem
                image={image}
                isLarge={false}
                onDeleteImage={vi.fn()}
                onSelectImage={vi.fn()}
            />
        );

        expect(container.firstChild).toHaveClass(
            styles.imageWrapper,
            styles.normalImageWrapper
        );

        expect(screen.getByRole("img")).toHaveClass(styles.image);

    });




    it("isLargeがtrueの場合、大きいサイズのクラスを設定する", () => {

        const { container } = render(
            <ImageItem
                image={image}
                isLarge={true}
                onDeleteImage={vi.fn()}
                onSelectImage={vi.fn()}
            />
        );

        expect(container.firstChild).toHaveClass(
            styles.imageWrapper,
            styles.largeImageWrapper
        );

        expect(screen.getByRole("img")).toHaveClass(styles.largeImage);

    });




    it("画像IDをuseSortableに渡す", () => {

        render(
            <ImageItem
                image={image}
                isLarge={false}
                onDeleteImage={vi.fn()}
                onSelectImage={vi.fn()}
            />
        );

        expect(useSortable).toHaveBeenCalledWith({
            id: 71,
        });

    });

});
