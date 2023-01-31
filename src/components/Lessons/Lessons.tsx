import {useEffect, useState} from "react";
import './lessons.css';
import Loader from "../Loader/Loader";
import {
    getTeacherFullName,
    getWeekNumberFromSync,
    Subgroup,
    Timetable,
    TimetableLesson
} from '../../services/bsuir-service'

interface LessonsProps {
    isGroup: boolean,
    isLoading: boolean,
    timetable: Timetable | null,
    date: Date,
    dayUp: () => void,
    dayDown: () => void
}

interface LessonsContentProps {
    isGroup: boolean,
    lessons: TimetableLesson[] | null | undefined,
    dayUp: () => void,
    dayDown: () => void
}

function LessonsContent({isGroup, lessons, dayUp, dayDown}: LessonsContentProps) {
    const groupIdentifier = (group: string): string => group.slice(0, 4);
    const groupNumber = (group: string): number => parseInt(group.slice(4));

    const formatGroups = (groups: Array<string>): Array<string> => {
        return groups
            .sort()
            .reduce((acc: Array<Array<string>>, cur: string) => {
                const last = acc[acc.length - 1];
                if (last.length === 0 || groupIdentifier(last[0]) === groupIdentifier(cur)) {
                    last.push(cur);
                } else {
                    acc.push([cur]);
                }
                return acc;
            }, [[]])
            .flatMap((group: Array<string>) => {
                if (group.length === 1) return group[0];
                const seq = group.reduce((acc: Array<Array<string>>, cur: string) => {
                    const last = acc[acc.length - 1];
                    if (last.length === 0 || groupNumber(last[last.length - 1]) === groupNumber(cur) - 1) {
                        last.push(cur);
                    } else {
                        acc.push([cur]);
                    }
                    return acc;
                }, [[]]);
                return seq.map((seq: Array<string>) => {
                    if (seq.length === 1) {
                        return seq[0];
                    }
                    return seq[0] + "-" + groupNumber(seq[seq.length - 1]);
                });
            });
    }

    return (
        <div className="Lessons-content">
            <div className="Lessons-content-left" onClick={() => dayDown()}></div>
            <div className="Lessons-content-right" onClick={() => dayUp()}></div>
            {lessons === undefined ? <></> : lessons === null
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
                                            <span
                                                className="lesson-subgroup"> ({lesson.subgroup === Subgroup.FIRST ? "1" : "2"})</span>}
                                    </div>
                                    <span className="lesson-room">{lesson.room}</span>
                                    {!isGroup
                                        ? formatGroups(lesson.groups).map((group, i) => {
                                            return <span key={`lesson-employee-${i}`}
                                                         className="lesson-employee">{group}</span>
                                        })
                                        : lesson.employees.map((employee, i) => {
                                            return <span key={`lesson-employee-${i}`}
                                                         className="lesson-employee">{getTeacherFullName(employee)}</span>
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

export default function Lessons({isGroup, isLoading, timetable, date, dayUp, dayDown}: LessonsProps) {
    const getLessons = (): TimetableLesson[] | null => {
        if (timetable === null) {
            return null;
        }

        const currentWeek = getWeekNumberFromSync(date, timetable.syncDate, timetable.syncWeek);
        const currentDay = timetable.schedules[date.getDay()];
        if (currentDay === null) {
            return [];
        }
        return currentDay.lessons.filter(lesson => lesson.weeks.includes(currentWeek))
          .filter(lesson => lesson.dateLesson === null || date === new Date(lesson.dateLesson.split(".").reverse().join("-")));
    }

    const [lessons, setLessons] = useState<TimetableLesson[] | null | undefined>(undefined);

    useEffect(() => {
        setLessons(getLessons());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [date, timetable])

    return (
        <div className="Lessons">
            <Loader isLoading={isLoading}>
                <LessonsContent
                    isGroup={isGroup}
                    lessons={lessons}
                    dayUp={dayUp}
                    dayDown={dayDown}
                />
            </Loader>
        </div>
    );
}