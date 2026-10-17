import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import LabelPanelItem from "./LabelPanelItem";
import type { Label } from "../../../../../../types/api/note";
import type { LabelState } from "../../../../../../types/ui/label";


const label: Label = {
    id: 1,
    name: "仕事",
};



describe("LabelPanelItem", () => {

    it("ラベル名が表示される", () => {

        render(
            <LabelPanelItem
                label={label}
                onSelectLabel={vi.fn()}
            />
        );

        expect(screen.getByText("仕事")).toBeInTheDocument();

    });



    it("labelStateがcheckedの場合、チェックが入る", () => {

        const labelState: LabelState = {
            id: 1,
            state: "checked",
        };

        render(
            <LabelPanelItem
                label={label}
                labelState={labelState}
                onSelectLabel={vi.fn()}
            />
        );

        expect(screen.getByRole("checkbox")).toBeChecked();

    });



    it("labelStateがindeterminateの場合、中間状態になる", () => {

        const labelState: LabelState = {
            id: 1,
            state: "indeterminate",
        };

        render(
            <LabelPanelItem
                label={label}
                labelState={labelState}
                onSelectLabel={vi.fn()}
            />
        );

        expect(screen.getByRole("checkbox")).toBePartiallyChecked();

    });




    it("チェックボックスを操作すると、正しいラベルIDでonSelectLabelが呼ばれる", () => {

        const onSelectLabel = vi.fn();

        render(
            <LabelPanelItem
                label={label}
                onSelectLabel={onSelectLabel}
            />
        );

        fireEvent.click(screen.getByRole("checkbox"));

        expect(onSelectLabel).toHaveBeenCalledTimes(1);
        expect(onSelectLabel).toHaveBeenCalledWith(1);

    });



    it("labelStateがない場合、チェックが入らず中間状態にもならない", () => {

        render(
            <LabelPanelItem
                label={label}
                onSelectLabel={vi.fn()}
            />
        );

        const checkbox = screen.getByRole("checkbox");

        expect(checkbox).not.toBeChecked();
        expect(checkbox).not.toBePartiallyChecked();

    });





});
