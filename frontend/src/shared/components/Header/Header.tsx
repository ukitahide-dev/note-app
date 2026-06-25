

// ---- css ----
import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import { useSearchStore } from "../../../features/search/store/SearchStore";
import { useNoteSelectionStore } from "../../../features/notes/store/useNoteSelectionStore";
import { useState } from "react";
import NoteMenu from "../../../features/notes/components/SortableNoteCard/NoteMenu/NoteMenu";
import ColorPalette from "../../ui/ColorPalette/ColorPalette";
import { updateNoteColor } from "../../../features/notes/api/noteApi";



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


    const [panelType, setPanelType] = useState<"color" | "menu" | null>(null);
    // const [tempColor, setTempColor] = useState();


    const navigate = useNavigate();

    const {
        searchText,
        setSearchText
    } = useSearchStore();



    // useNoteSelectionStoreを使う
    const {
        selectedNoteIds,
        previewColor,
        setPreviewColor,
    } = useNoteSelectionStore();


    console.log("Header", previewColor);




    const handleSaveSelectedColor =  async (

    ) => {

        const state = useNoteSelectionStore.getState();

        console.log("store", state.previewColor);

        // if (!previewColor) return;

        console.log("保存時", previewColor);


        // console.log("color:", previewColor);
        console.log("ids:", selectedNoteIds);

        try {

            await Promise.all(
                selectedNoteIds.map((id) =>
                    updateNoteColor(id, previewColor)
                )
            );

            // await selectedNoteIds.map((id) => updateNoteColor(id, previewColor))

            // setPreviewColor(null);


        } catch (error) {

             console.log(error.response?.status);

            // console.log(error.response?.data);
            // console.error(error);

        }



    }






    // 変えたいのは選択したノートカードの色だから、ここに書くのはおかしい。この関数をZustandに書くのかも。
    // // 色の選択をUIに表示する
    // const handleSelectColor = (
    //     color: string
    // ) => {
    //     setTempColor(color);
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

                    <button>
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
                        onClick={() => setPanelType("menu")}
                    >
                        ⋮
                    </button>


                </div>



                {panelType === "color" && (
                    <ColorPalette
                        onSelectColor={setPreviewColor}
                        onClose={() => {

                            console.log("onClose");
                            console.log("onClose previewColor", previewColor);

                            handleSaveSelectedColor();
                            setPanelType(null);


                        }}
                    />


                )}


                {panelType === "menu" && (

                    <NoteMenu


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
