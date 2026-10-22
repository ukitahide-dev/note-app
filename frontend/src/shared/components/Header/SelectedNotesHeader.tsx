// ---- react ----
import type { Dispatch, RefObject, SetStateAction } from "react";

// ---- store ----
import { useNoteSelectionStore } from "../../../features/notes/store/useNoteSelectionStore";
// import { useNoteStore } from "../../../features/notes/store/useNoteStore";

// ---- component ----
import NoteMenu from "../../../features/notes/components/SortableNoteCard/NoteMenu/NoteMenu";
import ColorPalette from "../../ui/ColorPalette/ColorPalette";
import LabelPanel from "../../../features/notes/components/SortableNoteCard/LabelPanel/LabelPanel";

// ---- hooks ----
import { useSelectedNoteLabels } from "../../../features/notes/hooks/useSelectedNoteLabels/useSelectedNoteLabels";
import { useSelectedNoteActions } from "../../../features/notes/hooks/useSelectedNoteActions/useSelectedNoteActions";

// ---- react-icon ----
import { BsPin } from "react-icons/bs";
import { MdPushPin } from "react-icons/md";

// ---- css ----
import styles from "./Header.module.css";
import { useSelectedNotes } from "../../../features/notes/hooks/useSelectedNotes/useSelectedNotes";


type PanelType = "color" | "menu" | "label" | null;


type Props = {

    selectedNoteCount: number;
    // pinnedState: "add" | "remove";
    onTogglePin: (pinnedState: "add" | "remove") => void;

    panelType: PanelType;
    setPanelType: Dispatch<SetStateAction<PanelType>>;

    paletteRef: RefObject<HTMLDivElement | null>;

    setPreviewColor: ReturnType<
        typeof useNoteSelectionStore.getState
    >["setPreviewColor"];

    // labelStates: ReturnType<
    //     typeof useSelectedNoteLabels
    // >["labelStates"];

    // handleSelectLabel: ReturnType<
    //     typeof useSelectedNoteLabels
    // >["handleSelectLabel"];

    handleMoveToTrash: ReturnType<
        typeof useSelectedNoteActions
    >["handleMoveToTrash"];

    handleDuplicateNotes: ReturnType<
        typeof useSelectedNoteActions
    >["handleDuplicateNotes"];
};


export default function SelectedNotesHeader({
    selectedNoteCount,
    // pinnedState,
    onTogglePin,
    panelType,
    setPanelType,
    paletteRef,
    setPreviewColor,
    // labelStates,
    // handleSelectLabel,
    handleMoveToTrash,
    handleDuplicateNotes,

}: Props) {

    // hooks
    const {
        // selectedNotes,
        labelStates,
        handleSelectLabel,

    } = useSelectedNoteLabels();


    // hooks
    const { selectedNotes } = useSelectedNotes();


    const pinnedState = selectedNotes.some((note) => !note.is_pinned)
        ? "add"
        : "remove";




    return (

        <header className={styles.header}>

            <h1 className={styles.logo}>
                {selectedNoteCount}件を選択中
            </h1>

            <div className={styles.buttons}>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onTogglePin(pinnedState);
                    }}
                >
                    {pinnedState === "remove" ? (
                        <MdPushPin size={22} color="#04c5fb" />
                    ) : (
                        <BsPin size={20} color="#f459fc" />
                    )}
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setPanelType("color");
                    }}
                >
                    🎨
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setPanelType("menu");
                    }}
                >
                    ⋮
                </button>
            </div>

            {panelType === "color" && (
                <ColorPalette
                    onSelectColor={setPreviewColor}
                    paletteRef={paletteRef}
                />
            )}

            {panelType === "menu" && (
                <NoteMenu
                    onMoveToTrash={async () => {
                        await handleMoveToTrash();
                        setPanelType(null);
                    }}
                    onOpenLabel={() => setPanelType("label")}
                    onDuplicateNote={async () => {
                        await handleDuplicateNotes();
                        setPanelType(null);
                    }}
                />
            )}

            {panelType === "label" && (
                <LabelPanel
                    labelStates={labelStates}
                    onSelectLabel={handleSelectLabel}
                />
            )}

        </header>
    );
}
