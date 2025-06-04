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
import React, { useState } from "react";
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

const KanbanBoard: React.FC = () => {
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

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [showEventModal, setShowEventModal] = useState(false);
  const [targetColumnId, setTargetColumnId] = useState<string>("");
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [editingTask, setEditingTask] = useState<{ task: Task; columnId: string } | null>(null);
  const [columns, setColumns] = useState<Column[]>(getInitialColumns());
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

  const handleAddEvent = () => {
    if (!newEvent.title.trim()) return;

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
      id: Date.now().toString(),
      title: newEvent.title,
      platform: newEvent.platform1 || (selected.length > 0 ? selected[0] : undefined),
      status: newEvent.status || undefined,
    };

    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.id === targetColumnId ? { ...col, tasks: [...col.tasks, newTask] } : col
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
    if (!newEvent.title.trim()) return;

    if (editingEvent) {
      const updatedEvents = events.map((event) =>
        event.id === editingEvent.id ? { ...event, ...newEvent } : event
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
                        platform: newEvent.platform1 || undefined,
                        status: newEvent.status || undefined,
                      }
                    : task
                ),
              }
            : col
        )
      );
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
        [captureCategory]: prevCaptures[captureCategory].map((capture) =>
          capture.id === editingCapture.id ? { ...capture, text: newCapture } : capture
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

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, task: Task, sourceColumnId: string) => {
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

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, columnId: string) => {
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

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetColumnId: string) => {
    e.preventDefault();
    if (!draggedTask) return;

    const { task, sourceColumnId } = draggedTask;

    setColumns((prevColumns) => {
      const newColumns = prevColumns.map((col) => ({ ...col, tasks: [...col.tasks] }));
      const sourceColumn = newColumns.find((col) => col.id === sourceColumnId);
      const targetColumn = newColumns.find((col) => col.id === targetColumnId);

      if (sourceColumn) {
        const taskIndex = sourceColumn.tasks.findIndex((t) => t.id === task.id);
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
      date: "",
      status: "",
    });
    setSelected([]);
  };

  const editTask = (task: Task, columnId: string) => {
    setEditingTask({ task, columnId });
    setTargetColumnId(columnId);
    setShowEventModal(true);
    setNewEvent({
      title: task.title,
      description: "",
      time: "",
      color: "#3b82f6",
      platform1: task.platform || "",
      platform2: "",
      date: "",
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

  const editCapture = (category: string, capture: { id: string; text: string }) => {
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
        col.id === columnId ? { ...col, tasks: col.tasks.filter((task) => task.id !== taskId) } : col
      )
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
    const allTasks: (Task & { status: string })[] = [];
    columns.forEach((column) => {
      const statusName = column.title.replace(/^[^\s]*\s/, "");
      column.tasks.forEach((task) => {
        allTasks.push({ ...task, status: statusName });
      });
    });
    return allTasks.sort((a, b) => a.title.localeCompare(b.title));
  };

  const toggle = (name: string) => {
    setSelected((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));
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
      date: "",
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
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="p-4">
          <h1 className="text-2xl sm:text-3xl font-light tracking-wider mb-4">MANAGEMENT</h1>
          <div className="h-px bg-zinc-700 mb-4" />
          <div className="mt-4 flex items-center space-x-2">
            <span className="text-lg">#</span>
            <span className="text-lg font-medium">The Architect</span>
          </div>
        </div>

        <div className="p-6 border-zinc-900">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-zinc-400">📝</span>
              <span className="font-medium">Capture Space</span>
            </div>
            <Button
              onClick={() => setShowNewColumnModal(true)}
              className="bg-transparent hover:bg-transparent hover:underline text-white text-sm px-3 py-1"
            >
              + New Column
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
            {Object.keys(captures).map((category) => (
              <div key={category} className="bg-zinc-900 rounded-lg">
                <div className="px-3 py-2 rounded-t-lg text-sm font-medium bg-zinc-900">
                  {category}
                </div>
                <div className="space-y-1 p-2">
                  {captures[category].map((capture) => (
                    <div
                      key={capture.id}
                      className="bg-zinc-800 rounded px-3 py-2 text-sm text-white cursor-pointer hover:bg-zinc-700"
                      onClick={() => editCapture(category, capture)}
                    >
                      {capture.text}
                    </div>
                  ))}
                  <div
                    className="bg-zinc-800 rounded px-3 py-2 text-sm cursor-pointer hover:bg-zinc-800/60"
                    onClick={() => openCaptureModal(category)}
                  >
                    + New Capture
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-zinc-400">⚡</span>
              <button
                onClick={() => setShowListView(false)}
                className={`font-medium transition-colors ${
                  !showListView ? "text-white underline underline-offset-4" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Operation Space
              </button>
              <span className="text-zinc-400">📋</span>
              <button
                onClick={() => setShowListView(true)}
                className={`font-medium transition-colors ${
                  showListView ? "text-white underline underline-offset-4" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Operation Space List
              </button>
            </div>
            {!showListView && (
              <Button
                onClick={() => setShowNewOperationColumnModal(true)}
                className="bg-transparent hover:bg-transparent hover:underline text-white text-sm px-3 py-1"
              >
                + New Column
              </Button>
            )}
          </div>
          <div className="h-px bg-zinc-700 my-4" />

          {showListView ? (
            <div className="rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left p-3 font-medium text-zinc-300">Task</th>
                      <th className="text-left p-3 font-medium text-zinc-300">Author</th>
                      <th className="text-center p-3 font-medium text-zinc-300">Platform 1</th>
                      <th className="text-center p-3 font-medium text-zinc-300">Platform 2</th>
                      <th className="text-left p-3 font-medium text-zinc-300">Date</th>
                      <th className="text-center p-3 font-medium text-zinc-300">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getAllTasks().map((task, index) => (
                      <tr
                        key={task.id}
                        className="border-b border-zinc-700 hover:bg-zinc-700 transition-colors"
                      >
                        <td className="p-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-zinc-400">📄</span>
                            <span className="text-white">{task.title}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-zinc-400">👤</span>
                            <span className="text-zinc-300">The Architect</span>
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          {task.platform && (
                            <div className="flex items-center justify-center space-x-1">
                              <span>{getPlatformIcon(task.platform)}</span>
                              <span className="text-zinc-300">{task.platform}</span>
                            </div>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {task.status && task.status !== task.platform && (
                            <div className="flex items-center justify-center space-x-1">
                              <span>{getPlatformIcon(task.status)}</span>
                              <span className="text-zinc-300">{task.status}</span>
                            </div>
                          )}
                        </td>
                        <td className="p-3 text-zinc-300">December {10 + index}, 2024</td>
                        <td className="p-3 text-center">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              task.status === "Published"
                                ? "bg-green-600 text-green-100"
                                : task.status === "Scheduled"
                                ? "bg-yellow-600 text-yellow-100"
                                : task.status === "Editing"
                                ? "bg-blue-600 text-blue-100"
                                : task.status === "Filming"
                                ? "bg-red-600 text-red-100"
                                : task.status === "Scripting"
                                ? "bg-cyan-600 text-cyan-100"
                                : "bg-purple-600 text-purple-100"
                            }`}
                          >
                            {task.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t border-zinc-700">
                      <td className="p-3" colSpan={6}>
                        <div
                          className="flex items-center space-x-2 cursor-pointer hover:bg-zinc-800 rounded px-3 py-2"
                          onClick={() => columns[0] && addTask(columns[0].id)}
                        >
                          <span className="text-zinc-400">➕</span>
                          <span className="text-zinc-300">Add New Task</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-start">
              {columns.map((column) => (
                <div
                  key={column.id}
                  className={`rounded-lg transition-all duration-200 bg-zinc-900 ${
                    dragOverColumn === column.id ? "ring-2 ring-sky-700 bg-opacity-20" : ""
                  }`}
                  onDragOver={handleDragOver}
                  onDragEnter={(e) => handleDragEnter(e, column.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, column.id)}
                >
                  <div
                    className="rounded-t-lg px-3 py-2 text-sm font-medium flex items-center justify-between"
                    style={{ backgroundColor: column.color }}
                  >
                    <span>{column.title}</span>
                    <button
                      onClick={() => addTask(column.id)}
                      className="text-white hover:bg-black hover:bg-opacity-20 rounded px-1"
                    >
                      +
                    </button>
                  </div>
                  <div
                    className="bg-zinc-900 rounded-b-lg p-2 space-y-2"
                    onDragOver={handleDragOver}
                    onDragEnter={(e) => handleDragEnter(e, column.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, column.id)}
                  >
                    {column.tasks.map((task) => (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task, column.id)}
                        onDragEnd={handleDragEnd}
                        onClick={() => editTask(task, column.id)}
                        className="bg-zinc-800 rounded-lg p-3 cursor-move hover:bg-zinc-800/60 transition-all duration-200 group select-none"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-sm font-medium text-white leading-tight flex-1">
                            {task.title}
                          </h4>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openDeleteDialog(column.id, task.id);
                                }}
                                className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                              >
                                ×
                              </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription className="text-zinc-400">
                                  This action cannot be undone. This will permanently delete the task "{task.title}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="bg-zinc-800 text-white border-zinc-800 hover:bg-zinc-900">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => taskToDelete && deleteTask(taskToDelete.columnId, taskToDelete.taskId)}
                                  className="bg-red-600 text-white hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                        {task.platform && (
                          <div className="flex items-center space-x-2">
                            <span className="text-xs">{getPlatformIcon(task.platform)}</span>
                            <span className="text-xs text-zinc-400">{task.platform}</span>
                          </div>
                        )}
                        {task.status && (
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs">{getPlatformIcon(task.status)}</span>
                            <span className="text-xs text-zinc-400">{task.status}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <Dialog open={showEventModal} onOpenChange={closeModal}>
            <DialogContent className="bg-zinc-900 border-zinc-700 text-white w-full max-w-md">
              <DialogHeader>
                <DialogTitle className="text-lg font-medium">
                  {editingEvent || editingTask ? "Edit Task" : "Add New Task"}
                </DialogTitle>
                <DialogDescription className="text-zinc-400">
                  {editingEvent || editingTask ? "Update your task details" : "Create a new task for your board"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm text-zinc-400">
                    Title
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    value={newEvent.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewEvent({ ...newEvent, title: e.target.value })
                    }
                    className="bg-zinc-800 border-zinc-700 text-white focus:border-zinc-500"
                    placeholder="Task title"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="platform1" className="text-sm text-zinc-400">
                      Platform 1
                    </Label>
                    <select
                      id="platform1"
                      value={newEvent.platform1}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setNewEvent({ ...newEvent, platform1: e.target.value })
                      }
                      className="w-full bg-zinc-800 border border-zinc-700 text-white focus:border-zinc-500 rounded px-3 py-2 text-sm"
                    >
                      <option value="">Select Platform</option>
                      {platforms.map((platform) => (
                        <option key={platform.name} value={platform.name}>
                          {platform.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="platform2" className="text-sm text-zinc-400">
                      Platform 2
                    </Label>
                    <select
                      id="platform2"
                      value={newEvent.platform2}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setNewEvent({ ...newEvent, platform2: e.target.value })
                      }
                      className="w-full bg-zinc-800 border border-zinc-700 text-white focus:border-zinc-500 rounded px-3 py-2 text-sm"
                    >
                      <option value="">Select Platform</option>
                      {platforms.map((platform) => (
                        <option key={platform.name} value={platform.name}>
                          {platform.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-sm text-zinc-400">
                      Date
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={newEvent.date}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewEvent({ ...newEvent, date: e.target.value })
                      }
                      className="bg-zinc-800 border-zinc-700 text-white focus:border-zinc-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-sm text-zinc-400">
                      Status
                    </Label>
                    <select
                      id="status"
                      value={newEvent.status}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setNewEvent({ ...newEvent, status: e.target.value })
                      }
                      className="w-full bg-zinc-800 border border-zinc-700 text-white focus:border-zinc-500 rounded px-3 py-2 text-sm"
                    >
                      <option value="">Select Status</option>
                      {columns.map((column) => {
                        const statusName = column.title.replace(/^[^\s]*\s/, "");
                        return (
                          <option key={column.id} value={statusName}>
                            {statusName}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <Button
                  onClick={editingEvent || editingTask ? handleUpdateEvent : handleAddEvent}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {editingEvent || editingTask ? "Update Task" : "Add Task"}
                </Button>
                <Button
                  onClick={closeModal}
                  className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white"
                >
                  Cancel
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showCaptureModal} onOpenChange={closeCaptureModal}>
            <DialogContent className="bg-zinc-900 border-zinc-700 text-white w-full max-w-md">
              <DialogHeader>
                <DialogTitle className="text-lg font-medium">
                  {editingCapture ? `Edit ${captureCategory} Capture` : `Add New ${captureCategory} Capture`}
                </DialogTitle>
                <DialogDescription className="text-zinc-400">
                  {editingCapture
                    ? `Update your goal or idea for ${captureCategory}`
                    : `Enter your goal or idea for ${captureCategory}`}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="capture" className="text-sm text-zinc-400">
                    {captureCategory} Goal
                  </Label>
                  <Input
                    id="capture"
                    type="text"
                    value={newCapture}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCapture(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white focus:border-zinc-500"
                    placeholder={`Enter ${captureCategory.toLowerCase()} goal`}
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <Button
                  onClick={handleAddCapture}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {editingCapture ? "Update Capture" : "Add Capture"}
                </Button>
                <Button
                  onClick={closeCaptureModal}
                  className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white"
                >
                  Cancel
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showNewColumnModal} onOpenChange={closeNewColumnModal}>
            <DialogContent className="bg-zinc-900 border-zinc-700 text-white w-full max-w-md">
              <DialogHeader>
                <DialogTitle className="text-lg font-medium">Add New Column</DialogTitle>
                <DialogDescription className="text-zinc-400">
                  Enter the name for the new Capture Space column
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="columnName" className="text-sm text-zinc-400">
                    Column Name
                  </Label>
                  <Input
                    id="columnName"
                    type="text"
                    value={newColumnName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewColumnName(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white focus:border-zinc-500"
                    placeholder="Enter column name"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <Button
                  onClick={handleAddColumn}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Add Column
                </Button>
                <Button
                  onClick={closeNewColumnModal}
                  className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white"
                >
                  Cancel
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showNewOperationColumnModal} onOpenChange={closeNewOperationColumnModal}>
            <DialogContent className="bg-zinc-900 border-zinc-700 text-white w-full max-w-md">
              <DialogHeader>
                <DialogTitle className="text-lg font-medium">Add New Operation Space Column</DialogTitle>
                <DialogDescription className="text-zinc-400">
                  Enter the name and select a color for the new Operation Space column
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="operationColumnName" className="text-sm text-zinc-400">
                    Column Name
                  </Label>
                  <Input
                    id="operationColumnName"
                    type="text"
                    value={newOperationColumnName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewOperationColumnName(e.target.value)
                    }
                    className="bg-zinc-800 border-zinc-700 text-white focus:border-zinc-500"
                    placeholder="Enter column name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="operationColumnColor" className="text-sm text-zinc-400">
                    Column Color
                  </Label>
                  <Input
                    id="operationColumnColor"
                    type="color"
                    value={newOperationColumnColor}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewOperationColumnColor(e.target.value)
                    }
                    className="bg-zinc-800 border-zinc-700 text-white focus:border-zinc-500 h-10"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <Button
                  onClick={handleAddOperationColumn}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Add Column
                </Button>
                <Button
                  onClick={closeNewOperationColumnModal}
                  className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white"
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

export default KanbanBoard;