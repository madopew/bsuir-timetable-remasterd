import './TabMenu.css';
import {CalendarMonth, School} from "@mui/icons-material";

interface TabMenuProps {
    selectedTab: number;
    setSelectedTab: (tab: number) => void;
}

export default function TabMenu({selectedTab, setSelectedTab}: TabMenuProps) {
    const handleTabChange = (tab: number) => {
        setSelectedTab(tab);
    }

    return (
        <div className="TabMenu">
            <div className={`TabMenu-tab ${selectedTab === 0 && 'active'}`} onClick={() => handleTabChange(0)}>
                <School/>
                <span>Преподаватели</span>
            </div>
            <div className={`TabMenu-tab ${selectedTab === 1 && 'active'}`} onClick={() => handleTabChange(1)}>
                <CalendarMonth/>
                <span>Расписание</span>
            </div>
            {/*<div className={`TabMenu-tab ${selectedTab === 2 && 'active'}`} onClick={() => handleTabChange(2)}>*/}
            {/*    <Functions/>*/}
            {/*    <span>Экзамены</span>*/}
            {/*</div>*/}
        </div>
    );
}