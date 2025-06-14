"use client";

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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    Calendar,
    Clock,
    Edit,
    Folder,
    MapPin,
    Plus,
    Star,
    Tag,
    Trash,
} from "lucide-react";
import React, { useState } from "react";

interface Note {
    id: string;
    title: string;
    notebook: string;
    tags: string[];
    area: string;
    created: Date;
    lastEdited: Date;
    starred?: boolean;
    content: string;
}

const NotesInterface: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>([
        {
            id: "1",
            title: "Lets see",
            notebook: "Notebook 4",
            tags: [],
            area: "Personal Development",
            created: new Date("2025-05-08T20:15:00"),
            lastEdited: new Date("2025-05-08T20:15:00"),
            content: "",
        },
        {
            id: "2",
            title: "First video",
            notebook: "The current situation of the world",
            tags: [],
            area: "Personal Development",
            created: new Date("2024-11-07T01:01:00"),
            lastEdited: new Date("2024-11-19T05:45:00"),
            content: "",
        },
        {
            id: "3",
            title: "Meeting Notes",
            notebook: "Work Projects",
            tags: ["important"],
            area: "Work",
            created: new Date("2025-06-01T14:30:00"),
            lastEdited: new Date("2025-06-02T09:15:00"),
            content: "",
        },
        {
            id: "4",
            title: "Book Ideas",
            notebook: "Creative Writing",
            tags: ["draft", "fiction"],
            area: "Ideas",
            created: new Date("2025-05-15T11:20:00"),
            lastEdited: new Date("2025-05-20T16:45:00"),
            content: "",
        },
        {
            id: "5",
            title: "Workout Plan",
            notebook: "Health & Fitness",
            tags: ["routine"],
            area: "Personal Development",
            created: new Date("2025-05-25T07:00:00"),
            lastEdited: new Date("2025-05-25T07:00:00"),
            content: "",
        },
        {
            id: "6",
            title: "Recipe Collection",
            notebook: "Cooking",
            tags: ["favorites"],
            area: "Personal Development",
            created: new Date("2025-04-10T19:30:00"),
            lastEdited: new Date("2025-05-30T20:15:00"),
            content: "",
        },
    ]);

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [newNote, setNewNote] = useState({
        title: "",
        notebook: "",
        area: "Personal Development",
        content: "",
    });
    const [editNote, setEditNote] = useState<Note | null>(null);

    const formatDate = (date: Date): string => {
        return date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    const handleAddNote = () => {
        if (!newNote.title.trim()) return;

        const note: Note = {
            id: Date.now().toString(),
            title: newNote.title.trim(),
            notebook: newNote.notebook.trim() || "Default Notebook",
            tags: [],
            area: newNote.area.trim(),
            created: new Date(),
            lastEdited: new Date(),
            content: newNote.content.trim(),
            starred: false,
        };

        setNotes([note, ...notes]);
        setNewNote({
            title: "",
            notebook: "",
            area: "Personal Development",
            content: "",
        });
        setIsAddDialogOpen(false);
    };

    const handleEditNote = (note: Note) => {
        setEditNote(note);
        setIsEditDialogOpen(true);
    };

    const handleUpdateNote = () => {
        if (!editNote || !editNote.title.trim()) return;

        setNotes(
            notes.map((note) =>
                note.id === editNote.id
                    ? {
                          ...editNote,
                          title: editNote.title.trim(),
                          notebook: editNote.notebook.trim(),
                          area: editNote.area.trim(),
                          content: editNote.content.trim(),
                          lastEdited: new Date(),
                      }
                    : note
            )
        );
        setEditNote(null);
        setIsEditDialogOpen(false);
    };

    const handleDeleteProject = (noteId: string) => {
        setNotes(notes.filter((note) => note.id !== noteId));
    };

    const toggleStar = (noteId: string) => {
        setNotes(
            notes.map((note) =>
                note.id === noteId ? { ...note, starred: !note.starred } : note
            )
        );
    };

    return (
        <div className='max-w-7xl mx-auto min-h-screen bg-zinc-950 text-white'>
            {/* Header */}
            <div className='px-4 sm:px-6 py-6'>
                <h1 className='text-xl sm:text-2xl md:text-3xl font-light tracking-[0.36em] text-zinc-300 uppercase'>
                    NOTES
                </h1>
                <Separator className='my-4 bg-gray-700' />
            </div>

            {/* Table Header */}
            <div className='grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] min-w-[1000px] gap-2 sm:gap-4 px-4 sm:px-6 py-3 bg-zinc-900 border-b border-gray-700 text-xs sm:text-sm font-semibold text-gray-600'>
                <div className='flex items-center justify-center gap-2'>
                    <Star className='w-4 h-4 sm:w-5 sm:h-5' />
                </div>
                <div className='flex items-center gap-2'>
                    <Folder className='w-4 h-4 sm:w-5 sm:h-5' />
                    Notes
                </div>
                <div className='flex items-center gap-2'>
                    <Folder className='w-4 h-4 sm:w-5 sm:h-5' />
                    Notebooks
                </div>
                <div className='flex items-center gap-2'>
                    <Tag className='w-4 h-4 sm:w-5 sm:h-5' />
                    Tags
                </div>
                <div className='flex items-center gap-2'>
                    <MapPin className='w-4 h-4 sm:w-5 sm:h-5' />
                    Areas
                </div>
                <div className='flex items-center gap-2'>
                    <Calendar className='w-4 h-4 sm:w-5 sm:h-5' />
                    Created
                </div>
                <div className='flex items-center gap-2'>
                    <Clock className='w-4 h-4 sm:w-5 sm:h-5' />
                    Last Edited
                </div>
                <div className='flex items-center justify-center gap-2'>
                    Actions
                </div>
            </div>

            {/* Notes List */}
            <div className='flex-1 overflow-x-auto'>
                {notes.map((note) => (
                    <div
                        key={note.id}
                        className='grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] min-w-[1000px] gap-2 sm:gap-4 px-4 sm:px-6 py-3 border-b border-gray-800 hover:bg-gray-800/30 transition-colors'
                    >
                        <div className='flex items-center justify-center'>
                            <button
                                type='button'
                                onClick={() => toggleStar(note.id)}
                                className={`p-1 rounded ${
                                    note.starred
                                        ? 'text-yellow-400'
                                        : 'text-gray-600 hover:text-gray-400'
                                }`}
                            >
                                <Star
                                    className='w-4 h-4 sm:w-5 sm:h-5'
                                    fill={note.starred ? 'currentColor' : 'none'}
                                />
                            </button>
                        </div>
                        <div className='flex items-center'>
                            <Folder className='w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-500' />
                            <span className='text-xs sm:text-sm truncate'>{note.title}</span>
                        </div>
                        <div className='flex items-center'>
                            <Folder className='w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-500' />
                            <span className='text-xs sm:text-sm text-gray-300 truncate'>{note.notebook}</span>
                        </div>
                        <div className='flex items-center flex-wrap gap-1'>
                            <Tag className='w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-500' />
                            {note.tags.length > 0 ? (
                                note.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className='text-xs bg-gray-600 text-gray-300 px-1.5 py-0.5 rounded'
                                    >
                                        {tag}
                                    </span>
                                ))
                            ) : (
                                <span className='text-xs sm:text-sm text-gray-500'>-</span>
                            )}
                        </div>
                        <div className='flex items-center'>
                            <MapPin className='w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-500' />
                            <span className='text-xs sm:text-sm text-gray-300 truncate'>{note.area}</span>
                        </div>
                        <div className='text-xs sm:text-sm text-gray-400 truncate'>{formatDate(note.created)}</div>
                        <div className='text-xs sm:text-sm text-gray-400 truncate'>{formatDate(note.lastEdited)}</div>
                        <div className='flex items-center justify-center gap-2'>
                            <button
                                type='button'
                                onClick={() => handleEditNote(note)}
                                className='p-1 bg-gray-800 text-gray-400 hover:bg-blue-600 hover:text-white rounded transition-colors'
                                title='Edit'
                            >
                                <Edit className='w-4 h-4 sm:w-5 sm:h-5' />
                            </button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <button
                                        type='button'
                                        className='p-1 bg-gray-800 text-gray-400 hover:bg-red-600 hover:text-white rounded transition-colors'
                                        title='Delete'
                                    >
                                        <Trash className='w-4 h-4 sm:w-5 sm:h-5' />
                                    </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className='bg-gray-900 text-white border-gray-700 max-w-[95vw] sm:max-w-md p-4 sm:p-6'>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className='text-base sm:text-lg font-medium'>Delete Note</AlertDialogTitle>
                                        <AlertDialogDescription className='text-gray-400 text-xs sm:text-sm'>
                                            Are you sure you want to delete &quot;{note.title}&quot;? This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter className='flex flex-col sm:flex-row gap-2 sm:gap-4'>
                                        <AlertDialogCancel className='bg-gray-700 text-gray-100 hover:bg-gray-600 text-xs sm:text-sm rounded transition-colors'>
                                            Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => handleDeleteProject(note.id)}
                                            className='bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm rounded transition-colors'
                                        >
                                            Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Note Dialog */}
            <div className='px-4 sm:px-6 py-4 border-t border-gray-800'>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <button
                            type='button'
                            className='flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors text-xs sm:text-sm'
                        >
                            <Plus className='w-4 h-4 sm:w-5 sm:h-5' />
                            Add Note
                        </button>
                    </DialogTrigger>
                    <DialogContent className='bg-gray-900 text-white border-gray-700 max-w-[95vw] sm:max-w-md p-4 sm:p-6 min-h-[180px]'>
                        <DialogHeader>
                            <DialogTitle className='text-base sm:text-lg font-medium'>Add New Note</DialogTitle>
                            <DialogDescription className='text-gray-400 text-xs sm:text-sm'>
                                Enter the details for the new note.
                            </DialogDescription>
                        </DialogHeader>
                        <div className='space-y-4 py-4'>
                            <div className='space-y-2'>
                                <Label htmlFor='title' className='text-xs sm:text-sm font-medium text-gray-400'>
                                    Title
                                </Label>
                                <Input
                                    id='title'
                                    value={newNote.title}
                                    onChange={(e) =>
                                        setNewNote({
                                            ...newNote,
                                            title: e.target.value,
                                        })
                                    }
                                    className='bg-gray-800 border-gray-700 text-white text-xs sm:text-sm focus:border-gray-500 placeholder-gray-500'
                                    placeholder='Note title'
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='notebook' className='text-xs sm:text-sm font-medium text-gray-400'>
                                    Notebook
                                </Label>
                                <Input
                                    id='notebook'
                                    value={newNote.notebook}
                                    onChange={(e) =>
                                        setNewNote({
                                            ...newNote,
                                            notebook: e.target.value,
                                        })
                                    }
                                    className='bg-gray-800 border-gray-700 text-white text-xs sm:text-sm focus:border-gray-500 placeholder-gray-500'
                                    placeholder='Notebook name'
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='area' className='text-xs sm:text-sm font-medium text-gray-400'>
                                    Area
                                </Label>
                                <Input
                                    id='area'
                                    value={newNote.area}
                                    onChange={(e) =>
                                        setNewNote({
                                            ...newNote,
                                            area: e.target.value,
                                        })
                                    }
                                    className='bg-gray-800 border-gray-700 text-white text-xs sm:text-sm focus:border-gray-500 placeholder-gray-500'
                                    placeholder='Area'
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='content' className='text-xs sm:text-sm font-medium text-gray-400'>
                                    Content
                                </Label>
                                <Input
                                    id='content'
                                    value={newNote.content}
                                    onChange={(e) =>
                                        setNewNote({
                                            ...newNote,
                                            content: e.target.value,
                                        })
                                    }
                                    className='bg-gray-800 border-gray-700 text-white text-xs sm:text-sm focus:border-gray-500 placeholder-gray-500'
                                    placeholder='Content'
                                />
                            </div>
                        </div>
                        <DialogFooter className='flex flex-col sm:flex-row gap-2 sm:gap-4'>
                            <button
                                type='button'
                                onClick={() => setIsAddDialogOpen(false)}
                                className='px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-100 rounded text-xs sm:text-sm transition-colors'
                            >
                                Cancel
                            </button>
                            <button
                                type='button'
                                onClick={handleAddNote}
                                disabled={!newNote.title.trim()}
                                className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs sm:text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                Add
                            </button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Edit Note Dialog */}
            {editNote && (
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className='bg-gray-900 text-white border-gray-700 max-w-[95vw] sm:max-w-md p-4 sm:p-6 min-h-[180px]'>
                        <DialogHeader>
                            <DialogTitle className='text-base sm:text-lg font-medium'>Edit Note</DialogTitle>
                            <DialogDescription className='text-gray-400 text-xs sm:text-sm'>
                                Update the details for the note.
                            </DialogDescription>
                        </DialogHeader>
                        <div className='space-y-4 py-4'>
                            <div className='space-y-2'>
                                <Label htmlFor='edit_title' className='text-xs sm:text-sm font-medium text-gray-400'>
                                    Title
                                </Label>
                                <Input
                                    id='edit_title'
                                    value={editNote.title}
                                    onChange={(e) =>
                                        setEditNote({
                                            ...editNote,
                                            title: e.target.value,
                                        })
                                    }
                                    className='bg-gray-800 border-gray-700 text-white text-xs sm:text-sm focus:border-gray-500 placeholder-gray-500'
                                    placeholder='Note title'
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='edit_notebook' className='text-xs sm:text-sm font-medium text-gray-400'>
                                    Notebook
                                </Label>
                                <Input
                                    id='edit_notebook'
                                    value={editNote.notebook}
                                    onChange={(e) =>
                                        setEditNote({
                                            ...editNote,
                                            notebook: e.target.value,
                                        })
                                    }
                                    className='bg-gray-800 border-gray-700 text-white text-xs sm:text-sm focus:border-gray-500 placeholder-gray-500'
                                    placeholder='Notebook name'
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='edit_area' className='text-xs sm:text-sm font-medium text-gray-400'>
                                    Area
                                </Label>
                                <Input
                                    id='edit_area'
                                    value={editNote.area}
                                    onChange={(e) =>
                                        setEditNote({
                                            ...editNote,
                                            area: e.target.value,
                                        })
                                    }
                                    className='bg-gray-800 border-gray-700 text-white text-xs sm:text-sm focus:border-gray-500 placeholder-gray-500'
                                    placeholder='Area'
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='edit_content' className='text-xs sm:text-sm font-medium text-gray-400'>
                                    Content
                                </Label>
                                <Input
                                    id='edit_content'
                                    value={editNote.content || ""}
                                    onChange={(e) =>
                                        setEditNote({
                                            ...editNote,
                                            content: e.target.value,
                                        })
                                    }
                                    className='bg-gray-800 border-gray-700 text-white text-xs sm:text-sm focus:border-gray-500 placeholder-gray-500'
                                    placeholder='Content'
                                />
                            </div>
                        </div>
                        <DialogFooter className='flex flex-col sm:flex-row gap-2 sm:gap-4'>
                            <button
                                type='button'
                                onClick={() => setIsEditDialogOpen(false)}
                                className='px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-100 rounded text-xs sm:text-sm transition-colors'
                            >
                                Cancel
                            </button>
                            <button
                                type='button'
                                onClick={handleUpdateNote}
                                disabled={!editNote.title.trim()}
                                className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs sm:text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                Update
                            </button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* Footer */}
            <div className='px-4 sm:px-6 py-4 border-t border-gray-800 text-xs sm:text-sm text-gray-400'>
                <Separator className='my-4 bg-gray-700' />
                <div className='flex items-center gap-2'>
                    <span>COUNT</span>
                    <span className='font-medium'>{notes.length}</span>
                </div>
            </div>
        </div>
    );
};

export default NotesInterface;