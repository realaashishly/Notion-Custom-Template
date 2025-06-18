"use client"
import ManagementKanbanBoard from "@/components/calender";
import CalendarEvents from "@/components/calenderView";
import ClientPortalTable from "@/components/klaticBrain/clientPortal";
import ProjectManagementDashboard from "@/components/klaticBrain/Projects";
import TeamMembersTable from "@/components/klaticBrain/TeamPortal";
import PlatformsAccounts from "@/components/platform";
import Areas from "@/components/secondBrain/area";
import KanbanBoardTask from "@/components/secondBrain/kanbanBoard";
import NotesInterface from "@/components/secondBrain/notes";
import KanbanBoard from "@/components/secondBrain/project";
import WorldClock from "@/components/secondBrain/worldClocks";
import TaskBoard from "@/components/taskboard";

export default function Home() {
    return (
        <div className='flex flex-col gap-6 bg-zinc-950 '>
            <CalendarEvents />
            <ManagementKanbanBoard/>
            <PlatformsAccounts/>
            <TaskBoard />

            <KanbanBoard />
            <Areas />
            <NotesInterface />
            <KanbanBoardTask/>
            <WorldClock/>

            <ProjectManagementDashboard/>
            <ClientPortalTable/>
            <TeamMembersTable/>
        </div>
    );
}
