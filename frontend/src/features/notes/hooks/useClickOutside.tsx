import { useEffect } from "react";



// 呼び出し元: NoteCard,
// 役割: 指定された領域の外側クリックを検知する。


export function useClickOutside(
    refs: React.RefObject<HTMLElement | null>[],
    onClickOutside: () => void,
    enabled: boolean,

) {


    useEffect(() => {

        if (!enabled) return;   // ここを通過しないと、documentの監視は登録されない。


        const handleClick = (event: MouseEvent) => {

            const target = event.target as Node;    // 今回クリックされた実際のHTML要素を取り出して、TypeScriptに『これはNodeとして扱っていいよ』と伝えている。event.target: 実際にクリックされた要素。

            // クリックされた場所は、カード・メニュー・ラベルパネル・カラーパレットのどれの中にも入っていないかを調べている。
            const clickedOutside = refs.every(   // every: 配列の全要素が条件を満たしているかを調べる。
                (ref) => !ref.current?.contains(target),    // そのrefの中にクリックされた場所 target が存在しない。
            );

            if (clickedOutside) {
                onClickOutside();
            }
        };


        document.addEventListener("click", handleClick);

        return () => {
            document.removeEventListener("click", handleClick);
        };


    }, [refs, onClickOutside, enabled]);   // useEffectの中で使っている値は、依存配列に書いておく。


}
