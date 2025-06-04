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

export const tasks: Task[] = [
    {
        id: "1",
        name: "100 days of No Code",
        status: "in-progress",
        dateRange: ["December 12, 2024", "December 12, 2024"],
        daysLeft: { text: "172 days overdue", color: "red" },
    },
    {
        id: "2",
        name: "100 days learning 100 books",
        status: "done",
        dateRange: ["September 6, 2024", "September 13, 2024"],
        daysLeft: { text: "Completed", color: "green" },
    },
    {
        id: "3",
        name: "21 days habit challenge",
        status: "cancelled",
        dateRange: ["December 3, 2024", "December 24, 2024"],
        daysLeft: { text: "Cancelled", color: "gray" },
    },
    {
        id: "4",
        name: "The Manhattan Challenge",
        status: "not-started",
        dateRange: ["November 1, 2024", "December 28, 2024"],
        daysLeft: { text: "156 days overdue", color: "red" },
    },
];


