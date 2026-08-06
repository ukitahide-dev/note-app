import { useEffect, useState } from "react";

import styles from "./Calendar.module.css";

import { useNoteStore } from "../../../notes/store/useNoteStore";
import NoteDetailModal from "../../../notes/components/NoteDetailModal/NoteDetailModal";

import type { Note } from "../../../../types/note";
import { useCalendarTooltip } from "../../hooks/useCalendarTooltip";


import {
	getDaysInMonth,
	createDays,
	getFirstDayOfMonth,
	createBlanks,
} from "../../utils/calendarUtils"
import { CalendarDay } from "../CalendarDay/CalendarDay";
import { countNotesByDay } from "../../utils/calendarNoteUtils";



export default function Calendar() {

    // store
    const { notes, fetchAllNotes } = useNoteStore();

    useEffect(() => {
        fetchAllNotes();
    }, []);


	// hooks
	const {
		tooltip,
		showTooltip,
		hideTooltip,
		stopTooltiptimer,
	} = useCalendarTooltip();







   

    // new Date(year, month, day) の month は 0始まり。
    const [currentDate, setCurrentDate] = useState(new Date()); // new Date(): 今この瞬間の日時オブジェクトが作られる。現在表示しているカレンダーの日付を状態として管理する。

	const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    const [selectedNote, setSelectedNote] = useState<Note | null>(null);



    // 「現実世界の今日」
    const today = new Date();

    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth() + 1;
    const todayDate = today.getDate();


	// 計算ロジックはutilsに移した
	const daysInMonth = getDaysInMonth(year, month);
	const days = createDays(daysInMonth);


	const firstDayInMonth = getFirstDayOfMonth(year, month);
	const blanks = createBlanks(firstDayInMonth);


    // calendarNoteUtils
    const noteCountByDay =
        countNotesByDay(
            notes,
            year,
            month,
        );




    function isToday(day: number) {
        return year === todayYear &&
            month === todayMonth &&
            day === todayDate;
    }



    const handleDayMouseEnter = (
        e: React.MouseEvent<HTMLDivElement>,
        day: number,
    ) => {

        const rect = e.currentTarget.getBoundingClientRect();

        const notesOfDay = notes.filter((note) => {
            const date = new Date(note.created_at);

            return (
                date.getFullYear() === year &&
                date.getMonth() + 1 === month &&
                date.getDate() === day
            );
        });

		showTooltip(notesOfDay, rect.right + 8, rect.top);


    };








	return (

        <div className={styles.calendar}>

            <div className={styles.header}>

                <button
                    onClick={() => setCurrentDate(new Date(year, month - 2, 1))}
                >
                    ←
                </button>

                <h2>
                    {year}年 {month}月
                </h2>

                <button
                    onClick={() => setCurrentDate(new Date(year, month, 1))}
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
                    <div key={`blank-${index}`}
                        className={styles.blank}
                    />
                ))}


                {/* 日付 */}
                {days.map((day) => (

                    <CalendarDay
                        key={day}
                        day={day}
                        isToday={isToday(day)}
                        count={noteCountByDay[day] ?? 0}
                        onMouseEnter={(e) => handleDayMouseEnter(e, day)}
                        onMouseLeave={hideTooltip}

                    />

                ))}

            </div>


            {tooltip && (

                <div
                    className={styles.tooltip}
                    style={{
                        left: tooltip.x,
                        top: tooltip.y,
                    }}

					onMouseEnter={stopTooltiptimer}

                    onMouseLeave={hideTooltip}

                >
                    <h3>
                        {year}年{month}月のノート
                    </h3>

                    {tooltip.notes.map((note) => (
                        <div
                            key={note.id}
                            onClick={() => {
                                setSelectedNote(note);
								hideTooltip();

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
