import React, { useState } from "react";
import {
    Plus,
    Edit2,
    Trash2,
    User,
    Mail,
    Phone,
    Briefcase,
    Circle,
    Users,
} from "lucide-react";
import { Separator } from "../ui/separator";

// Types
interface TeamMember {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    position: string;
    status: "Active" | "Employee" | "Founder";
    clients: string[];
    projects: string[];
    tasks: string[];
}

interface Column {
    id: Exclude<keyof TeamMember, "id" | "clients" | "projects" | "tasks">;
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

const TeamMembersTable: React.FC = () => {
    // Data from the image
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
        {
            id: "1",
            name: "Tush",
            email: "businesswithtush@gmail.com",
            phoneNumber: "+91970401116",
            position: "Chief Operating Officer",
            status: "Active",
            clients: ["Daniel J", "Roge", "Kael", "Hamza"],
            projects: [],
            tasks: [],
        },
        {
            id: "2",
            name: "Nick",
            email: "narsheghe074@gmail.com",
            phoneNumber: "+919184025830",
            position: "Head Graphics Designer",
            status: "Employee",
            clients: ["Nathan"],
            projects: [],
            tasks: [],
        },
        {
            id: "3",
            name: "Maan",
            email: "maan0520@gmail.com",
            phoneNumber: "+919381123205",
            position: "Head Content generator",
            status: "Employee",
            clients: ["Nathan"],
            projects: [],
            tasks: [],
        },
        {
            id: "4",
            name: "Chanda",
            email: "Cpratha752@gmail.com",
            phoneNumber: "+919781038588",
            position: "UI/UX Designer",
            status: "Employee",
            clients: [],
            projects: [],
            tasks: [],
        },
        {
            id: "5",
            name: "Parth",
            email: "parthdesign77@gmail.com",
            phoneNumber: "8239136284",
            position: "Junior Graphics Designer",
            status: "Employee",
            clients: [],
            projects: [],
            tasks: [],
        },
        {
            id: "6",
            name: "Emer",
            email: "kumarikrish135@gmail.com",
            phoneNumber: "+919803038986",
            position: "Head video ex.",
            status: "Employee",
            clients: [],
            projects: [],
            tasks: [],
        },
        {
            id: "7",
            name: "Fais",
            email: "",
            phoneNumber: "",
            position: "",
            status: "Founder",
            clients: [
                "Imran Syal",
                "Kupid AI",
                "John",
                "Prashant",
                "Gymbag",
                "SATCOM",
                "Card Game",
                "Sumit Arora",
            ],
            projects: [],
            tasks: [],
        },
    ]);

    const [columns, setColumns] = useState<Column[]>([
        { id: "name", label: "Name", icon: <User className='w-5 h-5' /> },
        { id: "email", label: "Email", icon: <Mail className='w-5 h-5' /> },
        {
            id: "phoneNumber",
            label: "Phone Number",
            icon: <Phone className='w-5 h-5' />,
        },
        {
            id: "position",
            label: "Position",
            icon: <Briefcase className='w-5 h-5' />,
        },
        { id: "status", label: "Status", icon: <Circle className='w-5 h-5' /> },
    ]);

    // Modal states
    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
    const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
    const [deletingMemberId, setDeletingMemberId] = useState<string | null>(
        null
    );

    // Form states
    const [memberForm, setMemberForm] = useState<{
        name: string;
        email: string;
        phoneNumber: string;
        position: string;
        status: "Active" | "Employee" | "Founder";
    }>({
        name: "",
        email: "",
        phoneNumber: "",
        position: "",
        status: "Employee",
    });

    const [clientsInput, setClientsInput] = useState<string>(""); // New state for client input
    const [newColumnLabel, setNewColumnLabel] = useState("");

    // Team Member CRUD operations
    const handleAddMember = () => {
        const newClients = clientsInput
            .split(",")
            .map((client) => client.trim())
            .filter((client) => client !== "");
        const newMember: TeamMember = {
            id: Date.now().toString(),
            ...memberForm,
            clients: newClients,
            projects: [],
            tasks: [],
        };
        setTeamMembers([...teamMembers, newMember]);
        setMemberForm({
            name: "",
            email: "",
            phoneNumber: "",
            position: "",
            status: "Employee",
        });
        setClientsInput("");
        setIsMemberModalOpen(false);
    };

    const handleEditMember = (member: TeamMember) => {
        setEditingMember(member);
        setMemberForm({
            name: member.name,
            email: member.email,
            phoneNumber: member.phoneNumber,
            position: member.position,
            status: member.status,
        });
        setClientsInput(member.clients.join(", "));
        setIsMemberModalOpen(true);
    };

    const handleUpdateMember = () => {
        if (editingMember) {
            const updatedClients = clientsInput
                .split(",")
                .map((client) => client.trim())
                .filter((client) => client !== "");
            setTeamMembers(
                teamMembers.map((member) =>
                    member.id === editingMember.id
                        ? {
                              ...editingMember,
                              ...memberForm,
                              clients: updatedClients,
                              projects: editingMember.projects,
                              tasks: editingMember.tasks,
                          }
                        : member
                )
            );
            setEditingMember(null);
            setMemberForm({
                name: "",
                email: "",
                phoneNumber: "",
                position: "",
                status: "Employee",
            });
            setClientsInput("");
            setIsMemberModalOpen(false);
        }
    };

    const handleDeleteMember = (memberId: string) => {
        setDeletingMemberId(memberId);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteMember = () => {
        if (deletingMemberId) {
            setTeamMembers(
                teamMembers.filter((member) => member.id !== deletingMemberId)
            );
            setDeletingMemberId(null);
            setIsDeleteModalOpen(false);
        }
    };

    // Column operations
    const handleAddColumn = () => {
        if (newColumnLabel.trim()) {
            const newColumnId = newColumnLabel
                .toLowerCase()
                .replace(/\s+/g, "") as Exclude<
                keyof TeamMember,
                "id" | "clients" | "projects" | "tasks"
            >;
            const newColumn: Column = {
                id: newColumnId,
                label: newColumnLabel,
                icon: <Briefcase className='w-5 h-5' />,
            };
            setColumns([...columns, newColumn]);

            setTeamMembers(
                teamMembers.map((member) => ({
                    ...member,
                    [newColumnId]: "",
                }))
            );

            setNewColumnLabel("");
            setIsColumnModalOpen(false);
        }
    };

    const handleRemoveColumn = (columnId: keyof TeamMember) => {
        if (columns.length > 1) {
            setColumns(columns.filter((col) => col.id !== columnId));
            setTeamMembers(
                teamMembers.map((member) => {
                    const { [columnId]: removed, ...rest } = member;
                    return rest as TeamMember;
                })
            );
        }
    };

    return (
        <div className='w-full max-w-7xl mx-auto bg-zinc-950 text-white min-h-screen p-6'>
            {/* Header */}
            <div className='mb-6'>
                <div className='flex items-center justify-between'>
                    <h1 className='text-xl sm:text-2xl md:text-3xl font-light tracking-[0.3em] text-zinc-300'>
                        TEAM MEMBERS
                    </h1>
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
                            <th className='text-left p-4'>
                                <div className='flex items-center space-x-2'>
                                    <Users className='w-5 h-5' />
                                    <span className='text-sm font-medium text-zinc-300'>
                                        Clients
                                    </span>
                                </div>
                            </th>
                            <th className='w-24 p-4'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {teamMembers.map((member) => (
                            <tr
                                key={member.id}
                                className='border-b border-zinc-800  group transition-colors'
                            >
                                {columns.map((column) => (
                                    <td
                                        key={column.id}
                                        className='p-4 text-sm text-zinc-300'
                                    >
                                        {column.id === "status" ? (
                                            <span className='flex items-center space-x-2'>
                                                <Circle
                                                    className={`w-3 h-3 ${
                                                        member.status ===
                                                        "Active"
                                                            ? "text-green-500"
                                                            : member.status ===
                                                              "Employee"
                                                            ? "text-blue-500"
                                                            : "text-red-500"
                                                    }`}
                                                />
                                                <span>{member.status}</span>
                                            </span>
                                        ) : (
                                            member[column.id]
                                        )}
                                    </td>
                                ))}
                                <td className='p-4 text-sm text-zinc-300'>
                                    {member.clients.length > 0 ? (
                                        <ul className='list-disc list-inside'>
                                            {member.clients.map(
                                                (client, index) => (
                                                    <li key={index}>
                                                        {client}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    ) : (
                                        "-"
                                    )}
                                </td>
                                <td className='p-4'>
                                    <div className='flex space-x-2 opacity-0 group-hover:opacity-100'>
                                        <button
                                            onClick={() =>
                                                handleEditMember(member)
                                            }
                                            className='p-2 hover:bg-zinc-800 rounded text-zinc-400 transition-colors'
                                        >
                                            <Edit2 className='w-4 h-4' />
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDeleteMember(member.id)
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
                    onClick={() => setIsMemberModalOpen(true)}
                >
                    + New Member
                </div>
            </div>

            {/* Member Modal */}
            <Modal
                isOpen={isMemberModalOpen}
                onClose={() => {
                    setIsMemberModalOpen(false);
                    setEditingMember(null);
                    setMemberForm({
                        name: "",
                        email: "",
                        phoneNumber: "",
                        position: "",
                        status: "Employee",
                    });
                    setClientsInput("");
                }}
            >
                <h3 className='text-xl font-semibold text-white mb-6'>
                    {editingMember ? "Edit Member" : "Add New Member"}
                </h3>
                <div className='space-y-5'>
                    {columns.map((column) => (
                        <div key={column.id}>
                            <label className='block text-sm font-medium text-zinc-300 mb-2'>
                                {column.label}
                            </label>
                            {column.id === "status" ? (
                                <select
                                    value={memberForm.status}
                                    onChange={(e) =>
                                        setMemberForm({
                                            ...memberForm,
                                            status: e.target.value as
                                                | "Active"
                                                | "Employee"
                                                | "Founder",
                                        })
                                    }
                                    className='w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-zinc-600 transition-colors'
                                >
                                    <option value='Active'>Active</option>
                                    <option value='Employee'>Employee</option>
                                    <option value='Founder'>Founder</option>
                                </select>
                            ) : (
                                <input
                                    type='text'
                                    value={memberForm[column.id]}
                                    onChange={(e) =>
                                        setMemberForm({
                                            ...memberForm,
                                            [column.id]: e.target.value,
                                        })
                                    }
                                    className='w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-zinc-600 transition-colors'
                                    placeholder={`Enter ${column.label.toLowerCase()}`}
                                />
                            )}
                        </div>
                    ))}
                    <div>
                        <label className='block text-sm font-medium text-zinc-300 mb-2'>
                            Clients (comma-separated)
                        </label>
                        <input
                            type='text'
                            value={clientsInput}
                            onChange={(e) => setClientsInput(e.target.value)}
                            className='w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-zinc-600 transition-colors'
                            placeholder='Enter client names (e.g., John, Jane, Bob)'
                        />
                    </div>
                    <div className='flex justify-end space-x-4 pt-6'>
                        <button
                            onClick={() => {
                                setIsMemberModalOpen(false);
                                setEditingMember(null);
                                setMemberForm({
                                    name: "",
                                    email: "",
                                    phoneNumber: "",
                                    position: "",
                                    status: "Employee",
                                });
                                setClientsInput("");
                            }}
                            className='px-4 py-2 text-zinc-400 hover:text-white transition-colors rounded-lg'
                        >
                            Cancel
                        </button>
                        <button
                            onClick={
                                editingMember
                                    ? handleUpdateMember
                                    : handleAddMember
                            }
                            className='px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors shadow-md'
                        >
                            {editingMember ? "Update" : "Add"} Member
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
                    setDeletingMemberId(null);
                }}
                onConfirm={confirmDeleteMember}
                title='Delete Member'
                description='Are you sure you want to delete this team member? This action cannot be undone.'
            />
        </div>
    );
};

export default TeamMembersTable;
