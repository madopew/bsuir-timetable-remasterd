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
    syncKey: string,
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
    employees: Array<Teacher>,
    groups: Array<string>,
    subgroup: Subgroup,
    room: string,
    note: string
}

export interface Teacher {
    firstName: string,
    lastName: string,
    middleName: string,
    urlId: string
}

function convertLessonType(typeName: string): LessonType {
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

export function getTeacherFullName(teacher: Teacher) {
    return `${teacher.lastName} ${teacher.firstName} ${teacher.middleName}`;
}

export function getTeacherShortName(teacher: Teacher) {
    return `${teacher.lastName} ${teacher.firstName[0]}. ${teacher.middleName[0]}.`;
}

function convertTimetableDay(day: any): TimetableDay | null {
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
                employees: lesson["employees"]
                    ? lesson["employees"].map((employee: any) => {
                        return {
                            firstName: employee["firstName"],
                            lastName: employee["lastName"],
                            middleName: employee["middleName"],
                            urlId: employee["urlId"]
                        };
                    })
                    : [],
                groups: lesson["studentGroups"].map((group: any) => {
                    return group["name"];
                }),
                subgroup: lesson["numSubgroup"],
                room: lesson["auditories"][0],
                note: lesson["note"] ? lesson["note"] : ""
            }
        })
    }
}

export function getTimetable(group: string | undefined, urlId: string | undefined): Promise<Timetable> {
    if (group === undefined && urlId === undefined) throw new Error("Group or urlId must be defined");
    if (group !== undefined && urlId !== undefined) throw new Error("Group and urlId cannot be defined at the same time");

    const url = group !== undefined
        ? `https://iis.bsuir.by/api/v1/schedule?studentGroup=${group}`
        : `https://iis.bsuir.by/api/v1/employees/schedule/${urlId}`;

    return axios.get(url)
        .then((response) => response.data)
        .then((json) => {
            return {
                syncKey: group !== undefined ? group : urlId!,
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
            };
        });
}

export function getTeachers(): Promise<Array<Teacher>> {
    return axios.get("https://iis.bsuir.by/api/v1/employees/all")
        .then((response) => response.data)
        .then((json) => {
            return json.map((teacher: any) => {
                return {
                    firstName: teacher["firstName"],
                    lastName: teacher["lastName"],
                    middleName: teacher["middleName"],
                    urlId: teacher["urlId"]
                };
            });
        });
}