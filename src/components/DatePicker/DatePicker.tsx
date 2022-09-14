import './date-picker.css';
import UpdateIcon from '@mui/icons-material/Update';

const daysOfWeek = ["ВС", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"];
const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];

interface DatePickerProps {
    updateTimetable: (() => void) | undefined,
    onDateChange: (date: Date) => void,
    dateValue: Date
}

export default function DatePicker({updateTimetable, onDateChange, dateValue}: DatePickerProps) {
    const handleDateChange = (event: any) => {
        const dateString = event.target.value;
        if (dateString === null || dateString === undefined || dateString === "") {
            onDateChange(new Date());
        } else {
            onDateChange(new Date(dateString));
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
        <div className="date-picker-container">
            <label htmlFor="date-picker-id">{formatDateReadable(dateValue)}</label>
            <input id="date-picker-id"
                   type="date"
                   className="date-picker"
                   value={formatDateInput(dateValue)}
                   onChange={event => handleDateChange(event)}
            />
            {
                updateTimetable !== undefined &&
                (
                    <div className="update-button-container" onClick={() => updateTimetable()}>
                        <UpdateIcon fontSize={"large"}/>
                    </div>
                )
            }
        </div>);
}