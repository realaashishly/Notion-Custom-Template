import React, { useState } from "react";
import {
    Plus,
    Edit2,
    Trash2,
    User,
    FileText,
    Target,
    UserCheck,
    DollarSign,
    StickyNote,
} from "lucide-react";
import { Separator } from "../ui/separator";

// Types
interface Client {
    id: string;
    name: string;
    guidelines: string;
    projects: string;
    assigned: string;
    cost: string;
    notes: string;
}

interface Column {
    id: Exclude<keyof Client, "id">;
    label: string;
    icon: React.ReactNode;
}

// Modal Components
const Modal = ({
    isOpen,
    onClose,
    children,
}: {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}) => {
    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center'>
            <div className='fixed inset-0 bg-zinc-900/50' onClick={onClose} />
            <div className='relative bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-lg mx-4 shadow-2xl'>
                {children}
            </div>
        </div>
    );
};

const AlertDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
}) => {
    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center'>
            <div className='fixed inset-0 bg-zinc-900/50' onClick={onClose} />
            <div className='relative bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-lg mx-4 shadow-2xl'>
                <h3 className='text-xl font-semibold text-white mb-3'>
                    {title}
                </h3>
                <p className='text-zinc-400 mb-6'>{description}</p>
                <div className='flex justify-end space-x-4'>
                    <button
                        onClick={onClose}
                        className='px-4 py-2 text-zinc-400 hover:text-white transition-colors rounded-lg'
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className='px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors'
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

const ClientPortalTable: React.FC = () => {
    // Sample data
    const [clients, setClients] = useState<Client[]>([
        {
            id: "1",
            name: "Daniel J - Casino",
            guidelines: "Guidelines",
            projects: "Projects",
            assigned: "Tesh",
            cost: "Cost",
            notes: "Notes",
        },
        {
            id: "2",
            name: "Me Roge",
            guidelines: "Guidelines",
            projects: "Projects",
            assigned: "Tesh",
            cost: "Cost",
            notes: "Notes",
        },
        {
            id: "3",
            name: "Kael - Mini Hostel",
            guidelines: "Guidelines",
            projects: "Projects",
            assigned: "Tesh",
            cost: "Cost",
            notes: "Notes",
        },
        {
            id: "4",
            name: "Hamza - Icons",
            guidelines: "Guidelines",
            projects: "Projects",
            assigned: "Tesh",
            cost: "Cost",
            notes: "Notes",
        },
        {
            id: "5",
            name: "Nathan - Thumbnails",
            guidelines: "Guidelines",
            projects: "Projects",
            assigned: "Maan",
            cost: "Cost",
            notes: "Notes",
        },
    ]);

    const [columns, setColumns] = useState<Column[]>([
        {
            id: "name",
            label: "Client/Jobs",
            icon: <User className='w-5 h-5' />,
        },
        {
            id: "guidelines",
            label: "Guidelines",
            icon: <FileText className='w-5 h-5' />,
        },
        {
            id: "projects",
            label: "Projects",
            icon: <Target className='w-5 h-5' />,
        },
        {
            id: "assigned",
            label: "Assigned",
            icon: <UserCheck className='w-5 h-5' />,
        },
        { id: "cost", label: "Cost", icon: <DollarSign className='w-5 h-5' /> },
        {
            id: "notes",
            label: "Notes",
            icon: <StickyNote className='w-5 h-5' />,
        },
    ]);

    // Modal states
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);
    const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [deletingClientId, setDeletingClientId] = useState<string | null>(
        null
    );

    // Form states
    const [clientForm, setClientForm] = useState<{
        [K in Exclude<keyof Client, "id">]: string;
    }>({
        name: "",
        guidelines: "",
        projects: "",
        assigned: "",
        cost: "",
        notes: "",
    });

    const [newColumnLabel, setNewColumnLabel] = useState("");

    // Client CRUD operations
    const handleAddClient = () => {
        const newClient: Client = {
            id: Date.now().toString(),
            ...clientForm,
        };
        setClients([...clients, newClient]);
        setClientForm({
            name: "",
            guidelines: "",
            projects: "",
            assigned: "",
            cost: "",
            notes: "",
        });
        setIsClientModalOpen(false);
    };

    const handleEditClient = (client: Client) => {
        setEditingClient(client);
        setClientForm({
            name: client.name,
            guidelines: client.guidelines,
            projects: client.projects,
            assigned: client.assigned,
            cost: client.cost,
            notes: client.notes,
        });
        setIsClientModalOpen(true);
    };

    const handleUpdateClient = () => {
        if (editingClient) {
            setClients(
                clients.map((client) =>
                    client.id === editingClient.id
                        ? { ...editingClient, ...clientForm }
                        : client
                )
            );
            setEditingClient(null);
            setClientForm({
                name: "",
                guidelines: "",
                projects: "",
                assigned: "",
                cost: "",
                notes: "",
            });
            setIsClientModalOpen(false);
        }
    };

    const handleDeleteClient = (clientId: string) => {
        setDeletingClientId(clientId);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteClient = () => {
        if (deletingClientId) {
            setClients(
                clients.filter((client) => client.id !== deletingClientId)
            );
            setDeletingClientId(null);
            setIsDeleteModalOpen(false);
        }
    };

    // Column operations
    const handleAddColumn = () => {
        if (newColumnLabel.trim()) {
            const newColumnId = newColumnLabel
                .toLowerCase()
                .replace(/\s+/g, "") as Exclude<keyof Client, "id">;
            const newColumn: Column = {
                id: newColumnId,
                label: newColumnLabel,
                icon: <FileText className='w-5 h-5' />,
            };
            setColumns([...columns, newColumn]);

            // Add empty data for new column to all clients
            setClients(
                clients.map((client) => ({
                    ...client,
                    [newColumnId]: "",
                }))
            );

            setNewColumnLabel("");
            setIsColumnModalOpen(false);
        }
    };

    const handleRemoveColumn = (columnId: keyof Client) => {
        if (columns.length > 1) {
            setColumns(columns.filter((col) => col.id !== columnId));
            setClients(
                clients.map((client) => {
                    const { [columnId]: _removed, ...rest } = client;
                    return rest as Client;
                })
            );
        }
    };

    return (
        <div className='w-full max-w-7xl mx-auto bg-zinc-950 text-white min-h-screen p-6'>
            {/* Header */}
            <div className='mb-6 flex items-center justify-between'>
                <h1 className='text-xl sm:text-2xl md:text-3xl font-light tracking-[0.3em] text-zinc-300'>
                    CLIENT PORTALS
                </h1>

                <div className='flex items-center justify-between'>
                    <div className='flex space-x-4'>
                        <button
                            onClick={() => setIsColumnModalOpen(true)}
                            className='px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm transition-colors flex items-center space-x-2 shadow-md'
                        >
                            <Plus className='w-5 h-5' />
                            <span>Add Column</span>
                        </button>
                    </div>
                </div>
            </div>

            <Separator className='mb-6' />

            {/* Main Table */}
            <div className='flex-1 overflow-x-auto bg-zinc-900 rounded-xl shadow-xl border border-zinc-800'>
                <table className='w-full'>
                    <thead>
                        <tr className='border-b border-zinc-800'>
                            {columns.map((column) => (
                                <th
                                    key={column.id}
                                    className='text-left p-4 group'
                                >
                                    <div className='flex items-center justify-between'>
                                        <div className='flex items-center space-x-2'>
                                            {column.icon}
                                            <span className='text-sm font-medium text-zinc-300'>
                                                {column.label}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() =>
                                                handleRemoveColumn(column.id)
                                            }
                                            className='opacity-0 group-hover:opacity-100 p-2 hover:bg-zinc-800 rounded text-zinc-400 cursor-pointer transition-colors'
                                        >
                                            <Trash2 className='w-4 h-4' />
                                        </button>
                                    </div>
                                </th>
                            ))}
                            <th className='w-24 p-4'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((client) => (
                            <tr
                                key={client.id}
                                className='border-b border-zinc-800  group transition-colors'
                            >
                                {columns.map((column) => (
                                    <td
                                        key={column.id}
                                        className='p-4 text-sm text-zinc-300'
                                    >
                                        {client[column.id]}
                                    </td>
                                ))}
                                <td className='p-4'>
                                    <div className='flex space-x-2 opacity-0 group-hover:opacity-100'>
                                        <button
                                            onClick={() =>
                                                handleEditClient(client)
                                            }
                                            className='p-2 hover:bg-zinc-800 rounded text-zinc-400 transition-colors'
                                        >
                                            <Edit2 className='w-4 h-4' />
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDeleteClient(client.id)
                                            }
                                            className='p-2 hover:bg-zinc-800 rounded text-zinc-400 transition-colors'
                                        >
                                            <Trash2 className='w-4 h-4' />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div
                    className='w-full border-t border-zinc-800 p-4 text-zinc-400 hover:text-white transition-colors cursor-pointer text-sm'
                    onClick={() => setIsClientModalOpen(true)}
                >
                    + New Client
                </div>
            </div>

            {/* Client Modal */}
            <Modal
                isOpen={isClientModalOpen}
                onClose={() => {
                    setIsClientModalOpen(false);
                    setEditingClient(null);
                    setClientForm({
                        name: "",
                        guidelines: "",
                        projects: "",
                        assigned: "",
                        cost: "",
                        notes: "",
                    });
                }}
            >
                <h3 className='text-xl font-semibold text-white mb-6'>
                    {editingClient ? "Edit Client" : "Add New Client"}
                </h3>
                <div className='space-y-5'>
                    {columns.map((column) => (
                        <div key={column.id}>
                            <label className='block text-sm font-medium text-zinc-300 mb-2'>
                                {column.label}
                            </label>
                            <input
                                type='text'
                                value={clientForm[column.id]}
                                onChange={(e) =>
                                    setClientForm({
                                        ...clientForm,
                                        [column.id]: e.target.value,
                                    })
                                }
                                className='w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-zinc-600 transition-colors'
                                placeholder={`Enter ${column.label.toLowerCase()}`}
                            />
                        </div>
                    ))}
                    <div className='flex justify-end space-x-4 pt-6'>
                        <button
                            onClick={() => {
                                setIsClientModalOpen(false);
                                setEditingClient(null);
                                setClientForm({
                                    name: "",
                                    guidelines: "",
                                    projects: "",
                                    assigned: "",
                                    cost: "",
                                    notes: "",
                                });
                            }}
                            className='px-4 py-2 text-zinc-400 hover:text-white transition-colors rounded-lg'
                        >
                            Cancel
                        </button>
                        <button
                            onClick={
                                editingClient
                                    ? handleUpdateClient
                                    : handleAddClient
                            }
                            className='px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors shadow-md'
                        >
                            {editingClient ? "Update" : "Add"} Client
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Column Modal */}
            <Modal
                isOpen={isColumnModalOpen}
                onClose={() => {
                    setIsColumnModalOpen(false);
                    setNewColumnLabel("");
                }}
            >
                <h3 className='text-xl font-semibold text-white mb-6'>
                    Add New Column
                </h3>
                <div className='space-y-5'>
                    <div>
                        <label className='block text-sm font-medium text-zinc-300 mb-2'>
                            Column Label
                        </label>
                        <input
                            type='text'
                            value={newColumnLabel}
                            onChange={(e) => setNewColumnLabel(e.target.value)}
                            className='w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-zinc-600 transition-colors'
                            placeholder='Enter column name'
                        />
                    </div>
                    <div className='flex justify-end space-x-4 pt-6'>
                        <button
                            onClick={() => {
                                setIsColumnModalOpen(false);
                                setNewColumnLabel("");
                            }}
                            className='px-4 py-2 text-zinc-400 hover:text-white transition-colors rounded-lg'
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAddColumn}
                            className='px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors shadow-md'
                        >
                            Add Column
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <AlertDialog
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setDeletingClientId(null);
                }}
                onConfirm={confirmDeleteClient}
                title='Delete Client'
                description='Are you sure you want to delete this client? This action cannot be undone.'
            />
        </div>
    );
};

export default ClientPortalTable;
