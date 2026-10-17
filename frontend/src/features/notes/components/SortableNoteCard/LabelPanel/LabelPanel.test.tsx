
// 優先度	テスト内容	        確認すること
// 高	ラベル一覧の表示	Store のラベルが表示される
// 高	ラベルをクリック	onSelectLabel に正しい ID が渡る
// 高	入力欄に文字を入力	入力したラベルの作成ボタンが表示される
// 高	作成ボタンをクリック	handleCreateLabel が呼ばれ、入力欄が空になる
// 中	空白だけを入力	作成ボタンが表示されず、ラベル一覧が表示される
// 中	labelStates を渡す	各ラベルに対応する状態が子に渡される



import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import LabelPanel from "./LabelPanel";
import type { Label } from "../../../../../types/api/note";
import type { LabelState } from "../../../../../types/ui/label";



// Store のテスト用データと関数を用意する
const { mockHandleCreateLabel, mockLabels } = vi.hoisted(() => ({
    mockHandleCreateLabel: vi.fn(),
    mockLabels: [
        { id: 1, name: "仕事" },
        { id: 2, name: "プライベート" },
    ],

}));


// Zustand Store を偽物にする
vi.mock("../../../../labels/store/labelStore", () => ({
    useLabelStore: () => ({
        labels: mockLabels,
        handleCreateLabel: mockHandleCreateLabel,
    }),
}));


// 子コンポーネントを偽物にする
vi.mock("./LabelPanelItem/LabelPanelItem", () => ({
    default: ({
        label,
        labelState,
        onSelectLabel,

    }: {
        label: Label;
        labelState?: LabelState;
        onSelectLabel: (id: number) => void;

    }) => (

        <div>

            <span data-testid={`label-state-${label.id}`}>
                {labelState?.state ?? "undefined"}
            </span>

            <label>
                <input
                    type="checkbox"
                    checked={labelState?.state === "checked"}
                    readOnly
                    onClick={() => onSelectLabel(label.id)}
                />
                <span>{label.name}</span>
            </label>

        </div>


    ),

}));



describe("LabelPanel", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });


    it("Storeから取得したラベル一覧が表示される", () => {

        render(<LabelPanel onSelectLabel={vi.fn()} />);

        expect(screen.getByText("仕事")).toBeInTheDocument();
        expect(screen.getByText("プライベート")).toBeInTheDocument();

    });



    it("ラベルをクリックすると、正しいIDでonSelectLabelが呼ばれる", () => {

        const onSelectLabel = vi.fn();

        render(<LabelPanel onSelectLabel={onSelectLabel} />);

        fireEvent.click(screen.getByRole("checkbox", { name: "仕事" }));

        expect(onSelectLabel).toHaveBeenCalledTimes(1);
        expect(onSelectLabel).toHaveBeenCalledWith(1);

    });



    it("入力すると、入力したラベル名を含む作成ボタンが表示される", () => {

        render(<LabelPanel onSelectLabel={vi.fn()} />);

        fireEvent.change(  // fireEvent.change: 指定した要素で change イベントを発生させる関数。
            screen.getByPlaceholderText("新しいラベル"),  // placeholder が「新しいラベル」の入力欄を探す。
            { target: { value: "買い物" } },    // イベントの対象となった入力欄の value が "買い物" になった、という状況を再現するためのデータ。
        );

        expect(
            screen.getByRole("button", { name: "「買い物」を作成" }),
        ).toBeInTheDocument();

    });



    it("作成ボタンをクリックすると、ラベル作成関数が呼ばれて入力欄が空になる", () => {

        render(<LabelPanel onSelectLabel={vi.fn()} />);

        const input = screen.getByPlaceholderText("新しいラベル");

        fireEvent.change(input, {
            target: { value: "買い物" },
        });

        fireEvent.click(
            screen.getByRole("button", { name: "「買い物」を作成" }),
        );

        expect(mockHandleCreateLabel).toHaveBeenCalledTimes(1);
        expect(mockHandleCreateLabel).toHaveBeenCalledWith("買い物");
        expect(input).toHaveValue("");
    });




    it("空白だけを入力した場合、作成ボタンは表示されずラベル一覧が表示される", () => {

        render(<LabelPanel onSelectLabel={vi.fn()} />);

        fireEvent.change(
            screen.getByPlaceholderText("新しいラベル"),
            { target: { value: "   " } },
        );

        expect(
            screen.queryByRole("button", { name: /を作成/ }),
        ).not.toBeInTheDocument();

        expect(screen.getByText("仕事")).toBeInTheDocument();
        expect(screen.getByText("プライベート")).toBeInTheDocument();

    });





    it("各ラベルに対応するlabelStateを渡す", () => {

        const labelStates: LabelState[] = [
            { id: 2, state: "checked" },
            { id: 1, state: "indeterminate" },
        ];

        render(
            <LabelPanel
                onSelectLabel={vi.fn()}
                labelStates={labelStates}
            />
        );

        expect(screen.getByTestId("label-state-1"))
            .toHaveTextContent("indeterminate");

        expect(screen.getByTestId("label-state-2"))
            .toHaveTextContent("checked");

    });







});
