import { useRef } from "react";
import Card from "../../../../shared/ui/Card/Card";



import ColorPalette from "../../../../shared/ui/ColorPalette/ColorPalette";

import cardStyles from "./NoteCard.module.css";

import { useNoteLabels } from "../../hooks/useNoteLabels";

// ---- types ----
import type { Note } from "../../../../types/api/note";
import { useNoteSelectionStore } from "../../store/useNoteSelectionStore";
import { useNoteStore } from "../../store/useNoteStore";

import { useNoteColor } from "../../hooks/useNoteColor";


import type { NoteContext } from "../../../../types/ui/noteContext";
import NoteCardPanel from "../NoteCardPanel/NoteCardPanel";
import { useClickOutside } from "../../hooks/useClickOutside";
import NoteCardActions from "../NoteCardActions/NoteCardActions";
import { NoteLabels } from "../NoteLabels/NoteLabels";
import NoteCardHeader from "../NoteCardHeader/NoteCardHeader";




type Props = {
    note: Note;
    context: NoteContext;

    openColor: {
        noteId: number;
        context: NoteContext;
    } | null;

    setOpenColor: React.Dispatch<
        React.SetStateAction<{
            noteId: number;
            context: NoteContext;
        } | null>
    >;



    openMenu: {
        noteId: number;
        context: NoteContext;
    } | null;

    setOpenMenu: React.Dispatch<
        React.SetStateAction<{
            noteId: number;
            context: NoteContext;
        } | null>
    >;

    
    setSelectedNoteId: React.Dispatch<
        React.SetStateAction<number | null>
    >;

    dragHandleProps?: any;

    panelType: "label" | "history" | null;

    setPanelType: React.Dispatch<
        React.SetStateAction<"label" | "history" | null>
    >;
};





export default function NoteCard({
    note,
    context,

    openColor,
    setOpenColor,

    openMenu,
    setOpenMenu,

    setSelectedNoteId,

    dragHandleProps,

    panelType,
    setPanelType,


}: Props) {

    const cardRef = useRef<HTMLDivElement | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const labelPanelRef = useRef<HTMLDivElement | null>(null);
    const paletteRef = useRef<HTMLDivElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);



    // hook
    const {
        labelStates,
        handleSelectLabel,
        handleRemoveNoteLabel,

    } = useNoteLabels(
        {
            note,
        },
    );


    // hook
    const {
        tempColor,
        handleSelectColor,
        saveColor,

    } = useNoteColor(note);


    // Store
    const {
        selectedNoteIds,
        toggleSelect,
        previewColor,  // 複数のNoteCard色変更用

    } = useNoteSelectionStore();


    // Store
    const {
        createNote,
        moveToTrash,
        toggleFavorite,
        togglePin,

        searchParams,

        uploadNoteImage,
    } =
        useNoteStore();


    // このノートが選択中で、かつ previewColor が存在するなら previewColor を使う。そうでなければ tempColor を使う
    const displayColor =
        selectedNoteIds.includes(note.id) && previewColor
            ? previewColor
            : tempColor;


    const selected = selectedNoteIds.includes(note.id);


    const isColorOpen =
        openColor?.noteId === note.id &&
        openColor?.context === context;


    const isMenuOpen =
        openMenu?.noteId === note.id &&
        openMenu?.context === context;


    // hook
    useClickOutside(
        [cardRef, menuRef, labelPanelRef, paletteRef,],
        () => {

            // console.log("outside click");
            // console.log("note.id:", note.id);
            // console.log("openColor:", openColor);

            if (isColorOpen) {
                // console.log("outside click");
                // console.log("note.id:", note.id);
                // console.log("openColor:", openColor);

                saveColor();
                setOpenColor(null);
            }

            if (isMenuOpen) {
                // console.log("outside click");
                // console.log("note.id:", note.id);
                // console.log("openMenu:", openMenu);
                setOpenMenu(null);
                setPanelType(null);
            }

        },
        isColorOpen || isMenuOpen    // この条件が肝。これがないと、全ノートカードで、無条件にドキュメント監視イベントが登録され、あるノートの外側クリックをすると、全ノートの外側クリックが発火し、バグる。

    );




    const highlightText = (text: string) => {

        if (!searchParams.query.trim()) {
            return text;
        }

        const escapedSearchText = searchParams.query.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&",
        );

        const regex = new RegExp(`(${escapedSearchText})`, "gi");

        const parts = text.split(regex);

        return parts.map((part, index) =>

            part.toLowerCase() === searchParams.query.toLowerCase() ? (
                // markは、HTMLの <mark> タグの標準スタイル。自動で背景黄色が当たる。
                <mark key={index}>{part}</mark>
            ) : (
                <span key={index}>{part}</span>
            ),

        );

    };



    const handleImageChange = async (
        e: React.ChangeEvent<HTMLInputElement>,

    ) => {

        const file = e.target.files?.[0];

        if (!file) return;

        await uploadNoteImage(note.id, file);



    };






    return (

        <Card
            ref={cardRef}
            className={cardStyles.noteCard}
            style={{ backgroundColor: displayColor }}

            onClick={() => setSelectedNoteId(note.id)}
            // onClick={() => setSelectedNote(note)}
        >

            <NoteCardHeader
                note={note}
                selected={selected}
                onToggleSelect={() => toggleSelect(note.id)}
                onTogglePin={() => togglePin(note.id, note.is_pinned)}
                dragHandleProps={dragHandleProps}

            />



            <div className={cardStyles.images}>

                {note.images.slice(0, 6).map((image) => (
                    <img
                        key={image.id}
                        className={cardStyles.image}
                        src={image.image}
                        alt=""
                        onError={() => {
                            console.log("画像読み込み失敗:", image.image);
                        }}
                    />
                ))}

            </div>


            <div className={cardStyles.chars}>

                <h3 className={cardStyles.title}>
                    {highlightText(note.title)}
                </h3>

                <p className={cardStyles.content}>
                    {highlightText(note.content)}
                </p>

            </div>


            <div className={cardStyles.labels}>

                <NoteLabels
                    labels={note.labels.slice(0, 2)}
                    onRemoveLabel={handleRemoveNoteLabel}
                />

                {note.labels.length > 2 && (
                    <span className={cardStyles.moreLabels}>
                        他{note.labels.length - 2}件
                    </span>
                )}

            </div>



            <NoteCardActions
                note={note}
                onOpenColor={() => {
                    setOpenMenu(null);
                    setOpenColor({
                        noteId: note.id,
                        context: context,
                    });
                }}
                onToggleFavorite={() => toggleFavorite(note.id, note.is_favorite)}
                onOpenImage={() => fileInputRef.current?.click()}
                onOpenMenu={() => {
                    setOpenColor(null);
                    setPanelType(null);
                    setOpenMenu((prev) =>
                        prev?.noteId === note.id &&
                        prev?.context === context
                            ? null
                            : {
                                noteId: note.id,
                                context: context,
                            }
                    );
                }}
                fileInputRef={fileInputRef}
                onImageChange={handleImageChange}
            />



            {openMenu?.noteId === note.id &&
                openMenu?.context === context && (

                <NoteCardPanel
                    panelType={panelType}
                    note={note}
                    labelPanelRef={labelPanelRef}
                    menuRef={menuRef}
                    labelStates={labelStates}
                    onSelectLabel={handleSelectLabel}
                    onCloseHistory={() => setOpenMenu(null)}
                    onOpenLabel={() => setPanelType("label")}
                    onOpenHistory={() => setPanelType("history")}
                    onMoveToTrash={() => moveToTrash(note.id)}
                    onDuplicateNote={() =>
                        createNote(
                            note.title,
                            note.content,
                            note.labels.map((label) => label.id),
                            note.color,
                        )
                    }
                />

                )
            }


            {/* 背景色 */}
            {openColor?.noteId === note.id &&
                openColor?.context === context && (

                    <ColorPalette
                        onSelectColor={handleSelectColor}
                        paletteRef={paletteRef}
                    />
                )
            }


        </Card>

    );
}
