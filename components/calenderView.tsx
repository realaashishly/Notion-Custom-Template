"use client";
import { ChevronLeft, ChevronRight, Edit, Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

// Event interface
interface CalendarEvent {
    id: string;
    title: string;
    description?: string;
    date: string;
    time?: string;
    color: string;
}

// Mock data for events
const initialEvents: CalendarEvent[] = [
    {
        id: "1",
        title: "New Content",
        description: "Create new blog content",
        date: "2025-05-26",
        time: "09:00",
        color: "#3b82f6",
    },
    {
        id: "2",
        title: "Research & Planning",
        description: "Market research for Q2",
        date: "2025-05-26",
        time: "14:00",
        color: "#10b981",
    },
];

const Calendar: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date(2025, 4, 30)); // May 2025
    const [viewMode, setViewMode] = useState<"weekly" | "monthly">("weekly");
    const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [showEventModal, setShowEventModal] = useState(false);
    const [showEventList, setShowEventList] = useState(false);
    const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(
        null
    );
    const [newEvent, setNewEvent] = useState({
        title: "",
        description: "",
        time: "",
        color: "#3b82f6",
    });

    const colors = ["#10b981", "#ef4444", "#8b5cf6"];

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
        const startOfWeek = new Date(date);
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
        return date.toISOString().split("T")[0];
    };

    // Get events for a specific date
    const getEventsForDate = (date: string) => {
        return events.filter((event) => event.date === date);
    };

    // Navigation functions
    const navigatePrevious = () => {
        if (viewMode === "weekly") {
            const newDate = new Date(currentDate);
            newDate.setDate(currentDate.getDate() - 7);
            setCurrentDate(newDate);
        } else {
            const newDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() - 1,
                1
            );
            setCurrentDate(newDate);
        }
    };

    const navigateNext = () => {
        if (viewMode === "weekly") {
            const newDate = new Date(currentDate);
            newDate.setDate(currentDate.getDate() + 7);
            setCurrentDate(newDate);
        } else {
            const newDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() + 1,
                1
            );
            setCurrentDate(newDate);
        }
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    // Event management functions
    const handleDateClick = (date: string) => {
        setSelectedDate(date);
        const dateEvents = getEventsForDate(date);
        if (dateEvents.length > 0) {
            setShowEventList(true);
        } else {
            setShowEventModal(true);
        }
    };

    const handleAddEvent = () => {
        if (newEvent.title.trim()) {
            const event: CalendarEvent = {
                id: Date.now().toString(),
                title: newEvent.title,
                description: newEvent.description,
                date: selectedDate,
                time: newEvent.time,
                color: newEvent.color,
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
            color: event.color,
        });
        setShowEventModal(true);
        setShowEventList(false);
    };

    const handleUpdateEvent = () => {
        if (editingEvent && newEvent.title.trim()) {
            const updatedEvents = events.map((event) =>
                event.id === editingEvent.id ? { ...event, ...newEvent } : event
            );
            setEvents(updatedEvents);
            resetEventForm();
        }
    };

    const handleDeleteEvent = (eventId: string) => {
        setEvents(events.filter((event) => event.id !== eventId));
        setShowEventList(false);
    };

    const resetEventForm = () => {
        setNewEvent({ title: "", description: "", time: "", color: "#3b82f6" });
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
                    className='h-20 sm:h-24 md:h-28 lg:h-32 border border-zinc-800 bg-zinc-900/50 p-1 sm:p-2'
                >
                    <span className='text-zinc-600 text-xs sm:text-sm'>
                        {day}
                    </span>
                </div>
            );
        }

        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                day
            );
            const dateString = formatDate(date);
            const dayEvents = getEventsForDate(dateString);
            const isToday = dateString === formatDate(new Date());

            days.push(
                <div
                    key={day}
                    className='h-20 sm:h-24 md:h-28 lg:h-32 border border-zinc-800 bg-zinc-900 p-1 sm:p-2 cursor-pointer hover:bg-zinc-800/50 transition-colors'
                    onClick={() => handleDateClick(dateString)}
                >
                    <div
                        className={`text-xs sm:text-sm mb-1 ${
                            isToday
                                ? "bg-red-600 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs"
                                : "text-zinc-300"
                        }`}
                    >
                        {day}
                    </div>
                    <div className='space-y-1'>
                        {dayEvents.slice(0, 2).map((event) => (
                            <div
                                key={event.id}
                                className='text-xs px-1 py-0.5 rounded truncate'
                                style={{
                                    backgroundColor: event.color + "40",
                                    color: event.color,
                                }}
                            >
                                {event.title}
                            </div>
                        ))}
                        {dayEvents.length > 2 && (
                            <div className='text-xs text-zinc-400'>
                                +{dayEvents.length - 2} more
                            </div>
                        )}
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
                    className='h-20 sm:h-24 md:h-28 lg:h-32 border border-zinc-800 bg-zinc-900/50 p-1 sm:p-2'
                >
                    <span className='text-zinc-600 text-xs sm:text-sm'>
                        {day}
                    </span>
                </div>
            );
        }

        return (
            <div className='grid grid-cols-7 gap-0'>
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                        <div
                            key={day}
                            className='p-2 sm:p-3 text-center text-zinc-400 text-xs sm:text-sm font-medium border border-zinc-800 bg-zinc-800'
                        >
                            <span className='hidden sm:inline'>{day}</span>
                            <span className='sm:hidden'>{day.charAt(0)}</span>
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
            <div className='grid grid-cols-7 gap-0'>
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                        <div
                            key={day}
                            className='p-2 sm:p-3 text-center text-zinc-400 text-xs sm:text-sm font-medium border border-zinc-800 bg-zinc-800'
                        >
                            <span className='hidden sm:inline'>{day}</span>
                            <span className='sm:hidden'>{day.charAt(0)}</span>
                        </div>
                    )
                )}
                {weekDates.map((date, index) => {
                    const dateString = formatDate(date);
                    const dayEvents = getEventsForDate(dateString);
                    const isToday = dateString === formatDate(new Date());

                    return (
                        <div
                            key={index}
                            className='h-32 sm:h-40 md:h-48 lg:h-60 border border-zinc-800 bg-zinc-900 p-2 sm:p-3 cursor-pointer hover:bg-zinc-800/50 transition-colors'
                            onClick={() => handleDateClick(dateString)}
                        >
                            <div
                                className={`text-sm sm:text-base mb-2 ${
                                    isToday
                                        ? "bg-red-600 text-white rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center"
                                        : "text-zinc-300"
                                }`}
                            >
                                {date.getDate()}
                            </div>
                            <div className='space-y-1'>
                                {dayEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        className='text-xs sm:text-sm px-2 py-1 rounded truncate'
                                        style={{
                                            backgroundColor: event.color + "40",
                                            color: event.color,
                                        }}
                                    >
                                        <div className='font-medium'>
                                            {event.title}
                                        </div>
                                        {event.time && (
                                            <div className='text-xs opacity-75'>
                                                {event.time}
                                            </div>
                                        )}
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
        <div className='bg-zinc-950 text-white min-h-screen p-4 sm:p-6'>
            <div className='max-w-7xl mx-auto'>
                {/* Header */}

                <div className='flex flex-col space-y-2 mb-2'>
                    <div className=''>
                        <h1 className='text-2xl sm:text-3xl font-light tracking-wider mb-4'>
                            CALENDER
                        </h1>

                        {/* Controls */}
                        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
                            <div className='flex items-center gap-4'>
                                {/* View Toggle */}
                                <div className='flex  rounded'>
                                    <button
                                        onClick={() => setViewMode("weekly")}
                                        className={`px-3 py-1 text-sm rounded cursor-pointer ${
                                            viewMode === "weekly"
                                                ? "underline underline-offset-4 text-white"
                                                : "text-zinc-400"
                                        }`}
                                    >
                                        Weekly View
                                    </button>
                                    <button
                                        onClick={() => setViewMode("monthly")}
                                        className={`px-3 py-1 text-sm rounded cursor-pointer ${
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

                    <div className='w-full bg-zinc-600 h-[1px] rounded-full' />

                    <div className=''>
                        {/* Controls */}
                        <div className='w-full flex flex-col sm:flex-row items-start sm:items-center gap-4'>
                            {/* Date Navigation */}
                            <div className='w-full flex items-center justify-between gap-2'>
                                <div className='flex items-center gap-2'>
                                    <div className='text-lg sm:text-xl font-light min-w-full text-center'>
                                        {currentDate.toLocaleDateString(
                                            "en-US",
                                            {
                                                month: "long",
                                                year: "numeric",
                                            }
                                        )}
                                    </div>
                                </div>

                                <div className='flex items-center gap-1'>
                                    <button
                                        onClick={navigatePrevious}
                                        className='p-2 hover:bg-zinc-800 rounded transition-colors'
                                    >
                                        <ChevronLeft size={20} />
                                    </button>

                                    <button
                                        onClick={goToToday}
                                        className='ml-4 py-1 text-sm rounded transition-colors'
                                    >
                                        Today
                                    </button>

                                    <button
                                        onClick={navigateNext}
                                        className='p-2 hover:bg-zinc-800 rounded transition-colors'
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Calendar */}
                <div className='bg-zinc-900 rounded-lg overflow-hidden'>
                    {viewMode === "monthly"
                        ? renderMonthlyView()
                        : renderWeeklyView()}
                </div>

                {/* Event Dialog */}
                <Dialog open={showEventModal} onOpenChange={setShowEventModal}>
                    <DialogContent className='bg-zinc-900 border-zinc-700 text-white w-full max-w-md'>
                        <DialogHeader>
                            <DialogTitle className='text-lg font-medium'>
                                {editingEvent ? "Edit Event" : "Add New Event"}
                            </DialogTitle>
                            <DialogDescription className='text-zinc-400'>
                                {editingEvent
                                    ? "Update your event details"
                                    : "Create a new event for your calendar"}
                            </DialogDescription>
                        </DialogHeader>

                        <div className='space-y-4'>
                            <div className='space-y-2'>
                                <Label
                                    htmlFor='title'
                                    className='text-sm text-zinc-400'
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
                                    className='bg-zinc-800 border-zinc-700 text-white focus:border-zinc-500'
                                    placeholder='Event title'
                                />
                            </div>

                            <div className='space-y-2'>
                                <Label
                                    htmlFor='description'
                                    className='text-sm text-zinc-400'
                                >
                                    Description
                                </Label>
                                <Textarea
                                    id='description'
                                    value={newEvent.description}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLTextAreaElement>
                                    ) =>
                                        setNewEvent({
                                            ...newEvent,
                                            description: e.target.value,
                                        })
                                    }
                                    className='bg-zinc-800 border-zinc-700 text-white focus:border-zinc-500 h-20'
                                    placeholder='Event description'
                                />
                            </div>

                            {/* <div className='space-y-2 w-full'>
                                <Label
                                    htmlFor='time'
                                    className='text-sm text-zinc-400'
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
                                    className='bg-zinc-800 border-zinc-700 text-white focus:border-zinc-500 w-full'
                                />
                            </div> */}

                            <div className='space-y-2'>
                                <Label className='text-sm text-zinc-400'>
                                    Color
                                </Label>
                                <div className='flex gap-2'>
                                    {colors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() =>
                                                setNewEvent({
                                                    ...newEvent,
                                                    color,
                                                })
                                            }
                                            className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer ${
                                                newEvent.color === color
                                                    ? "border-white scale-110"
                                                    : "border-zinc-600 hover:border-zinc-400"
                                            }`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className='flex gap-2 mt-6'>
                            <Button
                                onClick={
                                    editingEvent
                                        ? handleUpdateEvent
                                        : handleAddEvent
                                }
                                style={{ backgroundColor: newEvent.color }}
                                className='flex-1 bg-blue-600 hover:bg-blue-700 text-white'
                            >
                                {editingEvent ? "Update Event" : "Add Event"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Event List Modal */}
                {showEventList && (
                    <div className='fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50'>
                        <div className='bg-zinc-900 rounded-lg p-6 w-full max-w-md'>
                            <h3 className='text-lg font-medium mb-4'>
                                Events for{" "}
                                {new Date(selectedDate).toLocaleDateString()}
                            </h3>

                            <div className='space-y-3 max-h-64 overflow-y-auto'>
                                {getEventsForDate(selectedDate).map((event) => (
                                    <div
                                        key={event.id}
                                        className='bg-zinc-800 rounded p-3'
                                    >
                                        <div className='flex items-start justify-between'>
                                            <div className='flex-1'>
                                                <div
                                                    className='font-medium'
                                                    style={{
                                                        color: event.color,
                                                    }}
                                                >
                                                    {event.title}
                                                </div>
                                                {event.description && (
                                                    <div className='text-sm text-zinc-400 mt-1'>
                                                        {event.description}
                                                    </div>
                                                )}
                                                {event.time && (
                                                    <div className='text-sm text-zinc-500 mt-1'>
                                                        {event.time}
                                                    </div>
                                                )}
                                            </div>
                                            <div className='flex gap-1 ml-2'>
                                                <button
                                                    onClick={() =>
                                                        handleEditEvent(event)
                                                    }
                                                    className='p-1 hover:bg-zinc-700 rounded'
                                                >
                                                    <Edit size={14} />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDeleteEvent(
                                                            event.id
                                                        )
                                                    }
                                                    className='p-1 hover:bg-zinc-700 rounded text-red-400'
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className='flex gap-2 mt-4'>
                                <button
                                    onClick={() => {
                                        setShowEventList(false);
                                        setShowEventModal(true);
                                    }}
                                    className='flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors'
                                >
                                    <Plus size={16} />
                                    Add Event
                                </button>
                                <button
                                    onClick={() => setShowEventList(false)}
                                    className='flex-1 bg-zinc-700 hover:bg-zinc-600 text-white py-2 rounded transition-colors'
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

export default Calendar;
