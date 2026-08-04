import { useEffect, useRef, useState } from "react";

import styles from "./Calendar.module.css";


import { useNoteStore } from "../../store/useNoteStore";
import NoteDetailModal from "../NoteDetailModal/NoteDetailModal";


import type { Note } from "../../../../types/note";



export default function Calendar() {

    // store
    const {
        notes,
        fetchAllNotes,
    } = useNoteStore();


    useEffect(() => {
        fetchAllNotes();
    }, []);


    const noteCountByDay: Record<number, number> = {};


    // new Date(year, month, day) の month は 0始まり。
    const [currentDate, setCurrentDate] = useState(new Date());  // new Date(): 今この瞬間の日時オブジェクトが作られる。現在表示しているカレンダーの日付を状態として管理する。

    // const [selectedDay, setSelectedDay] = useState<number | null>(null);
    // const [hoverDay, setHoverDay] = useState<number | null>(null);

    const [tooltip, setTooltip] = useState<{
        notes: Note[];
        x: number;
        y: number;
    } | null>(null);

    const tooltipTimer = useRef<number | null>(null)

    // const [openNoteDetailId, setOpenNoteDetailId] = useState<number | null>(null);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;


    // 「現実世界の今日」
    const today = new Date();

    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth() + 1;
    const todayDate = today.getDate();



    // 今月の日数
    const daysInMonth = new Date(
        year,
        month,  // ex) month = 8なら、9月のこと。9月0日をjavascriptが自動で、8月31日に変換する。
        0       // 0日を表す
    ).getDate();   // getDate(): 日にち部分だけ取り出すメソッド。



    // その月の1日が何曜日か
    // 0 = 日曜日
    // 1 = 月曜日
    // ...
    // 6 = 土曜日
    const firstDay = new Date(
        year,
        month - 1,
        1
    ).getDay();  // getDay(): 曜日を数字で返すメソッド。



    // 空白セル
    const blanks = Array.from(
        { length: firstDay },
        (_, index) => index
    );



    // 日付配列
    const days = Array.from(
        { length: daysInMonth },
        (_, index) => index + 1
    );


    console.log(notes);

    notes.forEach((note) => {

        const date = new Date(note.created_at);


        if (date.getFullYear() === year &&
            date.getMonth() + 1 === month
        ) {

            const day = date.getDate();

            noteCountByDay[day] = (noteCountByDay[day] ?? 0) + 1;   // ?? は左側が null または undefined なら右側を使うという意味。


        }


    });



    // const hoverNotes = notes.filter((note) => {

    //     if (!hoverDay) return false;

    //     const date = new Date(note.created_at);

    //     return (
    //         date.getFullYear() === year &&
    //         date.getMonth() + 1 === month &&
    //         date.getDate() === hoverDay
    //     )

    // });



    function getDayClass(
        count: number,
    ) {

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



    function isToday(day: number) {

        return (
            year === todayYear &&
            month === todayMonth &&
            day === todayDate
        );

    }


    return (

        <div className={styles.calendar}>

            <div className={styles.header}>
                <button
                    onClick={() =>
                        setCurrentDate(
                            new Date(year, month - 2, 1)
                        )
                    }
                >
                    ←
                </button>

                <h2>{year}年 {month}月</h2>

                <button
                    onClick={() =>
                        setCurrentDate(
                            new Date(year, month, 1)
                        )
                    }
                >
                    →
                </button>

            </div>

            <div className={styles.weekdays}>

                <div>日</div>
                <div>月</div>
                <div>火</div>
                <div>水</div>
                <div>木</div>
                <div>金</div>
                <div>土</div>

            </div>


            <div className={styles.days}>


                {/* 空白 */}
                {blanks.map((_, index) => (

                    <div
                        key={`blank-${index}`}
                        className={styles.blank}

                    />

                ))}




                {/* 日付 */}
                {days.map((day) => {

                    const count = noteCountByDay[day] ?? 0;
                    console.log(count);

                    return (

                        <div
                            key={day}
                            className={`
                                ${styles.day}
                                ${getDayClass(count)}
                                ${isToday(day) ? styles.today : ""}
                            `}
                            onMouseEnter={(e) => {

                                if (tooltipTimer.current) {
                                    clearTimeout(tooltipTimer.current);
                                }

                                const rect = e.currentTarget.getBoundingClientRect();

                                const notesOfDay = notes.filter((note) => {

                                    const date = new Date(note.created_at);

                                    return (
                                        date.getFullYear() === year &&
                                        date.getMonth() + 1 === month &&
                                        date.getDate() === day
                                    );

                                });


                                setTooltip({
                                    notes: notesOfDay,
                                    x: rect.right + 8,
                                    y: rect.top,
                                });

                            }}

                            onMouseLeave={() => {
                                tooltipTimer.current = setTimeout(() => {
                                    setTooltip(null);
                                }, 200)
                            }}

                            // onMouseLeave={() => {
                            //     setTooltip(null);
                            // }}

                            // onMouseEnter={() => setHoverDay(day)}
                            // onMouseLeave={() => setHoverDay(null)}
                            // onClick={() => setSelectedDay(day)}
                        >
                            <p>{day}</p>

                            {
                                count > 0 && (
                                    <p>{count}件</p>
                                )
                            }

                            {/* {hoverDay === day && (
                                <div
                                    className={styles.tooltip}
                                >

                                    <h3>{month}月{hoverDay}日のノート</h3>

                                    {hoverNotes.map((note) => (
                                        <div
                                            key={note.id}
                                            onClick={() => {
                                                setOpenNoteDetailId(note.id);
                                                setSelectedNote(note)


                                            }}

                                        >

                                            {note.title}

                                        </div>
                                    ))}

                                </div>
                            )} */}

                        </div>
                    )



                })}


            </div>


            {tooltip && (
                <div
                    className={styles.tooltip}
                    style={{
                        left: tooltip.x,
                        top: tooltip.y,
                    }}
                    onMouseEnter={() => {
                        if (tooltipTimer.current) {
                            clearTimeout(tooltipTimer.current);
                        }
                        // clearTimeout(tooltipTimer.current)
                    }}
                    onMouseLeave={() => {

                        tooltipTimer.current = setTimeout(() => {
                            setTooltip(null);
                        }, 200);

                    }}
                    // onMouseLeave={() => setTooltip(null)}
                >

                    <h3>{year}年{month}月のノート</h3>

                    {tooltip.notes.map((note) => (
                        <div
                            key={note.id}
                            onClick={() => {
                                setSelectedNote(note);
                                setTooltip(null);
                            }}
                        >
                            {note.title}
                        </div>
                    ))}

                </div>



            )}


            {selectedNote && (
                <NoteDetailModal
                    note={selectedNote}
                    onClose={() => setSelectedNote(null)}
                />

            )}

        </div>

    );

}
