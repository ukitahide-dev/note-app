import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useRef } from "react";

import { useClickOutside } from "./useClickOutside";



// ---- 共通テスト用コンポーネント ----
type Props = {
    onClickOutside: () => void;
    enabled?: boolean;

};


function TestComponent({
    onClickOutside,
    enabled = true,

}: Props) {

    const ref1 = useRef<HTMLDivElement>(null);
    const ref2 = useRef<HTMLDivElement>(null);

    useClickOutside([ref1, ref2], onClickOutside, enabled);

    return (
        <>
            <div ref={ref1} data-testid="inside1">
                内側
            </div>

            <div ref={ref2} data-testid="inside2">
                内側2
            </div>

            <div data-testid="outside">
                外側
            </div>
        </>
    );
}




describe("useClickOutside", () => {

    it("外側をクリックすると、onClickOutsideが呼ばれる", () => {

        const onClickOutside = vi.fn();

        render(
            <TestComponent onClickOutside={onClickOutside} />
        );

        fireEvent.click(screen.getByTestId("outside"));

        expect(onClickOutside).toHaveBeenCalledTimes(1);

    });


    it("内側をクリックしても、onClickOutsideが呼ばれない", () => {

        const onClickOutside = vi.fn();

        render(
            <TestComponent onClickOutside={onClickOutside} />
        );

        fireEvent.click(screen.getByTestId("inside1"));

        expect(onClickOutside).not.toHaveBeenCalled();

    });



    it("enabledがfalseのとき、外側をクリックしても呼ばれない", () => {

        const onClickOutside = vi.fn();

        render(
            <TestComponent
                onClickOutside={onClickOutside}
                enabled={false}
            />
        );


        fireEvent.click(screen.getByTestId("outside"));

        expect(onClickOutside).not.toHaveBeenCalled();

    });



    it("複数の内側の領域をクリックしても、onClickOutsideが呼ばれない", () => {

        const onClickOutside = vi.fn();

        render(
            <TestComponent onClickOutside={onClickOutside} />
        );

        fireEvent.click(screen.getByTestId("inside1"));
        fireEvent.click(screen.getByTestId("inside2"));

        expect(onClickOutside).not.toHaveBeenCalled();

    });



    it("アンマウント時にイベントリスナーを解除する", () => {

        const onClickOutside = vi.fn();

        const { unmount } = render(
            <TestComponent onClickOutside={onClickOutside} />
        );

        unmount();

        fireEvent.click(document);

        expect(onClickOutside).not.toHaveBeenCalled();

    });


    it("アンマウント時にイベントリスナーを解除する", () => {

        const onClickOutside = vi.fn();

        // document の "removeEventListener" という関数を監視する。vi.spyOn()：すでに存在する関数を監視する。
        const removeEventListenerSpy = vi.spyOn(
            document,
            "removeEventListener",
        );

        const { unmount } = render(
            <TestComponent onClickOutside={onClickOutside} />
        );

        unmount();

        // removeEventListener が、第1引数に "click"、第2引数に関数を渡して呼び出されたことがあるかを確認。
        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            "click",
            expect.any(Function),
        );

        // vi.spyOn() で設定した監視を解除して、元の状態に戻すコード
        removeEventListenerSpy.mockRestore();

    });

});
