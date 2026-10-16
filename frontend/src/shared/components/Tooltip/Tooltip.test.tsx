import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Tooltip from "./Tooltip";
import styles from "./Tooltip.module.css";




describe("Tooltip", () => {

    it("渡された説明文が表示される", () => {

        render(
            <Tooltip text="ノートを選択">
                <button>選択</button>
            </Tooltip>
        );

        expect(screen.getByText("ノートを選択")).toBeInTheDocument();

    });





    it("子要素(children)が表示される", () => {

        render(
            <Tooltip text="ノートを選択">
                <button>選択</button>
            </Tooltip>
        );

        expect(
            screen.getByRole("button", { name: "選択" })
        ).toBeInTheDocument();

    });



    it("fullWidthがtrueの場合、専用クラスが付く", () => {

        const { container } = render(
            <Tooltip text="ノートを選択" fullWidth>
                <button>選択</button>
            </Tooltip>
        );


        expect(container.firstChild).toHaveClass(styles.fullWidth);

    });







    it("マウスを乗せるとTooltipが表示状態になる", () => {

        const { container } = render(
            <Tooltip text="ノートを選択">
                <button>選択</button>
            </Tooltip>
        );

        const wrapper = container.firstElementChild as HTMLElement;
        const tooltip = screen.getByText("ノートを選択");

        fireEvent.mouseEnter(wrapper);

        expect(tooltip).toHaveStyle({
            visibility: "visible",
            opacity: "1",
        });
    });
});
