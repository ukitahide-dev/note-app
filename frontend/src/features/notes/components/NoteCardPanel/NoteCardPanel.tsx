import type { Note } from "../../../../types/api/note";
import type { LabelState } from "../../../../types/ui/label";
import { HistoryPanel } from "../HistoryPanel/HistoryPanel";
import LabelPanel from "../SortableNoteCard/LabelPanel/LabelPanel";
import NoteMenu from "../SortableNoteCard/NoteMenu/NoteMenu";




type Props = {
    panelType: "label" | "history" | null;

    note: Note;

    labelPanelRef: React.RefObject<HTMLDivElement | null>;
    menuRef: React.RefObject<HTMLDivElement | null>;

    labelStates: LabelState[];

    onSelectLabel: (labelId: number) => void;

    onCloseHistory: () => void;
    onOpenLabel: () => void;
    onOpenHistory: () => void;
    onMoveToTrash: () => void;
    onDuplicateNote: () => void;
};




// 親: NoteCard,
// 役割: panelTypeに応じて表示するパネルを1個返す。NoteCardの「パネルをどう表示するか」という判断を、NoteCard自身から切り離した。


export default function NoteCardPanel({
    panelType,
    note,
    labelPanelRef,
    menuRef,
    labelStates,
    onSelectLabel,
    onCloseHistory,
    onOpenLabel,
    onOpenHistory,
    onMoveToTrash,
    onDuplicateNote,



}: Props) {


    if (panelType === "label") {

        return (
            <LabelPanel
                labelPanelRef={labelPanelRef}
                labelStates={labelStates}
                onSelectLabel={onSelectLabel}
            />
        );
    }

    
    if (panelType === "history") {

        return (
            <HistoryPanel
                note={note}
                onClose={onCloseHistory}
            />
        );
    }


    return (

        <NoteMenu
            menuRef={menuRef}
            onOpenLabel={onOpenLabel}
            onOpenHistory={onOpenHistory}
            onMoveToTrash={onMoveToTrash}
            onDuplicateNote={onDuplicateNote}
        />

    );




}
