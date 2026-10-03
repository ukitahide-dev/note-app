


type TooltipProps = {

    text: string;
    children: React.ReactNode;
    fullWidth?: boolean;

};


import styles from "./Tooltip.module.css";



// 呼び出し元: NoteCard,


// 役割: 共通の親コンポーネント(Tooltip)で包んで、バラバラの子供たちに共通機能(ホバーしたらツールチップ表示)を与える。
// 呼び出し元: NoteCard, Sidebar,


export default function Tooltip({
    text,
    children,
    fullWidth = false,

 }: TooltipProps) {

    return (

        <div
            className={`${styles.wrapper} ${
                fullWidth ? styles.fullWidth : ""
            }`}
        >

            {children}

            <span className={styles.tooltip}>
                {text}
            </span>

        </div>

    );
}
