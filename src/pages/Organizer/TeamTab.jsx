import { useState, useEffect } from "react";
import {
    DirectionAwareMenu,
    MenuItem,
    MenuSeparator,
    MenuTrigger,
} from "../../components/ui/DirectionAwareMenu";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "../../components/ui/Dailog";
import { Ellipsis } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const statusIcons = {
    active: (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="16"
            viewBox="0 0 17 16"
            fill="none"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.25 15C10.1065 15 11.887 14.2625 13.1997 12.9497C14.5125 11.637 15.25 9.85652 15.25 8C15.25 6.14348 14.5125 4.36301 13.1997 3.05025C11.887 1.7375 10.1065 1 8.25 1C6.39348 1 4.61301 1.7375 3.30025 3.05025C1.9875 4.36301 1.25 6.14348 1.25 8C1.25 9.85652 1.9875 11.637 3.30025 12.9497C4.61301 14.2625 6.39348 15 8.25 15ZM12.094 6.209C12.2157 6.05146 12.2699 5.85202 12.2446 5.65454C12.2193 5.45706 12.1165 5.27773 11.959 5.156C11.8015 5.03427 11.602 4.9801 11.4045 5.00542C11.2071 5.03073 11.0277 5.13346 10.906 5.291L7.206 10.081L5.557 8.248C5.49174 8.17247 5.41207 8.11073 5.32264 8.06639C5.23322 8.02205 5.13584 7.99601 5.03622 7.98978C4.9366 7.98356 4.83674 7.99729 4.7425 8.03016C4.64825 8.06303 4.56151 8.11438 4.48737 8.1812C4.41322 8.24803 4.35316 8.32898 4.31071 8.41931C4.26825 8.50965 4.24425 8.60755 4.24012 8.70728C4.23599 8.807 4.25181 8.90656 4.28664 9.00009C4.32148 9.09363 4.37464 9.17927 4.443 9.252L6.693 11.752C6.76649 11.8335 6.85697 11.8979 6.95806 11.9406C7.05915 11.9833 7.16838 12.0034 7.27805 11.9993C7.38772 11.9952 7.49515 11.967 7.59277 11.9169C7.69038 11.8667 7.7758 11.7958 7.843 11.709L12.094 6.209Z"
                fill="#10B981"
            />
        </svg>
    ),
    inactive: (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="16"
            viewBox="0 0 17 16"
            fill="none"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.25 15C10.1065 15 11.887 14.2625 13.1997 12.9497C14.5125 11.637 15.25 9.85652 15.25 8C15.25 6.14348 14.5125 4.36301 13.1997 3.05025C11.887 1.7375 10.1065 1 8.25 1C6.39348 1 4.61301 1.7375 3.30025 3.05025C1.9875 4.36301 1.25 6.14348 1.25 8C1.25 9.85652 1.9875 11.637 3.30025 12.9497C4.61301 14.2625 6.39348 15 8.25 15ZM11.03 10.78C10.8894 10.9205 10.6988 10.9993 10.5 10.9993C10.3012 10.9993 10.1106 10.9205 9.97 10.78L8.25 9.06L6.53 10.78C6.46134 10.8537 6.37854 10.9128 6.28654 10.9538C6.19454 10.9948 6.09523 11.0168 5.99452 11.0186C5.89382 11.0204 5.79379 11.0018 5.7004 10.9641C5.60701 10.9264 5.52218 10.8703 5.45096 10.799C5.37974 10.7278 5.3236 10.643 5.28588 10.5496C5.24816 10.4562 5.22963 10.3562 5.23141 10.2555C5.23319 10.1548 5.25523 10.0555 5.29622 9.96346C5.33721 9.87146 5.39631 9.78866 5.47 9.72L7.19 8L5.47 6.28C5.33752 6.13783 5.2654 5.94978 5.26883 5.75548C5.27225 5.56118 5.35097 5.37579 5.48838 5.23838C5.62579 5.10097 5.81118 5.02225 6.00548 5.01883C6.19978 5.0154 6.38783 5.08752 6.53 5.22L8.25 6.94L9.97 5.22C10.0387 5.14631 10.1215 5.08721 10.2135 5.04622C10.3055 5.00523 10.4048 4.98319 10.5055 4.98141C10.6062 4.97963 10.7062 4.99816 10.7996 5.03588C10.893 5.0736 10.9778 5.12974 11.049 5.20096C11.1203 5.27218 11.1764 5.35701 11.2141 5.4504C11.2518 5.54379 11.2704 5.64382 11.2686 5.74452C11.2668 5.84523 11.2448 5.94454 11.2038 6.03654C11.1628 6.12854 11.1037 6.21134 11.03 6.28L9.31 8L11.03 9.72C11.1705 9.86063 11.2493 10.0512 11.2493 10.25C11.2493 10.4488 11.1705 10.6394 11.03 10.78Z"
                fill="white"
                fillOpacity="0.4"
            />
        </svg>
    ),
};

const roles = ["Manager", "Admin", "Door staff"];

// Sample data for members
const sampleMembers = [
    {
        id: 1,
        name: "John Smith",
        phone: "+1234 5678",
        role: "Manager",
        status: "active",
    },
    {
        id: 2,
        name: "Emma Davis",
        phone: "+1234 5678",
        role: "Admin",
        status: "active",
    },
    {
        id: 3,
        name: "Sarah Wilson",
        phone: "+1234 5678",
        role: "Door staff",
        status: "active",
    },
    {
        id: 4,
        name: "Mike Brown",
        phone: "+1234 5678",
        role: "Door staff",
        status: "inactive",
    },
    {
        id: 5,
        name: "Alex Lee",
        phone: "+1234 5678",
        role: "Door staff",
        status: "active",
    },
];

const newMemberSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    phoneNumber: z.string().min(1, "Phone number is required"),
    role: z.string().min(1, "Role is required"),
});

const editMemberSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    phoneNumber: z.string().min(1, "Phone number is required"),
    role: z.string().min(1, "Role is required"),
});

export default function TeamTab() {
    const [members] = useState(sampleMembers);
    const [selectedMember, setSelectedMember] = useState(null);
    const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [newMemberDialogOpen, setNewMemberDialogOpen] = useState(false);
    const [editMemberDialogOpen, setEditMemberDialogOpen] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const [removeMemberDialogOpen, setRemoveMemberDialogOpen] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        setValue,
        watch,
    } = useForm({
        resolver: zodResolver(newMemberSchema),
        defaultValues: {
            fullName: "",
            phoneNumber: "",
            role: roles[0],
            events: [],
        },
    });

    const {
        register: registerEdit,
        handleSubmit: handleSubmitEdit,
        formState: { errors: editErrors, isValid: isEditValid },
        setValue: setEditValue,
        watch: watchEdit,
        reset: resetEdit,
    } = useForm({
        resolver: zodResolver(editMemberSchema),
        defaultValues: {
            fullName: "",
            phoneNumber: "",
            role: roles[0],
            events: [],
        },
    });

    useEffect(() => {
        if (selectedMember && editMemberDialogOpen) {
            resetEdit({
                fullName: selectedMember.name,
                phoneNumber: selectedMember.phone.replace("+1", ""),
                role: selectedMember.role,
            });
        }
    }, [selectedMember, editMemberDialogOpen, resetEdit]);

    const onSubmit = (data) => {
        console.log("Form data:", data);
        setNewMemberDialogOpen(false);
    };

    const onEditSubmit = (data) => {
        console.log("Edit member data:", data);
        setEditMemberDialogOpen(false);
    };

    const filteredMembers = members.filter((member) => {
        const matchesStatus =
            selectedStatus === "all" || member.status === selectedStatus;
        const matchesSearch =
            searchQuery.trim() === "" ||
            member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.status.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesStatus && matchesSearch;
    });

    return (
        <div>
            <div className="@container grid gap-9">
                <div className="grid @4xl:grid-cols-3 gap-4 h-fit">
                    <div className="border border-white/10 p-4 rounded-xl h-full flex flex-col gap-y-3">
                        <h2 className="font-medium text-white/70 text-sm">Total members</h2>
                        <p className="text-2xl font-medium">12</p>
                    </div>
                    <div className="border border-white/10 p-4 rounded-xl h-full flex flex-col gap-y-3">
                        <h2 className="font-medium text-white/70 text-sm">
                            Active members
                        </h2>
                        <p className="text-2xl font-medium">10</p>
                    </div>
                    <div className="border border-white/10 p-4 rounded-xl h-full flex flex-col gap-y-3">
                        <h2 className="font-medium text-white/70 text-sm">Door staff</h2>
                        <p className="text-2xl font-medium">8</p>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col h-fit @4xl:flex-row items-start @4xl:items-center justify-start @4xl:justify-between gap-4">
                    <div className="flex items-center gap-2 h-fit">
                        <button
                            onClick={() => setNewMemberDialogOpen(true)}
                            className="flex items-center gap-2 border border-white/10 hover:bg-white/10 transition-colors px-4 py-2 rounded-full text-sm font-medium"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                            >
                                <path
                                    d="M8 3.33337V12.6667M3.33333 8.00004H12.6667"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            New member
                        </button>
                    </div>
                    <div className="relative w-full @4xl:w-fit flex justify-end h-fit">
                        <input
                            type="text"
                            placeholder="Search members..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-10 w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/10 @4xl:w-[250px]"
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50"
                        >
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </div>
                </div>

                <div className="border rounded-xl h-fit border-white/10 overflow-hidden">
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-white/70 [&_th]:font-medium border-b border-white/5 bg-white/5 [&>th]:border-r [&>th]:border-white/5 last:[&>th]:border-r-0 [&>th]:min-w-[220px] last:[&>th]:min-w-fit">
                                    <th className="text-left p-4">Member</th>
                                    <th className="text-left p-4">Phone</th>
                                    <th className="text-left p-4">Role</th>
                                    <th className="text-left p-4">Status</th>
                                    <th className="py-4 px-4 flex items-center justify-center">
                                        <div className="h-8 w-8 flex items-center justify-center rounded-md">
                                            <Ellipsis />
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMembers.length > 0 ? (
                                    filteredMembers.map((member) => (
                                        <tr
                                            key={member.id}
                                            className="border-b border-white/5 last:border-none hover:bg-white/5 [&>td]:border-r [&>td]:border-white/5 last:[&>td]:border-r-0"
                                        >
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                                        <span className="text-sm">{member.name[0]}</span>
                                                    </div>
                                                    <span>{member.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">{member.phone}</td>
                                            <td className="p-4">{member.role}</td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    {statusIcons[member.status]}
                                                    <span className="capitalize">{member.status}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 sticky right-0 flex items-center justify-center">
                                                <div className="bg-white/[0.03] backdrop-blur-sm border-l border-white/5 h-8 w-8 flex items-center justify-center rounded-md">
                                                    <DirectionAwareMenu>
                                                        <MenuTrigger>
                                                            <Ellipsis className="w-4 h-4" />
                                                        </MenuTrigger>

                                                        <MenuItem
                                                            onClick={() => {
                                                                setSelectedMember(member);
                                                                setEditMemberDialogOpen(true);
                                                            }}
                                                        >
                                                            <div className="flex items-center gap-2 hover:bg-white/5 transition-colors w-full h-full p-2 rounded-md">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="16"
                                                                    height="16"
                                                                    viewBox="0 0 16 16"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                >
                                                                    <path d="M11 4H4a2 2 0 0 0-2 2v6c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1"></path>
                                                                    <path d="M7 8h3"></path>
                                                                </svg>
                                                                <span>Edit member info</span>
                                                            </div>
                                                        </MenuItem>
                                                        <MenuItem
                                                            onClick={() => {
                                                                setSelectedMember(member);
                                                                setDeactivateDialogOpen(true);
                                                            }}
                                                        >
                                                            <div className="flex items-center gap-2 hover:bg-white/5 transition-colors w-full h-full p-2 rounded-md">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="14"
                                                                    height="14"
                                                                    viewBox="0 0 14 14"
                                                                    fill="none"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        clipRule="evenodd"
                                                                        d="M7 14C8.85652 14 10.637 13.2625 11.9497 11.9497C13.2625 10.637 14 8.85652 14 7C14 5.14348 13.2625 3.36301 11.9497 2.05025C10.637 0.737498 8.85652 0 7 0C5.14348 0 3.36301 0.737498 2.05025 2.05025C0.737498 3.36301 0 5.14348 0 7C0 8.85652 0.737498 10.637 2.05025 11.9497C3.36301 13.2625 5.14348 14 7 14ZM9.78 9.78C9.63937 9.92045 9.44875 9.99934 9.25 9.99934C9.05125 9.99934 8.86063 9.92045 8.72 9.78L7 8.06L5.28 9.78C5.21134 9.85369 5.12854 9.91279 5.03654 9.95378C4.94454 9.99477 4.84523 10.0168 4.74452 10.0186C4.64382 10.0204 4.54379 10.0018 4.4504 9.96412C4.35701 9.9264 4.27218 9.87026 4.20096 9.79904C4.12974 9.72782 4.0736 9.64299 4.03588 9.5496C3.99816 9.45621 3.97963 9.35618 3.98141 9.25548C3.98319 9.15477 4.00523 9.05546 4.04622 8.96346C4.08721 8.87146 4.14631 8.78866 4.22 8.72L5.94 7L4.22 5.28C4.08752 5.13783 4.0154 4.94978 4.01883 4.75548C4.02225 4.56118 4.10097 4.37579 4.23838 4.23838C4.37579 4.10097 4.56118 4.02225 4.75548 4.01883C4.94978 4.0154 5.13783 4.08752 5.28 4.22L7 5.94L8.72 4.22C8.78866 4.14631 8.87146 4.08721 8.96346 4.04622C9.05546 4.00523 9.15477 3.98319 9.25548 3.98141C9.35618 3.97963 9.45621 3.99816 9.5496 4.03588C9.64299 4.0736 9.72782 4.12974 9.79904 4.20096C9.87026 4.27218 9.9264 4.35701 9.96412 4.4504C10.0018 4.54379 10.0204 4.64382 10.0186 4.74452C10.0168 4.84523 9.99477 4.94454 9.95378 5.03654C9.91279 5.12854 9.85369 5.21134 9.78 5.28L8.06 7L9.78 8.72C9.92045 8.86063 9.99934 9.05125 9.99934 9.25C9.99934 9.44875 9.92045 9.63937 9.78 9.78Z"
                                                                        fill="white"
                                                                        fillOpacity="0.4"
                                                                    />
                                                                </svg>
                                                                <span>Deactivate member</span>
                                                            </div>
                                                        </MenuItem>
                                                        <MenuSeparator />
                                                        <MenuItem
                                                            onClick={() => {
                                                                setSelectedMember(member);
                                                                setRemoveMemberDialogOpen(true);
                                                            }}
                                                        >
                                                            <div className="flex items-center gap-2 hover:bg-white/5 transition-colors w-full h-full p-2 rounded-md">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="16"
                                                                    height="16"
                                                                    viewBox="0 0 16 16"
                                                                    fill="none"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        clipRule="evenodd"
                                                                        d="M5 3.25V4H2.75C2.55109 4 2.36032 4.07902 2.21967 4.21967C2.07902 4.36032 2 4.55109 2 4.75C2 4.94891 2.07902 5.13968 2.21967 5.28033C2.36032 5.42098 2.55109 5.5 2.75 5.5H3.05L3.865 13.65C3.90218 14.0199 4.0754 14.3628 4.35107 14.6123C4.62675 14.8617 4.98523 14.9999 5.357 15H10.642C11.0139 15.0001 11.3727 14.8621 11.6486 14.6126C11.9244 14.3631 12.0978 14.0201 12.135 13.65L12.95 5.5H13.25C13.4489 5.5 13.6397 5.42098 13.7803 5.28033C13.921 5.13968 14 4.94891 14 4.75C14 4.55109 13.921 4.36032 13.7803 4.21967C13.6397 4.07902 13.4489 4 13.25 4H11V3.25C11 2.65326 10.7629 2.08097 10.341 1.65901C9.91903 1.23705 9.34674 1 8.75 1H7.25C6.65326 1 6.08097 1.23705 5.65901 1.65901C5.23705 2.08097 5 2.65326 5 3.25ZM7.25 2.5C7.05109 2.5 6.86032 2.57902 6.71967 2.71967C6.57902 2.86032 6.5 3.05109 6.5 3.25V4H9.5V3.25C9.5 3.05109 9.42098 2.86032 9.28033 2.71967C9.13968 2.57902 8.94891 2.5 8.75 2.5H7.25ZM6.05 6C6.14852 5.99502 6.24705 6.00952 6.33996 6.04268C6.43286 6.07584 6.51832 6.127 6.59142 6.19323C6.66453 6.25946 6.72385 6.33946 6.76599 6.42865C6.80813 6.51784 6.83226 6.61447 6.837 6.713L7.112 12.213C7.11933 12.4101 7.04872 12.6022 6.91546 12.7476C6.7822 12.893 6.59702 12.9801 6.40002 12.9899C6.20302 12.9998 6.01007 12.9317 5.86295 12.8003C5.71583 12.6689 5.62639 12.4849 5.614 12.288L5.339 6.788C5.33388 6.68956 5.34821 6.59107 5.38118 6.49818C5.41416 6.40528 5.46511 6.3198 5.53115 6.24661C5.59718 6.17343 5.677 6.11397 5.76603 6.07166C5.85506 6.02934 5.95155 6.00499 6.05 6ZM9.95 6C10.0484 6.00487 10.145 6.02909 10.234 6.07129C10.3231 6.11349 10.403 6.17283 10.4691 6.24592C10.5353 6.31901 10.5863 6.40442 10.6194 6.49726C10.6525 6.59011 10.667 6.68856 10.662 6.787L10.387 12.287C10.3746 12.4839 10.2852 12.6679 10.138 12.7993C9.99093 12.9307 9.79798 12.9988 9.60098 12.9889C9.40398 12.9791 9.2188 12.892 9.08554 12.7466C8.95228 12.6012 8.88167 12.4091 8.889 12.212L9.164 6.712C9.17409 6.51354 9.26253 6.32719 9.4099 6.19389C9.55727 6.06058 9.75152 5.99021 9.95 6Z"
                                                                        fill="#F43F5E"
                                                                    />
                                                                </svg>
                                                                <span>Remove from team</span>
                                                            </div>
                                                        </MenuItem>
                                                    </DirectionAwareMenu>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4 text-white/50">
                                            No members found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* New Member Dialog */}
            <Dialog
                open={newMemberDialogOpen}
                onOpenChange={setNewMemberDialogOpen}
                className="!max-w-[400px] border border-white/10 rounded-xl !p-0"
            >
                <DialogContent className="max-h-[90vh] !gap-0">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-y-3 bg-white/[0.03] border-b rounded-t-xl border-white/10 p-6">
                            <DialogTitle>Add new member</DialogTitle>
                            <DialogDescription>
                                Add a new member to your team.
                            </DialogDescription>
                        </div>
                        <div className="flex flex-col gap-4 p-6">
                            <div className="flex flex-col items-start justify-between gap-4">
                                <div className="flex flex-col gap-3 w-full">
                                    <span className="text-sm font-medium text-white">
                                        Full Name
                                    </span>
                                    <input
                                        {...register("fullName")}
                                        placeholder="John Doe"
                                        className="border bg-primary text-white text-sm border-white/10 h-10 rounded-lg px-5 py-2.5 focus:outline-none w-full"
                                    />
                                    {errors.fullName && (
                                        <span className="text-xs text-red-500">
                                            {errors.fullName.message}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col items-start justify-between gap-4">
                                <div className="flex flex-col gap-3 w-full">
                                    <span className="text-sm font-medium text-white">
                                        Phone Number
                                    </span>
                                    <div className="relative w-full">
                                        <div className="flex items-center bg-primary border border-white/10 h-10 rounded-lg px-2 py-2.5 w-full">
                                            <div className="flex items-center h-10 gap-1 px-1 pr-3 border-r border-white/10">
                                                <img
                                                    src="https://flagcdn.com/w40/us.png"
                                                    alt="US Flag"
                                                    className="w-4 h-4 rounded-full"
                                                />
                                                <span className="text-white text-sm">+1</span>
                                            </div>
                                            <input
                                                {...register("phoneNumber")}
                                                type="tel"
                                                placeholder="Enter phone number"
                                                className="bg-transparent text-sm flex-1 focus:outline-none px-2 text-white mx-3"
                                            />
                                        </div>
                                    </div>
                                    {errors.phoneNumber && (
                                        <span className="text-xs text-red-500">
                                            {errors.phoneNumber.message}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Replace the role section with this */}
                            <div className="flex flex-col gap-4">
                                <label className="text-sm font-medium text-white">Role</label>
                                <div className="flex flex-col gap-3">
                                    <input
                                        type="text"
                                        placeholder="Search or add new role"
                                        value={watch("role") || ""}
                                        onChange={(e) =>
                                            setValue("role", e.target.value, { shouldValidate: true })
                                        }
                                        className="border bg-primary text-white text-sm border-white/10 h-10 rounded-lg p-2.5 focus:outline-none w-full"
                                    />
                                    <div className="flex flex-wrap gap-2">
                                        {[...roles, "+ New role"].map((role) => {
                                            const isNewRole = role === "+ New role";
                                            const inputValue = watch("role") || "";
                                            const isSelected = isNewRole
                                                ? !roles.includes(inputValue) && inputValue !== ""
                                                : role === inputValue;

                                            if (isNewRole && roles.includes(inputValue)) return null;

                                            return (
                                                <button
                                                    key={role}
                                                    type="button"
                                                    onClick={() => {
                                                        if (!isNewRole) {
                                                            setValue("role", role, { shouldValidate: true });
                                                        }
                                                    }}
                                                    className={`h-8 w-fit flex items-center gap-2 border-2 pr-4  rounded-full text-sm font-medium transition-colors ${isSelected
                                                            ? "border-[#34B2DA] pl-2"
                                                            : "border-dashed border-white/10 text-white hover:bg-white/10 pl-4"
                                                        }`}
                                                >
                                                    {isSelected && (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="16"
                                                            height="16"
                                                            viewBox="0 0 16 16"
                                                            fill="none"
                                                            className="w-4 h-4 flex-shrink-0"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                clipRule="evenodd"
                                                                d="M12.4168 3.37625C12.5823 3.48659 12.6972 3.65814 12.7362 3.85317C12.7752 4.04821 12.7351 4.25075 12.6248 4.41625L7.62482 11.9162C7.56324 12.0085 7.48197 12.0859 7.38685 12.143C7.29174 12.2 7.18516 12.2353 7.07479 12.2462C6.96441 12.2571 6.85299 12.2434 6.74856 12.206C6.64412 12.1687 6.54926 12.1087 6.47082 12.0302L3.47082 9.03025C3.33834 8.88807 3.26622 8.70003 3.26965 8.50573C3.27308 8.31143 3.35179 8.12604 3.4892 7.98863C3.62661 7.85121 3.812 7.7725 4.0063 7.76907C4.2006 7.76565 4.38865 7.83777 4.53082 7.97025L6.88382 10.3232L11.3768 3.58325C11.4873 3.41793 11.6589 3.30325 11.854 3.26443C12.049 3.22561 12.2514 3.26583 12.4168 3.37625Z"
                                                                fill="#34B2DA"
                                                            />
                                                        </svg>
                                                    )}
                                                    {isNewRole &&
                                                        !roles.includes(inputValue) &&
                                                        inputValue !== "" ? (
                                                        <div className="flex items-center gap-2">
                                                            <span> {inputValue}</span>
                                                        </div>
                                                    ) : (
                                                        role
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                                {errors.role && (
                                    <span className="text-xs text-red-500">
                                        {errors.role.message}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 p-6 pt-0">
                            <button
                                type="submit"
                                disabled={!isValid}
                                className="w-full bg-white hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed text-black border-white/10 border text-center rounded-full h-9 px-4 focus:outline-none flex items-center justify-center gap-2 font-semibold transition-colors text-sm"
                            >
                                Add member
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Remove member Dialog */}
            <Dialog
                open={removeMemberDialogOpen}
                onOpenChange={setRemoveMemberDialogOpen}
                className="!max-w-[400px] border border-white/10 rounded-xl !p-0"
            >
                <DialogContent className="flex flex-col gap-3 p-6">
                    <DialogTitle className="flex items-center gap-2">
                        Deactivate{" "}
                        <span className="text-white bg-red-500/10 border border-white/10 border-dashed rounded-lg px-2 py-1 h-8 flex items-center justify-center text-sm w-fit">
                            {selectedMember?.name}
                        </span>
                        ?
                    </DialogTitle>
                    <DialogDescription>
                        This member will no longer be able to access events. You can always
                        activate them again later.
                    </DialogDescription>
                    <div className="flex flex-col gap-3 mt-3">
                        <button
                            onClick={() => {
                                console.log("Deactivate member:", selectedMember?.name);
                                setDeactivateDialogOpen(false);
                            }}
                            className="w-full bg-[#f43f5e] hover:bg-[#f43f5e]/90 text-white border-white/10 border text-center rounded-full h-10 px-4 focus:outline-none flex items-center justify-center gap-2 font-medium transition-colors"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M5 3.25V4H2.75C2.55109 4 2.36032 4.07902 2.21967 4.21967C2.07902 4.36032 2 4.55109 2 4.75C2 4.94891 2.07902 5.13968 2.21967 5.28033C2.36032 5.42098 2.55109 5.5 2.75 5.5H3.05L3.865 13.65C3.90218 14.0199 4.0754 14.3628 4.35107 14.6123C4.62675 14.8617 4.98523 14.9999 5.357 15H10.642C11.0139 15.0001 11.3727 14.8621 11.6486 14.6126C11.9244 14.3631 12.0978 14.0201 12.135 13.65L12.95 5.5H13.25C13.4489 5.5 13.6397 5.42098 13.7803 5.28033C13.921 5.13968 14 4.94891 14 4.75C14 4.55109 13.921 4.36032 13.7803 4.21967C13.6397 4.07902 13.4489 4 13.25 4H11V3.25C11 2.65326 10.7629 2.08097 10.341 1.65901C9.91903 1.23705 9.34674 1 8.75 1H7.25C6.65326 1 6.08097 1.23705 5.65901 1.65901C5.23705 2.08097 5 2.65326 5 3.25ZM7.25 2.5C7.05109 2.5 6.86032 2.57902 6.71967 2.71967C6.57902 2.86032 6.5 3.05109 6.5 3.25V4H9.5V3.25C9.5 3.05109 9.42098 2.86032 9.28033 2.71967C9.13968 2.57902 8.94891 2.5 8.75 2.5H7.25ZM6.05 6C6.14852 5.99502 6.24705 6.00952 6.33996 6.04268C6.43286 6.07584 6.51832 6.127 6.59142 6.19323C6.66453 6.25946 6.72385 6.33946 6.76599 6.42865C6.80813 6.51784 6.83226 6.61447 6.837 6.713L7.112 12.213C7.11933 12.4101 7.04872 12.6022 6.91546 12.7476C6.7822 12.893 6.59702 12.9801 6.40002 12.9899C6.20302 12.9998 6.01007 12.9317 5.86295 12.8003C5.71583 12.6689 5.62639 12.4849 5.614 12.288L5.339 6.788C5.33388 6.68956 5.34821 6.59107 5.38118 6.49818C5.41416 6.40528 5.46511 6.3198 5.53115 6.24661C5.59718 6.17343 5.677 6.11397 5.76603 6.07166C5.85506 6.02934 5.95155 6.00499 6.05 6ZM9.95 6C10.0484 6.00487 10.145 6.02909 10.234 6.07129C10.3231 6.11349 10.403 6.17283 10.4691 6.24592C10.5353 6.31901 10.5863 6.40442 10.6194 6.49726C10.6525 6.59011 10.667 6.68856 10.662 6.787L10.387 12.287C10.3746 12.4839 10.2852 12.6679 10.138 12.7993C9.99093 12.9307 9.79798 12.9988 9.60098 12.9889C9.40398 12.9791 9.2188 12.892 9.08554 12.7466C8.95228 12.6012 8.88167 12.4091 8.889 12.212L9.164 6.712C9.17409 6.51354 9.26253 6.32719 9.4099 6.19389C9.55727 6.06058 9.75152 5.99021 9.95 6Z"
                                    fill="white"
                                />
                            </svg>
                            Remove member
                        </button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Deactivate Dialog */}
            <Dialog
                open={deactivateDialogOpen}
                onOpenChange={setDeactivateDialogOpen}
                className="!max-w-[400px] border border-white/10 rounded-xl !p-0"
            >
                <DialogContent className="flex flex-col gap-3 p-6">
                    <DialogTitle className="flex items-center gap-2">
                        Deactivate{" "}
                        <span className="text-white bg-red-500/10 border border-white/10 border-dashed rounded-lg px-2 py-1 h-8 flex items-center justify-center text-sm w-fit">
                            {selectedMember?.name}
                        </span>
                        ?
                    </DialogTitle>
                    <DialogDescription>
                        This member will no longer be able to access events. You can always
                        activate them again later.
                    </DialogDescription>
                    <div className="flex flex-col gap-3 mt-3">
                        <button
                            onClick={() => {
                                console.log("Deactivate member:", selectedMember?.name);
                                setDeactivateDialogOpen(false);
                            }}
                            className="w-full bg-[#f43f5e] hover:bg-[#f43f5e]/90 text-white border-white/10 border text-center rounded-full h-10 px-4 focus:outline-none flex items-center justify-center gap-2 font-medium transition-colors"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 14 14"
                                fill="none"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M7 14C8.85652 14 10.637 13.2625 11.9497 11.9497C13.2625 10.637 14 8.85652 14 7C14 5.14348 13.2625 3.36301 11.9497 2.05025C10.637 0.737498 8.85652 0 7 0C5.14348 0 3.36301 0.737498 2.05025 2.05025C0.737498 3.36301 0 5.14348 0 7C0 8.85652 0.737498 10.637 2.05025 11.9497C3.36301 13.2625 5.14348 14 7 14ZM9.78 9.78C9.63937 9.92045 9.44875 9.99934 9.25 9.99934C9.05125 9.99934 8.86063 9.92045 8.72 9.78L7 8.06L5.28 9.78C5.21134 9.85369 5.12854 9.91279 5.03654 9.95378C4.94454 9.99477 4.84523 10.0168 4.74452 10.0186C4.64382 10.0204 4.54379 10.0018 4.4504 9.96412C4.35701 9.9264 4.27218 9.87026 4.20096 9.79904C4.12974 9.72782 4.0736 9.64299 4.03588 9.5496C3.99816 9.45621 3.97963 9.35618 3.98141 9.25548C3.98319 9.15477 4.00523 9.05546 4.04622 8.96346C4.08721 8.87146 4.14631 8.78866 4.22 8.72L5.94 7L4.22 5.28C4.08752 5.13783 4.0154 4.94978 4.01883 4.75548C4.02225 4.56118 4.10097 4.37579 4.23838 4.23838C4.37579 4.10097 4.56118 4.02225 4.75548 4.01883C4.94978 4.0154 5.13783 4.08752 5.28 4.22L7 5.94L8.72 4.22C8.78866 4.14631 8.87146 4.08721 8.96346 4.04622C9.05546 4.00523 9.15477 3.98319 9.25548 3.98141C9.35618 3.97963 9.45621 3.99816 9.5496 4.03588C9.64299 4.0736 9.72782 4.12974 9.79904 4.20096C9.87026 4.27218 9.9264 4.35701 9.96412 4.4504C10.0018 4.54379 10.0204 4.64382 10.0186 4.74452C10.0168 4.84523 9.99477 4.94454 9.95378 5.03654C9.91279 5.12854 9.85369 5.21134 9.78 5.28L8.06 7L9.78 8.72C9.92045 8.86063 9.99934 9.05125 9.99934 9.25C9.99934 9.44875 9.92045 9.63937 9.78 9.78Z"
                                    fill="white"
                                />
                            </svg>
                            <span>Deactivate member</span>
                        </button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Member Dialog */}
            <Dialog
                open={editMemberDialogOpen}
                onOpenChange={setEditMemberDialogOpen}
                className="!max-w-[400px] border border-white/10 rounded-xl !p-0"
            >
                <DialogContent className="max-h-[90vh] !gap-0">
                    <form onSubmit={handleSubmitEdit(onEditSubmit)}>
                        <div className="flex flex-col gap-y-3 bg-white/[0.03] border-b rounded-t-xl border-white/10 p-6">
                            <DialogTitle>Edit member info</DialogTitle>
                            <DialogDescription>Update member information.</DialogDescription>
                        </div>
                        <div className="flex flex-col gap-4 p-6">
                            <div className="flex flex-col items-start justify-between gap-4">
                                <div className="flex flex-col gap-3 w-full">
                                    <span className="text-sm font-medium text-white">
                                        Full Name
                                    </span>
                                    <input
                                        {...registerEdit("fullName")}
                                        placeholder="John Doe"
                                        className="border bg-primary text-white text-sm border-white/10 h-10 rounded-lg px-5 py-2.5 focus:outline-none w-full"
                                    />
                                    {editErrors.fullName && (
                                        <span className="text-xs text-red-500">
                                            {editErrors.fullName.message}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col items-start justify-between gap-4">
                                <div className="flex flex-col gap-3 w-full">
                                    <span className="text-sm font-medium text-white">
                                        Phone Number
                                    </span>
                                    <div className="relative w-full">
                                        <div className="flex items-center bg-primary border border-white/10 h-10 rounded-lg px-2 py-2.5 w-full">
                                            <div className="flex items-center h-10 gap-1 px-1 pr-3 border-r border-white/10">
                                                <img
                                                    src="https://flagcdn.com/w40/us.png"
                                                    alt="US Flag"
                                                    className="w-4 h-4 rounded-full"
                                                />
                                                <span className="text-white text-sm">+1</span>
                                            </div>
                                            <input
                                                {...registerEdit("phoneNumber")}
                                                type="tel"
                                                placeholder="Enter phone number"
                                                className="bg-transparent text-sm flex-1 focus:outline-none px-2 text-white mx-3"
                                            />
                                        </div>
                                    </div>
                                    {editErrors.phoneNumber && (
                                        <span className="text-xs text-red-500">
                                            {editErrors.phoneNumber.message}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-3">
                                    <span className="text-sm font-medium text-white">Role</span>
                                    <input
                                        type="text"
                                        placeholder="Search or add new role"
                                        value={watchEdit("role") || ""}
                                        onChange={(e) =>
                                            setEditValue("role", e.target.value, {
                                                shouldValidate: true,
                                            })
                                        }
                                        className="border bg-primary text-white text-sm border-white/10 h-10 rounded-lg p-2.5 focus:outline-none w-full"
                                    />
                                    <div className="flex flex-wrap gap-2">
                                        {[...roles, "+ New role"].map((role) => {
                                            const isNewRole = role === "+ New role";
                                            const inputValue = watchEdit("role") || "";
                                            const isSelected = isNewRole
                                                ? !roles.includes(inputValue) && inputValue !== ""
                                                : role === inputValue;

                                            if (isNewRole && roles.includes(inputValue)) return null;

                                            return (
                                                <button
                                                    key={role}
                                                    type="button"
                                                    onClick={() => {
                                                        if (!isNewRole) {
                                                            setEditValue("role", role, {
                                                                shouldValidate: true,
                                                            });
                                                        }
                                                    }}
                                                    className={`h-8 w-fit flex items-center gap-2 border-2 pr-4 rounded-full text-sm font-medium transition-colors ${isSelected
                                                            ? "border-[#34B2DA] pl-2"
                                                            : isNewRole &&
                                                                !roles.includes(inputValue) &&
                                                                inputValue !== ""
                                                                ? "border-dashed border-white/10 text-white hover:bg-white/10 pl-4"
                                                                : "border border-white/10 text-white hover:bg-white/10 pl-4"
                                                        }`}
                                                >
                                                    {isSelected && (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="16"
                                                            height="16"
                                                            viewBox="0 0 16 16"
                                                            fill="none"
                                                            className="w-4 h-4 flex-shrink-0"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                clipRule="evenodd"
                                                                d="M12.4168 3.37625C12.5823 3.48659 12.6972 3.65814 12.7362 3.85317C12.7752 4.04821 12.7351 4.25075 12.6248 4.41625L7.62482 11.9162C7.56324 12.0085 7.48197 12.0859 7.38685 12.143C7.29174 12.2 7.18516 12.2353 7.07479 12.2462C6.96441 12.2571 6.85299 12.2434 6.74856 12.206C6.64412 12.1687 6.54926 12.1087 6.47082 12.0302L3.47082 9.03025C3.33834 8.88807 3.26622 8.70003 3.26965 8.50573C3.27308 8.31143 3.35179 8.12604 3.4892 7.98863C3.62661 7.85121 3.812 7.7725 4.0063 7.76907C4.2006 7.76565 4.38865 7.83777 4.53082 7.97025L6.88382 10.3232L11.3768 3.58325C11.4873 3.41793 11.6589 3.30325 11.854 3.26443C12.049 3.22561 12.2514 3.26583 12.4168 3.37625Z"
                                                                fill="#34B2DA"
                                                            />
                                                        </svg>
                                                    )}
                                                    {isNewRole &&
                                                        !roles.includes(inputValue) &&
                                                        inputValue !== "" ? (
                                                        <div className="flex items-center gap-2">
                                                            <span> {inputValue}</span>
                                                        </div>
                                                    ) : (
                                                        role
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                                {editErrors.role && (
                                    <span className="text-xs text-red-500">
                                        {editErrors.role.message}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 p-6 pt-0">
                            <button
                                type="submit"
                                disabled={!isEditValid}
                                className="w-full bg-white hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed text-black border-white/10 border text-center rounded-full h-9 px-4 focus:outline-none flex items-center justify-center gap-2 font-semibold transition-colors text-sm"
                            >
                                Update member
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}