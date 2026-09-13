import { useNoteStore } from "../../store/useNoteStore"



import styles from "./SortSelect.module.css";


type Props = {

    ordering: string;

    onPageOrderChange: (
        ordering: string,

    ) => void;

    manualOrderValue: "order" | "pinned_order";
}


// 親: NotesPage.tsx、

export default function SortSelect({
    ordering,
    onPageOrderChange,
    manualOrderValue,

}: Props) {


    // Store
    // const {
    //     ordering,

    // } = useNoteStore();




    return (

        <div
            className={styles.container}
        >

            <label className={styles.label}>
                並び替え
            </label>

            <select
                className={styles.select}
                value={ordering}
                onChange={(e) => onPageOrderChange(e.target.value)}
            >

                <option value="-created_at">
                    新しい順
                </option>

                <option value="created_at">
                    古い順
                </option>

                <option value="-updated_at">
                    更新順
                </option>

                <option value="title">
                    タイトル順
                </option>

                <option value="-view_count">
                    閲覧数順
                </option>

                <option value="-total_view_seconds">
                    合計滞在時間順
                </option>

                <option value={manualOrderValue}>
                    手動順
                </option>

            </select>

        </div>



    )




}
