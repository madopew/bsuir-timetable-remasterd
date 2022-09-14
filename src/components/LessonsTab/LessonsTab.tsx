import React from "react";
import {DialogAction, DialogActionType} from "../../reducers/DialogReducer";
import useLocalStorage from "../../hooks/LocalStorage";
import useTimetable from "../../hooks/Timetable";
import Lessons from "../Lessons/Lessons";
import './lessons-tab.css';
import DatePicker from "../DatePicker/DatePicker";
import GroupPicker from "../GroupPicker/GroupPicker";

interface LessonsTabProps {
    dialogDispatch: React.Dispatch<DialogAction>
}

export default function LessonsTab({dialogDispatch}: LessonsTabProps) {
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

    const [group, setGroup] = useLocalStorage("timetable-bsuir-key-lessons", "951006");

    const [timetable, timetableLoading, updateTimetable] = useTimetable({
        key: group,
        onError: onTimetableError
    }, true);

    const [_selectedDate, _setSelectedDate] = useLocalStorage("timetable-bsuir-date-lessons", new Date().getTime());
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
        <div className="LessonsTab">
            <div className="LessonsTab-header">
                <DatePicker updateTimetable={updateTimetable}
                            onDateChange={date => setSelectedDate(date)}
                            dateValue={getSelectedDate()}/>
                <GroupPicker group={group} setGroup={setGroup}/>
            </div>
            <div className="LessonsTab-content">
                <Lessons
                    isGroup={true}
                    isLoading={timetableLoading}
                    timetable={timetable}
                    date={getSelectedDate()}
                    dayUp={dayUp}
                    dayDown={dayDown}
                />
            </div>
        </div>
    );
}