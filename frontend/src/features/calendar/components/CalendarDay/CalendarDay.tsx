

import styles from "./CalendarDay.module.css";

type Props = {
    day: number;
    count: number;
    isToday: boolean;

    onMouseEnter: (
        e: React.MouseEvent<HTMLDivElement>  // HTMLのdivに対するマウスイベントを受け取って、何も返さない関数。
    ) => void;

    onMouseLeave: () => void;  // 引数なしで呼べて、戻り値はない関数という意味。
};


export function CalendarDay({
    day,
    count,
    isToday,
    onMouseEnter,
    onMouseLeave,

}: Props) {



    function getDayClass(count: number) {

        if (count >= 4) {
            return styles.level4;
        }

        if (count >= 2) {
            return styles.level3;
        }

        if (count >= 1) {
            return styles.level2;
        }

        return styles.level1;
    }



    return (

        <div
            className={`
				${styles.day}
				${getDayClass(count)}
				${isToday ? styles.today : ""}
			`}

            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}

        >
            <p>{day}</p>

            {count > 0 && <p>{count}件</p>}

        </div>
    );
}
