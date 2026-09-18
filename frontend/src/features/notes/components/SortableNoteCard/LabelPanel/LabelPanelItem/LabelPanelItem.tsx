import { useEffect, useRef } from "react";

// ---- css ----
import styles from "./LabelPanelItem.module.css";

// ---- type ----
import type { Label } from "../../../../../../types/api/note";
import type { LabelState } from "../../../../../../types/ui/label";

// type LabelState = {
//     id: number;
//     state: "checked" | "unchecked" | "indeterminate";
// };



type Props = {

    label: Label;

    labelState?: LabelState;

    onSelectLabel: (id: number) => void;
};



// 親: LabelPanel.tsx、

export default function LabelPanelItem({
    label,
    labelState,
    onSelectLabel,

}: Props) {


    const checkboxRef = useRef<HTMLInputElement>(null);

    // useEffectは、画面が描画された後に実行される
    useEffect(() => {

        if (checkboxRef.current) {   // checkboxRef.currentはinput要素のこと


            checkboxRef.current.indeterminate =
                labelState?.state === "indeterminate";
        }

    }, [labelState]);



    return (

        <label className={styles.labelPanellItem}>

            <input
                ref={checkboxRef}
                type="checkbox"
                checked={labelState?.state === "checked"}
                onChange={() => onSelectLabel(label.id)}
            />

            <span>{label.name}</span>

        </label>

    );
}
