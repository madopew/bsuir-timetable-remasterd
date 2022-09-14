import React from "react";
import {DialogAction, DialogActionType} from "../../reducers/DialogReducer";
import './teachers-tab.css';
import useLocalStorage from "../../hooks/LocalStorage";
import useTimetable from "../../hooks/Timetable";
import DatePicker from "../DatePicker/DatePicker";
import Lessons from "../Lessons/Lessons";
import TeacherPicker from "../TeacherPicker/TeacherPicker";

interface TeachersTabProps {
    dialogDispatch: React.Dispatch<DialogAction>
}

export default function TeachersTab({dialogDispatch}: TeachersTabProps) {
    const onTimetableError = (reason: string) => {
        dialogDispatch({
            type: DialogActionType.openInfo,
            info: {
                title: "Ошибка",
                text: reason
            },
            close: () => dialogDispatch({type: DialogActionType.hide})
        });
    }

    const [teacherName, setTeacherName] = useLocalStorage("timetable-bsuir-teacher-name", "Нестеренков С. Н.");
    const [urlId, setUrlId] = useLocalStorage("timetable-bsuir-key-teachers", "s-nesterenkov");
    const [teachersLoading, setTeachersLoading] = useLocalStorage("timetable-bsuir-teachers-loading", false);

    const [timetable, timetableLoading, updateTimetable] = useTimetable({
        key: urlId,
        onError: onTimetableError
    }, false);

    const [_selectedDate, _setSelectedDate] = useLocalStorage("timetable-bsuir-date-teachers", new Date().getTime());
    const getSelectedDate = () => new Date(_selectedDate);
    const setSelectedDate = (date: Date) => _setSelectedDate(date.getTime());

    const dayUp = () => {
        const newDate = new Date(getSelectedDate());
        newDate.setDate(newDate.getDate() + 1);
        setSelectedDate(newDate);
    }

    const dayDown = () => {
        const newDate = new Date(getSelectedDate());
        newDate.setDate(newDate.getDate() - 1);
        setSelectedDate(newDate);
    }

    return (
        <div className="TeachersTab">
            <div className="TeachersTab-header">
                <DatePicker updateTimetable={updateTimetable}
                            onDateChange={date => setSelectedDate(date)}
                            dateValue={getSelectedDate()}/>
                <TeacherPicker name={teacherName} setLoading={setTeachersLoading} setName={setTeacherName} setUrlId={setUrlId}/>
            </div>
            <div className="TeachersTab-content">
                <Lessons
                    isGroup={false}
                    isLoading={timetableLoading || teachersLoading}
                    timetable={timetable}
                    date={getSelectedDate()}
                    dayUp={dayUp}
                    dayDown={dayDown}
                />
            </div>
        </div>
    );
}
