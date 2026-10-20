import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import NoteCardHeader from "./NoteCardHeader";
import type { Note } from "../../../../../types/api/note";

// 本物の Tooltip をテスト用の偽物に置き換える
vi.mock("../../../../shared/components/Tooltip/Tooltip", () => ({
    // vi.mock は、指定したファイルをテスト中にモック（偽物）に置き換える機能。
    default: ({
        // 渡されるデータは本物で、それを受け取って表示する Tooltip だけが偽物
        text, // これは本物
        children,
    }: {
        text: string;
        children: React.ReactNode;
    }) => (
        <div>
            {children}
            <span>{text}</span>
        </div>
    ),
}));

const note: Note = {
    id: 1,
    title: "テストタイトル",
    content: "テスト本文",
    color: "#ffffff",
    is_favorite: false,
    is_pinned: false,
    labels: [],
    images: [],
    view_count: 0,
    total_view_seconds: 0,
    created_at: "2026-01-01T00:00:00Z",
    order: 0,
    pinned_order: 0,
};

describe("NoteCardHeader", () => {
    it("選択ボタンをクリックすると、onToggleSelectが呼ばれる", () => {
        const onToggleSelect = vi.fn();
        const onTogglePin = vi.fn();

        render(
            <NoteCardHeader
                note={note}
                selected={false}
                onToggleSelect={onToggleSelect}
                onTogglePin={onTogglePin}
            />,
        );

        fireEvent.click(screen.getByRole("button", { name: "○" }));

        expect(onToggleSelect).toHaveBeenCalledTimes(1);
        expect(onTogglePin).not.toHaveBeenCalled();
    });

    it("ピンボタンをクリックすると、onTogglePinが呼ばれる", () => {
        const onToggleSelect = vi.fn();
        const onTogglePin = vi.fn();

        render(
            <NoteCardHeader
                note={note}
                selected={false}
                onToggleSelect={onToggleSelect}
                onTogglePin={onTogglePin}
            />,
        );

        fireEvent.click(screen.getByRole("button", { name: "📍" }));

        expect(onTogglePin).toHaveBeenCalledTimes(1);
        expect(onToggleSelect).not.toHaveBeenCalled();
    });

    it("選択済みの場合、✓ が表示される", () => {
        render(
            <NoteCardHeader
                note={note}
                selected={true}
                onToggleSelect={vi.fn()}
                onTogglePin={vi.fn()}
            />,
        );

        expect(screen.getByRole("button", { name: "✓" })).toBeInTheDocument();
    });

    it("ピン留め済みの場合、📌 が表示される", () => {
        render(
            <NoteCardHeader
                note={{ ...note, is_pinned: true }}
                selected={false}
                onToggleSelect={vi.fn()}
                onTogglePin={vi.fn()}
            />,
        );

        expect(screen.getByRole("button", { name: "📌" })).toBeInTheDocument();
    });

    // ---- Tooltip関連 ----

    it("未選択の場合、選択用Tooltipが表示される", () => {
        render(
            <NoteCardHeader
                note={note}
                selected={false}
                onToggleSelect={vi.fn()}
                onTogglePin={vi.fn()}
            />,
        );

        expect(screen.getByText("ノートを選択")).toBeInTheDocument();
    });

    it("選択済みの場合、選択解除用Tooltipが表示される", () => {
        render(
            <NoteCardHeader
                note={note}
                selected={true}
                onToggleSelect={vi.fn()}
                onTogglePin={vi.fn()}
            />,
        );

        expect(screen.getByText("ノートの選択を解除")).toBeInTheDocument();
    });

    it("未ピン留めの場合、ピン留め用Tooltipが表示される", () => {
        render(
            <NoteCardHeader
                note={note}
                selected={false}
                onToggleSelect={vi.fn()}
                onTogglePin={vi.fn()}
            />,
        );

        expect(screen.getByText("ピン留めする")).toBeInTheDocument();
    });

    it("ピン留め済みの場合、ピン留め解除用Tooltipが表示される", () => {
        render(
            <NoteCardHeader
                note={{ ...note, is_pinned: true }}
                selected={false}
                onToggleSelect={vi.fn()}
                onTogglePin={vi.fn()}
            />,
        );

        expect(screen.getByText("ピン留めを外す")).toBeInTheDocument();
    });
});
