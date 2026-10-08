import ColorPalette from "../../../../../shared/ui/ColorPalette/ColorPalette";
import type { Note } from "../../../../../types/api/note";
import type { LabelState } from "../../../../../types/ui/label";
import { HistoryPanel } from "../../HistoryPanel/HistoryPanel";
import LabelPanel from "../../SortableNoteCard/LabelPanel/LabelPanel";
import NoteMenu from "../../SortableNoteCard/NoteMenu/NoteMenu";




type Props = {
    panelType: "menu" | "color" | "label" | "history" | null;

    onOpenLabel?: () => void;
    onOpenHistory?: () => void;
    onMoveToTrash?: () => void;
    onDuplicateNote?: ( ) => void;



    tempColor: string;
    onSelectColor: (color: string) => void;
    onCloseColor: () => void;

    labelStates: LabelState[];
    onSelectLabel: (labelId: number) => void;

    note: Note;
    onCloseHistory: () => void;

};




export default function NoteDetailModalPanel({
    panelType,

    onOpenLabel,
    onOpenHistory,
    onMoveToTrash,
    onDuplicateNote,

    tempColor,
    onSelectColor,
    onCloseColor,

    labelStates,
    onSelectLabel,

    note,
    onCloseHistory,


}: Props) {


    if (panelType === "menu") {

        return (

            <NoteMenu
                onOpenLabel={onOpenLabel}
                onOpenHistory={onOpenHistory}
                onMoveToTrash={onMoveToTrash}
                onDuplicateNote={onDuplicateNote}
            />
        );
    }


    if (panelType === "label") {

        return (

            <LabelPanel
                labelStates={labelStates}
                onSelectLabel={onSelectLabel}
            />



        );

    }

    if (panelType === "color") {

        return (

            <ColorPalette
                tempColor={tempColor}
                onSelectColor={onSelectColor}
                onClose={onCloseColor}
            />

        );
    }


    if (panelType === "history") {

        return (

            <HistoryPanel
                note={note}
                onClose={onCloseHistory}
            />

        )


    }


}
