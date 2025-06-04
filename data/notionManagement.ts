import { Column } from "@/lib/constant";

export const getInitialColumns = (): Column[] => [
    {
        id: "research",
        title: "📚 Research & Planning",
        color: "",
        tasks: [
            { id: "task-1", title: "How to apply for Y Combinator", platform: "Instagram", status: "YouTube" },
            { id: "task-2", title: "How to achieve the Flow State", platform: "Threads", status: "X" },
        ],
    },
    {
        id: "scripting",
        title: "📝 Scripting",
        color: "",
        tasks: [
            { id: "task-3", title: "Top 10 AI for content creation", platform: "YouTube" },
        ],
    },
    {
        id: "filming",
        title: "🎬 Filming",
        color: "",
        tasks: [
            { id: "task-4", title: "Top 10 movies for entrepreneurs", platform: "X" },
            { id: "task-5", title: "How to get started with Machine Learning", platform: "YouTube" },
        ],
    },
    {
        id: "editing",
        title: "✂️ Editing",
        color: "",
        tasks: [
            { id: "task-6", title: "Top 10 apps for productivity in 2024", platform: "X" },
        ],
    },
    {
        id: "scheduled",
        title: "📅 Scheduled",
        color: "",
        tasks: [
            { id: "task-7", title: "Top 10 websites for Wallpapers", platform: "YouTube" },
        ],
    },
    {
        id: "published",
        title: "✅ Published",
        color: "",
        tasks: [
            { id: "task-8", title: "Top 10 AI for 3D Model generation", platform: "Instagram" },
            { id: "task-9", title: "New Content", platform: "Instagram" },
            { id: "task-10", title: "How to get started with Notion", platform: "Instagram" },
        ],
    },
];