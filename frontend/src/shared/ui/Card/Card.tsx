import { forwardRef } from "react";
import styles from "./Card.module.css";


type Props = {
    children: React.ReactNode;
    className?: string;
    "data-testid"?: string;
    onClick?: () => void;
    style?: React.CSSProperties;
};



const Card = forwardRef<
    HTMLDivElement,  //  refの型
    Props  // propsの型
>(
    (
        {
            children,
            className,
            "data-testid": dataTestId,
            onClick,
            style,
        },
        ref
    ) => {

        return (

            <div
                ref={ref}
                className={`
                    ${styles.card}
                    ${className || ""}
                `}
                data-testid={dataTestId}
                onClick={onClick}
                style={style}
            >

                {children}

            </div>

        );
    }
);



export default Card;
