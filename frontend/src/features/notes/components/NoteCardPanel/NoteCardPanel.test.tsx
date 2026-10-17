import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import NoteCardPanel from "./NoteCardPanel";
import type { Note } from "../../../../types/api/note";


//  ---- 子コンポーネントをテスト用の偽物に置き換える ----

vi.mock("../SortableNoteCard/LabelPanel/LabelPanel", () => ({
    default: () => <div>LabelPanel</div>,
}));


vi.mock("../HistoryPanel/HistoryPanel", () => ({
    HistoryPanel: () => <div>HistoryPanel</div>,
}));


vi.mock("../SortableNoteCard/NoteMenu/NoteMenu", () => ({
    default: () => <div>NoteMenu</div>,
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



const renderNoteCardPanel = (
    panelType: "label" | "history" | null

) => {

    return render (

        <NoteCardPanel
            note={note}
            panelType={panelType}
            labelPanelRef={{ current: null }}
            menuRef={{ current: null }}
            labelStates={[]}
            onSelectLabel={vi.fn()}
            onCloseHistory={vi.fn()}
            onOpenLabel={vi.fn()}
            onOpenHistory={vi.fn()}
            onMoveToTrash={vi.fn()}
            onDuplicateNote={vi.fn()}
        />

    );

}



describe("NoteCardPanel", () => {

    it("panelTypeがlabelの場合、LabelPanelが表示される", () => {

        renderNoteCardPanel("label");

        expect(screen.getByText("LabelPanel")).toBeInTheDocument();

    });



    it("panelTypeがhistoryの場合、HistoryPanelが表示される", () => {

        renderNoteCardPanel("history");

        expect(screen.getByText("HistoryPanel")).toBeInTheDocument();

    });



    it("panelTypeがnullの場合、NoteMenuが表示される", () => {

        renderNoteCardPanel(null);

        expect(screen.getByText("NoteMenu")).toBeInTheDocument();
    });
    
});
