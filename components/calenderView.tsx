"use client";
import { ChevronLeft, ChevronRight, Edit, Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";

// Event interface
interface CalendarEvent {
    id: string;
    title: string;
    description?: string;
    date: string;
    time?: string;
    color: string;
    completed: boolean;
}

// Mock data for events with some past incomplete tasks
const initialEvents: CalendarEvent[] = [
    {
        id: "1",
        title: "New Content",
        description: "Create new blog content",
        date: "2025-06-10",
        time: "09:00",
        color: "#3b82f6",
        completed: false,
    },
    {
        id: "2",
        title: "Research & Planning",
        description: "Market research for Q2",
        date: "2025-06-12",
        time: "14:00",
        color: "#10b981",
        completed: false,
    },
    {
        id: "3",
        title: "Team Meeting",
        description: "Weekly team sync",
        date: "2025-06-14",
        time: "10:00",
        color: "#ef4444",
        completed: false,
    },
    {
        id: "4",
        title: "Project Review",
        description: "Review project deliverables",
        date: "2025-06-15",
        time: "15:00",
        color: "#3b82f6",
        completed: false,
    },
];

// Dialog Components
const Dialog = ({ open, onOpenChange, children }: { open: boolean; onOpenChange: (open: boolean) => void; children: React.ReactNode }) => {
    if (!open) return null;
    
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => onOpenChange(false)}>
            <div onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};

const DialogContent = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className}>
        {children}
    </div>
);

const DialogHeader = ({ children }: { children: React.ReactNode }) => (
    <div className="mb-4">
        {children}
    </div>
);

const DialogTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <h2 className={className}>
        {children}
    </h2>
);

const DialogDescription = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <p className={className}>
        {children}
    </p>
);

const Label = ({ htmlFor, children, className }: { htmlFor?: string; children: React.ReactNode; className?: string }) => (
    <label htmlFor={htmlFor} className={className}>
        {children}
    </label>
);

const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { className?: string }) => (
    <input className={className} {...props} />
);

const Textarea = ({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { className?: string }) => (
    <textarea className={className} {...props} />
);

const Button = ({ children, onClick, style, className }: { children: React.ReactNode; onClick?: () => void; style?: React.CSSProperties; className?: string }) => (
    <button onClick={onClick} style={style} className={className}>
        {children}
    </button>
);

const CalendarEvents: React.FC = () => {
    // Normalize currentDate to start of day
    const normalizeDate = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };
    const [currentDate, setCurrentDate] = useState(normalizeDate(new Date()));
    const [viewMode, setViewMode] = useState<"weekly" | "monthly">("weekly");
    const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [showEventModal, setShowEventModal] = useState(false);
    const [showEventList, setShowEventList] = useState(false);
    const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
    const [newEvent, setNewEvent] = useState({
        title: "",
        description: "",
        time: "",
    });

    const colors = ["#3b82f6", "#10b981", "#ef4444"];

    // Assign color based on date
    const getColorForDate = (date: string) => {
        const hash = date.split("-").reduce((acc, num) => acc + parseInt(num), 0);
        return colors[hash % colors.length];
    };

    // Get today's date as string
    const getTodayString = () => {
        return formatDate(normalizeDate(new Date()));
    };

    // Get days in month
    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    // Get first day of month (0 = Sunday)
    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    // Get week dates
    const getWeekDates = (date: Date) => {
        const startOfWeek = normalizeDate(date);
        const day = startOfWeek.getDay();
        startOfWeek.setDate(startOfWeek.getDate() - day);

        const weekDates = [];
        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(startOfWeek);
            currentDate.setDate(startOfWeek.getDate() + i);
            weekDates.push(currentDate);
        }
        return weekDates;
    };

    // Format date to YYYY-MM-DD
    const formatDate = (date: Date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    };

    // Get events for a specific date
    const getEventsForDate = (date: string) => {
        return events.filter((event) => event.date === date);
    };

    // Check if date is past
    const isPastDate = (date: string) => {
        return date < getTodayString();
    };

    // Navigation functions
    const navigatePrevious = () => {
        if (viewMode === "weekly") {
            const newDate = new Date(currentDate);
            newDate.setDate(currentDate.getDate() - 7);
            setCurrentDate(normalizeDate(newDate));
        } else {
            const newDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() - 1,
                1
            );
            setCurrentDate(normalizeDate(newDate));
        }
    };

    const navigateNext = () => {
        if (viewMode === "weekly") {
            const newDate = new Date(currentDate);
            newDate.setDate(currentDate.getDate() + 7);
            setCurrentDate(normalizeDate(newDate));
        } else {
            const newDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() + 1,
                1
            );
            setCurrentDate(normalizeDate(newDate));
        }
    };

    const goToToday = () => {
        setCurrentDate(normalizeDate(new Date()));
    };

    // Event management functions
    const handleDateClick = (date: string) => {
        setSelectedDate(date);
        setShowEventList(true);
    };

    const handleAddEvent = () => {
        if (newEvent.title.trim()) {
            const event: CalendarEvent = {
                id: Date.now().toString(),
                title: newEvent.title,
                description: newEvent.description,
                date: selectedDate,
                time: newEvent.time,
                color: getColorForDate(selectedDate),
                completed: false,
            };
            setEvents([...events, event]);
            resetEventForm();
        }
    };

    const handleEditEvent = (event: CalendarEvent) => {
        setEditingEvent(event);
        setNewEvent({
            title: event.title,
            description: event.description || "",
            time: event.time || "",
        });
        setSelectedDate(event.date);
        setShowEventModal(true);
        setShowEventList(false);
    };

    const handleUpdateEvent = () => {
        if (editingEvent && newEvent.title.trim()) {
            const updatedEvents = events.map((event) =>
                event.id === editingEvent.id
                    ? { ...event, ...newEvent, date: selectedDate, color: getColorForDate(selectedDate) }
                    : event
            );
            setEvents(updatedEvents);
            resetEventForm();
        }
    };

    const handleDeleteEvent = (eventId: string) => {
        setEvents(events.filter((event) => event.id !== eventId));
        setShowEventList(false);
    };

    const handleToggleComplete = (eventId: string) => {
        setEvents(
            events.map((event) =>
                event.id === eventId
                    ? { ...event, completed: !event.completed }
                    : event
            )
        );
    };

    const resetEventForm = () => {
        setNewEvent({ title: "", description: "", time: "" });
        setEditingEvent(null);
        setShowEventModal(false);
        setShowEventList(false);
        setSelectedDate("");
    };

    // Render monthly view
    const renderMonthlyView = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];

        // Previous month's trailing days
        const prevMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() - 1,
            0
        );
        for (let i = firstDay - 1; i >= 0; i--) {
            const day = prevMonth.getDate() - i;
            days.push(
                <div
                    key={`prev-${day}`}
                    className="min-h-[5rem] sm:min-h-[6rem] md:min-h-[7rem] lg:min-h-[8rem] border border-zinc-800 bg-zinc-900/50 p-1 sm:p-2"
                >
                    <span className="text-zinc-600 text-xs sm:text-sm">
                        {day}
                    </span>
                </div>
            );
        }

        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = normalizeDate(new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                day
            ));
            const dateString = formatDate(date);
            const isToday = dateString === getTodayString();
            const dayEvents = getEventsForDate(dateString);

            days.push(
                <div
                    key={day}
                    className="min-h-[5rem] sm:min-h-[6rem] md:min-h-[7rem] lg:min-h-[8rem] border border-zinc-800 bg-zinc-900 p-1 sm:p-2 cursor-pointer hover:bg-zinc-800/50 transition-colors"
                    onClick={() => handleDateClick(dateString)}
                >
                    <div
                        className={`text-xs sm:text-sm mb-1 ${
                            isToday
                                ? "bg-red-600 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs font-medium"
                                : "text-zinc-300"
                        }`}
                    >
                        {day}
                    </div>
                    <div className="space-y-1">
                        {dayEvents.map((event) => (
                            <div
                                key={event.id}
                                className={`text-xs p-1 rounded ${
                                    event.completed
                                        ? "line-through text-zinc-500"
                                        : ""
                                }`}
                                style={{ backgroundColor: `${event.color}20` }}
                            >
                                <span
                                    style={{
                                        color: event.completed
                                            ? undefined
                                            : event.color,
                                    }}
                                >
                                    {event.time ? `${event.time} ` : ""}
                                    {event.title}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        // Next month's leading days
        const remainingCells = 42 - days.length;
        for (let day = 1; day <= remainingCells; day++) {
            days.push(
                <div
                    key={`next-${day}`}
                    className="min-h-[5rem] sm:min-h-[6rem] md:min-h-[7rem] lg:min-h-[8rem] border border-zinc-800 bg-zinc-900/50 p-1 sm:p-2"
                >
                    <span className="text-zinc-600 text-xs sm:text-sm">
                        {day}
                    </span>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-7 gap-0">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                        <div
                            key={day}
                            className="p-2 sm:p-3 text-center text-zinc-400 text-xs sm:text-sm font-medium border border-zinc-800 bg-zinc-800"
                        >
                            <span className="hidden sm:inline">{day}</span>
                            <span className="sm:hidden">{day.charAt(0)}</span>
                        </div>
                    )
                )}
                {days}
            </div>
        );
    };

    // Render weekly view
    const renderWeeklyView = () => {
        const weekDates = getWeekDates(currentDate);

        return (
            <div className="grid grid-cols-7 gap-0">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                        <div
                            key={day}
                            className="p-2 sm:p-3 text-center text-zinc-400 text-xs sm:text-sm font-medium border border-zinc-800 bg-zinc-800"
                        >
                            <span className="hidden sm:inline">{day}</span>
                            <span className="sm:hidden">{day.charAt(0)}</span>
                        </div>
                    )
                )}
                {weekDates.map((date, index) => {
                    const dateString = formatDate(date);
                    const isToday = dateString === getTodayString();
                    const dayEvents = getEventsForDate(dateString);

                    return (
                        <div
                            key={index}
                            className="min-h-[8rem] sm:min-h-[10rem] md:min-h-[12rem] lg:min-h-[15rem] border border-zinc-800 bg-zinc-900 p-2 sm:p-3 cursor-pointer hover:bg-zinc-800/50 transition-colors"
                            onClick={() => handleDateClick(dateString)}
                        >
                            <div
                                className={`text-sm sm:text-base mb-2 ${
                                    isToday
                                        ? "bg-red-600 text-white rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center font-medium"
                                        : "text-zinc-300"
                                }`}
                            >
                                {date.getDate()}
                            </div>
                            <div className="space-y-1">
                                {dayEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        className={`text-xs p-1 rounded ${
                                            event.completed
                                                ? "line-through text-zinc-500"
                                                : ""
                                        }`}
                                        style={{
                                            backgroundColor: `${event.color}20`,
                                        }}
                                    >
                                        <span
                                            style={{
                                                color: event.completed
                                                    ? undefined
                                                    : event.color,
                                            }}
                                        >
                                            {event.time ? `${event.time} ` : ""}
                                            {event.title}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="bg-zinc-950 text-white p-4 sm:p-6 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col space-y-4 mb-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-light tracking-wider mb-4">
                            CALENDAR
                        </h1>

                        {/* Controls */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 flex-wrap">
                            <div className="flex items-center gap-4">
                                {/* View Toggle */}
                                <div className="flex rounded">
                                    <button
                                        onClick={() => setViewMode("weekly")}
                                        className={`px-3 py-1 text-xs sm:text-sm rounded cursor-pointer ${
                                            viewMode === "weekly"
                                                ? "underline underline-offset-4 text-white"
                                                : "text-zinc-400"
                                        }`}
                                    >
                                        Weekly View
                                    </button>
                                    <button
                                        onClick={() => setViewMode("monthly")}
                                        className={`px-3 py-1 text-xs sm:text-sm rounded cursor-pointer ${
                                            viewMode === "monthly"
                                                ? "underline underline-offset-4 text-white"
                                                : "text-zinc-400"
                                        }`}
                                    >
                                        Monthly View
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full bg-zinc-600 h-[1px] rounded-full" />

                    <div>
                        {/* Controls */}
                        <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-wrap">
                            {/* Date Navigation */}
                            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <div className="text-base sm:text-lg md:text-xl font-light text-center w-full">
                                        {currentDate.toLocaleDateString(
                                            "en-US",
                                            {
                                                month: "long",
                                                year: "numeric",
                                            }
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={navigatePrevious}
                                        className="p-2 hover:bg-zinc-800 rounded transition-colors"
                                    >
                                        <ChevronLeft
                                            size={16}
                                            className="sm:w-5 sm:h-5"
                                        />
                                    </button>

                                    <button
                                        onClick={goToToday}
                                        className="mx-4 py-1 px-3 text-xs sm:text-sm bg-zinc-800 hover:bg-zinc-700 rounded transition-colors"
                                    >
                                        Today
                                    </button>

                                    <button
                                        onClick={navigateNext}
                                        className="p-2 hover:bg-zinc-800 rounded transition-colors"
                                    >
                                        <ChevronRight
                                            size={16}
                                            className="sm:w-5 sm:h-5"
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Calendar */}
                <div className="bg-zinc-900 rounded-lg overflow-hidden">
                    {viewMode === "monthly"
                        ? renderMonthlyView()
                        : renderWeeklyView()}
                </div>

                {/* Event Dialog */}
                <Dialog open={showEventModal} onOpenChange={setShowEventModal}>
                    <DialogContent className="bg-zinc-900 border border-zinc-700 text-white w-[400px] p-4 sm:p-6 rounded-lg">
                        <DialogHeader>
                            <DialogTitle className="text-base sm:text-lg font-medium">
                                {editingEvent ? "Edit Event" : "Add New Event"}
                            </DialogTitle>
                            <DialogDescription className="text-zinc-400 text-xs sm:text-sm">
                                {editingEvent
                                    ? "Update your event details"
                                    : "Create a new event for your calendar"}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="title"
                                    className="text-xs sm:text-sm text-zinc-400"
                                >
                                    Title
                                </Label>
                                <Input
                                    id="title"
                                    type="text"
                                    value={newEvent.title}
                                    onChange={(e) =>
                                        setNewEvent({
                                            ...newEvent,
                                            title: e.target.value,
                                        })
                                    }
                                    className="w-full bg-zinc-800 border border-zinc-700 text-white focus:border-zinc-500 text-xs sm:text-sm px-3 py-2 rounded"
                                    placeholder="Event title"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="description"
                                    className="text-xs sm:text-sm text-zinc-400"
                                >
                                    Description
                                </Label>
                                <Textarea
                                    id="description"
                                    value={newEvent.description}
                                    onChange={(e) =>
                                        setNewEvent({
                                            ...newEvent,
                                            description: e.target.value,
                                        })
                                    }
                                    className="w-full bg-zinc-800 border border-zinc-700 text-white focus:border-zinc-500 h-20 text-xs sm:text-sm px-3 py-2 rounded resize-none"
                                    placeholder="Event description"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="time"
                                    className="text-xs sm:text-sm text-zinc-400"
                                >
                                    Time
                                </Label>
                                <Input
                                    id="time"
                                    type="time"
                                    value={newEvent.time}
                                    onChange={(e) =>
                                        setNewEvent({
                                            ...newEvent,
                                            time: e.target.value,
                                        })
                                    }
                                    className="w-full bg-zinc-800 border border-zinc-700 text-white focus:border-zinc-500 text-xs sm:text-sm px-3 py-2 rounded"
                                />
                            </div>
                        </div>

                        <div className="flex gap-2 mt-6 flex-col sm:flex-row">
                            <Button
                                onClick={
                                    editingEvent
                                        ? handleUpdateEvent
                                        : handleAddEvent
                                }
                                style={{ backgroundColor: getColorForDate(selectedDate) }}
                                className="flex-1 hover:opacity-80 text-white text-xs sm:text-sm py-2 px-4 rounded transition-opacity"
                            >
                                {editingEvent ? "Update Event" : "Add Event"}
                            </Button>
                            <Button
                                onClick={resetEventForm}
                                className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white text-xs sm:text-sm py-2 px-4 rounded transition-colors"
                            >
                                Cancel
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Event List Modal */}
                {showEventList && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-zinc-900 rounded-lg p-4 sm:p-6 w-full max-w-[95vw] sm:max-w-md">
                            <h3 className="text-base sm:text-lg font-medium mb-4">
                                Events for{" "}
                                {new Date(selectedDate).toLocaleDateString()}
                            </h3>

                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                {getEventsForDate(selectedDate).length === 0 ? (
                                    <div className="text-zinc-400 text-center py-4">
                                        No events for this date
                                    </div>
                                ) : (
                                    getEventsForDate(selectedDate).map(
                                        (event) => (
                                            <div
                                                key={event.id}
                                                className={`bg-zinc-800 rounded p-3 ${
                                                    isPastDate(event.date) &&
                                                    !event.completed
                                                        ? "border-l-4 border-yellow-600"
                                                        : ""
                                                }`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <input
                                                                type="checkbox"
                                                                checked={
                                                                    event.completed
                                                                }
                                                                onChange={() =>
                                                                    handleToggleComplete(
                                                                        event.id
                                                                    )
                                                                }
                                                                className="rounded"
                                                            />
                                                            <div
                                                                className={`font-medium text-xs sm:text-sm ${
                                                                    event.completed
                                                                        ? "line-through text-zinc-500"
                                                                        : ""
                                                                }`}
                                                                style={{
                                                                    color: event.completed
                                                                        ? undefined
                                                                        : event.color,
                                                                }}
                                                            >
                                                                {event.title}
                                                            </div>
                                                        </div>
                                                        {isPastDate(
                                                            event.date
                                                        ) &&
                                                            !event.completed && (
                                                                <div className="text-xs text-yellow-400 mb-1">
                                                                    Overdue
                                                                </div>
                                                            )}
                                                        {event.description && (
                                                            <div className="text-xs sm:text-sm text-zinc-400 mt-1">
                                                                {
                                                                    event.description
                                                                }
                                                            </div>
                                                        )}
                                                        {event.time && (
                                                            <div className="text-xs text-zinc-500 mt-1">
                                                                {event.time}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex gap-1 ml-2">
                                                        <button
                                                            onClick={() =>
                                                                handleEditEvent(
                                                                    event
                                                                )
                                                            }
                                                            className="p-1 cursor-pointer rounded"
                                                        >
                                                            <Edit
                                                                size={14}
                                                                className="sm:w-4 sm:h-4"
                                                            />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDeleteEvent(
                                                                    event.id
                                                                )}
                                                            className="p-1 cursor-pointer rounded text-red-600"
                                                        >
                                                            <Trash2
                                                                size={14}
                                                                className="sm:w-4 sm:h-4"
                                                            />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )
                                )}
                            </div>

                            <div className="flex gap-2 mt-4 flex-col sm:flex-row">
                                <button
                                    onClick={() => {
                                        setShowEventList(false);
                                        setShowEventModal(true);
                                    }}
                                    className="flex w-full sm:w-1/2 items-center justify-center cursor-pointer gap-2 px-2 sm:px-2 py-4 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors text-xs sm:text-sm"
                                    >
                                    <Plus
                                        size={16}
                                        className="sm:w-5 sm:h-5"
                                    />
                                    Add Event
                                </button>
                                <button
                                    onClick={() => setShowEventList(false)}
                                    className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white cursor-pointer py-2 px-4 rounded transition-colors text-xs sm:text-sm font-semibold"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CalendarEvents;