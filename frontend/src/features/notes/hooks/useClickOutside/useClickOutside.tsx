import { useEffect, useRef } from "react";



// 呼び出し元: NoteCard,
// 役割: 指定された領域の外側クリックを検知する。


export function useClickOutside(
    refs: React.RefObject<HTMLElement | null>[],
    onClickOutside: () => void,
    enabled: boolean,

) {

    // ----- イベントリスナーは前のまま維持しながら、クリック判定には最新のRef、実行する処理には最新の関数を使えるようにしている。----
    const refsRef = useRef(refs);
    const callbackRef = useRef(onClickOutside);

    refsRef.current = refs;   // 再レンダリングされたら、refsRef.current、つまり、refsRefの中身だけを最新の値に変える。refsRef自体は再レンダリングされても、ずっと同じものを参照している。
    callbackRef.current = onClickOutside;

    console.log(refsRef);
    useEffect(() => {

        console.log("[NoteCard] useEffect", { enabled });

        if (!enabled) return;


        const handleClick = (event: MouseEvent) => {

            const target = event.target as Node;   // 今回クリックされた実際のHTML要素を取り出して、TypeScriptに『これはNodeとして扱っていいよ』と伝えている。event.target: 実際にクリックされた要素。

            if (!target) return;

            const clickedOutside = refsRef.current.every((ref) => {
                const element = ref.current;
                return !element || !element.contains(target);
            });

            if (clickedOutside) {
                console.log("外クリック処理実行");
                callbackRef.current();
            }
        };

        document.addEventListener("click", handleClick);    // Webページ全体のクリックを監視して、クリックされたら handleClick を実行して、と登録するコード
        console.log("hanleClickイベント登録");

        return () => {
            document.removeEventListener("click", handleClick);
        };

    }, [enabled]);    // 初回マウント時と、enabledの値が変わったときに実行される。


    // useEffect(() => {

    //     console.log("[NoteCard] useEffect", { enabled });

    //     if (!enabled) {
    //         console.log("[NoteCard] disabled: listener not registered");
    //         return;
    //     }

    //     const handleClick = (event: MouseEvent) => {

    //         console.log("[NoteCard] document click");

    //         const target = event.target as Node;

    //         const clickedOutside = refs.every(
    //             (ref) => !ref.current?.contains(target),
    //         );

    //         console.log("[NoteCard] clickedOutside", clickedOutside);

    //         if (clickedOutside) {
    //             onClickOutside();
    //         }
    //     };

    //     document.addEventListener("click", handleClick);
    //     console.log("[NoteCard] listener registered");

    //     return () => {
    //         document.removeEventListener("click", handleClick);
    //         console.log("[NoteCard] listener removed");
    //     };

    // }, [refs, onClickOutside, enabled]);


    // useEffect(() => {

    //     console.log(enabled);

    //     if (!enabled) return;   // ここを通過しないと、documentの監視は登録されない。


    //     const handleClick = (event: MouseEvent) => {

    //         console.log("useClickOutside");

    //         const target = event.target as Node;    // 今回クリックされた実際のHTML要素を取り出して、TypeScriptに『これはNodeとして扱っていいよ』と伝えている。event.target: 実際にクリックされた要素。

    //         // クリックされた場所は、カード・メニュー・ラベルパネル・カラーパレットのどれの中にも入っていないかを調べている。
    //         const clickedOutside = refs.every(   // every: 配列の全要素が条件を満たしているかを調べる。
    //             (ref) => !ref.current?.contains(target),    // そのrefの中にクリックされた場所 target が存在しない。
    //         );

    //         if (clickedOutside) {
    //             onClickOutside();
    //         }
    //     };


    //     document.addEventListener("click", handleClick);   // Webページ全体のクリックを監視して、クリックされたら handleClick を実行して、と登録するコード

    //     return () => {
    //         document.removeEventListener("click", handleClick);
    //     };


    // }, [refs, onClickOutside, enabled]);   // useEffectの中で使っている値は、依存配列に書いておく。


}
