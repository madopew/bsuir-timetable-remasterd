import './group-picker.css';

interface GroupPickerProps {
    group: string,
    setGroup: (group: string) => void,
}

export default function GroupPicker({group, setGroup}: GroupPickerProps) {
    const handleGroupClick = () => {
        const newGroup = prompt("Введите номер группы", group);
        if (newGroup !== null && newGroup !== undefined && newGroup !== "") {
            setGroup(newGroup);
        }
    }

    return (
        <h2 className="group-picker-header" onClick={() => handleGroupClick()}>группа {group}</h2>
    );
}