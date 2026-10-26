
import { useEffect } from "react";
import type { Dispatch, RefObject, SetStateAction } from "react";



type Props = {

    paletteRef: RefObject<HTMLElement | null>;
    headerRef: RefObject<HTMLElement | null>;
    panelType: string | null;
    setPanelType: Dispatch<SetStateAction<"color" | "menu" | "label" | null>>;
    handleSaveSelectedColor: () => Promise<void>;
    clearSelection: () => void;

};


// 呼び出し元: Header,

export function useHeaderClickOutside({
    paletteRef,
    headerRef,
    panelType,
    setPanelType,
    handleSaveSelectedColor,
    clearSelection,

}: Props) {

    useEffect(() => {

        // console.log("[Header] useEffect: register");

        const handleClickOutside = async (event: MouseEvent) => {

            // console.log("[Header] document click", {
            //     panelType,
            //     target: event.target,
            // });


            const target = event.target as Node;

            const clickedOutsidePalette =
                !paletteRef.current ||
                !paletteRef.current.contains(target);

            const clickedOutsideHeader =
                headerRef.current &&
                !headerRef.current.contains(target);

            // console.log("clickedOutsidePalette", clickedOutsidePalette);
            // console.log("clickedOutsideHeader", clickedOutsideHeader);


            // カラーパレットの外をクリックした場合
            // if (panelType === "color" && clickedOutsidePalette) {
            if(clickedOutsidePalette) {

                setPanelType(null);
                // console.log("clickedOutsidePaletteの中")
                const savePromise = handleSaveSelectedColor();
                await savePromise;   // 色の保存処理全体が終わるまで待つ。これで、NoteCardのtempColorに、先に更新後の色が入るようになる。色変更後に、外クリック処理で、一瞬だけ元の色がちらつくバグを防げる。

                // ヘッダーの外なら、保存完了後に選択を解除する
                if (clickedOutsideHeader) {
                    // await savePromise;   // 色の保存処理全体が終わるまで待つ。これで、NoteCardのtempColorに、先に更新後の色が入るようになる。色変更後に、外クリック処理で、一瞬だけ元の色がちらつくバグを防げる。
                    clearSelection();    // 保存処理とsetでの更新が終わってから、selectedNoteIdsを空にする。
                }

                return;

            }

            // ヘッダーの外をクリックした場合
            if (clickedOutsideHeader) {
                setPanelType(null);
                console.log("clickedOutsideHeader単体の中")
                clearSelection();
            }

        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
            // console.log("[Header] listener removed");
        };
    }, [
        panelType,
        paletteRef,
        headerRef,
        handleSaveSelectedColor,
        clearSelection,
    ]);


    // useEffect(() => {

    //     const handleClickOutside = async (event: MouseEvent) => {

    //         const target = event.target as Node;

    //         const clickedOutsidePalette =
    //             !paletteRef.current ||
    //             !paletteRef.current.contains(target);

    //         const clickedOutsideHeader =
    //             headerRef.current &&
    //             !headerRef.current.contains(target);

    //         // console.log("clickedOutsidePalette", clickedOutsidePalette);
    //         // console.log("clickedOutsideHeader", clickedOutsideHeader);


    //         // カラーパレットの外をクリックした場合
    //         // if (panelType === "color" && clickedOutsidePalette) {
    //         if(clickedOutsidePalette) {

    //             setPanelType(null);
    //             // console.log("clickedOutsidePaletteの中")
    //             const savePromise = handleSaveSelectedColor();
    //             await savePromise;   // 色の保存処理全体が終わるまで待つ。これで、NoteCardのtempColorに、先に更新後の色が入るようになる。色変更後に、外クリック処理で、一瞬だけ元の色がちらつくバグを防げる。

    //             // ヘッダーの外なら、保存完了後に選択を解除する
    //             if (clickedOutsideHeader) {
    //                 // await savePromise;   // 色の保存処理全体が終わるまで待つ。これで、NoteCardのtempColorに、先に更新後の色が入るようになる。色変更後に、外クリック処理で、一瞬だけ元の色がちらつくバグを防げる。
    //                 clearSelection();    // 保存処理とsetでの更新が終わってから、selectedNoteIdsを空にする。
    //             }

    //             return;

    //         }

    //         // ヘッダーの外をクリックした場合
    //         if (clickedOutsideHeader) {
    //             setPanelType(null);
    //             console.log("clickedOutsideHeader単体の中")
    //             clearSelection();
    //         }
    //     };

    //     document.addEventListener("click", handleClickOutside);

    //     return () => {
    //         document.removeEventListener("click", handleClickOutside);
    //     };

    // }, [
    //     panelType,
    //     paletteRef,
    //     headerRef,
    //     handleSaveSelectedColor,
    //     clearSelection,
    // ]);

}
