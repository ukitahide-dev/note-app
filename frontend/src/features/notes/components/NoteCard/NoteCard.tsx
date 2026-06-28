import { useEffect, useRef, useState } from "react";
import Card from "../../../../shared/ui/Card/Card";
// import { useNavigate } from "react-router-dom";
import { updateNote, updateNoteColor, updateNoteFavorite, updateNoteLabels } from "../../api/noteApi";
import LabelPanel from "../SortableNoteCard/LabelPanel/LabelPanel";
import NoteMenu from "../SortableNoteCard/NoteMenu/NoteMenu";
import ColorPalette from "../../../../shared/ui/ColorPalette/ColorPalette";


import cardStyles from "./NoteCard.module.css";
import { useSearchStore } from "../../../search/store/SearchStore";
import NoteDetailModal from "../NoteDetailModal/NoteDetailModal";
import { useNoteLabels } from "../../hooks/useNoteLabels";


// type Label = {
//     id: number;
//     name: string;
// };


// ---- types ----
import type { Note } from "../../../../types/note";
import { useNoteSelectionStore } from "../../store/useNoteSelectionStore";
import { useNoteStore } from "../../store/useNoteStore";





type Props = {
    note: Note;
    setNotes: React.Dispatch<
        React.SetStateAction<Note[]>
    >;

    openMenuId: number | null;

    openColorId: number | null;
    setOpenColorId: React.Dispatch<
            React.SetStateAction<
                number | null
            >
        >;

    // onMoveToTrash: (id: number) => void;

    setOpenMenuId:
        React.Dispatch<
            React.SetStateAction<
                number | null
            >
        >;

    openNoteDetailId: number | null;
    setOpenNoteDetailId: React.Dispatch<
            React.SetStateAction<
                number | null
            >
        >;

    // onSave: (
    //     id: number,
    //     title: string,
    //     content: string,
    // ) => Promise<void>

    // onUpdateColor: (
    //     id: number,
    //     color: string,
    // ) => Promise<void>

    dragHandleProps?: any;

    // onToggleFavorite: (
    //     id: number,
    //     is_favorite: boolean,
    // ) => Promise<void>;

    // onTogglePin: (
    //     id: number,
    //     is_pinned: boolean,
    // ) => Promise<void>;


    // onDuplicateNote: (
    //     note: Note,
    // ) => Promise<void>;
};





export default function NoteCard({
    note,
    setNotes,
    openMenuId,
    setOpenMenuId,
    openColorId,
    setOpenColorId,
    // onMoveToTrash,
    openNoteDetailId,
    setOpenNoteDetailId,
    // onSave,
    // onUpdateColor,
    dragHandleProps,
    // onToggleFavorite,
    // onTogglePin,
    // onDuplicateNote,
}: Props) {




    const [tempColor, setTempColor] = useState(note.color);  // NoteCard単体の色変更用。useState(note.color)は「初回マウント時」にしか実行されない。


    const cardRef = useRef<HTMLDivElement | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const labelPanelRef = useRef<HTMLDivElement | null>(null);
    const paletteRef = useRef<HTMLDivElement | null>(null);


    const { searchText } = useSearchStore();



    // useNoteLabels hooksを使う
    const {
        isLabelOpen,
        handleOpenLabel,
        handleCloseLabel,
        selectedLabels,
        handleSelectLabel,
        handleRemoveLabel,
    } = useNoteLabels({
        note,
        setNotes,
    });


    // console.log("isLabelOpen", isLabelOpen);


    // useNoteSelectionStoreを使う
    const {
        selectedNoteIds,
        toggleSelect,
        previewColor,  // 複数のNoteCard色変更用
    } = useNoteSelectionStore();


    // useNoteStoreを使う
    const {
        updateNote,
        createNote,
        moveToTrash,
        toggleFavorite,
        togglePin,
    } = useNoteStore();








    const displayColor =
        selectedNoteIds.includes(note.id)
            && previewColor
            ? previewColor
            : tempColor;


    // console.log("NoteCardサイレンだリング");




    useEffect(() => {

        const handleClickOutside = (
            event: MouseEvent
        ) => {


            if (
                cardRef.current &&
                !cardRef.current.contains(event.target as Node) &&  // event.targetは実際にクリックされた要素。ex) <button>ラベル追加</button>
                (!menuRef.current || !menuRef.current.contains(event.target as Node)) &&
                (!labelPanelRef.current || !labelPanelRef.current.contains(event.target as Node)) &&
                (!paletteRef.current || !paletteRef.current.contains(event.target as Node))
            ) {

                console.log("NoteCard outside");
                console.log(openColorId);

                setOpenMenuId(null);
                handleCloseLabel();

                if (note.id === openColorId) {
                    handleClosePalette();
                }


            }

        };

        document.addEventListener(
            "click",
            // "mousedown",  mousedownにすると、LabelPanelが開かなくなる。reactのクリックイベントよりも先に実行され、LabelPanelRefが存在しない状態になり、handleClickOutsideの条件に引っかかるから。
            handleClickOutside
        );


        return () => {
            document.removeEventListener(
                "click",
                // "mousedown",
                handleClickOutside
            );
        };

    }, [tempColor, openColorId]);  // tempColorを書かないと、NoteCardが最初にマウントされたときのtempColorのまま、外クリック時にhandleClosePalette();が実行されてしまう。






    const highlightText = (
        text: string
    ) => {

        if (!searchText.trim()) {
            return text;
        }

        const escapedSearchText =
            searchText.replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );

        const regex = new RegExp(
            `(${escapedSearchText})`,
            "gi"
        );

        const parts = text.split(regex);

        return parts.map(
            (part, index) => (

                part.toLowerCase() ===
                searchText.toLowerCase()

                    ? ( // markは、HTMLの <mark> タグの標準スタイル。自動で背景黄色が当たる。
                        <mark key={index}>
                            {part}
                        </mark>
                    )
                    : (
                        <span key={index}>
                            {part}
                        </span>
                    )

            )
        );
    };





    // 色の選択をUIに表示する
    const handleSelectColor = (
        color: string
    ) => {
        setTempColor(color);
    }


    // useStateで定義したtempColorは初回マウント時しか値を取得しない。だから、これを書くことで、モーダルから色を変更し、setNotesを更新したときに、tempColorが変更後の色を取得できるようになる。
    useEffect(() => {
        setTempColor(note.color);
    }, [note.color]);




    // ノート単体の色を変える。ノートカードから色を変えたときの用途。
    const handleClosePalette = async () => {

        console.log("handleClosePalette実行");
        console.log(`tempColor: ${tempColor}`);

        try {

            const updatedNote = await updateNoteColor(Number(note.id), tempColor);
            updateNote(updatedNote);  // useNoteStore


        } catch (error) {

            console.error(error);

        }

        setOpenColorId(null);


    }










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

                <div
                    {...dragHandleProps}
                    className={cardStyles.dragHandle}
                >
                    ☰
                </div>

                <div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            togglePin(note.id, note.is_pinned);
                            // onTogglePin(note.id, note.is_pinned);

                        }}

                    >
                        {note.is_pinned ? "📌" : "📍"}

                    </button>

                </div>

                {/* <div
                    {...attributes}
                    {...listeners}  // drag開始用イベントまとめ。☰を掴んだ時だけdrag開始
                    className={cardStyles.dragHandle}
                >
                    ☰
                </div> */}

                <h3>
                    {highlightText(note.title)}
                </h3>

                <p>
                    {highlightText(note.content)}
                </p>


                <div className={cardStyles.labels}>
                    {note.labels.map((label) => (
                        <div
                            key={label.id}
                            className={cardStyles.label}
                        >
                            <span

                            >
                                {label.name}
                            </span>

                            <button
                                className={cardStyles.removeLabel}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveLabel(
                                        label.id
                                    );
                                }}
                            >
                                ×
                            </button>

                        </div>
                    ))}

                </div>

                <div className={cardStyles.buttons}>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();  // これがないと、ColorPaletteにクリックイベントが伝播して、クリックでColorPaletteが開くと同時に、閉じてしまう。
                            setOpenMenuId(null);
                            setOpenColorId((prev) => prev === note.id ? null : note.id);
                        }}
                    >
                        🎨
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(note.id, note.is_favorite);
                            // onToggleFavorite(note.id, note.is_favorite)
                        }}

                    >
                        {note.is_favorite ? "❤️" : "🤍"}

                    </button>

                    <button
                        className={cardStyles.menuButton}
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpenColorId(null);
                            setOpenMenuId((prev) => prev === note.id ? null : note.id);
                        }}
                    >
                        ⋮
                    </button>

                </div>


                {openMenuId === note.id && (
                    isLabelOpen ? (
                        <LabelPanel
                            labelPanelRef={labelPanelRef}
                            selectedLabels={selectedLabels}
                            // onCreateLabel={handleCreateLabel}
                            onSelectLabel={handleSelectLabel}
                        />
                    ) : (

                    // ---- menu ----
                    <NoteMenu
                        menuRef={menuRef}  // menuRefという名前で、{}の中のmenuRefを渡すという意味
                        onOpenLabel={handleOpenLabel}
                        onMoveToTrash={() => moveToTrash(note.id)}
                        onDuplicateNote={
                                () =>
                                    createNote(
                                        note.title,
                                        note.content,
                                        note.labels.map((label) => label.id),
                                        note.color
                                    )
                            }
                        // onDuplicateNote={() => onDuplicateNote(note)}
                    />

                    )
                )}


                {/* 背景色 */}
                {openColorId === note.id && (
                    <ColorPalette
                        onSelectColor={handleSelectColor}
                        tempColor={tempColor}
                        paletteRef={paletteRef}
                        onClose={handleClosePalette}

                    />


                )}


                {openNoteDetailId === note.id && (
                    <NoteDetailModal
                        note={note}
                        setNotes={setNotes}
                        // onSave={onSave}
                        // onUpdateColor={onUpdateColor}
                        // onMoveToTrash={onMoveToTrash}
                        // onDuplicateNote={onDuplicateNote}

                    />

                )}


            </Card>



    )





}








// ---- 元々NoteCardに書いていたけど、修正で不要になったもの ----




// const handleOpenLabel = () => {
    //     setIsLabelOpen((prev) => !prev);
    //     // setIsLabelOpen(true);
    // }




    // const updateLabels = async (
    //     newIds: number[]
    // ) => {

    //     setSelectedLabels(newIds);

    //     const updatedNote = await updateNoteLabels(note.id, newIds);

    //     // これで、ラベル追加・削除と同時に、各ノートのラベル名表示も反映される。
    //     setNotes((prev) =>
    //         prev.map((n) =>
    //             n.id === note.id ? updatedNote : n
    //         )
    //     );

    // }




    // const handleSelectLabel = async (labelId: number) => {

    //     try {

    //         let newIds;

    //         if (selectedLabels.includes(labelId)) {

    //             newIds = selectedLabels.filter((id) => id !== labelId);

    //         } else {

    //             newIds = [...selectedLabels, labelId];
    //         }

    //         updateLabels(newIds);

    //     } catch (error) {

    //         console.error(error);

    //     }

    // };




    // const handleRemoveLabel = async (
    //     labelId: number
    // ) => {

    //     try {

    //         const newIds = selectedLabels.filter((id) => id !== labelId);

    //         updateLabels(newIds);

    //     } catch (error) {

    //         console.error(error);

    //     }
    // };





    // const handleToggleFavorite = async (

        // ) => {

        //     try {

        //         const updatedNote = await updateNoteFavorite(note.id, !note.is_favorite);

        //         setNotes((prev) =>
        //             prev.map((n) =>
        //                 n.id === note.id ? updatedNote : n
        //             )
        //         );

        //     } catch (error) {

        //         console.error(error);

        //     }


        // }
