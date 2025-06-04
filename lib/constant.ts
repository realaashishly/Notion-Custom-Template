export enum Platform {
    Instagram = "Instagram",
    YouTube = "YouTube",
    X = "X",
    Threads = "Threads",
}

// Interfaces
export interface Task {
    id: string;
    title: string;
    platform?: string;
    status?: string;
}

export interface Column {
    id: string;
    title: string;
    color: string;
    tasks: Task[];
}

export interface CalendarEvent {
    id: string;
    title: string;
    description?: string;
    date: string;
    time?: string;
    color: string;
}

export const platforms = [
    { name: "Instagram", icon: "📷" },
    { name: "Facebook", icon: "📘" },
    { name: "X", icon: "❌" },
    { name: "YouTube", icon: "📺" },
    { name: "Reddit", icon: "👽" },
    { name: "Pinterest", icon: "📌" },
];
