import CalendarEvent from "@/components/calender";
import Calendar from "@/components/calenderView";
import PlatformsAccounts from "@/components/platform";
import TaskBoard from "@/components/taskboard";

export default function Home() {
    return (
        <div>
            <Calendar />
            <PlatformsAccounts/>
            <CalendarEvent />
            <TaskBoard />
        </div>
    );
}
