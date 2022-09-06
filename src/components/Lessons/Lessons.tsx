import {Subgroup, Timetable, TimetableLesson} from "../../hooks/Timetable";
import {useEffect, useState} from "react";
import './lessons.css';
import Loader from "../Loader/Loader";

interface LessonsProps {
    isLoading: boolean,
    timetable: Timetable | null,
    date: Date,
    dayUp: () => void,
    dayDown: () => void
}

interface LessonsContentProps {
    lessons: TimetableLesson[] | null,
    dayUp: () => void,
    dayDown: () => void
}

function LessonsContent({lessons, dayUp, dayDown}: LessonsContentProps) {
    return (
        <div className="Lessons-content">
            <div className="Lessons-content-left" onClick={e => dayDown()}></div>
            <div className="Lessons-content-right" onClick={e => dayUp()}></div>
            { lessons === null
                ? <div className="Lessons-empty">
                    <span>Расписания нет</span>
                </div>
                : lessons.length === 0
                ? <div className="Lessons-empty">
                    <span>В этот день пар нет</span>
                </div>
                : lessons.map((lesson, i) => {
                    return (
                        <div key={`lesson-number-${i}`} className={`Lessons-lesson lesson-${lesson.type}`}>
                            <div className="lesson-time">
                                <span className="lesson-start">{lesson.startTime}</span>
                                <span className="lesson-end">{lesson.endTime}</span>
                            </div>
                            <div className="lesson-info">
                                <div className="lesson-name-container">
                                    <span className="lesson-name">{lesson.name}</span>
                                    {lesson.subgroup !== Subgroup.BOTH &&
                                    <span className="lesson-subgroup"> ({lesson.subgroup === Subgroup.FIRST ? "1" : "2"})</span>}
                                </div>
                                <span className="lesson-room">{lesson.room}</span>
                                {lesson.employees.map((employee, i) => {
                                    return <span key={`lesson-employee-${i}`} className="lesson-employee">{employee}</span>
                                })}
                                {
                                    lesson.note !== "" &&
                                    <span className="lesson-note">{lesson.note}</span>
                                }
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default function Lessons({isLoading, timetable, date, dayUp, dayDown}: LessonsProps) {
    const getClosestSameWeekMonday = (fromDate: Date): Date => {
        const dayOfWeek = fromDate.getDay();
        const diff = fromDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        const dateCopy = new Date(fromDate);
        dateCopy.setDate(diff);
        return dateCopy;
    }

    const getCurrentWeek = (fromDate: Date, fromTimetable: Timetable): number => {
        const syncDate = new Date(fromTimetable.syncDate.split(".").reverse().join("-"));
        const syncMonday = getClosestSameWeekMonday(syncDate);
        const currentMonday = getClosestSameWeekMonday(fromDate);
        const diff = currentMonday.getTime() - syncMonday.getTime();
        const wholeWeeks = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
        const weeksDiff = (wholeWeeks + 1) % 4;
        if (weeksDiff === 0) {
            return 4;
        }
        return weeksDiff;
    }

    const getLessons = (): TimetableLesson[] | null => {
        if (timetable === null) {
            return null;
        }

        const currentWeek = getCurrentWeek(date, timetable);
        const currentDay = timetable.schedules[date.getDay()];
        if (currentDay === null) {
            return [];
        }
        return currentDay.lessons.filter(lesson => lesson.weeks.includes(currentWeek));
    }

    const [lessons, setLessons] = useState<TimetableLesson[] | null>([]);

    useEffect(() => {
        const lessons = getLessons();
        setLessons(lessons);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [date, timetable])

    return (
        <div className="Lessons">
            <Loader isLoading={isLoading}>
                <LessonsContent
                    lessons={lessons}
                    dayUp={dayUp}
                    dayDown={dayDown}
                />
            </Loader>
        </div>
    );
}