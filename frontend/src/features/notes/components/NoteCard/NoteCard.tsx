import { useEffect, useRef } from "react";
import Card from "../../../../shared/ui/Card/Card";

import { uploadNoteImageApi } from "../../api/noteApi";
import LabelPanel from "../SortableNoteCard/LabelPanel/LabelPanel";
import NoteMenu from "../SortableNoteCard/NoteMenu/NoteMenu";
import ColorPalette from "../../../../shared/ui/ColorPalette/ColorPalette";

import cardStyles from "./NoteCard.module.css";
import { useSearchStore } from "../../../search/store/SearchStore";
import NoteDetailModal from "../NoteDetailModal/NoteDetailModal";
import { useNoteLabels } from "../../hooks/useNoteLabels";

// ---- types ----
import type { Note } from "../../../../types/api/note";
import { useNoteSelectionStore } from "../../store/useNoteSelectionStore";
import { useNoteStore } from "../../store/useNoteStore";

import { useNoteColor } from "../../hooks/useNoteColor";
import { HistoryPanel } from "../HistoryPanel/HistoryPanel";
import LabelItem from "../LabelItem/LabelItem";

type Props = {
    note: Note;

    openMenuId: number | null;

    openColorId: number | null;
    setOpenColorId: React.Dispatch<React.SetStateAction<number | null>>;

    setOpenMenuId: React.Dispatch<React.SetStateAction<number | null>>;

    openNoteDetailId: number | null;
    setOpenNoteDetailId: React.Dispatch<React.SetStateAction<number | null>>;

    dragHandleProps?: any;

    panelType: "label" | "history" | null;

    setPanelType: React.Dispatch<
        React.SetStateAction<"label" | "history" | null>
    >;
};

export default function NoteCard({
    note,

    openMenuId,
    setOpenMenuId,
    openColorId,
    setOpenColorId,

    openNoteDetailId,
    setOpenNoteDetailId,

    dragHandleProps,
    panelType,
    setPanelType,
}: Props) {
    // const [tempColor, setTempColor] = useState(note.color);  // NoteCard単体の色変更用。useState(note.color)は「初回マウント時」にしか実行されない。

    const cardRef = useRef<HTMLDivElement | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const labelPanelRef = useRef<HTMLDivElement | null>(null);
    const paletteRef = useRef<HTMLDivElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);


    // store
    const { searchText } = useSearchStore();


    // hooks
    const { labelStates, handleSelectLabel, handleRemoveNoteLabel } = useNoteLabels(
        {
            note,
        },
    );


    // hooks
    const { tempColor, handleSelectColor, saveColor } = useNoteColor(note);


    // Store
    const {
        selectedNoteIds,
        toggleSelect,
        previewColor, // 複数のNoteCard色変更用

    } = useNoteSelectionStore();


    // Store
    const { createNote, moveToTrash, toggleFavorite, togglePin, fetchNotes } =
        useNoteStore();


    // このノートが選択中で、かつ previewColor が存在するなら previewColor を使う。そうでなければ tempColor を使う
    const displayColor =
        selectedNoteIds.includes(note.id) && previewColor
            ? previewColor
            : tempColor;

    let panel;

    if (panelType === "label") {
        panel = (
            <LabelPanel
                labelPanelRef={labelPanelRef}
                labelStates={labelStates}
                onSelectLabel={handleSelectLabel}
            />
        );
    } else if (panelType === "history") {
        panel = (
            <HistoryPanel
                note={note}
                onClose={() => {
                    setPanelType(null);
                    setOpenMenuId(null);
                }}
            />
        );
    } else {
        panel = (
            <NoteMenu
                menuRef={menuRef} // menuRefという名前で、{}の中のmenuRefを渡すという意味
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
        );
    }

    useEffect(() => {

        const handleClickOutside = (event: MouseEvent) => {
            if (
                cardRef.current &&
                !cardRef.current.contains(event.target as Node) && // event.targetは実際にクリックされた要素。ex) <button>ラベル追加</button>
                (!menuRef.current ||
                    !menuRef.current.contains(event.target as Node)) &&
                (!labelPanelRef.current ||
                    !labelPanelRef.current.contains(event.target as Node)) &&
                (!paletteRef.current ||
                    !paletteRef.current.contains(event.target as Node))
            ) {
                setOpenMenuId(null);
                setOpenColorId(null);

                setPanelType(null);

                if (note.id === openColorId) {
                    // この条件必要。これ書かないと、saveColorが全ノートカードに対して実行されるし、保存処理もバグる。
                    console.log("保存するのはこのカード");
                    saveColor();
                }
            }
        };

        // documentでclickが発生したら、handleClickOutsideを呼ぶ。
        document.addEventListener(
            "click",
            // "mousedown",  mousedownにすると、LabelPanelが開かなくなる。reactのクリックイベントよりも先に実行され、LabelPanelRefが存在しない状態になり、handleClickOutsideの条件に引っかかるから。
            handleClickOutside,
        );

        // このNoteCardが不要になったら、documentに登録した監視を解除する
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [note.id, tempColor]); // 基本的にuseEffect内で使っている値は、全部依存配列に書く。だから、note.idも書く。tempColorを書かないと、NoteCardが最初にマウントされたときのtempColorのまま、外クリック時にsaveColor();が実行されてしまう。

    // tempColor, openColorId
    // tempColor, openColorId, saveColor
    // note.id, tempColor,  useNoteColorにロジック移すと、依存配列こう書かないとバグるようになった。


    const highlightText = (text: string) => {
        if (!searchText.trim()) {
            return text;
        }

        const escapedSearchText = searchText.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&",
        );

        const regex = new RegExp(`(${escapedSearchText})`, "gi");

        const parts = text.split(regex);

        return parts.map((part, index) =>
            part.toLowerCase() === searchText.toLowerCase() ? (
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
        const file = e.target.files?.[0]; // e.target.files は、選択されたファイル一覧。

        if (!file) return;

        try {
            const image = await uploadNoteImageApi(note.id, file);
            console.log(image);
            fetchNotes();
        } catch (error) {
            console.error(error);
        }

        // console.log(file);
    };






    return (
        
        <Card
            style={{ backgroundColor: displayColor }}
            onClick={() => setOpenNoteDetailId(note.id)}
            ref={cardRef}
        >
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    toggleSelect(note.id);
                }}
            >
                ✅
            </button>

            <div {...dragHandleProps} className={cardStyles.dragHandle}>
                ☰
            </div>

            <div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        togglePin(note.id, note.is_pinned);
                    }}
                >
                    {note.is_pinned ? "📌" : "📍"}
                </button>
            </div>

            <div className={cardStyles.images}>
                {note.images.map((image) => (
                    <img
                        key={image.id}
                        className={cardStyles.image}
                        src={image.image}
                        alt=""
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

                {note.labels.map((label) => (
                    <LabelItem
                        key={label.id}
                        label={label}
                        onRemoveLabel={handleRemoveNoteLabel}
                        // onRemoveLabel={(labelId) => handleRemoveLabel(labelId)}
                    />
                ))}

            </div>


            <div className={cardStyles.buttons}>

                <button
                    onClick={(e) => {
                        e.stopPropagation(); // これがないと、ColorPaletteにクリックイベントが伝播して、クリックでColorPaletteが開くと同時に、閉じてしまう。
                        setOpenMenuId(null);
                        setOpenColorId((prev) =>
                            prev === note.id ? null : note.id,
                        );
                    }}
                >
                    🎨
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(note.id, note.is_favorite);
                    }}
                >
                    {note.is_favorite ? "❤️" : "🤍"}
                </button>

                <>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current?.click();
                        }}
                    >
                        📷
                    </button>

                    <span>👀 {note.view_count}</span>

                    <span>合計滞在時間: {note.total_view_seconds}秒</span>

                    <input
                        onClick={(e) => e.stopPropagation()}
                        ref={fileInputRef}
                        type="file"
                        hidden
                        onChange={handleImageChange}
                    />
                </>

                <button
                    className={cardStyles.menuButton}
                    onClick={(e) => {
                        e.stopPropagation();
                        setOpenColorId(null);
                        setPanelType(null);
                        setOpenMenuId((prev) =>
                            prev === note.id ? null : note.id,
                        );
                    }}
                >
                    ⋮
                </button>
            </div>

            {openMenuId === note.id && panel}

            {/* 背景色 */}
            {openColorId === note.id && (
                <ColorPalette
                    onSelectColor={handleSelectColor}
                    paletteRef={paletteRef}
                />
            )}

            {openNoteDetailId === note.id && (
                <NoteDetailModal
                    note={note}
                    onClose={() => setOpenNoteDetailId(null)}
                />
            )}
        </Card>
    );
}
