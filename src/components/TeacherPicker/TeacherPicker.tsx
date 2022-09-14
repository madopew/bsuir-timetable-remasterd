import './teacher-picker.css';
import {getTeacherFullName, getTeachers, getTeacherShortName} from "../../services/bsuir-service";

interface TeacherPickerProps {
    name: string,
    setLoading: (loading: boolean) => void,
    setName: (name: string) => void,
    setUrlId: (urlId: string) => void,
}

export default function TeacherPicker({name, setLoading, setName, setUrlId}: TeacherPickerProps) {
    const handleGroupClick = () => {
        const newName = prompt("Введите преподавателя");
        if (newName !== null && newName !== undefined && newName !== "") {
            setLoading(true);
            getTeachers().then(teachers => {
                for (const teacher of teachers) {
                    if (getTeacherFullName(teacher).toLowerCase().includes(newName.toLowerCase())) {
                        setName(getTeacherShortName(teacher));
                        setUrlId(teacher.urlId);
                        setLoading(false);
                        return;
                    }
                }

                setName(newName);
                setUrlId(newName);
                setLoading(false);
            });
        }
    }

    return (
        <h2 className="teacher-picker-header" onClick={() => handleGroupClick()}>{name}</h2>
    );
}