import useLocalStorage from "./LocalStorage";
import {useEffect, useState} from "react";
import axios from "axios";

export enum Subgroup {
    BOTH, FIRST, SECOND
}

export enum LessonType {
    LECTURE = "lecture",
    PRACTICE = "practice",
    LAB = "lab",
    UNKNOWN = "unknown"
}

export interface Timetable {
    syncGroup: string,
    syncDate: string,
    schedules: Array<TimetableDay | null>
}

export interface TimetableDay {
    lessons: Array<TimetableLesson>
}

export interface TimetableLesson {
    weeks: Array<number>,
    startTime: string,
    endTime: string,
    type: LessonType,
    name: string,
    employees: Array<string>,
    subgroup: Subgroup,
    room: string,
    note: string
}

interface TimetableInput {
    group: string,
    onError: (reason: string) => void
}

type TimetableOutput = [
    timetable: Timetable | null,
    loading: boolean,
    update: () => void
]

export default function useTimetable({group, onError}: TimetableInput): TimetableOutput {
    const [timetable, setTimetable] = useLocalStorage<Timetable | null>("timetable-bsuir-timetable", null);
    const [loading, setLoading] = useState<boolean>(false);

    const convertLessonType = (typeName: string): LessonType => {
        switch (typeName) {
            case "ЛК":
                return LessonType.LECTURE;
            case "ПЗ":
                return LessonType.PRACTICE;
            case "ЛР":
                return LessonType.LAB;
            default:
                return LessonType.UNKNOWN;
        }
    }

    const convertTimetableDay = (day: any): TimetableDay | null => {
        if (day === null || day === undefined) {
            return null;
        }

        return {
            lessons: day.map((lesson: any) => {
                return {
                    weeks: lesson["weekNumber"],
                    startTime: lesson["startLessonTime"],
                    endTime: lesson["endLessonTime"],
                    type: convertLessonType(lesson["lessonTypeAbbrev"]),
                    name: lesson["subject"],
                    employees: lesson["employees"].map((employee: any) => {
                        return `${employee["lastName"]} ${employee["firstName"]} ${employee["middleName"]}`;
                    }),
                    subgroup: lesson["numSubgroup"],
                    room: lesson["auditories"][0],
                    note: lesson["note"] ? lesson["note"] : ""
                }
            })
        }
    }

    const loadTimetable = () => {
        setLoading(true);
        axios.get(`https://iis.bsuir.by/api/v1/schedule?studentGroup=${group}`)
            .then((response) => response.data)
            .then((json) => {
                setTimetable({
                    syncGroup: group,
                    syncDate: json["startDate"],
                    schedules: [
                        convertTimetableDay(json["schedules"]["Воскресенье"]),
                        convertTimetableDay(json["schedules"]["Понедельник"]),
                        convertTimetableDay(json["schedules"]["Вторник"]),
                        convertTimetableDay(json["schedules"]["Среда"]),
                        convertTimetableDay(json["schedules"]["Четверг"]),
                        convertTimetableDay(json["schedules"]["Пятница"]),
                        convertTimetableDay(json["schedules"]["Суббота"])
                    ]
                });
                setLoading(false);
            })
            .catch((error) => {
                switch (error.response.status) {
                    case 404:
                        onError("Видимо, такой группы не существует");
                        break;
                    default:
                        onError("Что-то пошло не так");
                        break;
                }
                setTimetable(null);
                setLoading(false);
            });
    }

    useEffect(() => {
        if (timetable === null || timetable.syncGroup !== group) {
            loadTimetable();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [group]);

    return [timetable, loading, loadTimetable];
}