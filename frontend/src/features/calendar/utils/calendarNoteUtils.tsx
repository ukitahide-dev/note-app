

import type { Note } from "../../../types/note";


export function countNotesByDay(
    notes: Note[],
    year: number,
    month: number,


) {

    const noteCountByDay: Record<number, number> = {};   // noteCountByDayはnumberをキーにしてnumberを値に持つオブジェクトという意味。


    notes.forEach((note) => {

        const date = new Date(note.created_at);

        if (year === date.getFullYear() &&
            month === date.getMonth() + 1
        ) {

            const day = date.getDate();

            noteCountByDay[day] = (noteCountByDay[day] ?? 0) + 1   // ?? は左側が null または undefined なら右側を使うという意味。

        }



    });



    return noteCountByDay;

}
