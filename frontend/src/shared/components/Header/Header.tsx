

// ---- css ----
import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import { useSearchStore } from "../../../features/search/store/SearchStore";
import { useNoteSelectionStore } from "../../../features/notes/store/useNoteSelectionStore";



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


    const navigate = useNavigate();

    const {
        searchText,
        setSearchText
    } = useSearchStore();



    // useNoteSelectionStoreを使う
    const {
        selectedNoteIds,
    } = useNoteSelectionStore();





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

                    <button>
                        🎨
                    </button>

                    <button>
                        🗑
                    </button>


                </div>

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
                    My Keep
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
