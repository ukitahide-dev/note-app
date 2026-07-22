import { useEffect, useRef, } from "react";
import Card from "../../../../shared/ui/Card/Card";
// import { useNavigate } from "react-router-dom";
import { uploadNoteImage } from "../../api/noteApi";
import LabelPanel from "../SortableNoteCard/LabelPanel/LabelPanel";
import NoteMenu from "../SortableNoteCard/NoteMenu/NoteMenu";
import ColorPalette from "../../../../shared/ui/ColorPalette/ColorPalette";


import cardStyles from "./NoteCard.module.css";
import { useSearchStore } from "../../../search/store/SearchStore";
import NoteDetailModal from "../NoteDetailModal/NoteDetailModal";
import { useNoteLabels } from "../../hooks/useNoteLabels";




// ---- types ----
import type { Note } from "../../../../types/note";
import { useNoteSelectionStore } from "../../store/useNoteSelectionStore";
import { useNoteStore } from "../../store/useNoteStore";
// import { useLabelStore } from "../../../labels/store/labelStore";
import { useNoteColor } from "../../hooks/useNoteColor";
import { HistoryPanel } from "../HistoryPanel/HistoryPanel";
import LabelItem from "../LabelItem/LabelItem";





type Props = {
    note: Note;
    // setNotes: React.Dispatch<
    //     React.SetStateAction<Note[]>
    // >;

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

    panelType: "label" | null;

    setPanelType: React.Dispatch<
            React.SetStateAction<
                "label" | "history" | null
            >
        >;

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
    // setNotes,
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
    panelType,
    setPanelType,
    // onToggleFavorite,
    // onTogglePin,
    // onDuplicateNote,
}: Props) {




    // const [tempColor, setTempColor] = useState(note.color);  // NoteCard単体の色変更用。useState(note.color)は「初回マウント時」にしか実行されない。


    const cardRef = useRef<HTMLDivElement | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const labelPanelRef = useRef<HTMLDivElement | null>(null);
    const paletteRef = useRef<HTMLDivElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { searchText } = useSearchStore();


    // const [panelType, setPanelType] = useState<"label" | null>(null);

    // useNoteLabels hooksを使う
    const {
        labelStates,
        // isLabelOpen,
        // handleOpenLabel,
        // handleCloseLabel,
        selectedLabels,
        handleSelectLabel,
        handleRemoveLabel,
    } = useNoteLabels({
        note,
        // setNotes,
    });



    // useNoteColor hooks
    const {
        tempColor,
        handleSelectColor,
        saveColor,
    } = useNoteColor(
        note,
    );




    // useNoteSelectionStoreを使う
    const {
        selectedNoteIds,
        toggleSelect,
        previewColor,  // 複数のNoteCard色変更用
    } = useNoteSelectionStore();


    // useNoteStoreを使う
    const {
        // updateNote,
        createNote,
        moveToTrash,
        toggleFavorite,
        togglePin,
        fetchNotes,
    } = useNoteStore();





    const displayColor =
        selectedNoteIds.includes(note.id)
            && previewColor
            ? previewColor
            : tempColor;


    // console.log("NoteCardサイレンだリング");



    let panel;

    if (panelType === "label") {

        panel = (
            <LabelPanel
                labelPanelRef={labelPanelRef}
                selectedLabels={selectedLabels}
                labelStates={labelStates}
                onSelectLabel={handleSelectLabel}
            />
        )

    } else if (panelType === "history") {

        panel = (
            <HistoryPanel
                note={note}
                onClose={() => setPanelType(null)}

            />
        )

    } else {

        panel = (
            <NoteMenu
                menuRef={menuRef}  // menuRefという名前で、{}の中のmenuRefを渡すという意味
                // onOpenLabel={handleOpenLabel}
                onOpenLabel={() => setPanelType("label")}
                onOpenHistory={() => setPanelType("history")}
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
            />
        )

    }




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


                setOpenMenuId(null);
                setOpenColorId(null);
                // handleCloseLabel();
                setPanelType(null);

                // console.log(`note.id: ${note.id}`);
                // console.log(`openColorId: ${openColorId}`);



                console.log(
                    "実行される",
                    note.id,
                    openColorId
                );

                if (note.id === openColorId) {  // この条件必要。これ書かないと、saveColorが全ノートカードに対して実行されるし、保存処理もバグる。
                    console.log("保存するのはこのカード");
                    saveColor();
                }

                // saveColor();


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

    }, [note.id, tempColor]);  // 基本的にuseEffect内で使っている値は、全部依存配列に書く。だから、note.idも書く。tempColorを書かないと、NoteCardが最初にマウントされたときのtempColorのまま、外クリック時にsaveColor();が実行されてしまう。

    // tempColor, openColorId
    // tempColor, openColorId, saveColor
    // note.id, tempColor,  useNoteColorにロジック移すと、依存配列こう書かないとバグるようになった。


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




    const handleImageChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        const file = e.target.files?.[0];  // e.target.files は、選択されたファイル一覧。

        if (!file) return;


        try {

            const image = await uploadNoteImage(note.id, file);
            console.log(image);
            fetchNotes();

        } catch (error) {

            console.error(error);

        }

        // console.log(file);


    }

    console.log(note);



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

                <div
                    className={cardStyles.images}
                >

                    {note.images.map((image) => (
                        <img
                            key={image.id}
                            className={cardStyles.image}
                            src={image.image}
                            // src={`http://127.0.0.1:8000${image.image}`}
                            alt=""
                        />

                    ))}
                </div>

                {/* <div
                    {...attributes}
                    {...listeners}  // drag開始用イベントまとめ。☰を掴んだ時だけdrag開始
                    className={cardStyles.dragHandle}
                >
                    ☰
                </div> */}

                <div
                    className={cardStyles.chars}
                >

                    <h3
                        className={cardStyles.title}
                    >
                        {highlightText(note.title)}
                    </h3>

                    <p
                        className={cardStyles.content}
                    >
                        {highlightText(note.content)}
                    </p>

                </div>



                <div className={cardStyles.labels}>
                    {note.labels.map((label) => (

                        <LabelItem
                            label={label}
                            onRemoveLabel={(labelId) => handleRemoveLabel(labelId)}

                        />

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
                            setOpenMenuId((prev) => prev === note.id ? null : note.id);
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
                        // tempColor={tempColor}
                        paletteRef={paletteRef}
                        // onClose={saveColor}

                    />


                )}


                {openNoteDetailId === note.id && (
                    <NoteDetailModal
                        note={note}
                        // setNotes={setNotes}
                        setOpenNoteDetailId={setOpenNoteDetailId}
                        // onSave={onSave}
                        // onUpdateColor={onUpdateColor}
                        // onMoveToTrash={onMoveToTrash}
                        // onDuplicateNote={onDuplicateNote}

                    />

                )}


            </Card>
    )
}



// LabelItemコンポに切り出した
                        // <div
                        //     key={label.id}
                        //     className={cardStyles.label}
                        // >
                        //     <span

                        //     >
                        //         {label.name}
                        //     </span>

                        //     <button
                        //         className={cardStyles.removeLabel}
                        //         onClick={(e) => {
                        //             e.stopPropagation();
                        //             handleRemoveLabel(
                        //                 label.id
                        //             );
                        //         }}
                        //     >
                        //         ×
                        //     </button>

                        // </div>



{/* {openMenuId === note.id && (

                    panelType === "label" ? (

                        <LabelPanel
                            labelPanelRef={labelPanelRef}
                            selectedLabels={selectedLabels}
                            labelStates={labelStates}
                            // onCreateLabel={handleCreateLabel}
                            onSelectLabel={handleSelectLabel}
                        />
                    ): (

                        <NoteMenu
                            menuRef={menuRef}  // menuRefという名前で、{}の中のmenuRefを渡すという意味
                            // onOpenLabel={handleOpenLabel}
                            onOpenLabel={() => setPanelType("label")}
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

                )} */}





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





// useLabelStoreを使う
    // const {
    //     labels
    // } = useLabelStore();


    // useNoteLabels hooksに移した
    // const labelStates = labels.map(label => ({  // ({}) {}を()で囲んでいる。mapの省略形の書き方。

    //     id: label.id,

    //     state: selectedLabels.includes(label.id) ? "checked" : "unchecked",


    // }));





// ---- useNoteColor hook に移した ----

    // 色の選択をUIに表示する
    // const handleSelectColor = (
    //     color: string
    // ) => {
    //     setTempColor(color);
    // }


    // // useStateで定義したtempColorは初回マウント時しか値を取得しない。だから、これを書くことで、モーダルから色を変更し、setNotesを更新したときに、tempColorが変更後の色を取得できるようになる。
    // useEffect(() => {
    //     setTempColor(note.color);
    // }, [note.color]);




    // ノート単体の色を変える。ノートカードから色を変えたときの用途。
    // const saveColor = async () => {

    //     console.log("saveColor実行");
    //     console.log(`tempColor: ${tempColor}`);

    //     try {

    //         const updatedNote = await updateNoteColor(Number(note.id), tempColor);
    //         updateNote(updatedNote);  // useNoteStore


    //     } catch (error) {

    //         console.error(error);

    //     }

    //     // setOpenColorId(null);


    // }
    // ---- -----
