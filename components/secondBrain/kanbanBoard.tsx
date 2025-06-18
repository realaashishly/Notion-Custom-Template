import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, isSameDay, isSameMonth, isWithinInterval, addDays } from "date-fns";
import {
    CalendarIcon,
    Edit,
    Plus,
    Trash2,
} from "lucide-react";
import React, { useCallback, useState } from "react";

interface Task {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    category: string;
    date: string;
}

interface Column {
    id: string;
    title: string;
    date: string;
    tasks: Task[];
}

const KanbanBoardTask: React.FC = () => {
    const [activeView, setActiveView] = useState("All Tasks");
    const [draggedTask, setDraggedTask] = useState<{
        task: Task;
        sourceColumnId: string;
    } | null>(null);
    const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [, setSelectedColumnId] = useState<string>("");
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const [taskTitle, setTaskTitle] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [taskCategory, setTaskCategory] = useState("");
    const [taskCompleted, setTaskCompleted] = useState(false);
    const [taskDate, setTaskDate] = useState<Date | undefined>(new Date());

    const [columns, setColumns] = useState<Column[]>([
        {
            id: "jun10",
            title: "Jun 10, 2025",
            date: "2025-06-10",
            tasks: [
                {
                    id: "10",
                    title: "Prepare budget forecast",
                    description: "Compile financial data for Q3 budget planning",
                    completed: false,
                    category: "Finance",
                    date: "2025-06-10",
                },
                {
                    id: "11",
                    title: "Client feedback session",
                    description: "Discuss project updates with key stakeholders",
                    completed: false,
                    category: "Meetings",
                    date: "2025-06-10",
                },
            ],
        },
        {
            id: "jun18",
            title: "Jun 18, 2025",
            date: "2025-06-18",
            tasks: [
                {
                    id: "18",
                    title: "Today's meeting",
                    description: "Team standup meeting",
                    completed: false,
                    category: "Meetings",
                    date: "2025-06-18",
                },
            ],
        },
    ]);

    const categories = [
        "Development",
        "Design",
        "Marketing",
        "Management",
        "Documentation",
        "Review",
        "Meetings",
        "Planning",
        "Finance",
        "Security",
        "Training",
    ];

    const resetForm = useCallback(() => {
        setTaskTitle("");
        setTaskDescription("");
        setTaskCategory("");
        setTaskCompleted(false);
        setTaskDate(new Date());
    }, []);

    const toggleTask = useCallback((columnId: string, taskId: string) => {
        setColumns((prev) =>
            prev.map((column) =>
                column.id === columnId
                    ? {
                          ...column,
                          tasks: column.tasks.map((task) =>
                              task.id === taskId
                                  ? { ...task, completed: !task.completed }
                                  : task
                          ),
                      }
                    : column
            )
        );
    }, []);

    const handleTaskDoubleClick = useCallback(
        (columnId: string, taskId: string) => {
            toggleTask(columnId, taskId);
        },
        [toggleTask]
    );

    const handleAddTask = useCallback(() => {
        if (!taskTitle.trim() || !taskDate) return;

        const formattedDate = format(taskDate, "yyyy-MM-dd");
        const columnId =
            columns.find((col) => col.date === formattedDate)?.id ||
            `col-${Date.now()}`;

        const newColumn: Column = {
            id: columnId,
            title: format(taskDate, "MMM d, yyyy"),
            date: formattedDate,
            tasks: [],
        };

        const newTask: Task = {
            id: Date.now().toString(),
            title: taskTitle.trim(),
            description: taskDescription.trim() || undefined,
            completed: taskCompleted,
            category: taskCategory || "General",
            date: formattedDate,
        };

        setColumns((prev) => {
            const columnExists = prev.some((col) => col.date === formattedDate);
            const updatedColumns = columnExists
                ? prev.map((column) =>
                      column.date === formattedDate
                          ? { ...column, tasks: [...column.tasks, newTask] }
                          : column
                  )
                : [...prev, { ...newColumn, tasks: [newTask] }];

            return updatedColumns.sort((a, b) =>
                b.date.localeCompare(a.date)
            );
        });

        resetForm();
        setShowAddDialog(false);
        setSelectedColumnId("");
    }, [taskTitle, taskDescription, taskCategory, taskCompleted, taskDate, columns, resetForm]);

    const handleEditTask = useCallback(() => {
        if (!taskTitle.trim() || !selectedTask || !taskDate) return;

        const formattedDate = format(taskDate, "yyyy-MM-dd");
        const targetColumnId =
            columns.find((col) => col.date === formattedDate)?.id ||
            `col-${Date.now()}`;

        const updatedTask: Task = {
            ...selectedTask,
            title: taskTitle.trim(),
            description: taskDescription.trim() || undefined,
            category: taskCategory || "General",
            completed: taskCompleted,
            date: formattedDate,
        };

        setColumns((prev) => {
            let updatedColumns = prev.map((column) => ({
                ...column,
                tasks: column.tasks.filter((task) => task.id !== selectedTask.id),
            }));

            const columnExists = updatedColumns.some(
                (col) => col.date === formattedDate
            );

            if (!columnExists) {
                updatedColumns = [
                    ...updatedColumns,
                    {
                        id: targetColumnId,
                        title: format(taskDate, "MMM d, yyyy"),
                        date: formattedDate,
                        tasks: [updatedTask],
                    },
                ];
            } else {
                updatedColumns = updatedColumns.map((column) =>
                    column.date === formattedDate
                        ? { ...column, tasks: [...column.tasks, updatedTask] }
                        : column
                );
            }

            return updatedColumns.sort((a, b) => b.date.localeCompare(a.date));
        });

        resetForm();
        setShowEditDialog(false);
        setSelectedTask(null);
    }, [taskTitle, taskDescription, taskCategory, taskCompleted, taskDate, selectedTask, columns, resetForm]);

    const handleDeleteTask = useCallback(() => {
        if (!selectedTask) return;

        setColumns((prev) =>
            prev
                .map((column) => ({
                    ...column,
                    tasks: column.tasks.filter((task) => task.id !== selectedTask.id),
                }))
                .filter((column) => column.tasks.length > 0 || column.date === format(new Date(), "yyyy-MM-dd"))
        );

        setShowDeleteDialog(false);
        setSelectedTask(null);
    }, [selectedTask]);

    const openAddDialog = useCallback((columnId?: string) => {
        if (columnId) {
            setSelectedColumnId(columnId);
            const columnDate = columns.find((col) => col.id === columnId)?.date;
            setTaskDate(columnDate ? new Date(columnDate) : new Date());
        } else {
            setSelectedColumnId("");
            setTaskDate(new Date());
        }
        resetForm();
        setShowAddDialog(true);
    }, [columns, resetForm]);

    const openEditDialog = useCallback((task: Task) => {
        setSelectedTask(task);
        setTaskTitle(task.title);
        setTaskDescription(task.description || "");
        setTaskCategory(task.category);
        setTaskCompleted(task.completed);
        setTaskDate(new Date(task.date));
        setShowEditDialog(true);
    }, []);

    const openDeleteDialog = useCallback((task: Task) => {
        setSelectedTask(task);
        setShowDeleteDialog(true);
    }, []);

    const handleDragStart = useCallback(
        (e: React.DragEvent, task: Task, columnId: string) => {
            setDraggedTask({ task, sourceColumnId: columnId });
            e.dataTransfer.effectAllowed = "move";
        },
        []
    );

    const handleDragOver = useCallback((e: React.DragEvent, columnId: string) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        setDragOverColumn(columnId);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setDragOverColumn(null);
        }
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent, targetColumnId: string, targetIndex?: number) => {
            e.preventDefault();
            setDragOverColumn(null);

            if (!draggedTask) return;

            const { task, sourceColumnId } = draggedTask;
            const targetColumn = columns.find((col) => col.id === targetColumnId);
            if (!targetColumn) return;

            if (sourceColumnId === targetColumnId && targetIndex === undefined) {
                setDraggedTask(null);
                return;
            }

            const updatedTask: Task = {
                ...task,
                date: targetColumn.date,
            };

            setColumns((prevColumns) => {
                let newColumns = [...prevColumns];

                const sourceColumnIndex = newColumns.findIndex(
                    (col) => col.id === sourceColumnId
                );
                const targetColumnIndex = newColumns.findIndex(
                    (col) => col.id === targetColumnId
                );

                if (sourceColumnIndex === -1 || targetColumnIndex === -1)
                    return prevColumns;

                const sourceTasks = [...newColumns[sourceColumnIndex].tasks];
                const taskIndex = sourceTasks.findIndex((t) => t.id === task.id);
                if (taskIndex === -1) return prevColumns;

                sourceTasks.splice(taskIndex, 1);
                newColumns[sourceColumnIndex] = {
                    ...newColumns[sourceColumnIndex],
                    tasks: sourceTasks,
                };

                const targetTasks = [...newColumns[targetColumnIndex].tasks];
                const insertIndex =
                    targetIndex !== undefined ? targetIndex : targetTasks.length;
                targetTasks.splice(insertIndex, 0, updatedTask);

                newColumns[targetColumnIndex] = {
                    ...newColumns[targetColumnIndex],
                    tasks: targetTasks,
                };

                newColumns = newColumns.filter(
                    (col) => col.tasks.length > 0 || col.date === format(new Date(), "yyyy-MM-dd")
                );

                return newColumns.sort((a, b) => b.date.localeCompare(a.date));
            });

            setDraggedTask(null);
        },
        [draggedTask, columns]
    );

    const handleTaskDrop = useCallback(
        (e: React.DragEvent, targetColumnId: string, targetTaskId: string) => {
            e.preventDefault();
            e.stopPropagation();

            if (!draggedTask) return;

            const targetColumn = columns.find((col) => col.id === targetColumnId);
            if (!targetColumn) return;

            const targetTaskIndex = targetColumn.tasks.findIndex(
                (t) => t.id === targetTaskId
            );
            if (targetTaskIndex === -1) return;

            handleDrop(e, targetColumnId, targetTaskIndex);
        },
        [draggedTask, columns, handleDrop]
    );

    const views = ["All Tasks", "Today's Tasks", "Day View", "Week View", "Month View"];

    const getFilteredColumns = useCallback(() => {
        const today = new Date();
        
        return columns
            .filter((column) => {
                const columnDate = new Date(column.date);
                switch (activeView) {
                    case "All Tasks":
                        return true;
                    case "Today's Tasks":
                        return isSameDay(columnDate, today);
                    case "Day View":
                        return isSameDay(columnDate, today);
                    case "Week View":
                        return isWithinInterval(columnDate, {
                            start: today,
                            end: addDays(today, 7),
                        });
                    case "Month View":
                        return isSameMonth(columnDate, today);
                    default:
                        return true;
                }
            })
            .sort((a, b) => b.date.localeCompare(a.date));
    }, [activeView, columns]);

    const filteredColumns = getFilteredColumns();

    return (
        <div className='min-h-screen bg-zinc-950 text-zinc-200'>
            <div className='max-w-7xl mx-auto px-4'>
                <div className='py-6 border-b border-zinc-800'>
                    <div className='flex items-center justify-between mb-6'>
                        <div className='flex items-center space-x-3'>
                            <h1 className='text-2xl font-semibold text-zinc-200'>
                                Task Management
                            </h1>
                        </div>
                        <Button
                            onClick={() => openAddDialog()}
                            className='bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                        >
                            <Plus className='w-4 h-4 mr-2' />
                            Add Task
                        </Button>
                    </div>

                    <div className='flex space-x-1 rounded p-1'>
                        {views.map((view) => (
                            <button
                                key={view}
                                onClick={() => setActiveView(view)}
                                className={`px-4 py-2 text-sm font-medium rounded transition-colors cursor-pointer ${
                                    activeView === view
                                        ? "underline-offset-2 underline text-zinc-200"
                                        : "text-zinc-400 hover:text-zinc-200"
                                }`}
                            >
                                {view}
                            </button>
                        ))}
                    </div>
                </div>

                <div className='py-6'>
                    {filteredColumns.length === 0 ? (
                        <div className='text-center py-12'>
                            <p className='text-zinc-400 text-sm'>
                                No tasks found for {activeView}
                            </p>
                        </div>
                    ) : (
                        <div
                            className='grid gap-4'
                            style={{
                                gridTemplateColumns: `repeat(auto-fill, minmax(300px, 1fr))`,
                            }}
                        >
                            {filteredColumns.map((column) => (
                                <div
                                    key={column.id}
                                    className={`min-h-fit rounded-lg border border-zinc-800 transition-colors ${
                                        dragOverColumn === column.id
                                            ? "border-zinc-600"
                                            : ""
                                    }`}
                                    onDragOver={(e) =>
                                        handleDragOver(e, column.id)
                                    }
                                    onDragLeave={handleDragLeave}
                                    onDrop={(e) => handleDrop(e, column.id)}
                                >
                                    <div className='px-4 py-3 border-b border-zinc-800'>
                                        <h3 className='text-sm font-semibold text-zinc-300'>
                                            {column.title}
                                        </h3>
                                    </div>
                                    <div className='p-4 space-y-2'>
                                        {column.tasks.map((task) => (
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
                                                onDragOver={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                }}
                                                onDrop={(e) =>
                                                    handleTaskDrop(
                                                        e,
                                                        column.id,
                                                        task.id
                                                    )
                                                }
                                                onDoubleClick={() =>
                                                    handleTaskDoubleClick(
                                                        column.id,
                                                        task.id
                                                    )
                                                }
                                                className={`group relative p-3 rounded bg-zinc-900 border border-zinc-800 hover:bg-zinc-800/50 transition-colors ${
                                                    draggedTask?.task.id ===
                                                    task.id
                                                        ? "opacity-50"
                                                        : ""
                                                }`}
                                            >
                                                <div className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1'>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openEditDialog(
                                                                task
                                                            );
                                                        }}
                                                        className='p-1 rounded bg-zinc-800 hover:bg-zinc-700'
                                                    >
                                                        <Edit className='w-3 h-3 text-zinc-400' />
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openDeleteDialog(
                                                                task
                                                            );
                                                        }}
                                                        className='p-1 rounded bg-zinc-800 hover:bg-zinc-700'
                                                    >
                                                        <Trash2 className='w-3 h-3 text-zinc-400' />
                                                    </button>
                                                </div>

                                                <div className='space-y-2'>
                                                    <h4
                                                        className={`text-sm font-medium ${
                                                            task.completed
                                                                ? "text-zinc-500 line-through"
                                                                : "text-zinc-200"
                                                        }`}
                                                    >
                                                        {task.title}
                                                    </h4>

                                                    {task.description && (
                                                        <p className='text-xs text-zinc-400 line-clamp-2'>
                                                            {task.description}
                                                        </p>
                                                    )}

                                                    <div className='flex items-center justify-between'>
                                                        <span className='px-2 py-1 bg-zinc-800 text-zinc-400 text-xs rounded'>
                                                            {task.category}
                                                        </span>
                                                        <span
                                                            className={`text-xs px-2 py-1 rounded ${
                                                                task.completed
                                                                    ? "text-zinc-400 bg-zinc-800"
                                                                    : "text-zinc-400 bg-zinc-800"
                                                            }`}
                                                        >
                                                            {task.completed
                                                                ? "✓ Completed"
                                                                : "⏱ Pending"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        <button
                                            onClick={() => openAddDialog(column.id)}
                                            className='w-full p-3 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 rounded text-sm transition-colors cursor-pointer'
                                        >
                                            <div className='flex items-center space-x-2'>
                                                <Plus className='w-4 h-4' />
                                                <span>New Task</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Dialog open={showAddDialog} onOpenChange={(open) => {
                setShowAddDialog(open);
                if (!open) {
                    resetForm();
                    setSelectedColumnId("");
                }
            }}>
                <DialogContent className='bg-zinc-900 border-zinc-800 text-zinc-200'>
                    <DialogHeader>
                        <DialogTitle>Add New Task</DialogTitle>
                    </DialogHeader>
                    <div className='space-y-4'>
                        <div>
                            <label className='block text-sm font-medium text-zinc-300 mb-1'>
                                Task Title *
                            </label>
                            <input
                                type='text'
                                value={taskTitle}
                                onChange={(e) => setTaskTitle(e.target.value)}
                                placeholder='Enter task title'
                                className='w-full px-3 py-2 bg-zinc-800 border border-zinc-800 rounded text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-600'
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-zinc-300 mb-1'>
                                Task Date *
                            </label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full h-9 justify-start text-left font-normal bg-zinc-800 border-zinc-800 text-zinc-200",
                                            !taskDate && "text-zinc-500"
                                        )}
                                    >
                                        <CalendarIcon className='mr-2 h-4 w-4 text-zinc-400' />
                                        {taskDate ? (
                                            format(taskDate, "PPP")
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className='w-auto p-0 bg-zinc-900 border-zinc-800'>
                                    <Calendar
                                        mode='single'
                                        selected={taskDate}
                                        onSelect={(date) => date && setTaskDate(date)}
                                        initialFocus
                                        className='bg-zinc-900 text-zinc-200'
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-zinc-300 mb-1'>
                                Description
                            </label>
                            <textarea
                                value={taskDescription}
                                onChange={(e) => setTaskDescription(e.target.value)}
                                placeholder='Enter task description'
                                rows={4}
                                className='w-full px-3 py-2 bg-zinc-800 border border-zinc-800 rounded text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zero-600 resize-none'
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-zinc-300 mb-1'>
                                Category
                            </label>
                            <select
                                value={taskCategory}
                                onChange={(e) => setTaskCategory(e.target.value)}
                                className='w-full px-3 py-2 bg-zinc-800 border border-zinc-800 rounded text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-600 h-full'
                            >
                                <option value='' className='text-zinc-500'>
                                    Select category
                                </option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat} className='text-zinc-200'>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant='outline'
                            onClick={() => {
                                setShowAddDialog(false);
                                resetForm();
                                setSelectedColumnId("");
                            }}
                            className='bg-zinc-800 cursor-pointer hover:bg-zinc-700 text-zinc-200 border-zinc-800'
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddTask}
                            disabled={!taskTitle.trim() || !taskDate}
                            className='bg-zinc-800 cursor-pointer hover:bg-zinc-700 text-zinc-200'
                        >
                            Add Task
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showEditDialog} onOpenChange={(open) => {
                setShowEditDialog(open);
                if (!open) {
                    setSelectedTask(null);
                    resetForm();
                }
            }}>
                <DialogContent className='bg-zinc-900 border-zinc-800 text-zinc-200'>
                    <DialogHeader>
                        <DialogTitle>Edit Task</DialogTitle>
                    </DialogHeader>
                    <div className='space-y-4'>
                        <div>
                            <label className='block text-sm font-medium text-zinc-300 mb-1'>
                                Task Title *
                            </label>
                            <input
                                type='text'
                                value={taskTitle}
                                onChange={(e) => setTaskTitle(e.target.value)}
                                placeholder='Enter task title'
                                className='w-full px-3 py-2 bg-zinc-800 border border-zinc-800 rounded text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-600'
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-zinc-300 mb-1'>
                                Task Date *
                            </label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full h-9 justify-start text-left font-normal bg-zinc-800 border-zinc-800 text-zinc-200",
                                            !taskDate && "text-zinc-500"
                                        )}
                                    >
                                        <CalendarIcon className='mr-2 h-4 w-4 text-zinc-400' />
                                        {taskDate ? (
                                            format(taskDate, "PPP")
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className='w-auto p-0 bg-zinc-900 border-zinc-800'>
                                    <Calendar
                                        mode='single'
                                        selected={taskDate}
                                        onSelect={(date) => date && setTaskDate(date)}
                                        initialFocus
                                        className='bg-zinc-900 text-zinc-200'
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-zinc-300 mb-1'>
                                Description
                            </label>
                            <textarea
                                value={taskDescription}
                                onChange={(e) => setTaskDescription(e.target.value)}
                                placeholder='Enter task description'
                                rows={4}
                                className='w-full px-3 py-2 bg-zinc-800 border border-zinc-800 rounded text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zero-600 resize-none'
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-zinc-300 mb-1'>
                                Category
                            </label>
                            <select
                                value={taskCategory}
                                onChange={(e) => setTaskCategory(e.target.value)}
                                className='w-full h-full px-3 py-2 bg-zinc-800 border border-zinc-800 rounded text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-600'
                            >
                                <option value='' className='text-zinc-500'>
                                    Select category
                                </option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat} className='text-zinc-200'>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className='flex items-center'>
                            <input
                                type='checkbox'
                                id='taskCompleted'
                                checked={taskCompleted}
                                onChange={(e) => setTaskCompleted(e.target.checked)}
                                className='mr-2 w-4 h-4 text-zinc-400 bg-zinc-800 border-zinc-600 rounded focus:ring-zinc-600'
                            />
                            <label
                                htmlFor='taskCompleted'
                                className='text-sm text-zinc-300'
                            >
                                Mark as completed
                            </label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant='outline'
                            onClick={() => {
                                setShowEditDialog(false);
                                resetForm();
                            }}
                            className='bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-800'
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleEditTask}
                            disabled={!taskTitle.trim() || !taskDate}
                            className='bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                        >
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog
                open={showDeleteDialog}
                onOpenChange={(open) => {
                    setShowDeleteDialog(open);
                    if (!open) setSelectedTask(null);
                }}
            >
                <AlertDialogContent className='bg-zinc-900 border-zinc-800 text-zinc-200'>
                    <AlertDialogHeader>
                        <AlertDialogTitle className='text-zinc-200'>
                            Are you sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription className='text-zinc-400'>
                            This action cannot be undone. This will permanently
                            delete the task &quot;{selectedTask?.title}&quot;.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className='bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-800'>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteTask}
                            className='bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                        >
                            Delete Task
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default KanbanBoardTask;