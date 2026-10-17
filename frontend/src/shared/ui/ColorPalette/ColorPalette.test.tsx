import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ColorPalette from "./ColorPalette";



describe("ColorPalette", () => {

    it("定義された11色のボタンが表示される", () => {

        render(<ColorPalette onSelectColor={vi.fn()} />);

        const buttons = screen.getAllByRole("button");

        expect(buttons).toHaveLength(11);

    });



    it("色ボタンをクリックすると、選択した色でonSelectColorが呼ばれる", () => {

        const onSelectColor = vi.fn();

        render(<ColorPalette onSelectColor={onSelectColor} />);

        fireEvent.click(screen.getAllByRole("button")[1]);

        expect(onSelectColor).toHaveBeenCalledTimes(1);
        expect(onSelectColor).toHaveBeenCalledWith("#f28b82");

    });



    it("パレット内をクリックしても、親へのクリックイベントが伝播しない", () => {

        const onParentClick = vi.fn();

        render(
            <div onClick={onParentClick}>
                <ColorPalette onSelectColor={vi.fn()} />
            </div>
        );

        fireEvent.click(screen.getAllByRole("button")[0]);

        expect(onParentClick).not.toHaveBeenCalled();

    });



    it("各ボタンに定義された背景色が設定されている", () => {

        render(<ColorPalette onSelectColor={vi.fn()} />);

        const buttons = screen.getAllByRole("button");

        const expectedColors = [
            "#ffffff",
            "#f28b82",
            "#fbbc04",
            "#fff475",
            "#ccff90",
            "#a7ffeb",
            "#cbf0f8",
            "#aecbfa",
            "#5c3df5",
            "#3e7c79",
            "#a1d6a8",
        ];

        buttons.forEach((button, index) => {
            expect(button).toHaveStyle({
                backgroundColor: expectedColors[index],
            });
        });

    });
    
});
