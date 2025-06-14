"use client";

import { useState, useEffect } from "react";
import { Circle, Menu, X, Edit2, Trash2 } from "lucide-react";
import Image from "next/image";

// Types
export type TaskStatus = "in-progress" | "done" | "cancelled" | "not-started";

export interface Task {
    id: string;
    name: string;
    status: TaskStatus;
    dateRange: string[];
    daysLeft: {
        text: string;
        icon?: React.ReactNode;
        color: string;
    };
}

// Helper function to calculate days left
function calculateDaysLeft(
    startDate: string,
    endDate: string,
    status: TaskStatus
) {
    const end = new Date(endDate);
    const today = new Date();

    if (status === "done") {
        return { text: "Completed", color: "green" };
    }

    if (status === "cancelled") {
        return { text: "Cancelled", color: "gray" };
    }

    const timeDiff = end.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff > 0) {
        return { text: `${daysDiff} days left`, color: "blue" };
    } else if (daysDiff === 0) {
        return { text: "Due today", color: "yellow" };
    } else {
        return { text: `${Math.abs(daysDiff)} days overdue`, color: "red" };
    }
}

// Sample tasks data
const initialTasks: Task[] = [
    {
        id: "1",
        name: "100 days of No Code",
        status: "in-progress",
        dateRange: ["2024-12-12", "2024-12-12"],
        daysLeft: { text: "172 days overdue", color: "red" },
    },
    {
        id: "2",
        name: "100 days learning 100 books",
        status: "done",
        dateRange: ["2024-09-06", "2024-09-13"],
        daysLeft: { text: "Completed", color: "green" },
    },
    {
        id: "3",
        name: "21 days habit challenge",
        status: "cancelled",
        dateRange: ["2024-12-03", "2024-12-24"],
        daysLeft: { text: "Cancelled", color: "gray" },
    },
    {
        id: "4",
        name: "The Manhattan Challenge",
        status: "not-started",
        dateRange: ["2024-11-01", "2024-12-28"],
        daysLeft: { text: "156 days overdue", color: "red" },
    },
];

// Separator component
const Separator = () => <div className='w-full h-px bg-zinc-700 my-4' />;

const TABS = [
    { key: "all", label: "All Challenges" },
    { key: "ongoing", label: "Ongoing" },
    { key: "gallery", label: "Gallery" },
];

const statusMap = {
    "in-progress": {
        label: "In progress",
        bgClass: "bg-blue-600",
        textClass: "text-blue-100",
        dotClass: "bg-blue-400",
    },
    done: {
        label: "Done & Archived",
        bgClass: "bg-green-600",
        textClass: "text-green-100",
        dotClass: "bg-green-400",
    },
    cancelled: {
        label: "Cancelled",
        bgClass: "bg-red-600",
        textClass: "text-red-100",
        dotClass: "bg-red-400",
    },
    "not-started": {
        label: "Not started",
        bgClass: "bg-zinc-700",
        textClass: "text-zinc-100",
        dotClass: "bg-zinc-400",
    },
} as const;

// Helper function to get status styling
function getStatusStyling(status: TaskStatus) {
    return statusMap[status];
}

// Helper function to get days left color class
function getDaysLeftColorClass(color: string) {
    switch (color) {
        case "red":
            return "text-red-400";
        case "green":
            return "text-green-400";
        case "gray":
            return "text-zinc-400";
        case "blue":
            return "text-blue-400";
        case "yellow":
            return "text-yellow-400";
        default:
            return "text-zinc-400";
    }
}

// Professional filtering: uses strict task status value for ongoing
function getFilteredTasks(tab: string, tasks: Task[]): Task[] {
    if (tab === "ongoing") {
        return tasks.filter((t) => t.status === "in-progress");
    }
    return tasks;
}

// Function to cycle through statuses
const statusOrder: TaskStatus[] = [
    "not-started",
    "in-progress",
    "done",
    "cancelled",
];
function getNextStatus(currentStatus: TaskStatus): TaskStatus {
    const currentIndex = statusOrder.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % statusOrder.length;
    return statusOrder[nextIndex];
}

// Modal component for creating/editing tasks
const TaskModal = ({
    isOpen,
    onClose,
    onSubmit,
    editingTask,
}: {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (task: {
        name: string;
        status: TaskStatus;
        startDate: string;
        endDate: string;
    }) => void;
    editingTask?: Task | null;
}) => {
    const [newTask, setNewTask] = useState({
        name: "",
        status: "not-started" as TaskStatus,
        startDate: "",
        endDate: "",
    });

    const handleSubmit = () => {
        if (!newTask.name || !newTask.startDate || !newTask.endDate) {
            return;
        }
        onSubmit(newTask);
        setNewTask({
            name: "",
            status: "not-started",
            startDate: "",
            endDate: "",
        });
    };

    // Reset form when modal opens/closes or editing task changes
    useEffect(() => {
        if (isOpen) {
            if (editingTask) {
                setNewTask({
                    name: editingTask.name,
                    status: editingTask.status,
                    startDate: editingTask.dateRange[0],
                    endDate: editingTask.dateRange[1],
                });
            } else {
                setNewTask({
                    name: "",
                    status: "not-started",
                    startDate: "",
                    endDate: "",
                });
            }
        }
    }, [isOpen, editingTask]);

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4'>
            <div className='bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-lg p-4 sm:p-6 w-full max-w-[95vw] sm:max-w-md'>
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-base sm:text-lg font-medium text-zinc-100'>
                        {editingTask ? "Edit Task" : "Create New Task"}
                    </h2>
                    <button
                        onClick={onClose}
                        className='text-zinc-400 hover:text-zinc-100'
                        type='button'
                    >
                        <X className='w-4 h-4 sm:w-5 sm:h-5' />
                    </button>
                </div>

                <div className='space-y-4'>
                    <div>
                        <label className='block text-xs sm:text-sm font-medium text-zinc-400 mb-2'>
                            Task Name
                        </label>
                        <input
                            type='text'
                            value={newTask.name}
                            onChange={(e) =>
                                setNewTask({ ...newTask, name: e.target.value })
                            }
                            className='w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-100 text-xs sm:text-sm focus:border-zinc-500'
                            placeholder='Enter task name'
                            required
                        />
                    </div>
                    <div>
                        <label className='block text-xs sm:text-sm font-medium text-zinc-400 mb-2'>
                            Status
                        </label>
                        <select
                            value={newTask.status}
                            onChange={(e) =>
                                setNewTask({
                                    ...newTask,
                                    status: e.target.value as TaskStatus,
                                })
                            }
                            className='w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-100 text-xs sm:text-sm focus:border-zinc-500'
                        >
                            <option value='not-started'>Not started</option>
                            <option value='in-progress'>In progress</option>
                            <option value='done'>Done & Archived</option>
                            <option value='cancelled'>Cancelled</option>
                        </select>
                    </div>
                    <div>
                        <label className='block text-xs sm:text-sm font-medium text-zinc-400 mb-2'>
                            Start Date
                        </label>
                        <input
                            type='date'
                            value={newTask.startDate}
                            onChange={(e) =>
                                setNewTask({
                                    ...newTask,
                                    startDate: e.target.value,
                                })
                            }
                            className='w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-100 text-xs sm:text-sm focus:border-zinc-500'
                            required
                        />
                    </div>
                    <div>
                        <label className='block text-xs sm:text-sm font-medium text-zinc-400 mb-2'>
                            End Date
                        </label>
                        <input
                            type='date'
                            value={newTask.endDate}
                            onChange={(e) =>
                                setNewTask({
                                    ...newTask,
                                    endDate: e.target.value,
                                })
                            }
                            className='w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-100 text-xs sm:text-sm focus:border-zinc-500'
                            required
                        />
                    </div>
                </div>

                <div className='flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 mt-6'>
                    <button
                        type='button'
                        onClick={onClose}
                        className='px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-100 rounded-md text-xs sm:text-sm transition-colors'
                    >
                        Cancel
                    </button>
                    <button
                        type='button'
                        onClick={handleSubmit}
                        className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-zinc-100 rounded-md text-xs sm:text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                        disabled={
                            !newTask.name ||
                            !newTask.startDate ||
                            !newTask.endDate
                        }
                    >
                        {editingTask ? "Update Task" : "Create Task"}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Delete Confirmation Modal
const DeleteModal = ({
    isOpen,
    onClose,
    onConfirm,
    taskName,
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    taskName: string;
}) => {
    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4'>
            <div className='bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-lg p-4 sm:p-6 w-full max-w-[95vw] sm:max-w-md'>
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-base sm:text-lg font-medium text-zinc-100'>
                        Delete Task
                    </h2>
                    <button
                        onClick={onClose}
                        className='text-zinc-400 hover:text-zinc-100'
                        type='button'
                    >
                        <X className='w-4 h-4 sm:w-5 sm:h-5' />
                    </button>
                </div>

                <div className='mb-6'>
                    <p className='text-zinc-400 text-xs sm:text-sm'>
                        Are you sure you want to delete "{taskName}"?
                        This action cannot be undone.
                    </p>
                </div>

                <div className='flex flex-col sm:flex-row justify-end gap-2 sm:gap-4'>
                    <button
                        type='button'
                        onClick={onClose}
                        className='px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-100 rounded-md text-xs sm:text-sm transition-colors'
                    >
                        Cancel
                    </button>
                    <button
                        type='button'
                        onClick={onConfirm}
                        className='px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs sm:text-sm transition-colors'
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function TaskBoard() {
    const [activeTab, setActiveTab] = useState<string>("all");
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

    const filteredTasks = getFilteredTasks(activeTab, tasks);

    const handleCreateTask = (taskData: {
        name: string;
        status: TaskStatus;
        startDate: string;
        endDate: string;
    }) => {
        const daysLeft = calculateDaysLeft(
            taskData.startDate,
            taskData.endDate,
            taskData.status
        );

        if (editingTask) {
            // Update existing task
            const updatedTask: Task = {
                ...editingTask,
                name: taskData.name,
                status: taskData.status,
                dateRange: [taskData.startDate, taskData.endDate],
                daysLeft,
            };

            setTasks(
                tasks.map((task) =>
                    task.id === editingTask.id ? updatedTask : task
                )
            );
            setEditingTask(null);
        } else {
            // Create new task
            const task: Task = {
                id: (
                    Math.max(...tasks.map((t) => parseInt(t.id)), 0) + 1
                ).toString(),
                name: taskData.name,
                status: taskData.status,
                dateRange: [taskData.startDate, taskData.endDate],
                daysLeft,
            };
            setTasks([...tasks, task]);
        }

        setDialogOpen(false);
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setDialogOpen(true);
    };

    const handleDeleteTask = (task: Task) => {
        setTaskToDelete(task);
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (taskToDelete) {
            setTasks(tasks.filter((task) => task.id !== taskToDelete.id));
            setTaskToDelete(null);
            setDeleteModalOpen(false);
        }
    };

    const handleStatusChange = (task: Task) => {
        const newStatus = getNextStatus(task.status);
        const daysLeft = calculateDaysLeft(
            task.dateRange[0],
            task.dateRange[1],
            newStatus
        );
        const updatedTask: Task = {
            ...task,
            status: newStatus,
            daysLeft,
        };
        setTasks(tasks.map((t) => t.id === task.id ? updatedTask : t));
    };

    const NewPageButton = ({ children }: { children: React.ReactNode }) => (
        <button
            onClick={() => {
                setEditingTask(null);
                setDialogOpen(true);
            }}
            className='w-full text-left'
            type='button'
        >
            {children}
        </button>
    );

    return (
        <div className='bg-zinc-950 text-zinc-100 min-h-screen'>
            {/* Header */}
            <div className='px-4 sm:px-6 max-w-7xl mx-auto'>
                <div className='flex items-center justify-between'>
                    <h1 className='text-xl sm:text-2xl md:text-3xl font-light tracking-[0.3em] text-zinc-300'>
                        TASK
                    </h1>        
                </div>
                <Separator />
            </div>

            <div className='max-w-7xl mx-auto flex flex-col lg:flex-row'>
                {/* Main Content */}
                <div className='px-4 sm:px-6 lg:px-8 py-6 lg:py-10 flex-1 min-w-0'>
                    <div className='flex flex-col'>
                        <span className='text-base sm:text-lg tracking-wide font-medium text-zinc-100'>
                            Tasks
                        </span>
                        <Separator />
                        {/* Tabs - Scrollable on mobile */}
                        <div className='flex gap-2 sm:gap-4 items-center overflow-x-auto'>
                            {TABS.map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`px-1 py-1 text-xs sm:text-sm font-medium border-b-2 transition-colors duration-100 whitespace-nowrap ${
                                        activeTab === tab.key
                                            ? "border-zinc-100 text-zinc-100"
                                            : "border-transparent text-zinc-400 hover:text-zinc-200"
                                    } cursor-pointer`}
                                    type='button'
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <Separator />

                        {/* Table or Gallery */}
                        {activeTab !== "gallery" ? (
                            <>
                                {/* Desktop Table View */}
                                <div className='hidden lg:block w-full rounded-lg border border-zinc-700 shadow-lg overflow-x-auto'>
                                    {/* Table header */}
                                    <div className='grid grid-cols-[3fr_1.5fr_2fr_1.5fr_80px] px-4 sm:px-6 py-2 sm:py-3 bg-zinc-900 border-b border-zinc-700 text-zinc-400 text-xs sm:text-sm uppercase tracking-wide font-medium gap-x-4 min-w-[600px]'>
                                        <div>Name</div>
                                        <div>Status</div>
                                        <div>Date Range</div>
                                        <div className='flex items-center gap-1'>
                                            <span>Σ</span>
                                            <span>Days Left</span>
                                        </div>
                                        <div></div>
                                    </div>
                                    {/* Table body */}
                                    {filteredTasks.map((task) => {
                                        const statusStyling = getStatusStyling(
                                            task.status
                                        );
                                        const daysLeftColorClass =
                                            getDaysLeftColorClass(
                                                task.daysLeft.color
                                            );

                                        return (
                                            <div
                                                key={task.id}
                                                className={`grid grid-cols-[3fr_1.5fr_2fr_1.5fr_80px] items-center px-4 sm:px-6 py-2 sm:py-3 bg-zinc-950 border-b last:border-b-0 border-zinc-700 group hover:bg-zinc-900 transition-colors gap-x-4 min-w-[600px]`}
                                            >
                                                {/* Name + icon */}
                                                <div className='flex items-center gap-2 min-w-0'>
                                                    <Circle
                                                        className='text-zinc-500 flex-shrink-0'
                                                        size={18}
                                                    />
                                                    <span className='text-zinc-100 text-xs sm:text-sm font-medium truncate'>
                                                        {task.name}
                                                    </span>
                                                </div>
                                                {/* Status */}
                                                <div className='min-w-0'>
                                                    <button
                                                        onClick={() =>
                                                            handleStatusChange(
                                                                task
                                                            )
                                                        }
                                                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs sm:text-sm font-semibold ${statusStyling.bgClass} ${statusStyling.textClass}`}
                                                        type='button'
                                                    >
                                                        <span
                                                            className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full flex-shrink-0 ${statusStyling.dotClass}`}
                                                        ></span>
                                                        <span className='truncate'>
                                                            {
                                                                statusStyling.label
                                                            }
                                                        </span>
                                                    </button>
                                                </div>
                                                {/* Date Range */}
                                                <div className='text-zinc-400 text-xs sm:text-sm truncate'>
                                                    {task.dateRange.join(" - ")}
                                                </div>
                                                {/* Days Left */}
                                                <div className='min-w-0'>
                                                    <span
                                                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs sm:text-sm font-semibold bg-zinc-800 ${daysLeftColorClass}`}
                                                    >
                                                        {task.daysLeft.icon &&
                                                            task.daysLeft.icon}
                                                        <span className='truncate'>
                                                            {task.daysLeft.text}
                                                        </span>
                                                    </span>
                                                </div>
                                                {/* Actions column */}
                                                <div className='flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                                                    <button
                                                        onClick={() =>
                                                            handleEditTask(task)
                                                        }
                                                        className='p-1 text-zinc-400 hover:text-zinc-100 transition-colors'
                                                        title='Edit task'
                                                        type='button'
                                                    >
                                                        <Edit2 className='w-4 h-4 sm:w-5 sm:h-5' />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteTask(
                                                                task
                                                            )
                                                        }
                                                        className='p-1 text-red-400 hover:text-red-300 transition-colors'
                                                        title='Delete task'
                                                        type='button'
                                                    >
                                                        <Trash2 className='w-4 h-4 sm:w-5 sm:h-5' />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {/* New page row for table view */}
                                    <NewPageButton>
                                        <div className='grid grid-cols-[3fr_1.5fr_2fr_1.5fr_80px] items-center px-4 sm:px-6 py-2 sm:py-3 bg-zinc-900 border-b-0 border-zinc-700 hover:bg-zinc-900/60 cursor-pointer transition-colors gap-x-4 min-w-[600px]'>
                                            <div className='flex items-center gap-2 text-zinc-500 hover:text-zinc-300'>
                                                <span className='text-lg sm:text-xl'>
                                                    +
                                                </span>
                                                <span className='text-xs sm:text-sm'>
                                                    New page
                                                </span>
                                            </div>
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                        </div>
                                    </NewPageButton>
                                </div>

                                {/* Mobile Card View */}
                                <div className='lg:hidden space-y-2 sm:space-y-4'>
                                    {filteredTasks.map((task) => {
                                        const statusStyling = getStatusStyling(
                                            task.status
                                        );
                                        const daysLeftColorClass =
                                            getDaysLeftColorClass(
                                                task.daysLeft.color
                                            );

                                        return (
                                            <div
                                                key={task.id}
                                                className='bg-zinc-900 border border-zinc-700 rounded-lg p-3 sm:p-4 space-y-3'
                                            >
                                                {/* Name + icon */}
                                                <div className='flex items-center gap-2'>
                                                    <Circle
                                                        className='text-zinc-500 flex-shrink-0'
                                                        size={18}
                                                    />
                                                    <span className='text-zinc-100 text-xs sm:text-sm font-medium flex-1 min-w-0 truncate'>
                                                        {task.name}
                                                    </span>
                                                </div>

                                                {/* Status and Days Left */}
                                                <div className='flex flex-wrap gap-2'>
                                                    <button
                                                        onClick={() =>
                                                            handleStatusChange(
                                                                task
                                                            )
                                                        }
                                                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs sm:text-sm font-semibold ${statusStyling.bgClass} ${statusStyling.textClass}`}
                                                        type='button'
                                                    >
                                                        <span
                                                            className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${statusStyling.dotClass}`}
                                                        ></span>
                                                        {statusStyling.label}
                                                    </button>
                                                    <span
                                                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs sm:text-sm font-semibold bg-zinc-800 ${daysLeftColorClass}`}
                                                    >
                                                        {task.daysLeft.icon &&
                                                            task.daysLeft.icon}
                                                        {task.daysLeft.text}
                                                    </span>
                                                </div>

                                                {/* Date Range */}
                                                <div className='text-zinc-400 text-xs sm:text-sm'>
                                                    {task.dateRange.join(" - ")}
                                                </div>

                                                {/* Actions */}
                                                <div className='flex items-center gap-2 pt-2'>
                                                    <button
                                                        onClick={() =>
                                                            handleEditTask(task)
                                                        }
                                                        className='flex items-center gap-1 px-2 py-1 text-xs sm:text-sm bg-zinc-700 hover:bg-zinc-600 text-zinc-100 rounded transition-colors'
                                                    >
                                                        <Edit2 className='w-3 h-3 sm:w-4 sm:h-4' />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteTask(
                                                                task
                                                            )
                                                        }
                                                        className='flex items-center gap-1 px-2 py-1 text-xs sm:text-sm bg-red-600 hover:bg-red-700 text-white rounded transition-colors'
                                                    >
                                                        <Trash2 className='w-3 h-3 sm:w-4 sm:h-4' />
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {/* New page card for mobile view */}
                                    <NewPageButton>
                                        <div className='bg-zinc-900 border-2 border-dashed border-zinc-700 rounded-lg p-3 sm:p-4 flex items-center justify-center text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors'>
                                            <div className='flex items-center gap-2'>
                                                <span className='text-lg sm:text-xl'>
                                                    +
                                                </span>
                                                <span className='text-xs sm:text-sm'>
                                                    New page
                                                </span>
                                            </div>
                                        </div>
                                    </NewPageButton>
                                </div>
                            </>
                        ) : (
                            // GALLERY VIEW - Responsive Grid
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4'>
                                {tasks.map((task) => {
                                    const statusStyling = getStatusStyling(
                                        task.status
                                    );
                                    const daysLeftColorClass =
                                        getDaysLeftColorClass(
                                            task.daysLeft.color
                                        );

                                    return (
                                        <div
                                            key={task.id}
                                            className='flex flex-col justify-between bg-zinc-900 border border-zinc-700 rounded-lg p-3 sm:p-4 min-h-[180px] shadow-md relative group transition-colors cursor-pointer'
                                        >
                                            {/* Actions in top right */}
                                            <div className='absolute top-2 sm:top-3 right-2 sm:right-3 gap-1 hidden group-hover:flex transition'>
                                                <button
                                                    onClick={() =>
                                                        handleEditTask(task)
                                                    }
                                                    className='p-1 text-zinc-400 hover:text-zinc-100 transition-colors bg-zinc-800 rounded cursor-pointer'
                                                    title='Edit task'
                                                    type='button'
                                                >
                                                    <Edit2 className='w-4 h-4 sm:w-5 sm:h-5' />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDeleteTask(task)
                                                    }
                                                    className='p-1 text-red-400 hover:text-red-300 transition-colors bg-zinc-800 rounded cursor-pointer'
                                                    title='Delete task'
                                                    type='button'
                                                >
                                                    <Trash2 className='w-4 h-4 sm:w-5 sm:h-5' />
                                                </button>
                                            </div>

                                            <div className='flex items-start mb-2 pr-16 sm:pr-20'>
                                                <Circle
                                                    className='text-zinc-500 mr-2 mt-0.5 flex shrink-0'
                                                    size={18}
                                                />
                                                <div className='flex-1 min-w-0'>
                                                    <span className='text-zinc-100 text-xs sm:text-sm font-medium block truncate'>
                                                        {task.name}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className='text-zinc-400 text-xs sm:text-sm mb-3 truncate'>
                                                {task.dateRange.join(" - ")}
                                            </div>
                                            <div className='space-y-2'>
                                                <span
                                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs sm:text-sm font-semibold bg-zinc-800 ${daysLeftColorClass}`}
                                                >
                                                    {task.daysLeft.icon &&
                                                        task.daysLeft.icon}
                                                    <span className='truncate'>
                                                        {task.daysLeft.text}
                                                    </span>
                                                </span>
                                                <div>
                                                    <button
                                                        onClick={() =>
                                                            handleStatusChange(
                                                                task
                                                            )
                                                        }
                                                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs sm:text-sm font-semibold ${statusStyling.bgClass} ${statusStyling.textClass}`}
                                                        type='button'
                                                    >
                                                        <span
                                                            className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${statusStyling.dotClass}`}
                                                        ></span>
                                                        <span className='truncate'>
                                                            {
                                                                statusStyling.label
                                                            }
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                {/* New page Card */}
                                <NewPageButton>
                                    <div className='flex flex-col items-center justify-center bg-zinc-900 border-2 border-dashed border-zinc-700 rounded-lg min-h-[180px] p-3 sm:p-4 text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors'>
                                        <span className='text-xl sm:text-2xl mb-2'>+</span>
                                        <span className='text-xs sm:text-sm'>
                                            New page
                                        </span>
                                    </div>
                                </NewPageButton>
                            </div>
                        )}
                        {/* Count Task */}
                        <div className='text-zinc-500 text-xs sm:text-sm mt-4 ml-2'>
                            count{" "}
                            <b className='text-zinc-400'>
                                {filteredTasks.length}
                            </b>
                        </div>
                    </div>
                </div>
            </div>

            {/* Task Modal */}
            <TaskModal
                isOpen={dialogOpen}
                onClose={() => {
                    setDialogOpen(false);
                    setEditingTask(null);
                }}
                onSubmit={handleCreateTask}
                editingTask={editingTask}
            />

            {/* Delete Modal */}
            <DeleteModal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setTaskToDelete(null);
                }}
                onConfirm={confirmDelete}
                taskName={taskToDelete?.name || ""}
            />
        </div>
    );
}