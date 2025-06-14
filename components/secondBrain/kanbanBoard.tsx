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
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, isSameDay, isSameMonth, isWithinInterval, subDays } from "date-fns";
import {
    Calendar as CalendarIcon,
    Edit,
    Plus,
    Trash2,
    X
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
    const [activeView, setActiveView] = useState("Today's Tasks");
    const [draggedTask, setDraggedTask] = useState<{
        task: Task;
        sourceColumnId: string;
    } | null>(null);
    const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [_selectedColumnId, setSelectedColumnId] = useState<string>("");
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const [taskTitle, setTaskTitle] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [taskCategory, setTaskCategory] = useState("");
    const [taskCompleted, setTaskCompleted] = useState(false);
    const [taskDate, setTaskDate] = useState<Date>(new Date());

    const [columns, setColumns] = useState<Column[]>([
        {
            id: "jun10",
            title: "Jun 10, 2025",
            date: "2025-06-10",
            tasks: [
                {
                    id: "10",
                    title: "Prepare budget forecast",
                    description:
                        "Compile financial data for Q3 budget planning",
                    completed: false,
                    category: "Finance",
                    date: "2025-06-10",
                },
                {
                    id: "11",
                    title: "Client feedback session",
                    description:
                        "Discuss project updates with key stakeholders",
                    completed: false,
                    category: "Meetings",
                    date: "2025-06-10",
                },
            ],
        },
        {
            id: "jun9",
            title: "Jun 9, 2025",
            date: "2025-06-09",
            tasks: [
                {
                    id: "12",
                    title: "Optimize database queries",
                    description: "Improve performance of backend services",
                    completed: true,
                    category: "Development",
                    date: "2025-06-09",
                },
                {
                    id: "13",
                    title: "Create social media campaign",
                    completed: false,
                    category: "Marketing",
                    date: "2025-06-09",
                },
            ],
        },
        {
            id: "jun8",
            title: "Jun 8, 2025",
            date: "2025-06-08",
            tasks: [
                {
                    id: "14",
                    title: "Update UI components",
                    description: "Refactor button and modal components",
                    completed: false,
                    category: "Design",
                    date: "2025-06-08",
                },
                {
                    id: "15",
                    title: "Security audit",
                    description: "Review system vulnerabilities",
                    completed: true,
                    category: "Security",
                    date: "2025-06-08",
                },
                {
                    id: "16",
                    title: "Team retrospective",
                    completed: false,
                    category: "Meetings",
                    date: "2025-06-08",
                },
            ],
        },
        {
            id: "jun7",
            title: "Jun 7, 2025",
            date: "2025-06-07",
            tasks: [
                {
                    id: "1",
                    title: "Review morning reports",
                    description:
                        "Go through all department reports and summarize key findings",
                    completed: false,
                    category: "Management",
                    date: "2025-06-07",
                },
                {
                    id: "2",
                    title: "Team standup meeting",
                    description: "Daily standup with development team",
                    completed: true,
                    category: "Meetings",
                    date: "2025-06-07",
                },
                {
                    id: "3",
                    title: "Complete project proposal",
                    description: "Finalize the Q3 project proposal document",
                    completed: false,
                    category: "Documentation",
                    date: "2025-06-07",
                },
            ],
        },
        {
            id: "jun6",
            title: "Jun 6, 2025",
            date: "2025-06-06",
            tasks: [
                {
                    id: "5",
                    title: "Finish quarterly review",
                    completed: true,
                    category: "Review",
                    date: "2025-06-06",
                },
                {
                    id: "6",
                    title: "Update website content",
                    completed: false,
                    category: "Marketing",
                    date: "2025-06-06",
                },
            ],
        },
        {
            id: "jun5",
            title: "Jun 5, 2025",
            date: "2025-06-05",
            tasks: [
                {
                    id: "8",
                    title: "Design system documentation",
                    completed: false,
                    category: "Design",
                    date: "2025-06-05",
                },
                {
                    id: "9",
                    title: "Code review for new feature",
                    completed: true,
                    category: "Development",
                    date: "2025-06-05",
                },
            ],
        },
        {
            id: "jun4",
            title: "Jun 4, 2025",
            date: "2025-06-04",
            tasks: [
                {
                    id: "17",
                    title: "Plan sprint goals",
                    description: "Define objectives for next sprint",
                    completed: false,
                    category: "Planning",
                    date: "2025-06-04",
                },
                {
                    id: "18",
                    title: "Test API endpoints",
                    completed: true,
                    category: "Development",
                    date: "2025-06-04",
                },
            ],
        },
        {
            id: "jun3",
            title: "Jun 3, 2025",
            date: "2025-06-03",
            tasks: [
                {
                    id: "19",
                    title: "Create user personas",
                    description: "Develop profiles for target audience",
                    completed: false,
                    category: "Design",
                    date: "2025-06-03",
                },
                {
                    id: "20",
                    title: "Draft press release",
                    completed: false,
                    category: "Marketing",
                    date: "2025-06-03",
                },
                {
                    id: "21",
                    title: "Performance review",
                    completed: true,
                    category: "Management",
                    date: "2025-06-03",
                },
            ],
        },
        {
            id: "jun2",
            title: "Jun 2, 2025",
            date: "2025-06-02",
            tasks: [
                {
                    id: "22",
                    title: "Set up CI/CD pipeline",
                    description: "Configure automated deployment",
                    completed: false,
                    category: "Development",
                    date: "2025-06-02",
                },
                {
                    id: "23",
                    title: "Customer support training",
                    completed: true,
                    category: "Training",
                    date: "2025-06-02",
                },
            ],
        },
        {
            id: "jun1",
            title: "Jun 1, 2025",
            date: "2025-06-01",
            tasks: [
                {
                    id: "24",
                    title: "Monthly team meeting",
                    description: "Discuss monthly goals and progress",
                    completed: true,
                    category: "Meetings",
                    date: "2025-06-01",
                },
                {
                    id: "25",
                    title: "Update documentation",
                    completed: false,
                    category: "Documentation",
                    date: "2025-06-01",
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

    const openAddDialog = useCallback((columnId: string) => {
        setSelectedColumnId(columnId);
        const columnDate = columns.find((col) => col.id === columnId)?.date;
        setTaskDate(columnDate ? new Date(columnDate) : new Date());
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
                const newColumns = [...prevColumns];

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

    const views = ["Today's Tasks", "Day View", "Week View", "Month View"];

    const getFilteredColumns = useCallback(() => {
        const today = new Date();
    

        return columns
            .filter((column) => {
                const columnDate = new Date(column.date);
                switch (activeView) {
                    case "All Tasks":
                        return true;
                    case "Today's Tasks":
                    case "Day View":
                        return isSameDay(columnDate, today);
                    case "Week View":
                        return isWithinInterval(columnDate, {
                            start: subDays(today, 7),
                            end: today,
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

    const TaskDialog = ({ isEdit = false }: { isEdit?: boolean }) => (
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
                    autoFocus
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
                    className='w-full px-3 py-2 bg-zinc-800 border border-zinc-800 rounded text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-600 resize-none'
                />
            </div>

            <div>
                <label className='block text-sm font-medium text-zinc-300 mb-1'>
                    Category
                </label>
                <select
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value)}
                    className='w-full h-9 px-3 py-2 bg-zinc-800 border border-zinc-800 rounded text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-600'
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

            {isEdit && (
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
            )}
        </div>
    );

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
                    </div>

                    <div className='flex space-x-1  rounded p-1'>
                        {["All Tasks", ...views].map((view) => (
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
                                    className={`min-h-fit  rounded-lg border border-zinc-800 transition-colors ${
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
                                            {column.date}
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
                                            onClick={() =>
                                                openAddDialog(column.id)
                                            }
                                            className='w-full p-3 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 rounded text-sm transition-colors cursor-pointer'
                                        >
                                            <div className='flex items-center  space-x-2'>
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

            {(showAddDialog || showEditDialog) && (
                <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
                    <div className='bg-zinc-900 border border-zinc-800 rounded-lg p-6 w-full max-w-md'>
                        <div className='flex items-center justify-between mb-4'>
                            <h2 className='text-lg font-semibold text-zinc-200'>
                                {showAddDialog ? "Add New Task" : "Edit Task"}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowAddDialog(false);
                                    setShowEditDialog(false);
                                    resetForm();
                                }}
                                className='text-zinc-400 hover:text-zinc-200'
                            >
                                <X className='w-5 h-5' />
                            </button>
                        </div>

                        <TaskDialog isEdit={showEditDialog} />

                        <div className='flex space-x-2 mt-6'>
                            <button
                                onClick={
                                    showAddDialog
                                        ? handleAddTask
                                        : handleEditTask
                                }
                                disabled={!taskTitle.trim() || !taskDate}
                                className='flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-sm transition-colors disabled:bg-zinc-800/50 disabled:cursor-not-allowed'
                            >
                                {showAddDialog ? "Add Task" : "Save Changes"}
                            </button>
                            <button
                                onClick={() => {
                                    setShowAddDialog(false);
                                    setShowEditDialog(false);
                                    resetForm();
                                }}
                                className='px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-sm transition-colors'
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <AlertDialog
                open={showDeleteDialog}
                onOpenChange={(open) => {
                    setShowDeleteDialog(open);
                    if (!open) setSelectedTask(null);
                }}
            >
                <AlertDialogContent className='bg-zinc-900 border border-zinc-800 text-zinc-200'>
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