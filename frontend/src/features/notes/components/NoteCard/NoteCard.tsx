import { useEffect, useRef } from "react";
import Card from "../../../../shared/ui/Card/Card";


// import LabelPanel from "../SortableNoteCard/LabelPanel/LabelPanel";
// import NoteMenu from "../SortableNoteCard/NoteMenu/NoteMenu";
import ColorPalette from "../../../../shared/ui/ColorPalette/ColorPalette";

import cardStyles from "./NoteCard.module.css";

import { useNoteLabels } from "../../hooks/useNoteLabels";

// ---- types ----
import type { Note } from "../../../../types/api/note";
import { useNoteSelectionStore } from "../../store/useNoteSelectionStore";
import { useNoteStore } from "../../store/useNoteStore";

import { useNoteColor } from "../../hooks/useNoteColor";
// import { HistoryPanel } from "../HistoryPanel/HistoryPanel";
import LabelItem from "../LabelItem/LabelItem";
import Tooltip from "../../../../shared/components/Tooltip/Tooltip";
import type { NoteContext } from "../../../../types/ui/noteContext";
import NoteCardPanel from "../NoteCardPanel/NoteCardPanel";
import { useClickOutside } from "../../hooks/useClickOutside";
import NoteCardActions from "../NoteCardActions/NoteCardActions";



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

    setSelectedNote: React.Dispatch<
        React.SetStateAction<Note | null>
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


    setSelectedNote,

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

            console.log("outside click");
            console.log("note.id:", note.id);
            console.log("openColor:", openColor);

            if (isColorOpen) {
                console.log("outside click");
                console.log("note.id:", note.id);
                console.log("openColor:", openColor);

                saveColor();
                setOpenColor(null);
            }

            if (isMenuOpen) {
                console.log("outside click");
                console.log("note.id:", note.id);
                console.log("openMenu:", openMenu);
                setOpenMenu(null);
                setPanelType(null);
            }

        },
        isColorOpen || isMenuOpen

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

            onClick={() => setSelectedNote(note)}
        >

            <div className={cardStyles.cardHeader}>

                <Tooltip
                    text={selected ? "ノートの選択を解除" : "ノートを選択"}
                >

                    <button
                        className={`${cardStyles.selectButton}
                                ${cardStyles.headerButton}
                                ${ selected ? cardStyles.selected : ""
                        }`}
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleSelect(note.id);
                        }}
                    >

                        {selected ? "✓" : "○"}

                    </button>


                </Tooltip>

                <div
                    {...dragHandleProps}
                    className={cardStyles.dragArea}
                />

                <Tooltip
                    text={note.is_pinned ? "ピン留めを外す" : "ピン留めする"}
                >

                    <button
                        className={`${cardStyles.headerButton}`}

                        onClick={(e) => {
                            e.stopPropagation();
                            togglePin(note.id, note.is_pinned);
                        }}

                    >

                        {note.is_pinned ? "📌" : "📍"}

                    </button>

                </Tooltip>

            </div>


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

                {note.labels.slice(0, 2).map((label) => (
                    <LabelItem
                        key={label.id}
                        label={label}
                        onRemoveLabel={handleRemoveNoteLabel}
                    />
                ))}

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
                // onToggleFavorite={() => toggleFavorite(note.id, note.is_favorite)}
                // onToggleFavorite={toggleFavorite(note.id, note.is_favorite)}  // ダメ toggleFavoriteを実行してしまっている
                // onToggleFavorite={toggleFavorite}  //  ダメ 引数が必要な関数を、引数なしでそのまま渡している
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

            {/* <div className={cardStyles.buttons}>

                <div className={cardStyles.leftButtons}>

                    <Tooltip
                        text="色を変更"
                    >

                        <button
                            onClick={(e) => {
                                e.stopPropagation();   // これがないと、ColorPaletteにクリックイベントが伝播して、クリックでColorPaletteが開くと同時に、閉じてしまう。
                                setOpenMenu(null);
                                setOpenColor({
                                    noteId: note.id,
                                    context: context,
                                });
                            }}
                        >
                            🎨
                        </button>

                    </Tooltip>


                    <Tooltip
                        text={note.is_favorite ? "お気に入りを解除" : "お気に入りに登録"}
                    >

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(note.id, note.is_favorite);
                            }}
                        >
                            {note.is_favorite ? "❤️" : "🤍"}

                        </button>

                    </Tooltip>

                    <Tooltip text="画像を追加">

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                fileInputRef.current?.click();
                            }}
                        >
                            📷
                        </button>

                    </Tooltip>

                    <Tooltip
                        text="閲覧数"
                    >

                        <span>👀 {note.view_count}</span>

                    </Tooltip>

                    <Tooltip
                        text="閲覧時間"
                    >

                        <span>🕑 {note.total_view_seconds}秒</span>

                    </Tooltip>

                    <input
                        onClick={(e) => e.stopPropagation()}
                        ref={fileInputRef}
                        type="file"
                        hidden
                        onChange={handleImageChange}
                    />

                </div>

                <Tooltip
                    text="その他"
                >

                    <button
                        className={cardStyles.menuButton}
                        onClick={(e) => {
                            e.stopPropagation();

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
                    >
                        ⋮
                    </button>

                </Tooltip>

            </div> */}

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
