


type TooltipProps = {

    text: string;
    children: React.ReactNode;

};


import styles from "./Tooltip.module.css";



// 呼び出し元: NoteCard,


// 役割: 共通の親コンポーネント(Tooltip)で包んで、バラバラの子供たちに共通機能(ホバーしたらツールチップ表示)を与える。

export default function Tooltip({
    text,
    children,

 }: TooltipProps) {

    return (

        <div className={styles.wrapper}>

            {children}

            <span className={styles.tooltip}>
                {text}
            </span>

        </div>

    );
}
