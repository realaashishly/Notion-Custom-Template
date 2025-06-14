"use client";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Archive,
    Calendar,
    Circle,
    Clock,
    Edit,
    Folder,
    Trash2
} from "lucide-react";
import { useState } from "react";

// Separator component (from TaskBoard)
const Separator = () => <div className='w-full h-px bg-zinc-700 my-4' />;

interface Project {
    id: string;
    title: string;
    status: "in-progress" | "upcoming" | "archived" | "not-started";
    dateRange: string;
    startDate?: Date;
    endDate?: Date;
    category: "all" | "personal" | "client";
}

const projects: Project[] = [
    {
        id: "1",
        title: "Amini (Luckywood)",
        status: "in-progress",
        dateRange: "2024-11-17 → 2024-12-17",
        startDate: new Date("2024-11-17"),
        endDate: new Date("2024-12-17"),
        category: "client",
    },
    {
        id: "2",
        title: "Project 02",
        status: "in-progress",
        dateRange: "2024-01-15 → 2024-02-10",
        startDate: new Date("2024-01-15"),
        endDate: new Date("2024-02-10"),
        category: "client",
    },
    {
        id: "3",
        title: "Project 03",
        status: "upcoming",
        dateRange: "2024-02-11 → 2024-02-17",
        startDate: new Date("2024-02-11"),
        endDate: new Date("2024-02-17"),
        category: "client",
    },
    {
        id: "4",
        title: "Case Study of Spacex",
        status: "archived",
        dateRange: "2024-09-03 → 2024-09-27",
        startDate: new Date("2024-09-03"),
        endDate: new Date("2024-09-27"),
        category: "personal",
    },
    {
        id: "5",
        title: "Creative Hairs",
        status: "archived",
        dateRange: "2024-09-10 → 2024-09-27",
        startDate: new Date("2024-09-10"),
        endDate: new Date("2024-09-27"),
        category: "client",
    },
    {
        id: "6",
        title: "Hitting 60 Kg Body Weight",
        status: "upcoming",
        dateRange: "2024-11-10 → 2024-11-30",
        startDate: new Date("2024-11-10"),
        endDate: new Date("2024-11-30"),
        category: "personal",
    },
    {
        id: "7",
        title: "New Project",
        status: "not-started",
        dateRange: "2024-11-02 → 2024-11-30",
        startDate: new Date("2024-11-02"),
        endDate: new Date("2024-11-30"),
        category: "personal",
    },
    {
        id: "8",
        title: "Learn React Native",
        status: "in-progress",
        dateRange: "2024-12-01 → 2025-01-15",
        startDate: new Date("2024-12-01"),
        endDate: new Date("2025-01-15"),
        category: "personal",
    },
    {
        id: "9",
        title: "Portfolio Website Redesign",
        status: "upcoming",
        dateRange: "2025-01-20 → 2025-02-28",
        startDate: new Date("2025-01-20"),
        endDate: new Date("2025-02-28"),
        category: "personal",
    },
    {
        id: "10",
        title: "Morning Routine Optimization",
        status: "in-progress",
        dateRange: "2024-11-01 → 2024-12-31",
        startDate: new Date("2024-11-01"),
        endDate: new Date("2024-12-31"),
        category: "personal",
    },
    {
        id: "11",
        title: "Side Project - Task Manager",
        status: "not-started",
        dateRange: "2025-03-01 → 2025-04-30",
        startDate: new Date("2025-03-01"),
        endDate: new Date("2025-04-30"),
        category: "personal",
    },
    {
        id: "12",
        title: "E-commerce Platform",
        status: "in-progress",
        dateRange: "2024-10-15 → 2024-12-30",
        startDate: new Date("2024-10-15"),
        endDate: new Date("2024-12-30"),
        category: "client",
    },
    {
        id: "13",
        title: "Mobile App Development",
        status: "upcoming",
        dateRange: "2025-01-05 → 2025-03-20",
        startDate: new Date("2025-01-05"),
        endDate: new Date("2025-03-20"),
        category: "client",
    },
    {
        id: "14",
        title: "Brand Identity Design",
        status: "archived",
        dateRange: "2024-08-10 → 2024-09-15",
        startDate: new Date("2024-08-10"),
        endDate: new Date("2024-09-15"),
        category: "client",
    },
    {
        id: "15",
        title: "Website Maintenance",
        status: "in-progress",
        dateRange: "2024-11-01 → Ongoing",
        startDate: new Date("2024-11-01"),
        category: "client",
    },
];

const StatusBadge = ({ status }: { status: string }) => {
    const getStatusConfig = (status: string) => {
        switch (status) {
            case "in-progress":
                return {
                    color: "bg-blue-600",
                    text: "In progress",
                    icon: <Circle className='w-1.5 h-1.5 sm:w-2 sm:h-2 fill-current' />,
                };
            case "upcoming":
                return {
                    color: "bg-yellow-600",
                    text: "Upcoming",
                    icon: <Clock className='w-1.5 h-1.5 sm:w-2 sm:h-2' />,
                };
            case "archived":
                return {
                    color: "bg-zinc-600",
                    text: "Archived",
                    icon: <Archive className='w-1.5 h-1.5 sm:w-2 sm:h-2' />,
                };
            case "not-started":
                return {
                    color: "bg-zinc-600",
                    text: "Not started",
                    icon: <Circle className='w-1.5 h-1.5 sm:w-2 sm:h-2' />,
                };
            default:
                return {
                    color: "bg-zinc-600",
                    text: status,
                    icon: <Circle className='w-1.5 h-1.5 sm:w-2 sm:h-2' />,
                };
        }
    };

    const config = getStatusConfig(status);

    return (
        <div
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs sm:text-sm font-medium text-white ${config.color}`}
        >
            <span>{config.icon}</span>
            <span>{config.text}</span>
        </div>
    );
};

const ProjectCard = ({
    project,
    onEdit,
    onDelete,
}: {
    project: Project;
    onEdit: (project: Project) => void;
    onDelete: (projectId: string) => void;
}) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className='bg-zinc-900 rounded-lg p-3 sm:p-4 border border-zinc-700 hover:bg-zinc-900/60 hover:border-zinc-600 transition-colors relative group'
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Action Buttons - Visible on Hover */}
            <div
                className={`absolute top-2 sm:top-3 right-2 sm:right-3 flex items-center gap-1 transition-opacity duration-200 ${
                    isHovered ? "opacity-100" : "opacity-0"
                }`}
            >
                <button
                    type='button'
                    onClick={() => onEdit(project)}
                    className='p-1 bg-zinc-800 hover:bg-zinc-700 rounded transition-colors'
                    title='Edit Project'
                >
                    <Edit className='w-4 h-4 sm:w-5 sm:h-5 text-zinc-400 hover:text-zinc-300' />
                </button>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <button
                            type='button'
                            className='p-1 bg-zinc-800 hover:bg-red-600 rounded transition-colors'
                            title='Delete Project'
                        >
                            <Trash2 className='w-4 h-4 sm:w-5 sm:h-5 text-zinc-400 hover:text-white' />
                        </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className='bg-zinc-900 border-zinc-700 text-white max-w-[95vw] sm:max-w-md p-4 sm:p-6'>
                        <AlertDialogHeader>
                            <AlertDialogTitle className='text-base sm:text-lg'>
                                Delete Project
                            </AlertDialogTitle>
                            <AlertDialogDescription className='text-zinc-400 text-xs sm:text-sm'>
                                Are you sure you want to delete "{project.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className='flex flex-col sm:flex-row gap-2 sm:gap-4'>
                            <AlertDialogCancel className='bg-zinc-700 hover:bg-zinc-600 text-zinc-100 text-xs sm:text-sm rounded transition-colors'>
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => onDelete(project.id)}
                                className='bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm rounded transition-colors'
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

            <div className='flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3'>
                <Folder className='w-4 h-4 sm:w-5 sm:h-5 text-zinc-400 mt-0.5 flex-shrink-0' />
                <h3 className='text-white text-xs sm:text-sm font-medium truncate pr-16 sm:pr-20'>
                    {project.title}
                </h3>
            </div>
            <div className='mb-2 sm:mb-3'>
                <StatusBadge status={project.status} />
            </div>
            <p className='text-zinc-400 text-xs sm:text-sm truncate'>
                {project.dateRange}
            </p>
        </div>
    );
};

const DatePicker = ({
    date,
    onDateChange,
    placeholder = "Pick a date",
    disabled = false,
}: {
    date?: Date;
    onDateChange: (date: Date | undefined) => void;
    placeholder?: string;
    disabled?: boolean;
}) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    disabled={disabled}
                    className='w-full justify-start text-left font-normal bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 hover:text-white focus:border-zinc-500 disabled:opacity-50 text-xs sm:text-sm'
                >
                    <Calendar className='mr-2 w-4 h-4 sm:w-5 sm:h-5' />
                    {date ? (
                        date.toLocaleDateString()
                    ) : (
                        <span className='text-zinc-400'>{placeholder}</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className='w-auto p-0 bg-zinc-900 border-zinc-700'
                align='start'
            >
                <CalendarComponent
                    mode='single'
                    selected={date}
                    onSelect={onDateChange}
                    initialFocus
                    className='bg-zinc-900 text-white'
                    classNames={{
                        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                        month: "space-y-4",
                        caption: "flex justify-center pt-1 relative items-center text-white",
                        caption_label: "text-xs sm:text-sm font-medium text-white",
                        nav: "space-x-1 flex items-center",
                        nav_button: "h-7 w-7 bg-transparent p-0 text-zinc-400 hover:text-white hover:bg-zinc-800",
                        nav_button_previous: "absolute left-1",
                        nav_button_next: "absolute right-1",
                        table: "w-full border-collapse space-y-1",
                        head_row: "flex",
                        head_cell: "text-zinc-500 rounded-md w-9 font-normal text-xs",
                        row: "flex w-full mt-2",
                        cell: "text-center text-xs sm:text-sm p-0 relative [&:has([aria-selected])]:bg-zinc-800 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:z-20",
                        day: "h-9 w-9 p-0 font-normal text-white hover:bg-zinc-800 hover:text-white aria-selected:opacity-100",
                        day_selected: "bg-blue-600 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white",
                        day_today: "bg-zinc-800 text-white",
                        day_outside: "text-zinc-600 opacity-50",
                        day_disabled: "text-zinc-600 opacity-50",
                    }}
                />
            </PopoverContent>
        </Popover>
    );
};

const AddProjectCard = ({ onAdd }: { onAdd: () => void }) => {
    return (
        <button
            type='button'
            onClick={onAdd}
            className='bg-zinc-900 border-2 border-dashed border-zinc-700 hover:bg-zinc-900/60 hover:border-zinc-500 rounded-lg p-3 sm:p-4 transition-colors flex flex-col items-center justify-center min-h-[120px] sm:min-h-[140px]'
        >
            <div className='flex flex-col items-center gap-2 text-zinc-500 hover:text-zinc-300'>
                <span className='text-xl sm:text-2xl'>+</span>
                <span className='text-xs sm:text-sm font-medium'>Add New Project</span>
            </div>
        </button>
    );
};

const KanbanBoard = () => {
    const [activeTab, setActiveTab] = useState<"all" | "personal" | "client">("all");
    const [projectList, setProjectList] = useState<Project[]>(projects);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newProject, setNewProject] = useState<Partial<Project>>({
        title: "",
        status: "not-started",
        category: "personal",
        startDate: undefined,
        endDate: undefined,
    });

    const formatDateRange = (startDate?: Date, endDate?: Date) => {
        if (!startDate) return "";

        const formatDate = (date: Date) => {
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        };

        if (endDate) {
            return `${formatDate(startDate)} → ${formatDate(endDate)}`;
        } else {
            return `${formatDate(startDate)} → Ongoing`;
        }
    };

    const handleEditProject = (project: Project) => {
        setEditingProject(project);
        setIsEditDialogOpen(true);
    };

    const handleDeleteProject = (projectId: string) => {
        setProjectList((prev) => prev.filter((p) => p.id !== projectId));
    };

    const handleSaveProject = () => {
        if (editingProject) {
            const updatedProject = {
                ...editingProject,
                dateRange: formatDateRange(
                    editingProject.startDate,
                    editingProject.endDate
                ),
            };

            setProjectList((prev) =>
                prev.map((p) =>
                    p.id === editingProject.id ? updatedProject : p
                )
            );
            setIsEditDialogOpen(false);
            setEditingProject(null);
        }
    };

    const handleAddProject = () => {
        const defaultCategory = activeTab === "all" ? "personal" : activeTab;
        setNewProject({
            title: "",
            status: "not-started",
            category: defaultCategory,
            startDate: undefined,
            endDate: undefined,
        });
        setIsAddDialogOpen(true);
    };

    const handleSaveNewProject = () => {
        if (newProject.title?.trim()) {
            const projectToAdd: Project = {
                id: Date.now().toString(),
                title: newProject.title.trim(),
                status: newProject.status || "not-started",
                category: newProject.category || "personal",
                startDate: newProject.startDate,
                endDate: newProject.endDate,
                dateRange: formatDateRange(
                    newProject.startDate,
                    newProject.endDate
                ),
            };

            setProjectList((prev) => [...prev, projectToAdd]);
            setIsAddDialogOpen(false);
            setNewProject({
                title: "",
                status: "not-started",
                category: "personal",
                startDate: undefined,
                endDate: undefined,
            });
        }
    };

    const filteredProjects = projectList.filter(
        (project) => activeTab === "all" || project.category === activeTab
    );

    return (
        <div className='max-w-7xl mx-auto min-h-screen bg-zinc-950 text-white'>
            {/* Header */}
            <div className='px-4 sm:px-6 py-4 sm:py-6'>
                <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
                    <div className='w-full sm:w-auto'>
                        <h1 className='text-xl sm:text-2xl md:text-3xl font-light tracking-[0.3em] text-zinc-300'>
                            PROJECTS
                        </h1>
                        <Separator />
                        {/* Navigation Tabs */}
                        <div className='flex items-center gap-2 sm:gap-4 overflow-x-auto w-full sm:w-auto mt-4'>
                            <button
                                type='button'
                                onClick={() => setActiveTab("all")}
                                className={`flex items-center gap-2 px-2 sm:px-4 py-1 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                                    activeTab === "all"
                                        ? "text-white border-b-2 border-white"
                                        : "text-zinc-400 hover:text-zinc-200"
                                }`}
                            >
                                <Folder className='w-4 h-4 sm:w-5 sm:h-5' />
                                <span className='hidden sm:inline'>All Projects</span>
                                <span className='sm:hidden'>All</span>
                            </button>
                            <button
                                type='button'
                                onClick={() => setActiveTab("personal")}
                                className={`flex items-center gap-2 px-2 sm:px-4 py-1 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                                    activeTab === "personal"
                                        ? "text-white border-b-2 border-white"
                                        : "text-zinc-400 hover:text-zinc-200"
                                }`}
                            >
                                <Folder className='w-4 h-4 sm:w-5 sm:h-5' />
                                <span className='hidden sm:inline'>Personal Projects</span>
                                <span className='sm:hidden'>Personal</span>
                            </button>
                            <button
                                type='button'
                                onClick={() => setActiveTab("client")}
                                className={`flex items-center gap-2 px-2 sm:px-4 py-1 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                                    activeTab === "client"
                                        ? "text-white border-b-2 border-white"
                                        : "text-zinc-400 hover:text-zinc-200"
                                }`}
                            >
                                <Folder className='w-4 h-4 sm:w-5 sm:h-5' />
                                <span className='hidden sm:inline'>Client Projects</span>
                                <span className='sm:hidden'>Client</span>
                            </button>
                        </div>
                    </div>
                </div>
                <Separator />
            </div>

            {/* Project Grid */}
            <div className='px-4 sm:px-6 py-4 sm:py-6'>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-4'>
                    {filteredProjects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            onEdit={handleEditProject}
                            onDelete={handleDeleteProject}
                        />
                    ))}
                    <AddProjectCard onAdd={handleAddProject} />
                </div>
            </div>

            {/* Edit Project Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className='bg-zinc-900 border-zinc-700 text-white max-w-[95vw] sm:max-w-md p-4 sm:p-6'>
                    <DialogHeader>
                        <DialogTitle className='text-base sm:text-lg font-medium'>Edit Project</DialogTitle>
                        <DialogDescription className='text-zinc-400 text-xs sm:text-sm'>
                            Make changes to your project details.
                        </DialogDescription>
                    </DialogHeader>

                    {editingProject && (
                        <div className='space-y-4 py-4'>
                            <div className='space-y-2'>
                                <label className='text-xs sm:text-sm font-medium text-zinc-400'>
                                    Project Title
                                </label>
                                <input
                                    type='text'
                                    value={editingProject.title}
                                    onChange={(e) =>
                                        setEditingProject({
                                            ...editingProject,
                                            title: e.target.value,
                                        })
                                    }
                                    className='w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white text-xs sm:text-sm focus:border-zinc-500'
                                    placeholder='Enter project title'
                                />
                            </div>

                            <div className='space-y-2'>
                                <label className='text-xs sm:text-sm font-medium text-zinc-400'>
                                    Status
                                </label>
                                <select
                                    value={editingProject.status}
                                    onChange={(e) =>
                                        setEditingProject({
                                            ...editingProject,
                                            status: e.target.value as Project["status"],
                                        })
                                    }
                                    className='w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white text-xs sm:text-sm focus:border-zinc-500'
                                >
                                    <option value='not-started'>Not Started</option>
                                    <option value='in-progress'>In Progress</option>
                                    <option value='upcoming'>Upcoming</option>
                                    <option value='archived'>Archived</option>
                                </select>
                            </div>

                            <div className='space-y-2'>
                                <label className='text-xs sm:text-sm font-medium text-zinc-400'>
                                    Category
                                </label>
                                <select
                                    value={editingProject.category}
                                    onChange={(e) =>
                                        setEditingProject({
                                            ...editingProject,
                                            category: e.target.value as Project["category"],
                                        })
                                    }
                                    className='w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white text-xs sm:text-sm focus:border-zinc-500'
                                >
                                    <option value='personal'>Personal</option>
                                    <option value='client'>Client</option>
                                </select>
                            </div>

                            <div className='grid grid-cols-2 gap-2 sm:gap-4'>
                                <div className='space-y-2'>
                                    <label className='text-xs sm:text-sm font-medium text-zinc-400'>
                                        Start Date
                                    </label>
                                    <DatePicker
                                        date={editingProject.startDate}
                                        onDateChange={(date) =>
                                            setEditingProject({
                                                ...editingProject,
                                                startDate: date,
                                            })
                                        }
                                        placeholder='Select start date'
                                    />
                                </div>

                                <div className='space-y-2'>
                                    <label className='text-xs sm:text-sm font-medium text-zinc-400'>
                                        End Date
                                    </label>
                                    <DatePicker
                                        date={editingProject.endDate}
                                        onDateChange={(date) =>
                                            setEditingProject({
                                                ...editingProject,
                                                endDate: date,
                                            })
                                        }
                                        placeholder='Select end date (optional)'
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter className='flex flex-col sm:flex-row gap-2 sm:gap-4'>
                        <button
                            type='button'
                            onClick={() => setIsEditDialogOpen(false)}
                            className='px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-100 rounded text-xs sm:text-sm transition-colors'
                        >
                            Cancel
                        </button>
                        <button
                            type='button'
                            onClick={handleSaveProject}
                            className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs sm:text-sm transition-colors'
                        >
                            Save Changes
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Project Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className='bg-zinc-900 border-zinc-700 text-white max-w-[95vw] sm:max-w-md p-4 sm:p-6'>
                    <DialogHeader>
                        <DialogTitle className='text-base sm:text-lg font-medium'>Add New Project</DialogTitle>
                        <DialogDescription className='text-zinc-400 text-xs sm:text-sm'>
                            Create a new project with details.
                        </DialogDescription>
                    </DialogHeader>

                    <div className='space-y-4 py-4'>
                        <div className='space-y-2'>
                            <label className='text-xs sm:text-sm font-medium text-zinc-400'>
                                Project Title
                            </label>
                            <input
                                type='text'
                                value={newProject.title || ""}
                                onChange={(e) =>
                                    setNewProject({
                                        ...newProject,
                                        title: e.target.value,
                                    })
                                }
                                className='w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white text-xs sm:text-sm focus:border-zinc-500'
                                placeholder='Enter project title'
                            />
                        </div>

                        <div className='space-y-2'>
                            <label className='text-xs sm:text-sm font-medium text-zinc-400'>
                                Status
                            </label>
                            <select
                                value={newProject.status || "not-started"}
                                onChange={(e) =>
                                    setNewProject({
                                        ...newProject,
                                        status: e.target.value as Project["status"],
                                    })
                                }
                                className='w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white text-xs sm:text-sm focus:border-zinc-500'
                            >
                                <option value='not-started'>Not Started</option>
                                <option value='in-progress'>In Progress</option>
                                <option value='upcoming'>Upcoming</option>
                                <option value='archived'>Archived</option>
                            </select>
                        </div>

                        <div className='space-y-2'>
                            <label className='text-xs sm:text-sm font-medium text-zinc-400'>
                                Category
                            </label>
                            <select
                                value={newProject.category || "personal"}
                                onChange={(e) =>
                                    setNewProject({
                                        ...newProject,
                                        category: e.target.value as Project["category"],
                                    })
                                }
                                className='w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white text-xs sm:text-sm focus:border-zinc-500'
                            >
                                <option value='personal'>Personal</option>
                                <option value='client'>Client</option>
                            </select>
                        </div>

                        <div className='grid grid-cols-2 gap-2 sm:gap-4'>
                            <div className='space-y-2'>
                                <label className='text-xs sm:text-sm font-medium text-zinc-400'>
                                    Start Date
                                </label>
                                <DatePicker
                                    date={newProject.startDate}
                                    onDateChange={(date) =>
                                        setNewProject({
                                            ...newProject,
                                            startDate: date,
                                        })
                                    }
                                    placeholder='Select start date'
                                />
                            </div>

                            <div className='space-y-2'>
                                <label className='text-xs sm:text-sm font-medium text-zinc-400'>
                                    End Date
                                </label>
                                <DatePicker
                                    date={newProject.endDate}
                                    onDateChange={(date) =>
                                        setNewProject({
                                            ...newProject,
                                            endDate: date,
                                        })
                                    }
                                    placeholder='Select end date (optional)'
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className='flex flex-col sm:flex-row gap-2 sm:gap-4'>
                        <button
                            type='button'
                            onClick={() => setIsAddDialogOpen(false)}
                            className='px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-100 rounded text-xs sm:text-sm transition-colors'
                        >
                            Cancel
                        </button>
                        <button
                            type='button'
                            onClick={handleSaveNewProject}
                            disabled={!newProject.title?.trim()}
                            className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs sm:text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            Add Project
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default KanbanBoard;