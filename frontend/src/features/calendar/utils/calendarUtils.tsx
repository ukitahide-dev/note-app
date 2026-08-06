


// その月の日数を取得する
export function getDaysInMonth (
    year: number,
    month: number,
) {

    return (
        new Date(
            year,
            month,
            0,
        ).getDate()
    );

}



export function createDays (
    daysInMonth: number,
) {

    return (
        Array.from(
            {length: daysInMonth},
            (_, index) => index + 1
        )
    );

}



// その月の初日の曜日を数値で取得する
export function getFirstDayOfMonth (
    year: number,
    month: number,
) {

    return (
        new Date(
            year,
            month - 1,
            1,
        ).getDay()
    );

}




export function createBlanks (
    firstDay: number,

) {

    return (

        Array.from(
            { length: firstDay },
            (_, index) => index
        )

    );


}

