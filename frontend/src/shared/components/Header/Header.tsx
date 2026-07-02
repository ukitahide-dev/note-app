// ----react ----
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";


// ---- store ----
import { useSearchStore } from "../../../features/search/store/SearchStore";
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
    // const [tempColor, setTempColor] = useState();


    const navigate = useNavigate();


    const paletteRef = useRef<HTMLDivElement | null>(null);



    const {
        searchText,
        setSearchText
    } = useSearchStore();




    // useNoteSelectionStoreを使う
    const {
        selectedNoteIds,
        previewColor,
        setPreviewColor,
        // clearSelection,
    } = useNoteSelectionStore();



    // useNoteStoreを使う
    const {
        notes,
        // moveSelectedToTrash,
        // createNote,
        updateSelectedNoteColor,
        updateSelectedNotePin,
        // duplicateSelectedNotes,
        // updateSelectedNoteLabels,
    } = useNoteStore();




    const {
        // selectedNotes,
        labelStates,
        handleSelectLabel,
    } = useSelectedNoteLabels();



    const {
        handleMoveToTrash,
        handleDuplicateNotes,
    } = useSelectedNoteActions();



    const selectedNotes = notes.filter((note) => selectedNoteIds.includes(note.id));


    const pinnedState = selectedNotes.some((note) => !note.is_pinned) ? "add" : "remove";
    // console.log(pinnedState)




    // useSelectedNoteLabels hooks に移した。
    // 選択中のノートを抽出する
    // const selectedNotes = notes.filter((note) => selectedNoteIds.includes(note.id));
    // console.log(`selectedNotes: ${selectedNotes}`);


    // const labelStates = labels.map((label) => {  // => {} と書いた場合は、アロー関数のこと。{}には関数内の処理を書く。 => ({})のように、()で囲むのは、省略記法。今回はifとか使いたいから、{}で、関数内の処理として書く必要がある。

    //     const count = selectedNotes.filter((note) =>

    //         note.labels.some((l) => l.id === label.id)  // 選択中のノートが、今見ているラベルを所持しているかを調べる。

    //     ).length


    //     if (count === 0) {

    //         return {
    //             id: label.id,
    //             state: "unchecked",
    //         }

    //     }

    //     if (count === selectedNotes.length) {

    //         return {
    //             id: label.id,
    //             state: "checked",
    //         }
    //     }

    //     return {
    //         id: label.id,
    //         state: "indeterminate",
    //     }

    // });




    // const handleSelectLabel = (
    //     labelId: number,

    // ) => {

    //     const labelState = labelStates.find((l) => l.id === labelId)!;  // 選択したラベルの状態を抽出する・!はTypescriptに、この値は絶対にnullやundefinedではないことを教える。!消すとlabelStateに赤線出る。


    //     if (labelState.state === "checked") {
    //         // すべてのノートから、今見ているラベルのチェックを外す
    //         updateSelectedNoteLabels(selectedNoteIds, labelId, "remove");

    //     } else {
    //         // 全てのノートに、今見ているラベルのチェックを付ける
    //         updateSelectedNoteLabels(selectedNoteIds, labelId, "add");
    //     }





    // }



    const handleSaveSelectedColor =  async (

    ) => {

        // const state = useNoteSelectionStore.getState();

        // console.log("store", state.previewColor);


        // console.log("保存時", previewColor);


        // console.log("color:", previewColor);
        // console.log("ids:", selectedNoteIds);


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



    // hooksに移した
    // const handleMoveToTrash = async (

    // ) => {

    //     // console.log("handleMoveTrash実行");

    //     setPanelType(null);

    //     await moveSelectedToTrash(selectedNoteIds);


    // }



    // hooksに移した
    // const handleDuplicateNotes = async () => {

    //     await duplicateSelectedNotes(selectedNoteIds);

    // }







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
                        // onClick={() => {
                        //     updateSelectedNotePin(selectedNoteIds, pinnedState)
                        // }
                    >

                        📌
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
                            e.stopPropagation(); // これがないとdocumentにクリックが伝播してバグる
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
                        // onClose={() => {

                        //     console.log("onClose");
                        //     console.log("onClose previewColor", previewColor);

                        //     handleSaveSelectedColor();
                        //     setPanelType(null);


                        // }}
                    />


                )}


                {panelType === "menu" && (

                    <NoteMenu
                        onMoveToTrash={async () => {
                            await handleMoveToTrash();
                            setPanelType(null);
                        }}
                        // onMoveToTrash={handleMoveToTrash}
                        onOpenLabel={() => setPanelType("label")}
                        onDuplicateNote={async () => {
                            await handleDuplicateNotes();
                            setPanelType(null);
                        }}
                        // onDuplicateNote={handleDuplicateNotes}

                    />

                )}


                {panelType === "label" && (
                    <LabelPanel

                        labelStates={labelStates}
                        onSelectLabel={handleSelectLabel}

                    />

                )}

            </header>


        ): (


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
                    onFocus={() => navigate("/search")}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />

            </header>


        )}

        </>

    );
}



// useNoteStoreにmoveSelectedToTrashを作り、api呼び出しもそこに書いたことで、ここから不要になった。
        // try {

        //     await Promise.all(
        //         selectedNoteIds.map(
        //             (id) => moveToTrashApi(id)
        //         )
        //     )


        // } catch (error) {

        //     console.error(error);

        // }



// useNoteStoreにapi呼び出しも書くことで、不要になった
        // try {

        //     await Promise.all(
        //         selectedNoteIds.map((id) =>
        //             updateNoteColor(id, previewColor)
        //         )
        //     );




        // } catch (error) {

        //      console.log(error.response?.status);

        //     // console.log(error.response?.data);
        //     // console.error(error);

        // }



// useNoteStoreにduplicateSelectedNotes関数作ることで、これ以降いらなくなった。
        // 書き方1
        // for (const note of notes) {

        //     if (selectedNoteIds.includes(note.id)) {
        //         createNote(
        //             note.title,
        //             note.content,
        //             note.labels.map((label) => label.id),
        //             note.color
        //         )
        //     }

        // }

        // 書き方2
        // await Promise.all(
        //     notes
        //         .filter(note => selectedNoteIds.includes(note.id))
        //         .map(note =>
        //             createNote(
        //                 note.title,
        //                 note.content,
        //                 note.labels.map(label => label.id),
        //                 note.color
        //             )
        //         )
        //     );
