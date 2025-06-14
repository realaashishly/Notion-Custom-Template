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
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    Award,
    BookOpen,
    CreditCard,
    Dumbbell,
    Edit,
    Trash2,
    Users,
} from "lucide-react";
import React, { useState } from "react";

interface AreaItem {
    id: number;
    title: string;
    icon: React.ReactNode;
    gradient: string;
}

const iconOptions = [
    { name: "Dumbbell", component: Dumbbell },
    { name: "BookOpen", component: BookOpen },
    { name: "Award", component: Award },
    { name: "CreditCard", component: CreditCard },
    { name: "Users", component: Users },
];

const gradientOptions = [
    "from-blue-600 via-purple-600 to-orange-600",
    "from-zinc-600 via-gray-500 to-gray-400",
    "from-cyan-600 via-pink-500 to-orange-500",
    "from-yellow-600 via-orange-500 to-red-600",
    "from-purple-600 via-pink-500 to-orange-500",
    "from-green-600 via-blue-600 to-purple-600",
    "from-pink-600 via-red-600 to-yellow-600",
    "from-indigo-600 via-purple-600 to-pink-600",
];

const AddProjectCard = ({ onAdd }: { onAdd: () => void }) => {
    return (
        <button
            type='button'
            onClick={onAdd}
            className='bg-zinc-900 border-2 border-dashed border-zinc-700 hover:bg-zinc-900/60 hover:border-zinc-500 rounded-lg p-3 sm:p-4 transition-colors flex flex-col items-center justify-center min-h-[180px]'
        >
            <div className='flex flex-col items-center gap-2 text-zinc-500 hover:text-zinc-300'>
                <span className='text-xl sm:text-2xl'>+</span>
                <span className='text-xs sm:text-sm font-medium'>Add New Area</span>
            </div>
        </button>
    );
};

const Areas: React.FC = () => {
    const [areas, setAreas] = useState<AreaItem[]>([
        {
            id: 1,
            title: "Health & Fitness",
            icon: <Dumbbell />,
            gradient: "from-blue-600 via-purple-600 to-orange-600",
        },
        {
            id: 2,
            title: "Personal Development",
            icon: < BookOpen/>,
            gradient: "from-zinc-600 via-gray-500 to-gray-400",
        },
        {
            id: 3,
            title: "Skills",
            icon: <Award/>,
            gradient: "from-cyan-600 via-pink-500 to-orange-500",
        },
        {
            id: 4,
            title: "Finance",
            icon: <CreditCard/>,
            gradient: "from-yellow-600 via-orange-500 to-red-600",
        },
        {
            id: 5,
            title: "Agency Clients",
            icon: <Users/>,
            gradient: "from-purple-600 via-pink-500 to-orange-500",
        },
    ]);

    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
    const [editingArea, setEditingArea] = useState<AreaItem | null>(null);
    const [deletingAreaId, setDeletingAreaId] = useState<number | null>(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        iconName: "Dumbbell",
        gradient: gradientOptions[0],
    });

    const handleAddArea = () => {
        const selectedIcon = iconOptions.find(
            (icon) => icon.name === formData.iconName
        );
        if (!selectedIcon || !formData.title.trim()) return;

        const newArea: AreaItem = {
            id: Math.max(...areas.map((a) => a.id)) + 1,
            title: formData.title.trim(),
            icon: <selectedIcon.component />,
            gradient: formData.gradient,
        };

        setAreas([...areas, newArea]);
        setIsAddDialogOpen(false);
        setFormData({
            title: "",
            iconName: "Dumbbell",
            gradient: gradientOptions[0],
        });
    };

    const handleEditArea = () => {
        if (!editingArea || !formData.title.trim()) return;

        const selectedIcon = iconOptions.find(
            (icon) => icon.name === formData.iconName
        );
        if (!selectedIcon) return;

        setAreas(
                    areas.map((area) =>
                        area.id === editingArea.id
                            ? {
                                  ...area,
                                  title: formData.title.trim(),
                                  icon: <selectedIcon.component />,
                                  gradient: formData.gradient,
                              }
                            : area
                    )
                );

        setIsEditDialogOpen(false);
        setEditingArea(null);
        setFormData({
            title: "",
            iconName: "Dumbbell",
            gradient: gradientOptions[0],
        });
    };

    const handleDeleteArea = () => {
        if (deletingAreaId) {
            setAreas(areas.filter((area) => area.id !== deletingAreaId));
            setDeletingAreaId(null);
        }
    };

    const openEditDialog = (area: AreaItem) => {
        setEditingArea(area);
        const iconComponent = React.isValidElement(area.icon) && area.icon.type;
        const iconName =
            iconOptions.find((icon) => icon.component === iconComponent)?.name ||
            "Dumbbell";
        setFormData({
            title: area.title,
            iconName,
            gradient: area.gradient,
        });
        setIsEditDialogOpen(true);
    };

    const openAddDialog = () => {
        setFormData({
            title: "",
            iconName: "Dumbbell",
            gradient: gradientOptions[0],
        });
        setIsAddDialogOpen(true);
    };

    return (
        <div className='min-h-screen bg-zinc-950'>
            <div className='max-w-7xl mx-auto p-4 sm:p-6'>
                {/* Header */}
                <h1 className='text-xl sm:text-2xl md:text-3xl font-light tracking-[0.3em] text-zinc-300'>
                    AREAS
                </h1>
                <Separator className='my-4 bg-zinc-700' />

                {/* Grid */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4'>
                    {areas.map((area) => {
                        return (
                            <div
                                key={area.id}
                                className='relative overflow-hidden rounded-lg bg-zinc-900 border border-zinc-700 hover:bg-zinc-900/60 hover:border-zinc-600 transition-colors min-h-[180px]'
                                onMouseEnter={() => setHoveredCard(area.id)}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                {/* Gradient Background */}
                                <div
                                    className={`absolute inset-0 bg-gradient-to-br ${area.gradient} opacity-80`}
                                ></div>

                                {/* Dark Overlay */}
                                <div className='absolute inset-0 bg-zinc-800 opacity-50'></div>

                                {/* Content */}
                                <div className='relative h-full p-3 sm:p-4 flex flex-col justify-end'>
                                    <div className='flex items-center gap-2 sm:gap-3'>
                                        <div className='w-5 h-5 sm:w-6 sm:h-6 text-white flex-shrink-0'>
                                            {area.icon}
                                        </div>
                                        <h3 className='text-white text-sm sm:text-base font-medium truncate'>
                                            {area.title}
                                        </h3>
                                    </div>
                                </div>

                                {/* Hover Actions */}
                                {hoveredCard === area.id && (
                                    <div className='absolute top-2 sm:top-3 right-2 sm:right-3 flex gap-1'>
                                        <button
                                            type='button'
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openEditDialog(area);
                                            }}
                                            className='p-1 bg-zinc-800 hover:bg-zinc-700 rounded transition-colors'
                                            title='Edit Area'
                                        >
                                            <Edit className='w-4 h-4 sm:w-5 sm:h-5 text-zinc-400 hover:text-zinc-300' />
                                        </button>
                                        <button
                                            type='button'
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setDeletingAreaId(area.id);
                                            }}
                                            className='p-1 bg-zinc-800 hover:bg-red-600 rounded transition-colors'
                                            title='Delete Area'
                                        >
                                            <Trash2 className='w-4 h-4 sm:w-5 sm:h-5 text-zinc-400 hover:text-white' />
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    <AddProjectCard onAdd={openAddDialog} />
                </div>

                {/* Add Dialog */}
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogContent className='bg-zinc-900 border-zinc-700 text-white max-w-[95vw] sm:max-w-md p-4 sm:p-6'>
                        <DialogHeader>
                            <DialogTitle className='text-base sm:text-lg font-medium'>Add New Area</DialogTitle>
                            <DialogDescription className='text-zinc-400 text-xs sm:text-sm'>
                                Create a new area card with custom title, icon, and gradient.
                            </DialogDescription>
                        </DialogHeader>
                        <div className='space-y-4 py-4'>
                            <div className='space-y-2'>
                                <Label htmlFor='title' className='text-xs sm:text-sm font-medium text-zinc-400'>
                                    Title
                                </Label>
                                <Input
                                    id='title'
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            title: e.target.value,
                                        })
                                    }
                                    className='w-full px-3 py-2 bg-zinc-800 border-zinc-700 text-white text-xs sm:text-sm focus:border-zinc-500'
                                    placeholder='Enter area title'
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='icon' className='text-xs sm:text-sm font-medium text-zinc-400'>
                                    Icon
                                </Label>
                                <select
                                    id='icon'
                                    value={formData.iconName}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            iconName: e.target.value,
                                        })
                                    }
                                    className='w-full px-3 py-2 bg-zinc-800 border-zinc-700 text-white text-xs sm:text-sm rounded focus:border-zinc-500'
                                >
                                    {iconOptions.map((icon) => (
                                        <option key={icon.name} value={icon.name}>
                                            {icon.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='gradient' className='text-xs sm:text-sm font-medium text-zinc-400'>
                                    Gradient
                                </Label>
                                <select
                                    id='gradient'
                                    value={formData.gradient}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            gradient: e.target.value,
                                        })
                                    }
                                    className='w-full px-3 py-2 bg-zinc-800 border-zinc-700 text-white text-xs sm:text-sm rounded focus:border-zinc-500'
                                >
                                    {gradientOptions.map((gradient, index) => (
                                        <option key={index} value={gradient}>
                                            Gradient {index + 1}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <DialogFooter className='flex flex-col sm:flex-row gap-2 sm:gap-4'>
                            <button
                                type='button'
                                onClick={() => setIsAddDialogOpen(false)}
                                className='px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-100 rounded text-xs sm:text-sm transition-colors'
                            >
                                Cancel
                            </button>
                            <button
                                type='button'
                                onClick={handleAddArea}
                                disabled={!formData.title.trim()}
                                className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs sm:text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                Add Area
                            </button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Edit Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className='bg-zinc-900 border-zinc-700 text-white max-w-[95vw] sm:max-w-md p-4 sm:p-6'>
                        <DialogHeader>
                            <DialogTitle className='text-base sm:text-lg font-medium'>Edit Area</DialogTitle>
                            <DialogDescription className='text-zinc-400 text-xs sm:text-sm'>
                                Modify the area card details.
                            </DialogDescription>
                        </DialogHeader>
                        <div className='space-y-4 py-4'>
                            <div className='space-y-2'>
                                <Label htmlFor='edit-title' className='text-xs sm:text-sm font-medium text-zinc-400'>
                                    Title
                                </Label>
                                <Input
                                    id='edit-title'
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            title: e.target.value,
                                        })
                                    }
                                    className='w-full px-3 py-2 bg-zinc-800 border-zinc-700 text-white text-xs sm:text-sm focus:border-zinc-500'
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='edit-icon' className='text-xs sm:text-sm font-medium text-zinc-400'>
                                    Icon
                                </Label>
                                <select
                                    id='edit-icon'
                                    value={formData.iconName}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            iconName: e.target.value,
                                        })
                                    }
                                    className='w-full px-3 py-2 bg-zinc-800 border-zinc-700 text-white text-xs sm:text-sm rounded focus:border-zinc-500'
                                >
                                    {iconOptions.map((icon) => (
                                        <option key={icon.name} value={icon.name}>
                                            {icon.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='edit-gradient' className='text-xs sm:text-sm font-medium text-zinc-400'>
                                    Gradient
                                </Label>
                                <select
                                    id='edit-gradient'
                                    value={formData.gradient}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            gradient: e.target.value,
                                        })
                                    }
                                    className='w-full px-3 py-2 bg-zinc-800 border-zinc-700 text-white text-xs sm:text-sm rounded focus:border-zinc-500'
                                >
                                    {gradientOptions.map((gradient, index) => (
                                        <option key={index} value={gradient}>
                                            Gradient {index + 1}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <DialogFooter className='flex flex-col sm:flex-row gap-2 sm:gap-4'>
                            <button
                                type='button'
                                onClick={() => setIsEditDialogOpen(false)}
                                className='px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-100 rounded text-xs sm:text-sm transition-colors'
                            >
                                Cancel
                            </button>
                            <button
                                type='button'
                                onClick={handleEditArea}
                                disabled={!formData.title.trim()}
                                className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs sm:text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                Save Changes
                            </button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Alert Dialog */}
                <AlertDialog open={deletingAreaId !== null}>
                    <AlertDialogContent className='bg-zinc-900 border-zinc-700 text-white max-w-[95vw] sm:max-w-md p-4 sm:p-6'>
                        <AlertDialogHeader>
                            <AlertDialogTitle className='text-base sm:text-lg font-medium'>
                                Are you sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription className='text-zinc-400 text-xs sm:text-sm'>
                                This action cannot be undone. This will permanently delete the area card.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className='flex flex-col sm:flex-row gap-2 sm:gap-4'>
                            <AlertDialogCancel
                                onClick={() => setDeletingAreaId(null)}
                                className='px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-100 rounded text-xs sm:text-sm transition-colors'
                            >
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDeleteArea}
                                className='px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs sm:text-sm transition-colors'
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
};

export default Areas;