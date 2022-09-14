import React, {useReducer} from 'react';
import './App.css';
import AppearTransition, {TransitionType} from "./components/AppearTransition/AppearTransition";
import Dialog, {DIALOG_OPTIONS_INIT} from "./components/Dialog/Dialog";
import dialogReducer from "./reducers/DialogReducer";
import TabMenu from "./components/TabMenu/TabMenu";
import LessonsTab from "./components/LessonsTab/LessonsTab";
import useLocalStorage from "./hooks/LocalStorage";
import TeachersTab from "./components/TeachersTab/TeachersTab";

function App() {
    const [selectedTab, setSelectedTab] = useLocalStorage("timetable-bsuir-selected-tab", 0);

    const [dialogState, dialogDispatch] = useReducer(dialogReducer, {
        visible: false,
        options: DIALOG_OPTIONS_INIT,
    });

    const renderTabs = () => {
        switch (selectedTab) {
            case 1:
                return (
                    <LessonsTab dialogDispatch={dialogDispatch}/>
                );
            case 0:
                return (
                    <TeachersTab dialogDispatch={dialogDispatch}/>
                );
            default:
                return (<></>);
        }
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
            <div className="root-main">
                {renderTabs()}
            </div>
            <div className="root-tabs">
                <TabMenu selectedTab={selectedTab} setSelectedTab={tab => setSelectedTab(tab)}/>
            </div>
        </div>
    );
}

export default App;
