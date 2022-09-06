import React, {useReducer, useState} from 'react';
import './App.css';
import AppearTransition, {TransitionType} from "./components/AppearTransition/AppearTransition";
import Dialog, {DIALOG_OPTIONS_INIT} from "./components/Dialog/Dialog";
import dialogReducer, {DialogActionType} from "./reducers/DialogReducer";
import useTimetable from "./hooks/Timetable";
import useLocalStorage from "./hooks/LocalStorage";
import GroupPicker from "./components/GroupPicker/GroupPicker";
import Lessons from "./components/Lessons/Lessons";

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

    const [group, setGroup] = useLocalStorage("timetable-bsuir-group", "951006");

    const [timetable, timetableLoading, updateTimetable] = useTimetable({
        group: group,
        onError: onTimetableError
    });

    const dayUp = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + 1);
        setSelectedDate(newDate);
    }

    const dayDown = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() - 1);
        setSelectedDate(newDate);
    }

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
                    dateValue={selectedDate}
                />
            </div>
            <div className="root-main">
                <Lessons
                    isLoading={timetableLoading}
                    timetable={timetable}
                    date={selectedDate}
                    dayUp={dayUp}
                    dayDown={dayDown}
                />
            </div>
            <div className="root-tabs">

            </div>
        </div>
    );
}

export default App;
