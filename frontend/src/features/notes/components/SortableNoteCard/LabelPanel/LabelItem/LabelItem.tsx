import { useEffect, useRef } from "react";


// ---- css ----
import styles from "./LabelItem.module.css";


// ---- type ----
import type { Label } from "../../../../../../types/note";



type LabelState = {
    id: number,
    state: "checked" | "unchecked" | "indeterminate",
}



type Props = {
    label: Label;

    labelState?: LabelState;

    onSelectLabel: (id: number) => void;
};






export default function LabelItem({
    label,
    labelState,
    onSelectLabel,
}: Props) {



    const checkboxRef = useRef<HTMLInputElement>(null);



    // useEffectは、画面が描画されたあとに実行される
    useEffect(() => {
        if (checkboxRef.current) {  // checkboxRef.currentはinput要素のこと
            checkboxRef.current.indeterminate =
                labelState?.state === "indeterminate";
        }
    }, [labelState]);





    return (
        <label className={styles.labelItem}>
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
