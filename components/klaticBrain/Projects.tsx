import React, { useState } from "react";
import {
    ChevronDown,
    ChevronRight,
    Plus,
    X,
    Edit,
    Trash2,
    User,
    Calendar as CalendarIcon,
} from "lucide-react";
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
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface Task {
    id: string;
    title: string;
    assignee: string;
    status:
        | "In progress"
        | "Archived"
        | "Sample"
        | "Completed"
        | "Upcoming"
        | "On Hold";
    priority: "High Priority" | "Medium Priority" | "Low Priority";
    startDate?: string;
    dueDate?: string;
    followUpTime?: boolean;
    category: string;
}

interface Division {
    id: string;
    name: string;
    tasks: Task[];
    isExpanded: boolean;
}

interface Tab {
    id: string;
    name: string;
    isActive: boolean;
}

interface TaskDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (task: Omit<Task, "id">) => void;
    task?: Task;
    mode: "add" | "edit";
}

const TaskDialog: React.FC<TaskDialogProps> = ({
    isOpen,
    onClose,
    onSave,
    task,
    mode,
}) => {
    const [formData, setFormData] = useState({
        title: task?.title || "",
        assignee: task?.assignee || "",
        status: task?.status || "In progress",
        priority: task?.priority || "Medium Priority",
        startDate: task?.startDate || "",
        dueDate: task?.dueDate || "",
        followUpTime: task?.followUpTime || false,
        category: task?.category || "in-progress",
    });

    const [startDatePickerOpen, setStartDatePickerOpen] = useState(false);
    const [dueDatePickerOpen, setDueDatePickerOpen] = useState(false);

    const handleSave = () => {
        if (formData.title.trim()) {
            onSave(formData as Omit<Task, "id">);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
            <div className='bg-zinc-900 rounded-lg p-6 w-full max-w-lg border border-zinc-800'>
                <h2 className='text-xl font-semibold mb-6 text-white'>
                    {mode === "add" ? "Add New Task" : "Edit Task"}
                </h2>

                <div className='space-y-4'>
                    <div>
                        <label className='block text-sm font-medium text-zinc-300 mb-1'>
                            Title
                        </label>
                        <input
                            type='text'
                            value={formData.title}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    title: e.target.value,
                                }))
                            }
                            className='w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-zinc-600'
                            placeholder='Enter task title'
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-zinc-300 mb-1'>
                            Assignee
                        </label>
                        <input
                            type='text'
                            value={formData.assignee}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    assignee: e.target.value,
                                }))
                            }
                            className='w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-zinc-600'
                            placeholder='Enter assignee name'
                        />
                    </div>

                    <div className='grid grid-cols-2 gap-2'>
                        <div>
                            <label className='block text-sm font-medium text-zinc-300 mb-1'>
                                Status
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        status: e.target
                                            .value as Task["status"],
                                    }))
                                }
                                className='w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-zinc-600'
                            >
                                <option value='In progress'>In progress</option>
                                <option value='Completed'>Completed</option>
                                <option value='Upcoming'>Upcoming</option>
                                <option value='On Hold'>On Hold</option>
                                <option value='Archived'>Archived</option>
                                <option value='Sample'>Sample</option>
                            </select>
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-zinc-300 mb-1'>
                                Priority
                            </label>
                            <select
                                value={formData.priority}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        priority: e.target
                                            .value as Task["priority"],
                                    }))
                                }
                                className='w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-zinc-600'
                            >
                                <option value='High Priority'>
                                    High Priority
                                </option>
                                <option value='Medium Priority'>
                                    Medium Priority
                                </option>
                                <option value='Low Priority'>
                                    Low Priority
                                </option>
                            </select>
                        </div>
                    </div>

                    <div className='grid grid-cols-2 gap-2'>
                        <div>
                            <label className='block text-sm font-medium text-zinc-300 mb-1'>
                                Start Date
                            </label>
                            <Popover
                                open={startDatePickerOpen}
                                onOpenChange={setStartDatePickerOpen}
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        variant='outline'
                                        className='w-full justify-start text-left font-normal bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 hover:text-white'
                                    >
                                        <CalendarIcon className='mr-2 h-4 w-4' />
                                        {formData.startDate ? (
                                            formData.startDate
                                        ) : (
                                            <span className='text-zinc-400'>
                                                Pick a start date
                                            </span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className='w-auto p-0 bg-zinc-900 border-zinc-800'>
                                    <Calendar
                                        mode='single'
                                        selected={
                                            formData.startDate
                                                ? new Date(formData.startDate)
                                                : undefined
                                        }
                                        onSelect={(date) => {
                                            if (date) {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    startDate: format(
                                                        date,
                                                        "MMMM d, yyyy"
                                                    ),
                                                }));
                                            }
                                            setStartDatePickerOpen(false);
                                        }}
                                        initialFocus
                                        className='bg-zinc-900 text-white'
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-zinc-300 mb-1'>
                                Due Date
                            </label>
                            <Popover
                                open={dueDatePickerOpen}
                                onOpenChange={setDueDatePickerOpen}
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        variant='outline'
                                        className='w-full justify-start text-left font-normal bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 hover:text-white'
                                    >
                                        <CalendarIcon className='mr-2 h-4 w-4' />
                                        {formData.dueDate ? (
                                            formData.dueDate
                                        ) : (
                                            <span className='text-zinc-400'>
                                                Pick a due date
                                            </span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className='w-auto p-0 bg-zinc-900 border-zinc-800'>
                                    <Calendar
                                        mode='single'
                                        selected={
                                            formData.dueDate
                                                ? new Date(formData.dueDate)
                                                : undefined
                                        }
                                        onSelect={(date) => {
                                            if (date) {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    dueDate: format(
                                                        date,
                                                        "MMMM d, yyyy"
                                                    ),
                                                }));
                                            }
                                            setDueDatePickerOpen(false);
                                        }}
                                        initialFocus
                                        className='bg-zinc-900 text-white'
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <div className='flex items-center space-x-2'>
                        <input
                            type='checkbox'
                            id='followUpTime'
                            checked={formData.followUpTime}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    followUpTime: e.target.checked,
                                }))
                            }
                            className='rounded border-zinc-700 text-zinc-300 focus:ring-zinc-600'
                        />
                        <label
                            htmlFor='followUpTime'
                            className='text-sm text-zinc-300'
                        >
                            Follow-up Time
                        </label>
                    </div>
                </div>

                <div className='flex justify-end space-x-3 mt-6'>
                    <button
                        onClick={onClose}
                        className='px-4 py-2 text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors'
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className='px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-md transition-colors'
                    >
                        {mode === "add" ? "Add Task" : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
};

const ProjectManagementDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState("in-progress");
    const [tabs, setTabs] = useState<Tab[]>([
        { id: "gallery", name: "Gallery", isActive: false },
        { id: "table", name: "Table", isActive: false },
        { id: "in-progress", name: "In Progress", isActive: true },
        { id: "completed", name: "Completed", isActive: false },
        { id: "upcoming", name: "Upcoming", isActive: false },
        { id: "on-hold", name: "On Hold", isActive: false },
        { id: "archived", name: "Archived", isActive: false },
    ]);

    const [divisions, setDivisions] = useState<Division[]>([
        {
            id: "marketing",
            name: "Marketing Division",
            isExpanded: false,
            tasks: [
                {
                    id: "new-project",
                    title: "New Project",
                    assignee: "Not started",
                    status: "In progress",
                    priority: "Medium Priority",
                    category: "in-progress",
                },
            ],
        },
        {
            id: "tech",
            name: "Tech Division",
            isExpanded: true,
            tasks: [
                {
                    id: "mark",
                    title: "Mark",
                    assignee: "In progress",
                    status: "In progress",
                    priority: "High Priority",
                    startDate: "February 10, 2025",
                    dueDate: "February 14, 2025",
                    category: "in-progress",
                },
                {
                    id: "sunni-arora",
                    title: "Sunni Arora",
                    assignee: "GitHub",
                    status: "In progress",
                    priority: "High Priority",
                    category: "in-progress",
                },
            ],
        },
        {
            id: "creative",
            name: "Creative Division",
            isExpanded: true,
            tasks: [
                {
                    id: "nathan-thumbnails",
                    title: "Nathan - Thumbnails",
                    assignee: "Nathan",
                    status: "In progress",
                    priority: "Medium Priority",
                    followUpTime: true,
                    category: "in-progress",
                },
                {
                    id: "mr-rags",
                    title: "Mr. Rags",
                    assignee: "Rags",
                    status: "In progress",
                    priority: "High Priority",
                    category: "in-progress",
                },
                {
                    id: "karl-mini-hostel",
                    title: "Karl - Mini Hostel",
                    assignee: "Karl",
                    status: "In progress",
                    priority: "High Priority",
                    followUpTime: true,
                    category: "in-progress",
                },
            ],
        },
    ]);

    const [showNewTabInput, setShowNewTabInput] = useState(false);
    const [newTabName, setNewTabName] = useState("");
    const [newDivisionName, setNewDivisionName] = useState("");
    const [showNewDivisionInput, setShowNewDivisionInput] = useState(false);
    const [taskDialog, setTaskDialog] = useState<{
        isOpen: boolean;
        mode: "add" | "edit";
        task?: Task;
        divisionId?: string;
    }>({
        isOpen: false,
        mode: "add",
    });

    const toggleDivision = (divisionId: string) => {
        setDivisions((prev) =>
            prev.map((div) =>
                div.id === divisionId
                    ? { ...div, isExpanded: !div.isExpanded }
                    : div
            )
        );
    };

    const switchTab = (tabId: string) => {
        setActiveTab(tabId);
        setTabs((prev) =>
            prev.map((tab) => ({ ...tab, isActive: tab.id === tabId }))
        );
    };

    const addNewTab = () => {
        if (newTabName.trim()) {
            const newTabId = newTabName.toLowerCase().replace(/\s+/g, "-");
            setTabs((prev) => [
                ...prev,
                {
                    id: newTabId,
                    name: newTabName.trim(),
                    isActive: false,
                },
            ]);
            setNewTabName("");
            setShowNewTabInput(false);
        }
    };

    const addNewDivision = () => {
        if (newDivisionName.trim()) {
            const newDivisionId = newDivisionName
                .toLowerCase()
                .replace(/\s+/g, "-");
            setDivisions((prev) => [
                ...prev,
                {
                    id: newDivisionId,
                    name: newDivisionName.trim(),
                    isExpanded: true,
                    tasks: [],
                },
            ]);
            setNewDivisionName("");
            setShowNewDivisionInput(false);
        }
    };

    const removeTab = (tabId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (tabs.length > 1) {
            setTabs((prev) => prev.filter((tab) => tab.id !== tabId));
            if (activeTab === tabId) {
                const remainingTabs = tabs.filter((tab) => tab.id !== tabId);
                if (remainingTabs.length > 0) {
                    setActiveTab(remainingTabs[0].id);
                }
            }
        }
    };

    const handleAddTask = (divisionId: string) => {
        setTaskDialog({
            isOpen: true,
            mode: "add",
            divisionId,
        });
    };

    const handleEditTask = (task: Task, divisionId: string) => {
        setTaskDialog({
            isOpen: true,
            mode: "edit",
            task,
            divisionId,
        });
    };

    const handleSaveTask = (taskData: Omit<Task, "id">) => {
        if (taskDialog.mode === "add" && taskDialog.divisionId) {
            const newTask: Task = {
                ...taskData,
                id: Date.now().toString(),
            };

            setDivisions((prev) =>
                prev.map((div) =>
                    div.id === taskDialog.divisionId
                        ? { ...div, tasks: [...div.tasks, newTask] }
                        : div
                )
            );
        } else if (
            taskDialog.mode === "edit" &&
            taskDialog.task &&
            taskDialog.divisionId
        ) {
            setDivisions((prev) =>
                prev.map((div) =>
                    div.id === taskDialog.divisionId
                        ? {
                              ...div,
                              tasks: div.tasks.map((task) =>
                                  task.id === taskDialog.task!.id
                                      ? { ...taskData, id: task.id }
                                      : task
                              ),
                          }
                        : div
                )
            );
        }
    };

    const handleDeleteTask = (taskId: string, divisionId: string) => {
        setDivisions((prev) =>
            prev.map((div) =>
                div.id === divisionId
                    ? {
                          ...div,
                          tasks: div.tasks.filter((task) => task.id !== taskId),
                      }
                    : div
            )
        );
    };

    const getFilteredTasks = (tasks: Task[]) => {
        const categoryMap: { [key: string]: string[] } = {
            gallery: [
                "in-progress",
                "completed",
                "archived",
                "upcoming",
                "on-hold",
            ],
            table: [
                "in-progress",
                "completed",
                "archived",
                "upcoming",
                "on-hold",
            ],
            "in-progress": ["in-progress"],
            completed: ["completed"],
            upcoming: ["upcoming"],
            "on-hold": ["on-hold"],
            archived: ["archived"],
        };

        const allowedCategories = categoryMap[activeTab] || ["in-progress"];
        return tasks.filter((task) =>
            allowedCategories.includes(task.category)
        );
    };

    const renderTableView = () => {
        const allTasks = divisions.flatMap((division) =>
            getFilteredTasks(division.tasks)
        );

        if (allTasks.length === 0) {
            return (
                <div className='text-center text-zinc-400 py-10'>
                    No tasks available in this view.
                </div>
            );
        }

        return (
            <div className='overflow-x-auto'>
                <table className='w-full text-sm text-left text-zinc-300'>
                    <thead className='text-xs uppercase bg-zinc-800 text-zinc-400'>
                        <tr>
                            <th className='px-4 py-3'>Project Name</th>
                            <th className='px-4 py-3'>Priority</th>
                            <th className='px-4 py-3'>Status</th>
                            <th className='px-4 py-3'>Clients</th>
                            <th className='px-4 py-3'>Assignee</th>
                            <th className='px-4 py-3'>Budget</th>
                            <th className='px-4 py-3'>Start Date</th>
                            <th className='px-4 py-3'>Created Time</th>
                            <th className='px-4 py-3'>Tasks</th>
                            <th className='px-4 py-3'>Due Date</th>
                            <th className='px-4 py-3'>Final Deliverable</th>
                            <th className='px-4 py-3'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allTasks.map((task) => {
                            const division = divisions.find((div) =>
                                div.tasks.some((t) => t.id === task.id)
                            );
                            return (
                                <tr
                                    key={task.id}
                                    className='border-b border-zinc-800 hover:bg-zinc-800'
                                >
                                    <td className='px-4 py-3'>{task.title}</td>
                                    <td className='px-4 py-3'>
                                        <span className='inline-block px-2 py-1 rounded text-xs font-medium bg-zinc-700 text-white'>
                                            {task.priority}
                                        </span>
                                    </td>
                                    <td className='px-4 py-3'>
                                        <span className='text-xs text-zinc-400'>
                                            ● {task.status}
                                        </span>
                                    </td>
                                    <td className='px-4 py-3'>
                                        {division?.name.split(" ")[0] || "N/A"}
                                    </td>
                                    <td className='px-4 py-3'>
                                        {task.assignee}
                                    </td>
                                    <td className='px-4 py-3'>-</td>
                                    <td className='px-4 py-3'>
                                        {task.startDate || "-"}
                                    </td>
                                    <td className='px-4 py-3'>
                                        {new Date().toLocaleString()}
                                    </td>
                                    <td className='px-4 py-3'>-</td>
                                    <td className='px-4 py-3'>
                                        {task.dueDate || "-"}
                                    </td>
                                    <td className='px-4 py-3'>-</td>
                                    <td className='px-4 py-3'>
                                        <div className='flex items-center space-x-2'>
                                            <button
                                                onClick={() =>
                                                    handleEditTask(
                                                        task,
                                                        division!.id
                                                    )
                                                }
                                                className='p-1 hover:bg-zinc-700 rounded-md'
                                            >
                                                <Edit className='w-4 h-4 text-zinc-400 hover:text-zinc-300' />
                                            </button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <button className='p-1 hover:bg-zinc-700 rounded-md'>
                                                        <Trash2 className='w-4 h-4 text-zinc-400 hover:text-zinc-300' />
                                                    </button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent className='bg-zinc-900 border border-zinc-800'>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle className='text-white'>
                                                            Delete Task
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription className='text-zinc-400'>
                                                            Are you sure you
                                                            want to delete
                                                            &quot;
                                                            {task.title}&quot;?
                                                            This action cannot
                                                            be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel className='bg-zinc-800 text-white hover:bg-zinc-700 border-zinc-700'>
                                                            Cancel
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() =>
                                                                handleDeleteTask(
                                                                    task.id,
                                                                    division!.id
                                                                )
                                                            }
                                                            className='bg-zinc-700 hover:bg-zinc-600 text-white'
                                                        >
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className='min-h-screen bg-zinc-950 text-white p-6'>
            <div className='max-w-7xl mx-auto'>
                {/* Header */}
                <div className='flex items-center justify-between mb-6'>
                    <div className='flex items-center space-x-3'>
                        <h1 className='text-xl sm:text-2xl md:text-3xl font-light tracking-[0.3em] text-zinc-300'>
                            PROJECTS
                        </h1>
                    </div>
                    <button className='px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-md text-sm font-medium transition-colors'>
                        New Project
                    </button>
                </div>

                {/* Navigation Tabs */}
                <div className='border-b border-zinc-800 mb-6'>
                    <div className='flex items-center space-x-2 py-2'>
                        {tabs.map((tab) => (
                            <div key={tab.id} className='relative group'>
                                <button
                                    onClick={() => switchTab(tab.id)}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                                        tab.isActive
                                            ? "underline underline-offset-2 text-white"
                                            : "text-zinc-400  hover:text-zinc-300"
                                    } flex items-center space-x-2`}
                                >
                                    <span>{tab.name}</span>
                                    {tab.id !== "gallery" &&
                                        tab.id !== "table" &&
                                        tabs.length > 1 && (
                                            <X
                                                className='w-4 h-4 text-zinc-400 hover:text-zinc-300'
                                                onClick={(e) =>
                                                    removeTab(tab.id, e)
                                                }
                                            />
                                        )}
                                </button>
                            </div>
                        ))}

                        {showNewTabInput ? (
                            <div className='flex items-center space-x-2'>
                                <input
                                    type='text'
                                    value={newTabName}
                                    onChange={(e) =>
                                        setNewTabName(e.target.value)
                                    }
                                    onKeyPress={(e) =>
                                        e.key === "Enter" && addNewTab()
                                    }
                                    onBlur={() => {
                                        setShowNewTabInput(false);
                                        setNewTabName("");
                                    }}
                                    className='px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-sm w-32 text-white focus:outline-none focus:ring-2 focus:ring-zinc-600'
                                    placeholder='Tab name'
                                    autoFocus
                                />
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowNewTabInput(true)}
                                className='px-3 py-2 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-800 transition-colors'
                            >
                                <Plus className='w-4 h-4' />
                            </button>
                        )}
                    </div>
                </div>

                {/* Table View or Divisions */}
                {activeTab === "table" ? (
                    renderTableView()
                ) : (
                    <div className='space-y-6'>
                        {divisions.map((division) => {
                            const filteredTasks = getFilteredTasks(
                                division.tasks
                            );

                            if (
                                filteredTasks.length === 0 &&
                                !division.isExpanded
                            ) {
                                return null;
                            }

                            return (
                                <div
                                    key={division.id}
                                    className='bg-zinc-900 rounded-lg'
                                >
                                    {/* Division Header */}
                                    <div
                                        className='flex items-center justify-between py-3 px-4 cursor-pointer hover:bg-zinc-800 rounded-md transition-colors'
                                        onClick={() =>
                                            toggleDivision(division.id)
                                        }
                                    >
                                        <div className='flex items-center space-x-3'>
                                            {division.isExpanded ? (
                                                <ChevronDown className='w-5 h-5 text-zinc-400' />
                                            ) : (
                                                <ChevronRight className='w-5 h-5 text-zinc-400' />
                                            )}
                                            <h2 className='text-base font-medium text-zinc-300'>
                                                {division.name}
                                            </h2>
                                        </div>
                                        <div className='flex items-center space-x-2'>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleAddTask(division.id);
                                                }}
                                                className='p-2 hover:bg-zinc-700 rounded-md transition-colors'
                                            >
                                                <Plus className='w-4 h-4 text-zinc-400 hover:text-zinc-300' />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Tasks Grid */}
                                    {division.isExpanded && (
                                        <div className='p-4'>
                                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                                                {filteredTasks.map((task) => (
                                                    <div
                                                        key={task.id}
                                                        className='bg-zinc-800 rounded-lg p-4 h-[230px] flex flex-col border border-zinc-700 hover:bg-zinc-700 transition-colors group'
                                                    >
                                                        <div className='flex items-start justify-between mb-3'>
                                                            <div className='flex items-center space-x-2 min-w-0 flex-1'>
                                                                <User className='w-4 h-4 text-zinc-400 flex-shrink-0' />
                                                                <h3 className='font-medium text-sm text-white truncate'>
                                                                    {task.title}
                                                                </h3>
                                                            </div>
                                                            <div className='flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                                                                <button
                                                                    onClick={() =>
                                                                        handleEditTask(
                                                                            task,
                                                                            division.id
                                                                        )
                                                                    }
                                                                    className='p-1 hover:bg-zinc-600 rounded-md'
                                                                >
                                                                    <Edit className='w-4 h-4 text-zinc-400 hover:text-zinc-300' />
                                                                </button>
                                                                <AlertDialog>
                                                                    <AlertDialogTrigger
                                                                        asChild
                                                                    >
                                                                        <button className='p-1 hover:bg-zinc-600 rounded-md'>
                                                                            <Trash2 className='w-4 h-4 text-zinc-400 hover:text-zinc-300' />
                                                                        </button>
                                                                    </AlertDialogTrigger>
                                                                    <AlertDialogContent className='bg-zinc-900 border border-zinc-800'>
                                                                        <AlertDialogHeader>
                                                                            <AlertDialogTitle className='text-white'>
                                                                                Delete
                                                                                Task
                                                                            </AlertDialogTitle>
                                                                            <AlertDialogDescription className='text-zinc-400'>
                                                                                Are
                                                                                you
                                                                                sure
                                                                                you
                                                                                want
                                                                                to
                                                                                delete
                                                                                &quot;
                                                                                {
                                                                                    task.title
                                                                                }
                                                                                &quot;?
                                                                                This
                                                                                action
                                                                                cannot
                                                                                be
                                                                                undone.
                                                                            </AlertDialogDescription>
                                                                        </AlertDialogHeader>
                                                                        <AlertDialogFooter>
                                                                            <AlertDialogCancel className='bg-zinc-800 text-white hover:bg-zinc-700 border-zinc-700'>
                                                                                Cancel
                                                                            </AlertDialogCancel>
                                                                            <AlertDialogAction
                                                                                onClick={() =>
                                                                                    handleDeleteTask(
                                                                                        task.id,
                                                                                        division.id
                                                                                    )
                                                                                }
                                                                                className='bg-zinc-700 hover:bg-zinc-600 text-white'
                                                                            >
                                                                                Delete
                                                                            </AlertDialogAction>
                                                                        </AlertDialogFooter>
                                                                    </AlertDialogContent>
                                                                </AlertDialog>
                                                            </div>
                                                        </div>

                                                        <div className='mb-3'>
                                                            <span className='text-xs text-zinc-400'>
                                                                ● {task.status}
                                                            </span>
                                                        </div>

                                                        <div className='mb-3'>
                                                            <span className='inline-block px-2 py-1 rounded text-xs font-medium bg-zinc-700 text-white'>
                                                                {task.priority}
                                                            </span>
                                                        </div>

                                                        <div className='flex items-center space-x-2 mb-3 text-xs text-zinc-400'>
                                                            <User className='w-4 h-4' />
                                                            <span className='truncate'>
                                                                {task.assignee}
                                                            </span>
                                                        </div>

                                                        {task.startDate && (
                                                            <div className='flex items-center space-x-2 mb-3 text-xs text-zinc-400'>
                                                                <CalendarIcon className='w-4 h-4' />
                                                                <span className='truncate'>
                                                                    Start:{" "}
                                                                    {
                                                                        task.startDate
                                                                    }
                                                                </span>
                                                            </div>
                                                        )}

                                                        {task.dueDate && (
                                                            <div className='flex items-center space-x-2 mb-3 text-xs text-zinc-400'>
                                                                <CalendarIcon className='w-4 h-4' />
                                                                <span className='truncate'>
                                                                    Due:{" "}
                                                                    {
                                                                        task.dueDate
                                                                    }
                                                                </span>
                                                            </div>
                                                        )}

                                                        {task.followUpTime && (
                                                            <div className='text-xs text-zinc-400 font-medium'>
                                                                Follow-up Time
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}

                                                <div
                                                    onClick={() =>
                                                        handleAddTask(
                                                            division.id
                                                        )
                                                    }
                                                    className='bg-zinc-800 rounded-lg p-4 h-[230px] flex items-center justify-center border-2 border-dashed border-zinc-600 hover:border-zinc-500 transition-colors cursor-pointer'
                                                >
                                                    <div className='text-center text-zinc-400'>
                                                        <Plus className='w-6 h-6 mx-auto mb-2' />
                                                        <p className='text-sm'>
                                                            New Task
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* New Division */}
                        {showNewDivisionInput ? (
                            <div className='flex items-center space-x-2 py-3'>
                                <input
                                    type='text'
                                    value={newDivisionName}
                                    onChange={(e) =>
                                        setNewDivisionName(e.target.value)
                                    }
                                    onKeyPress={(e) =>
                                        e.key === "Enter" && addNewDivision()
                                    }
                                    onBlur={() => {
                                        setShowNewDivisionInput(false);
                                        setNewDivisionName("");
                                    }}
                                    className='px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-sm w-48 text-white focus:outline-none focus:ring-2 focus:ring-zinc-600'
                                    placeholder='Division name'
                                    autoFocus
                                />
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowNewDivisionInput(true)}
                                className='flex items-center space-x-2 text-zinc-400 hover:text-zinc-300 py-3 px-4 hover:bg-zinc-800 rounded-md transition-colors'
                            >
                                <Plus className='w-5 h-5' />
                                <span className='text-sm font-medium'>
                                    New Division
                                </span>
                            </button>
                        )}
                    </div>
                )}
            </div>

            <TaskDialog
                isOpen={taskDialog.isOpen}
                onClose={() => setTaskDialog({ isOpen: false, mode: "add" })}
                onSave={handleSaveTask}
                task={taskDialog.task}
                mode={taskDialog.mode}
            />
        </div>
    );
};

export default ProjectManagementDashboard;
