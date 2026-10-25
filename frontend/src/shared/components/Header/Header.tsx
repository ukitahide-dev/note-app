// ----react ----
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";

// ---- store ----
import { useNoteSelectionStore } from "../../../features/notes/store/useNoteSelectionStore";



// ---- css ----
import styles from "./Header.module.css";
import { useNoteStore } from "../../../features/notes/store/useNoteStore";

import { useSelectedNoteActions } from "../../../features/notes/hooks/useSelectedNoteActions/useSelectedNoteActions";



import { logoutApi } from "../../../features/auth/api/authApi";
import AccountMenu from "../../../features/account/components/AccountMenu/AccountMenu";

import { useHeaderClickOutside } from "./hooks/useHeaderClickOutside";
import SelectedNotesHeader from "./SelectedNotesHeader";
import { useSelectedNoteColor } from "../../../features/notes/hooks/useSelectedNoteColor/useSelectedNoteColor";




type Props = {
    onMenuClick: () => void; // onMenuClickプロパティの型は関数型という意味。
};





export default function Header({ onMenuClick }: Props) {     // 分割代入でpropsからonMenuClickを取り出している。props全体の型はProps。


    const [panelType, setPanelType] = useState<
        "color" | "menu" | "label" | null
    >(null);

    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

    const navigate = useNavigate();

    const paletteRef = useRef<HTMLDivElement | null>(null);
    const headerRef = useRef<HTMLDivElement | null>(null);


    // Store
    const {
        selectedNoteIds,

        setPreviewColor,
        clearSelection,

    } = useNoteSelectionStore();


    // Store
    const {

        updateSelectedNotePin,

        searchParams,
        setSearchParams,

    } = useNoteStore();



    // hook
    const { handleMoveToTrash, handleDuplicateNotes } =
        useSelectedNoteActions();


    // hook
    const { handleSaveSelectedColor } = useSelectedNoteColor();


    // hook
    useHeaderClickOutside({
        paletteRef,
        headerRef,
        panelType,
        setPanelType,
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

        <div
            ref={headerRef}
            className={styles.headerWrapper}
        >

            {selectedNoteIds.length > 0 ? (

                <SelectedNotesHeader
                    selectedNoteCount={selectedNoteIds.length}
                    onTogglePin={(pinnedState) =>  // => の後に {} を書かない。アロー関数の省略形。updateSelectedNotePin() の実行結果が、そのまま戻り値になる。
                        updateSelectedNotePin(
                            selectedNoteIds,
                            pinnedState,
                        )
                    }

                    panelType={panelType}
                    setPanelType={setPanelType}
                    paletteRef={paletteRef}
                    setPreviewColor={setPreviewColor}

                    handleMoveToTrash={handleMoveToTrash}
                    handleDuplicateNotes={handleDuplicateNotes}
                />


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
