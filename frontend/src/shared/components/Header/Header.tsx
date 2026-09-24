// ----react ----
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";


// ---- store ----
// import { useSearchStore } from "../../../features/search/store/SearchStore";
import { useNoteSelectionStore } from "../../../features/notes/store/useNoteSelectionStore";


// ---- component ----
import NoteMenu from "../../../features/notes/components/SortableNoteCard/NoteMenu/NoteMenu";
import ColorPalette from "../../ui/ColorPalette/ColorPalette";


// ---- api ----
// import { createNote as createNoteApi, moveToTrash as moveToTrashApi, updateNoteColor } from "../../../features/notes/api/noteApi";


// ---- css ----
import styles from "./Header.module.css";
import { useNoteStore } from "../../../features/notes/store/useNoteStore";
// import { useLabelStore } from "../../../features/labels/store/labelStore";
import LabelPanel from "../../../features/notes/components/SortableNoteCard/LabelPanel/LabelPanel";
import { useSelectedNoteLabels } from "../../../features/notes/hooks/useSelectedNoteLabels";
import { useSelectedNoteActions } from "../../../features/notes/hooks/useSelectedNoteActions";


// ---- react-icon ----
import { BsPin } from "react-icons/bs";
import { MdPushPin } from "react-icons/md";
import { logoutApi } from "../../../features/auth/api/authApi";
import AccountMenu from "../../../features/account/components/AccountMenu/AccountMenu";




type Props = {  // Props object の中にonMenuClickというプロパティがあるという意味。
    searchText: string;
    setSearchText: React.Dispatch<
        React.SetStateAction<string>
    >;

    onMenuClick: () => void;  // onMenuClickプロパティの型は関数型という意味。
};





export default function Header({
    onMenuClick,
}: Props) {   // 分割代入でpropsからonMenuClickを取り出している。props全体の型はProps。


    const [panelType, setPanelType] = useState<"color" | "menu" | "label" | null>(null);

    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

    const navigate = useNavigate();


    const paletteRef = useRef<HTMLDivElement | null>(null);



    // Store
    // const {
    //     searchText,
    //     setSearchText,

    // } = useSearchStore();




    // Store
    const {
        selectedNoteIds,   // SelectedNotesの計算と、Headerの表示切替に使う。
        previewColor,
        setPreviewColor,

    } = useNoteSelectionStore();



    // Store
    const {
        notes,
        updateSelectedNoteColor,
        updateSelectedNotePin,

        searchParams,
        setSearchParams,

    } = useNoteStore();



    // hooks
    const {
        labelStates,
        handleSelectLabel,

    } = useSelectedNoteLabels();


    // hooks
    const {
        handleMoveToTrash,
        handleDuplicateNotes,

    } = useSelectedNoteActions();



    const selectedNotes = notes.filter((note) => selectedNoteIds.includes(note.id));


    const pinnedState = selectedNotes.some((note) => !note.is_pinned) ? "add" : "remove";
    // console.log(pinnedState)







    const handleSaveSelectedColor =  async (

    ) => {


        setPanelType(null);


        if (!previewColor) return;  // previewColorがnullの場合は、ここで処理を止める。

        updateSelectedNoteColor(selectedNoteIds, previewColor);


        // clearSelection();  // これ書くとバグる

    }



    // 外クリック処理
    useEffect(() => {

            const handleClickOutside = (
                event: MouseEvent

            ) => {


                if (
                    (!paletteRef.current || !paletteRef.current.contains(event.target as Node))
                ) {

                    handleSaveSelectedColor();

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

        }, [previewColor]);  // previewColorを書かないと、previewColorの値が初回マウント時のまま、外クリックイベントに登録されてしまう。







    return (

        <>

        {selectedNoteIds.length > 0 ? (

            <header className={styles.header}>

                <h1
                    className={styles.logo}
                >
                    {selectedNoteIds.length}件を選択中
                </h1>


                <div className={styles.buttons}>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            updateSelectedNotePin(selectedNoteIds, pinnedState);
                        }}
                    >
                        {
                            pinnedState === "remove" ? (
                                <MdPushPin
                                    size={22}
                                    color="#04c5fb"
                                />
                            ) : (
                                <BsPin
                                    size={20}
                                    color="#f459fc"
                                    // color="#22b4dc"
                                />
                            )
                        }

                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation(); // これがないと、ColorPaletteにクリックイベントが伝播して、クリックでColorPaletteが開くと同時に、閉じてしまう。
                            setPanelType("color");
                        }}

                    >
                        🎨
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();  // これがないとdocumentにクリックが伝播してバグる
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


        ):(


            <header className={styles.header}>

                <button
                    className={styles.menuButton}
                    onClick={onMenuClick}
                >
                    ☰
                </button>

                <h1
                    className={styles.logo}
                    onClick={() => navigate("/notes")}
                >
                    My Note
                </h1>

                <input
                    className={styles.search}
                    type="text"
                    placeholder="検索..."
                    // value={searchText}
                    value={searchParams.query}
                    // onChange={(e) => setSearchText(e.target.value)}
                    onChange={(e) => {
                        setSearchParams({
                            ...searchParams,
                            query: e.target.value,
                        })
                    }}
                    onFocus={() => navigate("/search")}
                />




                <button
                    onClick={async () => {
                        await logoutApi();
                        navigate("/login");
                    }}

                >
                    ログアウト

                </button>


                <div
                    className={styles.accountWrapper}
                    onMouseEnter={() => setIsAccountMenuOpen(true)}
                    onMouseLeave={() => setIsAccountMenuOpen(false)}
                >

                    <button>
                        👤
                    </button>

                    {isAccountMenuOpen && (
                        <AccountMenu />
                    )}

                </div>



            </header>



        )}

        </>

    );
}



