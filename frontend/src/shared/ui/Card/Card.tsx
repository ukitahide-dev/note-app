import styles from "./Card.module.css";


type Props = {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    style?: React.CSSProperties;
};




export default function Card({
    children,
    className,
    onClick,
    style,
}: Props) {

    return (
        <div
            className={`
                ${styles.card}
                ${className || ""}
            `}
            onClick={onClick}
            style={style}
        >
            {children}
        </div>
    );
}
