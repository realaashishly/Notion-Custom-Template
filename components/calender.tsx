"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { CalendarEvent, Column, Task } from "@/lib/constant";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { getInitialColumns } from "@/data/notionManagement";

// Define platforms array directly to avoid import issues
const platforms = [
  { name: "Instagram", title: "Instagram" },
  { name: "YouTube", title: "YouTube" },
  { name: "X", title: "X" },
  { name: "Threads", title: "Threads" },
];

// Initial events from the calendar image
const initialEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "New Content",
    description: "",
    date: "2025-05-27",
    time: "09:00",
    color: "#3b82f6",
  },
  {
    id: "2",
    title: "Research & Planning",
    description: "",
    date: "2025-05-27",
    time: "14:00",
    color: "#16a34a",
  },
];

const ManagementKanbanBoard: React.FC = () => {
    const [newEvent, setNewEvent] = useState({
        title: "",
        description: "",
        time: "",
        color: "#3b82f6",
        platform1: "",
        platform2: "",
        date: "",
        status: "",
    });

    // Initialize events and selectedDate from localStorage or use initialEvents
    const [events, setEvents] = useState<CalendarEvent[]>(() => {
        if (typeof window !== "undefined") {
            const savedEvents = localStorage.getItem("calendarEvents");
            return savedEvents ? JSON.parse(savedEvents) : initialEvents;
        }
        return initialEvents;
    });

    // Set selectedDate to current date (formatted as YYYY-MM-DD)
    const [selectedDate, setSelectedDate] = useState<string>(() => {
        if (typeof window !== "undefined") {
            const savedDate = localStorage.getItem("selectedDate");
            if (savedDate) return savedDate;
        }
        const today = new Date();
        return today.toISOString().split("T")[0]; // Format as YYYY-MM-DD
    });

    const [selected, setSelected] = useState<string[]>([]);
    const [showEventModal, setShowEventModal] = useState(false);
    const [targetColumnId, setTargetColumnId] = useState<string>("");
    const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
    const [editingTask, setEditingTask] = useState<{
        task: Task;
        columnId: string;
    } | null>(null);
    const [columns, setColumns] = useState<Column[]>(() => {
        const initialCols = getInitialColumns();
        // Initialize columns with tasks from the calendar events
        const tasksFromEvents = initialEvents.map((event) => ({
            id: event.id,
            title: event.title,
            platform: undefined,
            status: undefined,
        }));
        return initialCols.map((col, index) =>
            index === 0 ? { ...col, tasks: tasksFromEvents } : col
        );
    });
    const [draggedTask, setDraggedTask] = useState<{
        task: Task;
        sourceColumnId: string;
    } | null>(null);
    const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
    const [showListView, setShowListView] = useState<boolean>(false);
    const [showCaptureModal, setShowCaptureModal] = useState<boolean>(false);
    const [newCapture, setNewCapture] = useState<string>("");
    const [captureCategory, setCaptureCategory] = useState<string>("");
    const [editingCapture, setEditingCapture] = useState<{
        id: string;
        text: string;
    } | null>(null);
    const [captures, setCaptures] = useState<{
        [key: string]: { id: string; text: string }[];
    }>({
        Ideas: [],
        Thumbnail: [],
        Hashtags: [],
        Giveaway: [],
        Sponsorships: [],
    });
    const [showNewColumnModal, setShowNewColumnModal] = useState<boolean>(false);
    const [newColumnName, setNewColumnName] = useState<string>("");
    const [showNewOperationColumnModal, setShowNewOperationColumnModal] = useState<boolean>(false);
    const [newOperationColumnName, setNewOperationColumnName] = useState<string>("");
    const [newOperationColumnColor, setNewOperationColumnColor] = useState<string>("#3b82f6");
    const [taskToDelete, setTaskToDelete] = useState<{
        columnId: string;
        taskId: string;
    } | null>(null);

    // Persist events and selectedDate to localStorage
    useEffect(() => {
        localStorage.setItem("calendarEvents", JSON.stringify(events));
    }, [events]);

    useEffect(() => {
        localStorage.setItem("selectedDate", selectedDate);
    }, [selectedDate]);

    const handleAddEvent = () => {
        if (!newEvent.title.trim() || !selectedDate) return;

        const event: CalendarEvent = {
            id: Date.now().toString(),
            title: newEvent.title,
            description: newEvent.description,
            date: selectedDate,
            time: newEvent.time,
            color: newEvent.color,
        };
        setEvents([...events, event]);

        const newTask: Task = {
            id: event.id,
            title: newEvent.title,
            platform:
                newEvent.platform1 ||
                (selected.length > 0 ? selected[0] : undefined),
            status: newEvent.status || undefined,
        };

        setColumns((prevColumns) =>
            prevColumns.map((col) =>
                col.id === targetColumnId
                    ? { ...col, tasks: [...col.tasks, newTask] }
                    : col
            )
        );

        setNewEvent({
            title: "",
            description: "",
            time: "",
            color: "#3b82f6",
            platform1: "",
            platform2: "",
            date: "",
            status: "",
        });
        setSelected([]);
        setTargetColumnId("");
        setShowEventModal(false);
    };

    const handleUpdateEvent = () => {
        if (!newEvent.title.trim() || !selectedDate) return;

        if (editingEvent) {
            const updatedEvents = events.map((event) =>
                event.id === editingEvent.id
                    ? { ...event, ...newEvent, date: selectedDate }
                    : event
            );
            setEvents(updatedEvents);
        }

        if (editingTask) {
            setColumns((prevColumns) =>
                prevColumns.map((col) =>
                    col.id === editingTask.columnId
                        ? {
                              ...col,
                              tasks: col.tasks.map((task) =>
                                  task.id === editingTask.task.id
                                      ? {
                                            ...task,
                                            title: newEvent.title,
                                            platform:
                                                newEvent.platform1 || undefined,
                                            status:
                                                newEvent.status || undefined,
                                        }
                                      : task
                              ),
                          }
                        : col
                )
            );

            // Update the corresponding event if it exists
            const correspondingEvent = events.find(
                (event) => event.id === editingTask.task.id
            );
            if (correspondingEvent) {
                const updatedEvents = events.map((event) =>
                    event.id === editingTask.task.id
                        ? {
                              ...event,
                              title: newEvent.title,
                              date: selectedDate,
                              time: newEvent.time,
                              color: newEvent.color,
                          }
                        : event
                );
                setEvents(updatedEvents);
            }
        }

        setNewEvent({
            title: "",
            description: "",
            time: "",
            color: "#3b82f6",
            platform1: "",
            platform2: "",
            date: "",
            status: "",
        });
        setSelected([]);
        setEditingEvent(null);
        setEditingTask(null);
        setTargetColumnId("");
        setShowEventModal(false);
    };

    const handleAddCapture = () => {
        if (!newCapture.trim() || !captureCategory) return;

        if (editingCapture) {
            setCaptures((prevCaptures) => ({
                ...prevCaptures,
                [captureCategory]: prevCaptures[captureCategory].map(
                    (capture) =>
                        capture.id === editingCapture.id
                            ? { ...capture, text: newCapture }
                            : capture
                ),
            }));
        } else {
            setCaptures((prevCaptures) => ({
                ...prevCaptures,
                [captureCategory]: [
                    ...prevCaptures[captureCategory],
                    { id: Date.now().toString(), text: newCapture },
                ],
            }));
        }
        setNewCapture("");
        setCaptureCategory("");
        setEditingCapture(null);
        setShowCaptureModal(false);
    };

    const handleAddColumn = () => {
        if (!newColumnName.trim()) return;
        setCaptures((prevCaptures) => ({
            ...prevCaptures,
            [newColumnName]: [],
        }));
        setNewColumnName("");
        setShowNewColumnModal(false);
    };

    const handleAddOperationColumn = () => {
        if (!newOperationColumnName.trim()) return;
        const newColumn: Column = {
            id: Date.now().toString(),
            title: `📌 ${newOperationColumnName}`,
            color: newOperationColumnColor,
            tasks: [],
        };
        setColumns((prevColumns) => [...prevColumns, newColumn]);
        setNewOperationColumnName("");
        setNewOperationColumnColor("#3b82f6");
        setShowNewOperationColumnModal(false);
    };

    const handleDragStart = (
        e: React.DragEvent<HTMLDivElement>,
        task: Task,
        sourceColumnId: string
    ) => {
        setDraggedTask({ task, sourceColumnId });
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", task.id);
        e.currentTarget.style.opacity = "0.5";
    };

    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.style.opacity = "1";
        setDraggedTask(null);
        setDragOverColumn(null);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDragEnter = (
        e: React.DragEvent<HTMLDivElement>,
        columnId: string
    ) => {
        e.preventDefault();
        setDragOverColumn(columnId);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const rect = e.currentTarget.getBoundingClientRect();
        if (
            e.clientX < rect.left ||
            e.clientX > rect.right ||
            e.clientY < rect.top ||
            e.clientY > rect.bottom
        ) {
            setDragOverColumn(null);
        }
    };

    const handleDrop = (
        e: React.DragEvent<HTMLDivElement>,
        targetColumnId: string
    ) => {
        e.preventDefault();
        if (!draggedTask) return;

        const { task, sourceColumnId } = draggedTask;

        setColumns((prevColumns) => {
            const newColumns = prevColumns.map((col) => ({
                ...col,
                tasks: [...col.tasks],
            }));
            const sourceColumn = newColumns.find(
                (col) => col.id === sourceColumnId
            );
            const targetColumn = newColumns.find(
                (col) => col.id === targetColumnId
            );

            if (sourceColumn) {
                const taskIndex = sourceColumn.tasks.findIndex(
                    (t) => t.id === task.id
                );
                if (taskIndex > -1) sourceColumn.tasks.splice(taskIndex, 1);
            }

            if (targetColumn && sourceColumnId !== targetColumnId) {
                targetColumn.tasks.push(task);
            } else if (sourceColumnId === targetColumnId && sourceColumn) {
                sourceColumn.tasks.push(task);
            }

            return newColumns;
        });

        setDraggedTask(null);
        setDragOverColumn(null);
    };

    const addTask = (columnId: string) => {
        setTargetColumnId(columnId);
        setShowEventModal(true);
        setEditingEvent(null);
        setEditingTask(null);
        setNewEvent({
            title: "",
            description: "",
            time: "",
            color: "#3b82f6",
            platform1: "",
            platform2: "",
            date: selectedDate,
            status: "",
        });
        setSelected([]);
    };

    const editTask = (task: Task, columnId: string) => {
        setEditingTask({ task, columnId });
        setTargetColumnId(columnId);
        setShowEventModal(true);
        const correspondingEvent = events.find((event) => event.id === task.id);
        setNewEvent({
            title: task.title,
            description: correspondingEvent?.description || "",
            time: correspondingEvent?.time || "",
            color: correspondingEvent?.color || "#3b82f6",
            platform1: task.platform || "",
            platform2: "",
            date: selectedDate,
            status: task.status || "",
        });
        setSelected(task.platform ? [task.platform] : []);
    };

    const openCaptureModal = (category: string) => {
        setCaptureCategory(category);
        setShowCaptureModal(true);
        setNewCapture("");
        setEditingCapture(null);
    };

    const editCapture = (
        category: string,
        capture: { id: string; text: string }
    ) => {
        setCaptureCategory(category);
        setEditingCapture(capture);
        setNewCapture(capture.text);
        setShowCaptureModal(true);
    };

    const openDeleteDialog = (columnId: string, taskId: string) => {
        setTaskToDelete({ columnId, taskId });
    };

    const deleteTask = (columnId: string, taskId: string) => {
        setColumns((prevColumns) =>
            prevColumns.map((col) =>
                col.id === columnId
                    ? {
                          ...col,
                          tasks: col.tasks.filter((task) => task.id !== taskId),
                      }
                    : col
            )
        );
        setEvents((prevEvents) =>
            prevEvents.filter((event) => event.id !== taskId)
        );
        setTaskToDelete(null);
    };

    const getPlatformIcon = (platform?: string) => {
        if (!platform) return "";
        switch (platform.toLowerCase()) {
            case "instagram":
                return "📷";
            case "youtube":
                return "📺";
            case "x":
                return "❌";
            case "threads":
                return "🧵";
            default:
                return "🌐";
        }
    };

    const getAllTasks = () => {
        const allTasks: (Task & {
            status: string;
            date: string;
            time?: string;
        })[] = [];
        columns.forEach((column) => {
            const statusName = column.title.replace(/^[^\s]*\s/, "");
            column.tasks.forEach((task) => {
                const event = events.find((e) => e.id === task.id);
                const taskDate = event
                    ? new Date(event.date)
                    : new Date(selectedDate);
                const formattedDate = taskDate.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                });
                allTasks.push({
                    ...task,
                    status: statusName,
                    date: formattedDate,
                    time: event?.time,
                });
            });
        });
        return allTasks.sort((a, b) => a.title.localeCompare(b.title));
    };

    const closeModal = () => {
        setShowEventModal(false);
        setEditingEvent(null);
        setEditingTask(null);
        setTargetColumnId("");
        setNewEvent({
            title: "",
            description: "",
            time: "",
            color: "#3b82f6",
            platform1: "",
            platform2: "",
            date: selectedDate,
            status: "",
        });
        setSelected([]);
    };

    const closeCaptureModal = () => {
        setShowCaptureModal(false);
        setNewCapture("");
        setCaptureCategory("");
        setEditingCapture(null);
    };

    const closeNewColumnModal = () => {
        setShowNewColumnModal(false);
        setNewColumnName("");
    };

    const closeNewOperationColumnModal = () => {
        setShowNewOperationColumnModal(false);
        setNewOperationColumnName("");
        setNewOperationColumnColor("#3b82f6");
    };

    return (
        <div className='bg-zinc-950 text-white min-h-screen'>
            <div className='max-w-7xl mx-auto'>
                <div className='p-4 sm:p-6'>
                    <h1 className='text-xl sm:text-2xl md:text-3xl font-light tracking-[0.3em] mb-4 text-zinc-300'>
                        MANAGEMENT
                    </h1>
                    <div className='h-px bg-zinc-700 mb-4' />
                    <div className='mt-4 flex items-center space-x-2'>
                        <span className='text-lg sm:text-xl text-zinc-400'>#</span>
                        <span className='text-lg sm:text-xl font-medium'>
                            The Architect
                        </span>
                    </div>
                </div>

                <div className='p-4 sm:p-6 border-zinc-900'>
                    <div className='flex items-center justify-between mb-4'>
                        <div className='flex items-center space-x-2'>
                            <span className='text-lg sm:text-xl text-zinc-400'>📝</span>
                            <span className='font-medium text-sm sm:text-base'>Capture Space</span>
                        </div>
                        <Button
                            onClick={() => setShowNewColumnModal(true)}
                            className='bg-zinc-800 hover:bg-zinc-700 text-white text-xs sm:text-sm px-3 py-1'
                        >
                            + New Column
                        </Button>
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4 items-start overflow-auto'>
                        {Object.keys(captures).map((category) => (
                            <div
                                key={category}
                                className='bg-zinc-900 rounded-lg min-h-[6rem] sm:min-h-[8rem]'
                            >
                                <div className='px-3 py-2 rounded-t-lg text-xs sm:text-sm font-medium bg-zinc-900'>
                                    {category}
                                </div>
                                <div className='space-y-1 p-2'>
                                    {captures[category].map((capture) => (
                                        <div
                                            key={capture.id}
                                            className='bg-zinc-800 rounded px-3 py-2 text-xs sm:text-sm text-white cursor-pointer hover:bg-zinc-700'
                                            onClick={() =>
                                                editCapture(category, capture)
                                            }
                                        >
                                            {capture.text}
                                        </div>
                                    ))}
                                    <div
                                        className='bg-zinc-800 rounded px-3 py-2 text-xs sm:text-sm cursor-pointer hover:bg-zinc-800/60'
                                        onClick={() =>
                                            openCaptureModal(category)
                                        }
                                    >
                                        + New Capture
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className='p-4 sm:p-6'>
                    <div className='flex items-center justify-between mb-4'>
                        <div className='flex items-center space-x-2 sm:space-x-4 flex-wrap gap-2'>
                            <span className='text-lg sm:text-xl text-zinc-400'>⚡</span>
                            <button
                                onClick={() => setShowListView(false)}
                                className={`font-medium text-xs sm:text-sm transition-colors ${
                                    !showListView
                                        ? "text-white underline underline-offset-4"
                                        : "text-zinc-500 hover:text-zinc-300"
                                }`}
                            >
                                Operation Space
                            </button>
                            <span className='text-lg sm:text-xl text-zinc-400'>📋</span>
                            <button
                                onClick={() => setShowListView(true)}
                                className={`font-medium text-xs sm:text-sm transition-colors ${
                                    showListView
                                        ? "text-white underline underline-offset-4"
                                        : "text-zinc-500 hover:text-zinc-300"
                                }`}
                            >
                                Operation Space List
                            </button>
                        </div>
                        {!showListView && (
                            <Button
                                onClick={() =>
                                    setShowNewOperationColumnModal(true)
                                }
                                className='bg-zinc-800 hover:bg-zinc-700 text-white text-xs sm:text-sm px-3 py-1'
                            >
                                + New Column
                            </Button>
                        )}
                    </div>
                    <div className='h-px bg-zinc-700 my-4' />

                    {showListView ? (
                        <div className='rounded-lg overflow-hidden'>
                            <div className='overflow-x-auto'>
                                <table className='w-full text-xs sm:text-sm min-w-[600px]'>
                                    <thead>
                                        <tr className='bg-zinc-800'>
                                            <th className='text-left p-2 sm:p-3 font-medium text-zinc-300'>
                                                Task
                                            </th>
                                            <th className='text-left p-2 sm:p-3 font-medium text-zinc-300'>
                                                Author
                                            </th>
                                            <th className='text-center p-2 sm:p-3 font-medium text-zinc-300'>
                                                Platform 1
                                            </th>
                                            <th className='text-center p-2 sm:p-3 font-medium text-zinc-300'>
                                                Platform 2
                                            </th>
                                            <th className='text-left p-2 sm:p-3 font-medium text-zinc-300'>
                                                Date
                                            </th>
                                            <th className='text-left p-2 sm:p-3 font-medium text-zinc-300'>
                                                Time
                                            </th>
                                            <th className='text-center p-2 sm:p-3 font-medium text-zinc-300'>
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getAllTasks().map((task) => (
                                            <tr
                                                key={task.id}
                                                className='border-b border-zinc-700 hover:bg-zinc-700 transition-colors'
                                            >
                                                <td className='p-2 sm:p-3'>
                                                    <div className='flex items-center space-x-2'>
                                                        <span className='text-zinc-400 text-lg sm:text-xl'>
                                                            📄
                                                        </span>
                                                        <span className='text-white'>
                                                            {task.title}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className='p-2 sm:p-3'>
                                                    <div className='flex items-center space-x-2'>
                                                        <span className='text-zinc-400 text-lg sm:text-xl'>
                                                            👤
                                                        </span>
                                                        <span className='text-zinc-300'>
                                                            The Architect
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className='p-2 sm:p-3 text-center'>
                                                    {task.platform && (
                                                        <div className='flex items-center justify-center space-x-1'>
                                                            <span className='text-lg sm:text-xl'>
                                                                {getPlatformIcon(
                                                                    task.platform
                                                                )}
                                                            </span>
                                                            <span className='text-zinc-300'>
                                                                {task.platform}
                                                            </span>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className='p-2 sm:p-3 text-center'>
                                                    {task.status &&
                                                        task.status !==
                                                            task.platform && (
                                                            <div className='flex items-center justify-center space-x-1'>
                                                                <span className='text-lg sm:text-xl'>
                                                                    {getPlatformIcon(
                                                                        task.status
                                                                    )}
                                                                </span>
                                                                <span className='text-zinc-300'>
                                                                    {
                                                                        task.status
                                                                    }
                                                                </span>
                                                            </div>
                                                        )}
                                                </td>
                                                <td className='p-2 sm:p-3 text-zinc-300'>
                                                    {task.date}
                                                </td>
                                                <td className='p-2 sm:p-3 text-zinc-300'>
                                                    {task.time || "N/A"}
                                                </td>
                                                <td className='p-2 sm:p-3 text-center'>
                                                    <span
                                                        className={`px-2 py-1 rounded text-xs sm:text-sm font-medium ${
                                                            task.status ===
                                                            "Published"
                                                                ? "bg-green-600 text-green-100"
                                                                : task.status ===
                                                                  "Scheduled"
                                                                ? "bg-yellow-600 text-yellow-100"
                                                                : task.status ===
                                                                  "Editing"
                                                                ? "bg-blue-600 text-blue-100"
                                                                : task.status ===
                                                                  "Filming"
                                                                ? "bg-red-600 text-red-100"
                                                                : task.status ===
                                                                  "Scripting"
                                                                ? "bg-cyan-600 text-cyan-100"
                                                                : "bg-purple-600 text-purple-100"
                                                        }`}
                                                    >
                                                        {task.status || "N/A"}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        <tr className='border-t border-zinc-700'>
                                            <td className='p-2 sm:p-3' colSpan={7}>
                                                <div
                                                    className='flex items-center space-x-2 cursor-pointer hover:bg-zinc-800 rounded px-3 py-2'
                                                    onClick={() =>
                                                        columns[0] &&
                                                        addTask(columns[0].id)
                                                    }
                                                >
                                                    <span className='text-zinc-400 text-lg sm:text-xl'>
                                                        ➕
                                                    </span>
                                                    <span className='text-zinc-300 text-xs sm:text-sm'>
                                                        Add New Task
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 items-start overflow-auto'>
                            {columns.map((column) => (
                                <div
                                    key={column.id}
                                    className={`rounded-lg transition-all duration-200 bg-zinc-900 ${
                                        dragOverColumn === column.id
                                            ? "ring-2 ring-sky-700 bg-opacity-20"
                                            : ""
                                    } min-h-[6rem] sm:min-h-[8rem]`}
                                    onDragOver={handleDragOver}
                                    onDragEnter={(e) =>
                                        handleDragEnter(e, column.id)
                                    }
                                    onDragLeave={handleDragLeave}
                                    onDrop={(e) => handleDrop(e, column.id)}
                                >
                                    <div
                                        className='rounded-t-lg px-3 py-2 text-xs sm:text-sm font-medium flex items-center justify-between'
                                        style={{
                                            backgroundColor: column.color,
                                        }}
                                    >
                                        <span>{column.title}</span>
                                        <button
                                            onClick={() => addTask(column.id)}
                                            className='text-white hover:bg-black hover:bg-opacity-20 rounded px-1 text-xs sm:text-sm'
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div
                                        className='bg-zinc-900 rounded-b-lg p-2 sm:p-3 space-y-2 sm:space-y-3 overflow-auto'
                                        onDragOver={handleDragOver}
                                        onDragEnter={(e) =>
                                            handleDragEnter(e, column.id)
                                        }
                                        onDragLeave={handleDragLeave}
                                        onDrop={(e) => handleDrop(e, column.id)}
                                    >
                                        {column.tasks.map((task) => {
                                            const event = events.find(
                                                (e) => e.id === task.id
                                            );
                                            return (
                                                <div
                                                    key={task.id}
                                                    draggable
                                                    onDragStart={(e) =>
                                                        handleDragStart(
                                                            e,
                                                            task,
                                                            column.id
                                                        )
                                                    }
                                                    onDragEnd={handleDragEnd}
                                                    onClick={() =>
                                                        editTask(
                                                            task,
                                                            column.id
                                                        )
                                                    }
                                                    className='bg-zinc-800 rounded-lg p-2 sm:p-3 cursor-move hover:bg-zinc-800/60 transition-colors group select-none min-h-[6rem]'
                                                    style={{
                                                        borderLeft: event
                                                            ? `4px solid ${event.color}`
                                                            : "none",
                                                    }}
                                                >
                                                    <div className='flex justify-between items-start mb-2'>
                                                        <h4 className='text-xs sm:text-sm font-medium text-white leading-tight flex-1'>
                                                            {task.title}
                                                        </h4>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger
                                                                asChild
                                                            >
                                                                <button
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        e.stopPropagation();
                                                                        openDeleteDialog(
                                                                            column.id,
                                                                            task.id
                                                                        );
                                                                    }}
                                                                    className='text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-xs sm:text-sm'
                                                                >
                                                                    ×
                                                                </button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent className='bg-zinc-900 border-zinc-700 text-white w-full max-w-[95vw] sm:max-w-md p-4 sm:p-6'>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle className='text-base sm:text-lg font-medium'>
                                                                        Are you sure?
                                                                    </AlertDialogTitle>
                                                                    <AlertDialogDescription className='text-zinc-400 text-xs sm:text-sm'>
                                                                        This action cannot be undone. This will permanently delete the task &quot;{task.title}&quot;.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter className='flex flex-col sm:flex-row gap-2 sm:gap-4'>
                                                                    <AlertDialogCancel className='bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700 text-xs sm:text-sm py-2'>
                                                                        Cancel
                                                                    </AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() =>
                                                                            taskToDelete &&
                                                                            deleteTask(
                                                                                taskToDelete.columnId,
                                                                                taskToDelete.taskId
                                                                            )
                                                                        }
                                                                        className='bg-red-600 text-white hover:bg-red-700 text-xs sm:text-sm py-2'
                                                                    >
                                                                        Delete
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                    {event && (
                                                        <div className='text-xs sm:text-sm text-zinc-400 mb-1 flex items-center space-x-1'>
                                                            <span className='text-lg sm:text-xl'>🕒</span>
                                                            <span>{event.time}</span>
                                                        </div>
                                                    )}
                                                    {task.platform && (
                                                        <div className='flex items-center space-x-2'>
                                                            <span className='text-lg sm:text-xl'>
                                                                {getPlatformIcon(
                                                                    task.platform
                                                                )}
                                                            </span>
                                                            <span className='text-xs sm:text-sm text-zinc-400'>
                                                                {task.platform}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {task.status && (
                                                        <div className='flex items-center space-x-2 mt-1'>
                                                            <span className='text-lg sm:text-xl'>
                                                                {getPlatformIcon(
                                                                    task.status
                                                                )}
                                                            </span>
                                                            <span className='text-xs sm:text-sm text-zinc-400'>
                                                                {task.status}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <Dialog open={showEventModal} onOpenChange={closeModal}>
                        <DialogContent className='bg-zinc-900 border-zinc-700 text-white w-full max-w-[95vw] sm:max-w-md p-4 sm:p-6'>
                            <DialogHeader>
                                <DialogTitle className='text-base sm:text-lg font-medium'>
                                    {editingEvent || editingTask
                                        ? "Edit Task"
                                        : "Add New Task"}
                                </DialogTitle>
                                <DialogDescription className='text-zinc-400 text-xs sm:text-sm'>
                                    {editingEvent || editingTask
                                        ? "Update your task details"
                                        : "Create a new task for your board"}
                                </DialogDescription>
                            </DialogHeader>
                            <div className='space-y-4'>
                                <div className='space-y-2'>
                                    <Label
                                        htmlFor='title'
                                        className='text-xs sm:text-sm text-zinc-400'
                                    >
                                        Title
                                    </Label>
                                    <Input
                                        id='title'
                                        type='text'
                                        value={newEvent.title}
                                        onChange={(
                                            e: React.ChangeEvent<HTMLInputElement>
                                        ) =>
                                            setNewEvent({
                                                ...newEvent,
                                                title: e.target.value,
                                            })
                                        }
                                        className='bg-zinc-800 border-zinc-700 text-white focus:border-zinc-500 text-xs sm:text-sm'
                                        placeholder='Task title'
                                    />
                                </div>
                                <div className='grid grid-cols-2 gap-2 sm:gap-4'>
                                    <div className='space-y-2'>
                                        <Label
                                            htmlFor='platform1'
                                            className='text-xs sm:text-sm text-zinc-400'
                                        >
                                            Platform 1
                                        </Label>
                                        <select
                                            id='platform1'
                                            value={newEvent.platform1}
                                            onChange={(
                                                e: React.ChangeEvent<HTMLSelectElement>
                                            ) =>
                                                setNewEvent({
                                                    ...newEvent,
                                                    platform1: e.target.value,
                                                })
                                            }
                                            className='w-full bg-zinc-800 border border-zinc-700 text-white focus:border-zinc-500 rounded px-3 py-2 text-xs sm:text-sm'
                                        >
                                            <option value=''>
                                                Select Platform
                                            </option>
                                            {platforms.map((platform) => (
                                                <option
                                                    key={platform.name}
                                                    value={platform.name}
                                                >
                                                    {platform.title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className='space-y-2'>
                                        <Label
                                            htmlFor='platform2'
                                            className='text-xs sm:text-sm text-zinc-400'
                                        >
                                            Platform 2
                                        </Label>
                                        <select
                                            id='platform2'
                                            value={newEvent.platform2}
                                            onChange={(
                                                e: React.ChangeEvent<HTMLSelectElement>
                                            ) =>
                                                setNewEvent({
                                                    ...newEvent,
                                                    platform2: e.target.value,
                                                })
                                            }
                                            className='w-full bg-zinc-800 border border-zinc-700 text-white focus:border-zinc-500 rounded px-3 py-2 text-xs sm:text-sm'
                                        >
                                            <option value=''>
                                                Select Platform
                                            </option>
                                            {platforms.map((platform) => (
                                                <option
                                                    key={platform.name}
                                                    value={platform.name}
                                                >
                                                    {platform.title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className='grid grid-cols-2 gap-2 sm:gap-4'>
                                    <div className='space-y-2'>
                                        <Label
                                            htmlFor='date'
                                            className='text-xs sm:text-sm text-zinc-400'
                                        >
                                            Date
                                        </Label>
                                        <Input
                                            id='date'
                                            type='date'
                                            value={selectedDate}
                                            onChange={(
                                                e: React.ChangeEvent<HTMLInputElement>
                                            ) => {
                                                setSelectedDate(e.target.value);
                                                setNewEvent({
                                                    ...newEvent,
                                                    date: e.target.value,
                                                });
                                            }}
                                            className='bg-zinc-800 border-zinc-700 text-white focus:border-zinc-500 text-xs sm:text-sm'
                                        />
                                    </div>
                                    <div className='space-y-2'>
                                        <Label
                                            htmlFor='time'
                                            className='text-xs sm:text-sm text-zinc-400'
                                        >
                                            Time
                                        </Label>
                                        <Input
                                            id='time'
                                            type='time'
                                            value={newEvent.time}
                                            onChange={(
                                                e: React.ChangeEvent<HTMLInputElement>
                                            ) =>
                                                setNewEvent({
                                                    ...newEvent,
                                                    time: e.target.value,
                                                })
                                            }
                                            className='bg-zinc-800 border-zinc-700 text-white focus:border-zinc-500 text-xs sm:text-sm'
                                        />
                                    </div>
                                </div>
                                <div className='grid grid-cols-2 gap-2 sm:gap-4'>
                                    <div className='space-y-2'>
                                        <Label
                                            htmlFor='color'
                                            className='text-xs sm:text-sm text-zinc-400'
                                        >
                                            Color
                                        </Label>
                                        <Input
                                            id='color'
                                            type='color'
                                            value={newEvent.color}
                                            onChange={(
                                                e: React.ChangeEvent<HTMLInputElement>
                                            ) =>
                                                setNewEvent({
                                                    ...newEvent,
                                                    color: e.target.value,
                                                })
                                            }
                                            className='bg-zinc-800 border-zinc-700 text-white focus:border-zinc-500 h-10'
                                        />
                                    </div>
                                    <div className='space-y-2'>
                                        <Label
                                            htmlFor='status'
                                            className='text-xs sm:text-sm text-zinc-400'
                                        >
                                            Status
                                        </Label>
                                        <select
                                            id='status'
                                            value={newEvent.status}
                                            onChange={(
                                                e: React.ChangeEvent<HTMLSelectElement>
                                            ) =>
                                                setNewEvent({
                                                    ...newEvent,
                                                    status: e.target.value,
                                                })
                                            }
                                            className='w-full bg-zinc-800 border border-zinc-700 text-white focus:border-zinc-500 rounded px-3 py-2 text-xs sm:text-sm'
                                        >
                                            <option value=''>
                                                Select Status
                                            </option>
                                            {columns.map((column) => {
                                                const statusName =
                                                    column.title.replace(
                                                        /^[^\s]*\s/,
                                                        ""
                                                    );
                                                return (
                                                    <option
                                                        key={column.id}
                                                        value={statusName}
                                                    >
                                                        {statusName}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col sm:flex-row gap-2 sm:gap-4 mt-6'>
                                <Button
                                    onClick={
                                        editingEvent || editingTask
                                            ? handleUpdateEvent
                                            : handleAddEvent
                                    }
                                    className='flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm py-2'
                                >
                                    {editingEvent || editingTask
                                        ? "Update Task"
                                        : "Add Task"}
                                </Button>
                                <Button
                                    onClick={closeModal}
                                    className='flex-1 bg-zinc-700 hover:bg-zinc-600 text-white text-xs sm:text-sm py-2'
                                >
                                    Cancel
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Dialog
                        open={showCaptureModal}
                        onOpenChange={closeCaptureModal}
                    >
                        <DialogContent className='bg-zinc-900 border-zinc-700 text-white w-full max-w-[95vw] sm:max-w-md p-4 sm:p-6'>
                            <DialogHeader>
                                <DialogTitle className='text-base sm:text-lg font-medium'>
                                    {editingCapture
                                        ? `Edit ${captureCategory} Capture`
                                        : `Add New ${captureCategory} Capture`}
                                </DialogTitle>
                                <DialogDescription className='text-zinc-400 text-xs sm:text-sm'>
                                    {editingCapture
                                        ? `Update your goal or idea for ${captureCategory}`
                                        : `Enter your goal or idea for ${captureCategory}`}
                                </DialogDescription>
                            </DialogHeader>
                            <div className='space-y-4'>
                                <div className='space-y-2'>
                                    <Label
                                        htmlFor='capture'
                                        className='text-xs sm:text-sm text-zinc-400'
                                    >
                                        {captureCategory} Goal
                                    </Label>
                                    <Input
                                        id='capture'
                                        type='text'
                                        value={newCapture}
                                        onChange={(
                                            e: React.ChangeEvent<HTMLInputElement>
                                        ) => setNewCapture(e.target.value)}
                                        className='bg-zinc-800 border-zinc-700 text-white focus:border-zinc-500 text-xs sm:text-sm'
                                        placeholder={`Enter ${captureCategory.toLowerCase()} goal`}
                                    />
                                </div>
                            </div>
                            <div className='flex flex-col sm:flex-row gap-2 sm:gap-4 mt-6'>
                                <Button
                                    onClick={handleAddCapture}
                                    className='flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm py-2'
                                >
                                    {editingCapture
                                        ? "Update Capture"
                                        : "Add Capture"}
                                </Button>
                                <Button
                                    onClick={closeCaptureModal}
                                    className='flex-1 bg-zinc-700 hover:bg-zinc-600 text-white text-xs sm:text-sm py-2'
                                >
                                    Cancel
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Dialog
                        open={showNewColumnModal}
                        onOpenChange={closeNewColumnModal}
                    >
                        <DialogContent className='bg-zinc-900 border-zinc-700 text-white w-full max-w-[95vw] sm:max-w-md p-4 sm:p-6'>
                            <DialogHeader>
                                <DialogTitle className='text-base sm:text-lg font-medium'>
                                    Add New Column
                                </DialogTitle>
                                <DialogDescription className='text-zinc-400 text-xs sm:text-sm'>
                                    Enter the name for the new Capture Space column
                                </DialogDescription>
                            </DialogHeader>
                            <div className='space-y-4'>
                                <div className='space-y-2'>
                                    <Label
                                        htmlFor='columnName'
                                        className='text-xs sm:text-sm text-zinc-400'
                                    >
                                        Column Name
                                    </Label>
                                    <Input
                                        id='columnName'
                                        type='text'
                                        value={newColumnName}
                                        onChange={(
                                            e: React.ChangeEvent<HTMLInputElement>
                                        ) => setNewColumnName(e.target.value)}
                                        className='bg-zinc-800 border-zinc-700 text-white focus:border-zinc-500 text-xs sm:text-sm'
                                        placeholder='Enter column name'
                                    />
                                </div>
                            </div>
                            <div className='flex flex-col sm:flex-row gap-2 sm:gap-4 mt-6'>
                                <Button
                                    onClick={handleAddColumn}
                                    className='flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm py-2'
                                >
                                    Add Column
                                </Button>
                                <Button
                                    onClick={closeNewColumnModal}
                                    className='flex-1 bg-zinc-700 hover:bg-zinc-600 text-white text-xs sm:text-sm py-2'
                                >
                                    Cancel
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Dialog
                        open={showNewOperationColumnModal}
                        onOpenChange={closeNewOperationColumnModal}
                    >
                        <DialogContent className='bg-zinc-900 border-zinc-700 text-white w-full max-w-[95vw] sm:max-w-md p-4 sm:p-6'>
                            <DialogHeader>
                                <DialogTitle className='text-base sm:text-lg font-medium'>
                                    Add New Operation Space Column
                                </DialogTitle>
                                <DialogDescription className='text-zinc-400 text-xs sm:text-sm'>
                                    Enter the name and select a color for the new Operation Space column
                                </DialogDescription>
                            </DialogHeader>
                            <div className='space-y-4'>
                                <div className='space-y-2'>
                                    <Label
                                        htmlFor='operationColumnName'
                                        className='text-xs sm:text-sm text-zinc-400'
                                    >
                                        Column Name
                                    </Label>
                                    <Input
                                        id='operationColumnName'
                                        type='text'
                                        value={newOperationColumnName}
                                        onChange={(
                                            e: React.ChangeEvent<HTMLInputElement>
                                        ) =>
                                            setNewOperationColumnName(
                                                e.target.value
                                            )
                                        }
                                        className='bg-zinc-800 border-zinc-700 text-white focus:border-zinc-500 text-xs sm:text-sm'
                                        placeholder='Enter column name'
                                    />
                                </div>
                                <div className='space-y-2'>
                                    <Label
                                        htmlFor='operationColumnColor'
                                        className='text-xs sm:text-sm text-zinc-400'
                                    >
                                        Column Color
                                    </Label>
                                    <Input
                                        id='operationColumnColor'
                                        type='color'
                                        value={newOperationColumnColor}
                                        onChange={(
                                            e: React.ChangeEvent<HTMLInputElement>
                                        ) =>
                                            setNewOperationColumnColor(
                                                e.target.value
                                            )
                                        }
                                        className='bg-zinc-800 border-zinc-700 text-white focus:border-zinc-500 h-10'
                                    />
                                </div>
                            </div>
                            <div className='flex flex-col sm:flex-row gap-2 sm:gap-4 mt-6'>
                                <Button
                                    onClick={handleAddOperationColumn}
                                    className='flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm py-2'
                                >
                                    Add Column
                                </Button>
                                <Button
                                    onClick={closeNewOperationColumnModal}
                                    className='flex-1 bg-zinc-700 hover:bg-zinc-600 text-white text-xs sm:text-sm py-2'
                                >
                                    Cancel
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default ManagementKanbanBoard;