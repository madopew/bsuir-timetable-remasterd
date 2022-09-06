import './group-picker.css';
import UpdateIcon from '@mui/icons-material/Update';

interface GroupPickerProps {
    group: string,
    setGroup: (group: string) => void,
    updateTimetable: () => void,
    onDateChange: (date: Date) => void,
    dateValue: Date
}

const daysOfWeek = ["ВС", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"];
const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];

export default function GroupPicker({group, setGroup, updateTimetable, onDateChange, dateValue}: GroupPickerProps) {

    const handleDateChange = (event: any) => {
        const dateString = event.target.value;
        if (dateString === null || dateString === undefined || dateString === "") {
            onDateChange(new Date());
        } else {
            onDateChange(new Date(dateString));
        }
    }

    const handleGroupClick = () => {
        const newGroup = prompt("Введите номер группы", group);
        if (newGroup !== null && newGroup !== undefined && newGroup !== "") {
            setGroup(newGroup);
        }
    }

    const formatDateReadable = (date: Date): string => {
        const dayOfWeek = date.getDay();
        return `${daysOfWeek[dayOfWeek]}, ${date.getDate()} ${months[date.getMonth()]}`;
    }

    const formatDateInput = (date: Date): string => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${year}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`;
    }

    return (
        <div className="group-picker">
            <div className="at-author-container">
                <div className="at-author">
                    <span>by @madopew</span>
                </div>
            </div>
            <div className="date-picker-container">
                <label htmlFor="date-picker-id">{formatDateReadable(dateValue)}</label>
                <input id="date-picker-id" type="date" className="date-picker" value={formatDateInput(dateValue)} onChange={event => handleDateChange(event)} />
                <div className="update-button-container" onClick={e => updateTimetable()}>
                    <UpdateIcon fontSize={"large"}/>
                </div>
            </div>
            <h2 onClick={e => handleGroupClick()}>группа {group}</h2>
        </div>
    );
}