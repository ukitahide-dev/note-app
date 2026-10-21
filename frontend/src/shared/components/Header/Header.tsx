// ----react ----
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

// ---- store ----
import { useNoteSelectionStore } from "../../../features/notes/store/useNoteSelectionStore";

// ---- component ----
import NoteMenu from "../../../features/notes/components/SortableNoteCard/NoteMenu/NoteMenu";
import ColorPalette from "../../ui/ColorPalette/ColorPalette";

// ---- css ----
import styles from "./Header.module.css";
import { useNoteStore } from "../../../features/notes/store/useNoteStore";
import LabelPanel from "../../../features/notes/components/SortableNoteCard/LabelPanel/LabelPanel";
import { useSelectedNoteLabels } from "../../../features/notes/hooks/useSelectedNoteLabels/useSelectedNoteLabels";
import { useSelectedNoteActions } from "../../../features/notes/hooks/useSelectedNoteActions/useSelectedNoteActions";

// ---- react-icon ----
import { BsPin } from "react-icons/bs";
import { MdPushPin } from "react-icons/md";
import { logoutApi } from "../../../features/auth/api/authApi";
import AccountMenu from "../../../features/account/components/AccountMenu/AccountMenu";

import { useHeaderClickOutside } from "./hooks/useHeaderClickOutside";



type Props = {
    // Props object の中にonMenuClickというプロパティがあるという意味。
    //     // searchText: string;
    //     // setSearchText: React.Dispatch<
    //         // React.SetStateAction<string>
    //     // >;

    onMenuClick: () => void; // onMenuClickプロパティの型は関数型という意味。
};





export default function Header({ onMenuClick }: Props) {
    // 分割代入でpropsからonMenuClickを取り出している。props全体の型はProps。

    const [panelType, setPanelType] = useState<
        "color" | "menu" | "label" | null
    >(null);

    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

    const navigate = useNavigate();

    const paletteRef = useRef<HTMLDivElement | null>(null);
    const headerRef = useRef<HTMLDivElement | null>(null);


    // Store
    const {
        selectedNoteIds,   // SelectedNotesの計算と、Headerの表示切替に使う。
        previewColor,
        setPreviewColor,
        clearSelection,

    } = useNoteSelectionStore();


    // Store
    const {
        // notes,
        updateSelectedNoteColor,
        updateSelectedNotePin,

        searchParams,
        setSearchParams,

    } = useNoteStore();


    // hooks
    const {
        selectedNotes,
        labelStates,
        handleSelectLabel,

    } = useSelectedNoteLabels();

    // hooks
    const { handleMoveToTrash, handleDuplicateNotes } =
        useSelectedNoteActions();






    // const selectedNotes = notes.filter((note) =>
    //     selectedNoteIds.includes(note.id),
    // );

    const pinnedState = selectedNotes.some((note) => !note.is_pinned)
        ? "add"
        : "remove";



    const handleSaveSelectedColor = async () => {

        setPanelType(null);
        console.log("previewColor", previewColor);

        if (!previewColor) return;  // previewColorがnullの場合は、ここで処理を止める。色を選択していないから、APIを呼ぶ必要がない。

        await updateSelectedNoteColor(selectedNoteIds, previewColor);   // Zustand の色更新処理が終わるまで待つ。

    };

    // hooks
    useHeaderClickOutside({
        paletteRef,
        headerRef,
        panelType,
        handleSaveSelectedColor,
        clearSelection,

    });



    // 外クリック処理
    // useEffect(() => {

    //     const handleClickOutside = async (event: MouseEvent) => {

    //         const target = event.target as Node;

    //         const clickedOutsidePalette =
    //             !paletteRef.current ||
    //             !paletteRef.current.contains(target);

    //         const clickedOutsideHeader =
    //             headerRef.current &&
    //             !headerRef.current.contains(target);


    //         // カラーパレットの外をクリックした場合
    //         if (panelType === "color" && clickedOutsidePalette) {

    //             const savePromise = handleSaveSelectedColor();

    //             // ヘッダーの外なら、保存完了後に選択を解除する
    //             if (clickedOutsideHeader) {
    //                 await savePromise;   // 色の保存処理全体が終わるまで待つ。これで、NoteCardのtempColorに、先に更新後の色が入るようになる。色変更後に、外クリック処理で、一瞬だけ元の色がちらつくバグを防げる。
    //                 clearSelection();   // 保存処理とsetでの更新が終わってから、selectedNoteIdsを空にする。
    //             }

    //             setPanelType(null);
    //             return;
    //         }

    //         // ヘッダーの外をクリックした場合
    //         if (clickedOutsideHeader) {
    //             setPanelType(null);
    //             clearSelection();
    //         }
    //     };

    //     document.addEventListener("click", handleClickOutside);

    //     return () => {
    //         document.removeEventListener("click", handleClickOutside);
    //     };

    // }, [
    //     panelType,
    //     handleSaveSelectedColor,
    //     clearSelection,
    // ]);





    // 外クリック処理
    // useEffect(() => {

    //     const handleClickOutside = (event: MouseEvent) => {

    //         if (
    //             !paletteRef.current ||
    //             !paletteRef.current.contains(event.target as Node)
    //         ) {
    //             handleSaveSelectedColor();
    //         }
    //     };


    //     document.addEventListener(
    //         "click",
    //         // "mousedown",  mousedownにすると、LabelPanelが開かなくなる。reactのクリックイベントよりも先に実行され、LabelPanelRefが存在しない状態になり、handleClickOutsideの条件に引っかかるから。
    //         handleClickOutside,
    //     );

    //     return () => {
    //         document.removeEventListener(
    //             "click",
    //             handleClickOutside,
    //         );
    //     };

    // }, [previewColor]); // previewColorを書かないと、previewColorの値が初回マウント時のまま、外クリックイベントに登録されてしまう。




    // useEffect(() => {

    //     const handleClickOutside = (event: MouseEvent) => {

    //         if (
    //             headerRef.current &&
    //             !headerRef.current.contains(event.target as Node)
    //         ) {
    //             clearSelection();
    //         }
    //     };


    //     document.addEventListener("click", handleClickOutside);

    //     return () => {
    //         document.removeEventListener("click", handleClickOutside);
    //     };


    // }, [clearSelection]);


    return (

        <div ref={headerRef}>

            {selectedNoteIds.length > 0 ? (

                <header className={styles.header}>

                    <h1 className={styles.logo}>
                        {selectedNoteIds.length}件を選択中
                    </h1>

                    <div className={styles.buttons}>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                updateSelectedNotePin(
                                    selectedNoteIds,
                                    pinnedState,
                                );
                            }}
                        >
                            {pinnedState === "remove" ? (
                                <MdPushPin size={22} color="#04c5fb" />
                            ) : (
                                <BsPin
                                    size={20}
                                    color="#f459fc"
                                    // color="#22b4dc"
                                />
                            )}
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
                                e.stopPropagation();   // これがないとdocumentにクリックが伝播してバグる
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

            ) : (

                <header className={styles.header}>

                    <button className={styles.menuButton} onClick={onMenuClick}>
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
                        value={searchParams.query}
                        onChange={(e) => {
                            setSearchParams({
                                ...searchParams,
                                query: e.target.value,
                            });
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
                        <button>👤</button>

                        {isAccountMenuOpen && <AccountMenu />}
                    </div>

                </header>
            )}
        </div>
    );
}
