import useLocalStorage from "./LocalStorage";
import {useEffect, useState} from "react";
import {getTimetable, Timetable} from "../services/bsuir-service";

interface TimetableInput {
    key: string,
    onError: (reason: string) => void
}

type TimetableOutput = [
    timetable: Timetable | null,
    loading: boolean,
    update: () => void
]

export default function useTimetable({key, onError}: TimetableInput, isGroup: boolean): TimetableOutput {
    const timetableKey = `timetable-bsuir-timetable-${isGroup ? "lessons" : "teachers"}`;
    const [timetable, setTimetable] = useLocalStorage<Timetable | null>(timetableKey, null);
    const [loading, setLoading] = useState<boolean>(false);

    const loadTimetable = () => {
        setLoading(true);

        const group = isGroup ? key : undefined;
        const urlId = !isGroup ? key : undefined;

        getTimetable(group, urlId).then(timetable => {
            setTimetable(timetable);
            setLoading(false);
        }).catch(error => {
            switch (error.response.status) {
                case 404:
                    onError(isGroup
                        ? "Видимо, такой группы не существует"
                        : "Видимо, такого преподавателя не существует");
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
        if (timetable === null || timetable.syncKey !== key) {
            loadTimetable();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key]);

    return [timetable, loading, loadTimetable];
}