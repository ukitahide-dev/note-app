import { useRef, useState } from "react";



import type { Note  } from "../../../types/note";


export function useCalendarTooltip(

) {



    const [tooltip, setTooltip] = useState<{
        notes: Note[],
        x: number;
        y: number;
    } | null>(null);


    const tooltipTimer = useRef<number | null>(null);





    const showTooltip = (
        notes: Note[],
        x: number,
        y: number,

    ) => {

        if (tooltipTimer.current) {
            clearTimeout(tooltipTimer.current);
        }

        setTooltip({
            notes: notes,
            x: x,
            y: y,
        });

    }


    // カレンダーの日付と、tooltipからマウスが離れたときに発動。
    const hideTooltip = () => {
        tooltipTimer.current = setTimeout(() => {
            setTooltip(null);
        }, 200);
    }



    const stopTooltiptimer = () => {

        if (tooltipTimer.current) {
            clearTimeout(tooltipTimer.current);
        }

    }





    return {
        tooltip,
        showTooltip,
        hideTooltip,
        stopTooltiptimer,
    }


}
