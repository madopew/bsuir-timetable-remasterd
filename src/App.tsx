import React, {useReducer, useState} from 'react';
import './App.css';
import AppearTransition, {TransitionType} from "./components/AppearTransition/AppearTransition";
import Dialog, {DIALOG_OPTIONS_INIT} from "./components/Dialog/Dialog";
import dialogReducer, {DialogActionType} from "./reducers/DialogReducer";
import useTimetable from "./hooks/Timetable";
import useLocalStorage from "./hooks/LocalStorage";
import GroupPicker from "./components/GroupPicker/GroupPicker";
import Lessons from "./components/Lessons/Lessons";

const daysOfWeek = ["ВС", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"];
const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];

function App() {
    const [dialogState, dialogDispatch] = useReducer(dialogReducer, {
        visible: false,
        options: DIALOG_OPTIONS_INIT,
    });

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

    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    const formatDate = (date: Date): string => {
        const dayOfWeek = date.getDay();
        return `${daysOfWeek[dayOfWeek]}, ${date.getDate()} ${months[date.getMonth()]}`;
    }

    const [group, setGroup] = useLocalStorage("timetable-bsuir-group", "951006");

    const [timetable, timetableLoading, updateTimetable] = useTimetable({
        group: group,
        onError: onTimetableError
    });

    return (
        <div className="App">
            <div className="root-top">
                <AppearTransition
                    visible={dialogState.visible}
                    effect={TransitionType.fadeIn}
                >
                    <Dialog options={dialogState.options}/>
                </AppearTransition>
            </div>
            <div className="root-group">
                <GroupPicker
                    group={group}
                    setGroup={setGroup}
                    updateTimetable={updateTimetable}
                    onDateChange={date => setSelectedDate(date)}
                    dateValue={formatDate(selectedDate)}
                />
            </div>
            <div className="root-main">
                <Lessons
                    isLoading={timetableLoading}
                    timetable={timetable}
                    date={selectedDate}/>
            </div>
            <div className="root-tabs">

            </div>
        </div>
    );
}

export default App;
