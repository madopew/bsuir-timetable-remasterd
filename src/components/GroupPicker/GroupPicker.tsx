import './group-picker.css';
import UpdateIcon from '@mui/icons-material/Update';

interface GroupPickerProps {
    group: string,
    setGroup: (group: string) => void,
    updateTimetable: () => void,
    onDateChange: (date: Date) => void,
    dateValue: string
}

export default function GroupPicker({group, setGroup, updateTimetable, onDateChange, dateValue}: GroupPickerProps) {

    const handleDateChange = (event: any) => {
        const dateString = event.target.value;
        if (dateString === null || dateString === undefined || dateString === "") {
            onDateChange(new Date());
        } else {
            onDateChange(new Date(dateString));
        }
    }

    return (
        <div className="group-picker">
            <div className="at-author-container">
                <div className="at-author">
                    <span>by @madopew</span>
                </div>
            </div>
            <div className="date-picker-container">
                <label htmlFor="date-picker-id">{dateValue}</label>
                <input id="date-picker-id" type="date" className="date-picker" onChange={event => handleDateChange(event)} />
                <div className="update-button-container" onClick={e => updateTimetable()}>
                    <UpdateIcon fontSize={"large"}/>
                </div>
            </div>
            <h2>группа {group}</h2>
        </div>
    );
}