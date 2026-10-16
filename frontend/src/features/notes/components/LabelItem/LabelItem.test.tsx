import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import LabelItem from "./LabelItem";
import type { Label } from "../../../../types/api/note";



const label: Label = {
    id: 1,
    name: "仕事",
};


describe("LabelItem", () => {

    it("ラベル名が表示される", () => {

        const onRemoveLabel = vi.fn();

        render(
            <LabelItem
                label={label}
                onRemoveLabel={onRemoveLabel}
            />
        );

        expect(screen.getByText("仕事")).toBeInTheDocument();

    });



    it("×ボタンをクリックすると、ラベルIDを渡して削除関数が呼ばれる", () => {

        const onRemoveLabel = vi.fn();

        render(
            <LabelItem
                label={label}
                onRemoveLabel={onRemoveLabel}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: "×" }));

        expect(onRemoveLabel).toHaveBeenCalledWith(1);
        expect(onRemoveLabel).toHaveBeenCalledTimes(1);

    });


    it("×ボタンのクリックが親要素に伝わらない", () => {

        const onRemoveLabel = vi.fn();
        const onParentClick = vi.fn();

        render(
            <div onClick={onParentClick}>
                <LabelItem
                    label={label}
                    onRemoveLabel={onRemoveLabel}
                />
            </div>
        );

        fireEvent.click(screen.getByRole("button", { name: "×" }));

        expect(onRemoveLabel).toHaveBeenCalledWith(1);
        expect(onParentClick).not.toHaveBeenCalled();

    });

});
