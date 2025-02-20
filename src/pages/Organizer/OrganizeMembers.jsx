import SidebarLayout from "../../components/layouts/SidebarLayout";
import SidebarToggle from "../../components/layouts/SidebarToggle";
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
} from "../../components/ui/Dialog";
import { Ellipsis } from "lucide-react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
} from "../../components/ui/Dropdown";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Checkbox } from "../../components/ui/Checkbox";

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

const roles = ["Door Staff", "Security", "Event Coordinator"];

// Sample data for members
const sampleMembers = [
  {
    id: 1,
    name: "John Smith",
    phone: "+1234 5678",
    role: "Door Staff",
    assigned: "3 events",
    status: "active",
  },
  {
    id: 2,
    name: "Sarah Wilson",
    phone: "+1234 5679",
    role: "Security",
    assigned: "5 events",
    status: "inactive",
  },
  {
    id: 3,
    name: "Yolanda Claribel",
    phone: "+1234 5680",
    role: "Event Coordinator",
    assigned: "2 events",
    status: "inactive",
  },
  {
    id: 4,
    name: "Michael Johnson",
    phone: "+1234 5681",
    role: "Door Staff",
    assigned: "4 events",
    status: "active",
  },
  {
    id: 5,
    name: "Emily Davis",
    phone: "+1234 5682",
    role: "Security",
    assigned: "N/A",
    status: "active",
  },
  {
    id: 6,
    name: "David Brown",
    phone: "+1234 5683",
    role: "Event Coordinator",
    assigned: "1 event",
    status: "active",
  },
  {
    id: 7,
    name: "Jessica Taylor",
    phone: "+1234 5684",
    role: "Door Staff",
    assigned: "3 events",
    status: "inactive",
  },
  {
    id: 8,
    name: "Daniel Wilson",
    phone: "+1234 5685",
    role: "Security",
    assigned: "2 events",
    status: "active",
  },
  {
    id: 9,
    name: "Laura Martinez",
    phone: "+1234 5686",
    role: "Event Coordinator",
    assigned: "5 events",
    status: "inactive",
  },
  {
    id: 10,
    name: "James Anderson",
    phone: "+1234 5687",
    role: "Door Staff",
    assigned: "4 events",
    status: "active",
  },
];

const sampleEvents = [
  { id: 1, name: "Summer Festival 2024" },
  { id: 2, name: "Tech Conference" },
  { id: 3, name: "New Year's Party" },
  { id: 4, name: "Corporate Event" },
  { id: 5, name: "Christmas Party" },
  { id: 6, name: "New Year's Eve" },
  { id: 7, name: "Valentine's Day" },
  { id: 8, name: "Halloween Party" },
  { id: 9, name: "Thanksgiving Dinner" },
  { id: 10, name: "Mothers Day" },
  { id: 11, name: "Fathers Day" },
  { id: 12, name: "Christmas Eve" },
];

const newMemberSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  role: z.string().min(1, "Role is required"),
  events: z.array(z.string()).optional(),
});

const editMemberSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  role: z.string().min(1, "Role is required"),
  events: z.array(z.string()).optional(),
});

export default function OrganizeMembers() {
  const [members] = useState(sampleMembers);
  const [selectedMember, setSelectedMember] = useState(null);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [newMemberDialogOpen, setNewMemberDialogOpen] = useState(false);
  const [editMemberDialogOpen, setEditMemberDialogOpen] = useState(false);
  const [assignEventsDialogOpen, setAssignEventsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
        events: [], // You would need to map the assigned events to actual event IDs here
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

  const handleViewMember = (memberId) => {
    console.log("View member:", memberId);
  };

  const filteredMembers = members.filter((member) => {
    const matchesStatus =
      selectedStatus === "all" || member.status === selectedStatus;
    const matchesSearch =
      searchQuery.trim() === "" ||
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.assigned.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <SidebarLayout>
      <div className="m-4 mb-2 z-20">
        <SidebarToggle />
      </div>
      <div className="text-white p-6 max-w-7xl mx-auto @container grid gap-9">
        <div className="grid gap-3">
          <h1 className="text-2xl md:text-3xl font-bold">Members</h1>
          <p className="text-white/70">Manage your event staff</p>
        </div>

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

            <Dropdown>
              <DropdownTrigger>
                <button className="flex items-center gap-2 border border-white/10 hover:bg-white/10 transition-colors px-4 py-2 rounded-full text-sm font-medium">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M4 8H12M2 4H14M6 12H10"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {selectedStatus === "all"
                    ? "All status"
                    : selectedStatus === "active"
                    ? "Active"
                    : "Inactive"}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="transform transition-transform"
                  >
                    <path
                      d="M4 6L8 10L12 6"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </DropdownTrigger>
              <DropdownContent className="w-48 bg-[#151515] border border-white/10 rounded-lg shadow-lg overflow-hidden">
                <DropdownItem
                  onClick={() => setSelectedStatus("all")}
                  className="px-4 py-2 hover:bg-white/5 transition-colors"
                >
                  All status
                </DropdownItem>
                <DropdownItem
                  onClick={() => setSelectedStatus("active")}
                  className="px-4 py-2 hover:bg-white/5 transition-colors"
                >
                  Active
                </DropdownItem>
                <DropdownItem
                  onClick={() => setSelectedStatus("inactive")}
                  className="px-4 py-2 hover:bg-white/5 transition-colors"
                >
                  Inactive
                </DropdownItem>
              </DropdownContent>
            </Dropdown>
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
                <tr className="text-white/70 [&_th]:font-medium border-b border-white/5 bg-white/5 [&>th]:min-w-[180px] last:[&>th]:min-w-fit">
                  <th className="text-left p-4">
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M8.00013 8C8.79578 8 9.55885 7.68393 10.1215 7.12132C10.6841 6.55871 11.0001 5.79565 11.0001 5C11.0001 4.20435 10.6841 3.44129 10.1215 2.87868C9.55885 2.31607 8.79578 2 8.00013 2C7.20449 2 6.44142 2.31607 5.87881 2.87868C5.31621 3.44129 5.00013 4.20435 5.00013 5C5.00013 5.79565 5.31621 6.55871 5.87881 7.12132C6.44142 7.68393 7.20449 8 8.00013 8ZM12.7351 14C13.3531 14 13.8281 13.439 13.6071 12.861C13.1736 11.7251 12.4053 10.7476 11.404 10.058C10.4026 9.36834 9.21548 8.99908 7.99963 8.99908C6.78379 8.99908 5.59662 9.36834 4.59528 10.058C3.59394 10.7476 2.82566 11.7251 2.39213 12.861C2.17213 13.439 2.64613 14 3.26413 14H12.7351Z"
                          fill="white"
                          fillOpacity="0.5"
                        />
                      </svg>
                      Member
                    </div>
                  </th>
                  <th className="text-left p-4">
                    <div className="flex items-center gap-2">
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
                          d="M3.855 7.286L4.922 6.752C5.11143 6.65747 5.26598 6.50526 5.36338 6.31729C5.46078 6.12931 5.49601 5.91528 5.464 5.706L5.024 2.848C4.9877 2.61197 4.86813 2.39671 4.68692 2.24118C4.5057 2.08564 4.27481 2.00009 4.036 2H3C2.73478 2 2.48043 2.10536 2.29289 2.29289C2.10536 2.48043 2 2.73478 2 3V5C2 5.709 2.082 6.4 2.238 7.062C2.62256 8.69074 3.45304 10.1802 4.6364 11.3636C5.81976 12.547 7.30926 13.3774 8.938 13.762C9.61389 13.9204 10.3058 14.0002 11 14H13C13.2652 14 13.5196 13.8946 13.7071 13.7071C13.8946 13.5196 14 13.2652 14 13V11.964C13.9999 11.7252 13.9144 11.4943 13.7588 11.3131C13.6033 11.1319 13.388 11.0123 13.152 10.976L10.294 10.536C10.0847 10.504 9.87069 10.5392 9.68271 10.6366C9.49474 10.734 9.34253 10.8886 9.248 11.078L8.714 12.145C7.57609 11.7796 6.54166 11.1482 5.69647 10.3032C4.85128 9.45814 4.22067 8.42384 3.855 7.286Z"
                          fill="white"
                          fillOpacity="0.5"
                        />
                      </svg>
                      Phone
                    </div>
                  </th>
                  <th className="text-left p-4">
                    <div className="flex items-center gap-2">
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
                          d="M8.378 1.34876C8.4913 1.28404 8.61952 1.25 8.75 1.25C8.88048 1.25 9.0087 1.28404 9.122 1.34876L10.369 2.06076C10.4546 2.10961 10.5297 2.17483 10.59 2.25271C10.6504 2.33058 10.6948 2.41958 10.7207 2.51462C10.7467 2.60966 10.7537 2.70888 10.7413 2.80662C10.7289 2.90436 10.6974 2.9987 10.6485 3.08426C10.5996 3.16981 10.5344 3.24491 10.4565 3.30526C10.3787 3.36561 10.2897 3.41003 10.1946 3.43598C10.0996 3.46194 10.0004 3.46892 9.90263 3.45652C9.8049 3.44413 9.71056 3.41261 9.625 3.36376L8.75 2.86376L7.875 3.36376C7.78944 3.41261 7.6951 3.44413 7.59736 3.45652C7.49963 3.46892 7.4004 3.46194 7.30536 3.43598C7.21032 3.41003 7.12133 3.36561 7.04345 3.30526C6.96558 3.24491 6.90035 3.16981 6.8515 3.08426C6.80265 2.9987 6.77113 2.90436 6.75873 2.80662C6.74634 2.70888 6.75332 2.60966 6.77928 2.51462C6.80523 2.41958 6.84965 2.33058 6.91 2.25271C6.97035 2.17483 7.04544 2.10961 7.131 2.06076L8.378 1.34876ZM5.4 3.91376C5.4986 4.08643 5.5246 4.29118 5.47229 4.48302C5.41997 4.67485 5.29361 4.83806 5.121 4.93676L5.012 4.99976L5.122 5.06276C5.28969 5.16392 5.41116 5.32666 5.46045 5.51619C5.50974 5.70573 5.48294 5.90702 5.38577 6.07706C5.28861 6.24709 5.12879 6.37238 4.94048 6.42614C4.75216 6.4799 4.55029 6.45787 4.378 6.36476L4.248 6.29176C4.23421 6.48455 4.14652 6.66457 4.00323 6.79428C3.85993 6.92399 3.6721 6.99337 3.47889 6.98795C3.28569 6.98253 3.10203 6.90274 2.96623 6.7652C2.83043 6.62767 2.75297 6.44302 2.75 6.24976V4.99976C2.75004 4.86756 2.78503 4.73772 2.85141 4.6234C2.91779 4.50907 3.01321 4.41433 3.128 4.34876L4.378 3.63476C4.55067 3.53615 4.75543 3.51015 4.94726 3.56247C5.13909 3.61479 5.3013 3.74114 5.4 3.91376ZM12.098 3.91376C12.1965 3.74097 12.3597 3.61441 12.5515 3.5619C12.7434 3.50939 12.9482 3.53524 13.121 3.63376L14.371 4.34876C14.486 4.4142 14.5816 4.50889 14.6482 4.62322C14.7147 4.73756 14.7499 4.86746 14.75 4.99976V6.24976C14.7509 6.44563 14.6751 6.63407 14.5389 6.77481C14.4027 6.91555 14.2168 6.99741 14.021 7.0029C13.8252 7.00839 13.6351 6.93706 13.4912 6.80417C13.3473 6.67128 13.2611 6.48737 13.251 6.29176L13.122 6.36476C12.9497 6.45787 12.7478 6.4799 12.5595 6.42614C12.3712 6.37238 12.2114 6.24709 12.1142 6.07706C12.0171 5.90702 11.9903 5.70573 12.0396 5.51619C12.0888 5.32666 12.2103 5.16392 12.378 5.06276L12.488 4.99976L12.378 4.93676C12.2052 4.83823 12.0786 4.67509 12.0261 4.48325C11.9736 4.2914 11.9995 4.08655 12.098 3.91376ZM6.852 6.91476C6.9507 6.74214 7.11391 6.61579 7.30574 6.56347C7.49757 6.51115 7.70233 6.53715 7.875 6.63576L8.75 7.13576L9.625 6.63576C9.79779 6.5371 10.0027 6.51112 10.1946 6.56353C10.3866 6.61595 10.5498 6.74247 10.6485 6.91526C10.7472 7.08805 10.7731 7.29295 10.7207 7.48489C10.6683 7.67684 10.5418 7.8401 10.369 7.93876L9.5 8.43476V9.24976C9.5 9.44867 9.42098 9.63943 9.28033 9.78009C9.13968 9.92074 8.94891 9.99976 8.75 9.99976C8.55109 9.99976 8.36032 9.92074 8.21967 9.78009C8.07902 9.63943 8 9.44867 8 9.24976V8.43476L7.131 7.93876C7.04531 7.88997 6.97009 7.82476 6.90963 7.74687C6.84917 7.66898 6.80467 7.57993 6.77866 7.48482C6.75265 7.38971 6.74566 7.2904 6.75807 7.19259C6.77048 7.09477 6.80206 7.00036 6.851 6.91476H6.852ZM3.5 8.99976C3.69891 8.99976 3.88968 9.07878 4.03033 9.21943C4.17098 9.36008 4.25 9.55085 4.25 9.74976V10.5648L5.122 11.0628C5.29479 11.1614 5.42131 11.3247 5.47372 11.5166C5.52614 11.7086 5.50016 11.9135 5.4015 12.0863C5.30284 12.259 5.13958 12.3856 4.94764 12.438C4.75569 12.4904 4.55079 12.4644 4.378 12.3658L3.128 11.6508C3.01321 11.5852 2.91779 11.4904 2.85141 11.3761C2.78503 11.2618 2.75004 11.132 2.75 10.9998V9.74976C2.75 9.55085 2.82902 9.36008 2.96967 9.21943C3.11032 9.07878 3.30109 8.99976 3.5 8.99976ZM14 8.99976C14.1989 8.99976 14.3897 9.07878 14.5303 9.21943C14.671 9.36008 14.75 9.55085 14.75 9.74976V10.9998C14.75 11.132 14.715 11.2618 14.6486 11.3761C14.5822 11.4904 14.4868 11.5852 14.372 11.6508L13.122 12.3658C12.9492 12.4644 12.7443 12.4904 12.5524 12.438C12.3604 12.3856 12.1972 12.259 12.0985 12.0863C11.9998 11.9135 11.9739 11.7086 12.0263 11.5166C12.0787 11.3247 12.2052 11.1614 12.378 11.0628L13.25 10.5648V9.74976C13.25 9.55085 13.329 9.36008 13.4697 9.21943C13.6103 9.07878 13.8011 8.99976 14 8.99976ZM9.499 12.7078L9.625 12.6358C9.79779 12.5371 10.0027 12.5111 10.1946 12.5635C10.3866 12.616 10.5498 12.7425 10.6485 12.9153C10.7472 13.088 10.7731 13.293 10.7207 13.4849C10.6683 13.6768 10.5418 13.8401 10.369 13.9388L9.122 14.6508C9.0087 14.7155 8.88048 14.7495 8.75 14.7495C8.61952 14.7495 8.4913 14.7155 8.378 14.6508L7.13 13.9398C6.95721 13.8411 6.83069 13.6778 6.77828 13.4859C6.72586 13.294 6.75184 13.089 6.8505 12.9163C6.94916 12.7435 7.11242 12.617 7.30436 12.5645C7.49631 12.5121 7.70121 12.5381 7.874 12.6368L8 12.7088C8.00992 12.5168 8.09316 12.336 8.23254 12.2036C8.37192 12.0713 8.55679 11.9975 8.749 11.9975C8.94121 11.9975 9.12608 12.0713 9.26546 12.2036C9.40484 12.336 9.48808 12.5168 9.498 12.7088L9.499 12.7078Z"
                          fill="white"
                          fillOpacity="0.5"
                        />
                      </svg>
                      Role
                    </div>
                  </th>
                  <th className="text-left p-4">
                    <div className="flex items-center gap-2">
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
                          d="M8.378 1.34876C8.4913 1.28404 8.61952 1.25 8.75 1.25C8.88048 1.25 9.0087 1.28404 9.122 1.34876L10.369 2.06076C10.4546 2.10961 10.5297 2.17483 10.59 2.25271C10.6504 2.33058 10.6948 2.41958 10.7207 2.51462C10.7467 2.60966 10.7537 2.70888 10.7413 2.80662C10.7289 2.90436 10.6974 2.9987 10.6485 3.08426C10.5996 3.16981 10.5344 3.24491 10.4565 3.30526C10.3787 3.36561 10.2897 3.41003 10.1946 3.43598C10.0996 3.46194 10.0004 3.46892 9.90263 3.45652C9.8049 3.44413 9.71056 3.41261 9.625 3.36376L8.75 2.86376L7.875 3.36376C7.78944 3.41261 7.6951 3.44413 7.59736 3.45652C7.49963 3.46892 7.4004 3.46194 7.30536 3.43598C7.21032 3.41003 7.12133 3.36561 7.04345 3.30526C6.96558 3.24491 6.90035 3.16981 6.8515 3.08426C6.80265 2.9987 6.77113 2.90436 6.75873 2.80662C6.74634 2.70888 6.75332 2.60966 6.77928 2.51462C6.80523 2.41958 6.84965 2.33058 6.91 2.25271C6.97035 2.17483 7.04544 2.10961 7.131 2.06076L8.378 1.34876ZM5.4 3.91376C5.4986 4.08643 5.5246 4.29118 5.47229 4.48302C5.41997 4.67485 5.29361 4.83806 5.121 4.93676L5.012 4.99976L5.122 5.06276C5.28969 5.16392 5.41116 5.32666 5.46045 5.51619C5.50974 5.70573 5.48294 5.90702 5.38577 6.07706C5.28861 6.24709 5.12879 6.37238 4.94048 6.42614C4.75216 6.4799 4.55029 6.45787 4.378 6.36476L4.248 6.29176C4.23421 6.48455 4.14652 6.66457 4.00323 6.79428C3.85993 6.92399 3.6721 6.99337 3.47889 6.98795C3.28569 6.98253 3.10203 6.90274 2.96623 6.7652C2.83043 6.62767 2.75297 6.44302 2.75 6.24976V4.99976C2.75004 4.86756 2.78503 4.73772 2.85141 4.6234C2.91779 4.50907 3.01321 4.41433 3.128 4.34876L4.378 3.63476C4.55067 3.53615 4.75543 3.51015 4.94726 3.56247C5.13909 3.61479 5.3013 3.74114 5.4 3.91376ZM12.098 3.91376C12.1965 3.74097 12.3597 3.61441 12.5515 3.5619C12.7434 3.50939 12.9482 3.53524 13.121 3.63376L14.371 4.34876C14.486 4.4142 14.5816 4.50889 14.6482 4.62322C14.7147 4.73756 14.7499 4.86746 14.75 4.99976V6.24976C14.7509 6.44563 14.6751 6.63407 14.5389 6.77481C14.4027 6.91555 14.2168 6.99741 14.021 7.0029C13.8252 7.00839 13.6351 6.93706 13.4912 6.80417C13.3473 6.67128 13.2611 6.48737 13.251 6.29176L13.122 6.36476C12.9497 6.45787 12.7478 6.4799 12.5595 6.42614C12.3712 6.37238 12.2114 6.24709 12.1142 6.07706C12.0171 5.90702 11.9903 5.70573 12.0396 5.51619C12.0888 5.32666 12.2103 5.16392 12.378 5.06276L12.488 4.99976L12.378 4.93676C12.2052 4.83823 12.0786 4.67509 12.0261 4.48325C11.9736 4.2914 11.9995 4.08655 12.098 3.91376ZM6.852 6.91476C6.9507 6.74214 7.11391 6.61579 7.30574 6.56347C7.49757 6.51115 7.70233 6.53715 7.875 6.63576L8.75 7.13576L9.625 6.63576C9.79779 6.5371 10.0027 6.51112 10.1946 6.56353C10.3866 6.61595 10.5498 6.74247 10.6485 6.91526C10.7472 7.08805 10.7731 7.29295 10.7207 7.48489C10.6683 7.67684 10.5418 7.8401 10.369 7.93876L9.5 8.43476V9.24976C9.5 9.44867 9.42098 9.63943 9.28033 9.78009C9.13968 9.92074 8.94891 9.99976 8.75 9.99976C8.55109 9.99976 8.36032 9.92074 8.21967 9.78009C8.07902 9.63943 8 9.44867 8 9.24976V8.43476L7.131 7.93876C7.04531 7.88997 6.97009 7.82476 6.90963 7.74687C6.84917 7.66898 6.80467 7.57993 6.77866 7.48482C6.75265 7.38971 6.74566 7.2904 6.75807 7.19259C6.77048 7.09477 6.80206 7.00036 6.851 6.91476H6.852ZM3.5 8.99976C3.69891 8.99976 3.88968 9.07878 4.03033 9.21943C4.17098 9.36008 4.25 9.55085 4.25 9.74976V10.5648L5.122 11.0628C5.29479 11.1614 5.42131 11.3247 5.47372 11.5166C5.52614 11.7086 5.50016 11.9135 5.4015 12.0863C5.30284 12.259 5.13958 12.3856 4.94764 12.438C4.75569 12.4904 4.55079 12.4644 4.378 12.3658L3.128 11.6508C3.01321 11.5852 2.91779 11.4904 2.85141 11.3761C2.78503 11.2618 2.75004 11.132 2.75 10.9998V9.74976C2.75 9.55085 2.82902 9.36008 2.96967 9.21943C3.11032 9.07878 3.30109 8.99976 3.5 8.99976ZM14 8.99976C14.1989 8.99976 14.3897 9.07878 14.5303 9.21943C14.671 9.36008 14.75 9.55085 14.75 9.74976V10.9998C14.75 11.132 14.715 11.2618 14.6486 11.3761C14.5822 11.4904 14.4868 11.5852 14.372 11.6508L13.122 12.3658C12.9492 12.4644 12.7443 12.4904 12.5524 12.438C12.3604 12.3856 12.1972 12.259 12.0985 12.0863C11.9998 11.9135 11.9739 11.7086 12.0263 11.5166C12.0787 11.3247 12.2052 11.1614 12.378 11.0628L13.25 10.5648V9.74976C13.25 9.55085 13.329 9.36008 13.4697 9.21943C13.6103 9.07878 13.8011 8.99976 14 8.99976ZM9.499 12.7078L9.625 12.6358C9.79779 12.5371 10.0027 12.5111 10.1946 12.5635C10.3866 12.616 10.5498 12.7425 10.6485 12.9153C10.7472 13.088 10.7731 13.293 10.7207 13.4849C10.6683 13.6768 10.5418 13.8401 10.369 13.9388L9.122 14.6508C9.0087 14.7155 8.88048 14.7495 8.75 14.7495C8.61952 14.7495 8.4913 14.7155 8.378 14.6508L7.13 13.9398C6.95721 13.8411 6.83069 13.6778 6.77828 13.4859C6.72586 13.294 6.75184 13.089 6.8505 12.9163C6.94916 12.7435 7.11242 12.617 7.30436 12.5645C7.49631 12.5121 7.70121 12.5381 7.874 12.6368L8 12.7088C8.00992 12.5168 8.09316 12.336 8.23254 12.2036C8.37192 12.0713 8.55679 11.9975 8.749 11.9975C8.94121 11.9975 9.12608 12.0713 9.26546 12.2036C9.40484 12.336 9.48808 12.5168 9.498 12.7088L9.499 12.7078Z"
                          fill="white"
                          fillOpacity="0.5"
                        />
                      </svg>
                      Assigned
                    </div>
                  </th>
                  <th className="text-left p-4 flex items-center gap-2">
                    <div className="flex items-center gap-2">
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
                          d="M8.378 1.34876C8.4913 1.28404 8.61952 1.25 8.75 1.25C8.88048 1.25 9.0087 1.28404 9.122 1.34876L10.369 2.06076C10.4546 2.10961 10.5297 2.17483 10.59 2.25271C10.6504 2.33058 10.6948 2.41958 10.7207 2.51462C10.7467 2.60966 10.7537 2.70888 10.7413 2.80662C10.7289 2.90436 10.6974 2.9987 10.6485 3.08426C10.5996 3.16981 10.5344 3.24491 10.4565 3.30526C10.3787 3.36561 10.2897 3.41003 10.1946 3.43598C10.0996 3.46194 10.0004 3.46892 9.90263 3.45652C9.8049 3.44413 9.71056 3.41261 9.625 3.36376L8.75 2.86376L7.875 3.36376C7.78944 3.41261 7.6951 3.44413 7.59736 3.45652C7.49963 3.46892 7.4004 3.46194 7.30536 3.43598C7.21032 3.41003 7.12133 3.36561 7.04345 3.30526C6.96558 3.24491 6.90035 3.16981 6.8515 3.08426C6.80265 2.9987 6.77113 2.90436 6.75873 2.80662C6.74634 2.70888 6.75332 2.60966 6.77928 2.51462C6.80523 2.41958 6.84965 2.33058 6.91 2.25271C6.97035 2.17483 7.04544 2.10961 7.131 2.06076L8.378 1.34876ZM5.4 3.91376C5.4986 4.08643 5.5246 4.29118 5.47229 4.48302C5.41997 4.67485 5.29361 4.83806 5.121 4.93676L5.012 4.99976L5.122 5.06276C5.28969 5.16392 5.41116 5.32666 5.46045 5.51619C5.50974 5.70573 5.48294 5.90702 5.38577 6.07706C5.28861 6.24709 5.12879 6.37238 4.94048 6.42614C4.75216 6.4799 4.55029 6.45787 4.378 6.36476L4.248 6.29176C4.23421 6.48455 4.14652 6.66457 4.00323 6.79428C3.85993 6.92399 3.6721 6.99337 3.47889 6.98795C3.28569 6.98253 3.10203 6.90274 2.96623 6.7652C2.83043 6.62767 2.75297 6.44302 2.75 6.24976V4.99976C2.75004 4.86756 2.78503 4.73772 2.85141 4.6234C2.91779 4.50907 3.01321 4.41433 3.128 4.34876L4.378 3.63476C4.55067 3.53615 4.75543 3.51015 4.94726 3.56247C5.13909 3.61479 5.3013 3.74114 5.4 3.91376ZM12.098 3.91376C12.1965 3.74097 12.3597 3.61441 12.5515 3.5619C12.7434 3.50939 12.9482 3.53524 13.121 3.63376L14.371 4.34876C14.486 4.4142 14.5816 4.50889 14.6482 4.62322C14.7147 4.73756 14.7499 4.86746 14.75 4.99976V6.24976C14.7509 6.44563 14.6751 6.63407 14.5389 6.77481C14.4027 6.91555 14.2168 6.99741 14.021 7.0029C13.8252 7.00839 13.6351 6.93706 13.4912 6.80417C13.3473 6.67128 13.2611 6.48737 13.251 6.29176L13.122 6.36476C12.9497 6.45787 12.7478 6.4799 12.5595 6.42614C12.3712 6.37238 12.2114 6.24709 12.1142 6.07706C12.0171 5.90702 11.9903 5.70573 12.0396 5.51619C12.0888 5.32666 12.2103 5.16392 12.378 5.06276L12.488 4.99976L12.378 4.93676C12.2052 4.83823 12.0786 4.67509 12.0261 4.48325C11.9736 4.2914 11.9995 4.08655 12.098 3.91376ZM6.852 6.91476C6.9507 6.74214 7.11391 6.61579 7.30574 6.56347C7.49757 6.51115 7.70233 6.53715 7.875 6.63576L8.75 7.13576L9.625 6.63576C9.79779 6.5371 10.0027 6.51112 10.1946 6.56353C10.3866 6.61595 10.5498 6.74247 10.6485 6.91526C10.7472 7.08805 10.7731 7.29295 10.7207 7.48489C10.6683 7.67684 10.5418 7.8401 10.369 7.93876L9.5 8.43476V9.24976C9.5 9.44867 9.42098 9.63943 9.28033 9.78009C9.13968 9.92074 8.94891 9.99976 8.75 9.99976C8.55109 9.99976 8.36032 9.92074 8.21967 9.78009C8.07902 9.63943 8 9.44867 8 9.24976V8.43476L7.131 7.93876C7.04531 7.88997 6.97009 7.82476 6.90963 7.74687C6.84917 7.66898 6.80467 7.57993 6.77866 7.48482C6.75265 7.38971 6.74566 7.2904 6.75807 7.19259C6.77048 7.09477 6.80206 7.00036 6.851 6.91476H6.852ZM3.5 8.99976C3.69891 8.99976 3.88968 9.07878 4.03033 9.21943C4.17098 9.36008 4.25 9.55085 4.25 9.74976V10.5648L5.122 11.0628C5.29479 11.1614 5.42131 11.3247 5.47372 11.5166C5.52614 11.7086 5.50016 11.9135 5.4015 12.0863C5.30284 12.259 5.13958 12.3856 4.94764 12.438C4.75569 12.4904 4.55079 12.4644 4.378 12.3658L3.128 11.6508C3.01321 11.5852 2.91779 11.4904 2.85141 11.3761C2.78503 11.2618 2.75004 11.132 2.75 10.9998V9.74976C2.75 9.55085 2.82902 9.36008 2.96967 9.21943C3.11032 9.07878 3.30109 8.99976 3.5 8.99976ZM14 8.99976C14.1989 8.99976 14.3897 9.07878 14.5303 9.21943C14.671 9.36008 14.75 9.55085 14.75 9.74976V10.9998C14.75 11.132 14.715 11.2618 14.6486 11.3761C14.5822 11.4904 14.4868 11.5852 14.372 11.6508L13.122 12.3658C12.9492 12.4644 12.7443 12.4904 12.5524 12.438C12.3604 12.3856 12.1972 12.259 12.0985 12.0863C11.9998 11.9135 11.9739 11.7086 12.0263 11.5166C12.0787 11.3247 12.2052 11.1614 12.378 11.0628L13.25 10.5648V9.74976C13.25 9.55085 13.329 9.36008 13.4697 9.21943C13.6103 9.07878 13.8011 8.99976 14 8.99976ZM9.499 12.7078L9.625 12.6358C9.79779 12.5371 10.0027 12.5111 10.1946 12.5635C10.3866 12.616 10.5498 12.7425 10.6485 12.9153C10.7472 13.088 10.7731 13.293 10.7207 13.4849C10.6683 13.6768 10.5418 13.8401 10.369 13.9388L9.122 14.6508C9.0087 14.7155 8.88048 14.7495 8.75 14.7495C8.61952 14.7495 8.4913 14.7155 8.378 14.6508L7.13 13.9398C6.95721 13.8411 6.83069 13.6778 6.77828 13.4859C6.72586 13.294 6.75184 13.089 6.8505 12.9163C6.94916 12.7435 7.11242 12.617 7.30436 12.5645C7.49631 12.5121 7.70121 12.5381 7.874 12.6368L8 12.7088C8.00992 12.5168 8.09316 12.336 8.23254 12.2036C8.37192 12.0713 8.55679 11.9975 8.749 11.9975C8.94121 11.9975 9.12608 12.0713 9.26546 12.2036C9.40484 12.336 9.48808 12.5168 9.498 12.7088L9.499 12.7078Z"
                          fill="white"
                          fillOpacity="0.5"
                        />
                      </svg>
                      Status
                    </div>
                  </th>
                  <th className="text-left p-4 w-10">
                    <Ellipsis />
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="border-b border-white/5 [&_td]:font-medium hover:bg-white/[2.5%] cursor-pointer transition-colors"
                  >
                    <td className="py-4 pl-4">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-sm">
                          {member.name.charAt(0)}
                        </div>
                        {member.name}
                      </div>
                    </td>
                    <td className="py-4 pl-4">{member.phone}</td>
                    <td className="py-4 pl-4">{member.role}</td>
                    <td className="py-4 pl-4">{member.assigned}</td>
                    <td className="py-4 pl-4">
                      <div className="flex items-center gap-2">
                        {statusIcons[member.status]}
                        <span
                          className={
                            member.status === "active"
                              ? "text-emerald-500"
                              : "text-white/50"
                          }
                        >
                          {member.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 pl-4">
                      <DirectionAwareMenu>
                        <MenuTrigger>
                          <Ellipsis />
                        </MenuTrigger>
                        <MenuItem onClick={() => handleViewMember(member.id)}>
                          <div className="flex items-center gap-2 hover:bg-white/5 transition-colors w-full h-full p-2 rounded-md">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                            >
                              <path
                                d="M8 9.5C8.39782 9.5 8.77936 9.34196 9.06066 9.06066C9.34196 8.77936 9.5 8.39782 9.5 8C9.5 7.60218 9.34196 7.22064 9.06066 6.93934C8.77936 6.65804 8.39782 6.5 8 6.5C7.20449 6.5 6.44142 6.65804 5.87881 6.93934C5.31621 7.22064 5.00013 7.60218 5.00013 8C5.00013 8.39782 5.31621 8.77936 5.87881 9.06066C6.44142 9.34196 7.20449 9.5 8 9.5Z"
                                fill="white"
                                fillOpacity="0.5"
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M1.37996 8.28012C1.31687 8.09672 1.31687 7.89751 1.37996 7.71412C1.85633 6.33749 2.75014 5.14368 3.93692 4.29893C5.1237 3.45419 6.54437 3.00056 8.00109 3.00122C9.45782 3.00188 10.8781 3.4568 12.0641 4.30262C13.2501 5.14844 14.1428 6.34306 14.618 7.72012C14.681 7.90351 14.681 8.10273 14.618 8.28612C14.1418 9.6631 13.248 10.8573 12.0611 11.7023C10.8742 12.5473 9.4533 13.0011 7.99632 13.0005C6.53934 12.9998 5.11883 12.5447 3.9327 11.6986C2.74657 10.8525 1.85387 9.65753 1.37896 8.28012H1.37996Z"
                                fill="white"
                                fillOpacity="0.5"
                              />
                            </svg>
                            <span>View member</span>
                          </div>
                        </MenuItem>
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
                            setAssignEventsDialogOpen(true);
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
                                d="M8.50004 4.5C8.50004 5.16304 8.23665 5.79893 7.76781 6.26777C7.29897 6.73661 6.66309 7 6.00004 7C5.337 7 4.70112 6.73661 4.23228 6.26777C3.76344 5.79893 3.50004 5.16304 3.50004 4.5C3.50004 3.83696 3.76344 3.20107 4.23228 2.73223C4.70112 2.26339 5.337 2 6.00004 2C6.66309 2 7.29897 2.26339 7.76781 2.73223C8.23665 3.20107 8.50004 3.83696 8.50004 4.5ZM10 13C10.552 13 11.01 12.548 10.9 12.006C10.6695 10.8763 10.0558 9.86091 9.1627 9.13167C8.26962 8.40242 7.15204 8.0041 5.99904 8.0041C4.84605 8.0041 3.72846 8.40242 2.83538 9.13167C1.9423 9.86091 1.32857 10.8763 1.09804 12.006C0.989044 12.548 1.44804 13 2.00004 13H10ZM12.5 3.5C12.699 3.5 12.8897 3.57902 13.0304 3.71967C13.171 3.86032 13.25 4.05109 13.25 4.25V5.25H14.25C14.449 5.25 14.6397 5.32902 14.7804 5.46967C14.921 5.61032 15 5.80109 15 6C15 6.19891 14.921 6.38968 14.7804 6.53033C14.6397 6.67098 14.449 6.75 14.25 6.75H13.25V7.75C13.25 7.94891 13.171 8.13968 13.0304 8.28033C12.8897 8.42098 12.699 8.5 12.5 8.5C12.3011 8.5 12.1104 8.42098 11.9697 8.28033C11.8291 8.13968 11.75 7.94891 11.75 7.75V6.75H10.75C10.5511 6.75 10.3604 6.67098 10.2197 6.53033C10.0791 6.38968 10 6.19891 10 6C10 5.80109 10.0791 5.61032 10.2197 5.46967C10.3604 5.32902 10.5511 5.25 10.75 5.25H11.75V4.25C11.75 4.05109 11.8291 3.86032 11.9697 3.71967C12.1104 3.57902 12.3011 3.5 12.5 3.5Z"
                                fill="white"
                                fillOpacity="0.5"
                              />
                            </svg>
                            <span>Assign events</span>
                          </div>
                        </MenuItem>
                        <MenuSeparator />
                        <MenuItem
                          onClick={() => {
                            setSelectedMember(member);
                            setDeactivateDialogOpen(true);
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
                    </td>
                  </tr>
                ))}
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
            <div className="flex flex-col gap-y-3 bg-white/[0.03] border-b border-white/10 p-6">
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

              <div className="flex flex-col gap-4">
                <label className="text-sm font-medium text-white">Role</label>
                <Dropdown>
                  <DropdownTrigger className="w-full">
                    <button
                      type="button"
                      className="flex w-full justify-between items-center text-white gap-2 border border-white/10 hover:bg-white/10 transition-colors px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      <span>{watch("role")}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        className="transform transition-transform"
                      >
                        <path
                          d="M4 6L8 10L12 6"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </DropdownTrigger>
                  <DropdownContent className="w-full bg-[#151515] border border-white/10 tex-white rounded-lg shadow-lg overflow-hidden">
                    {roles.map((role) => (
                      <DropdownItem
                        key={role}
                        onClick={() =>
                          setValue("role", role, { shouldValidate: true })
                        }
                        className="px-4 py-2 hover:bg-white/5 transition-colors text-white"
                      >
                        {role}
                      </DropdownItem>
                    ))}
                  </DropdownContent>
                </Dropdown>
                {errors.role && (
                  <span className="text-xs text-red-500">
                    {errors.role.message}
                  </span>
                )}
              </div>

              {/* Optional Events field */}
              <div className="flex flex-col gap-4">
                <label className="text-sm font-medium text-white flex items-center gap-2 justify-between">
                  Assign Events
                  <span className="text-xs text-white/50">Optional</span>
                </label>
                <Dropdown>
                  <DropdownTrigger className="w-full">
                    <button
                      type="button"
                      className="flex w-full justify-between items-center text-white gap-2 border border-white/10 hover:bg-white/10 transition-colors px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      <span>
                        {watch("events")?.length === 0
                          ? "Select events"
                          : `${watch("events")?.length} event${
                              watch("events")?.length === 1 ? "" : "s"
                            } selected`}
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        className="transform transition-transform"
                      >
                        <path
                          d="M4 6L8 10L12 6"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </DropdownTrigger>
                  <DropdownContent className="w-full hide-scrollbar max-h-[200px] overflow-y-auto bg-[#151515] border border-white/10 tex-white rounded-lg shadow-lg overflow-hidden">
                    {sampleEvents.map((event) => (
                      <DropdownItem
                        key={event.id}
                        className="px-4 py-2 hover:bg-white/5 transition-colors text-white"
                        onClick={() => {
                          const currentEvents = watch("events") || [];
                          const eventId = String(event.id);
                          if (currentEvents.includes(eventId)) {
                            setValue(
                              "events",
                              currentEvents.filter((id) => id !== eventId)
                            );
                          } else {
                            setValue("events", [...currentEvents, eventId]);
                          }
                        }}
                      >
                        <div className="flex items-center w-full justify-between gap-3">
                          {event.name}
                          <Checkbox
                            checked={watch("events")?.includes(
                              String(event.id)
                            )}
                            className="border-white/10 rounded bg-white/5 data-[state=checked]:bg-[#34B2DA] data-[state=checked]:text-black"
                          />
                        </div>
                      </DropdownItem>
                    ))}
                    <div className="sticky bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#151515] to-transparent pointer-events-none flex items-center justify-center text-white/50 text-xs">
                      Scroll for more
                    </div>{" "}
                  </DropdownContent>
                </Dropdown>
              </div>
            </div>
            <div className="flex flex-col gap-3 p-6 pt-0">
              <button
                type="submit"
                disabled={!isValid}
                className="w-full bg-white hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed text-black border-white/10 border text-center rounded-full h-9 px-4 focus:outline-none flex items-center justify-center gap-2 font-semibold transition-colors text-sm"
              >
                Invite Member
              </button>
            </div>
          </form>
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

      {/* Edit Member Dialog */}
      <Dialog
        open={editMemberDialogOpen}
        onOpenChange={setEditMemberDialogOpen}
        className="!max-w-[400px] border border-white/10 rounded-xl !p-0"
      >
        <DialogContent className="max-h-[90vh] !gap-0">
          <form onSubmit={handleSubmitEdit(onEditSubmit)}>
            <div className="flex flex-col gap-y-3 bg-white/[0.03] border-b border-white/10 p-6">
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
                <label className="text-sm font-medium text-white">Role</label>
                <Dropdown>
                  <DropdownTrigger className="w-full">
                    <button
                      type="button"
                      className="flex w-full justify-between items-center text-white gap-2 border border-white/10 hover:bg-white/10 transition-colors px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      <span>{watchEdit("role")}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        className="transform transition-transform"
                      >
                        <path
                          d="M4 6L8 10L12 6"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </DropdownTrigger>
                  <DropdownContent className="w-full bg-[#151515] border border-white/10 tex-white rounded-lg shadow-lg overflow-hidden">
                    {roles.map((role) => (
                      <DropdownItem
                        key={role}
                        onClick={() =>
                          setEditValue("role", role, { shouldValidate: true })
                        }
                        className="px-4 py-2 hover:bg-white/5 transition-colors text-white"
                      >
                        {role}
                      </DropdownItem>
                    ))}
                  </DropdownContent>
                </Dropdown>
                {editErrors.role && (
                  <span className="text-xs text-red-500">
                    {editErrors.role.message}
                  </span>
                )}
              </div>

              {/* Optional Events field */}
              <div className="flex flex-col gap-4">
                <label className="text-sm font-medium text-white flex items-center gap-2 justify-between">
                  Assign Events
                  <span className="text-xs text-white/50">Optional</span>
                </label>
                <Dropdown>
                  <DropdownTrigger className="w-full">
                    <button
                      type="button"
                      className="flex w-full justify-between items-center text-white gap-2 border border-white/10 hover:bg-white/10 transition-colors px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      <span>
                        {watchEdit("events")?.length === 0
                          ? selectedMember?.assigned || "Select events"
                          : `${watchEdit("events")?.length} event${
                              watchEdit("events")?.length === 1 ? "" : "s"
                            } selected`}
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        className="transform transition-transform"
                      >
                        <path
                          d="M4 6L8 10L12 6"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </DropdownTrigger>
                  <DropdownContent className="w-full overflow-y-auto hide-scrollbar max-h-[200px] bg-[#151515] border border-white/10 tex-white rounded-lg shadow-lg overflow-hidden">
                    {sampleEvents.map((event) => (
                      <DropdownItem
                        key={event.id}
                        className="px-4 py-2 hover:bg-white/5 transition-colors text-white"
                        onClick={() => {
                          const currentEvents = watchEdit("events") || [];
                          const eventId = String(event.id);
                          if (currentEvents.includes(eventId)) {
                            setEditValue(
                              "events",
                              currentEvents.filter((id) => id !== eventId)
                            );
                          } else {
                            setEditValue("events", [...currentEvents, eventId]);
                          }
                        }}
                      >
                        <div className="flex items-center w-full justify-between gap-3">
                          {event.name}
                          <Checkbox
                            checked={watchEdit("events")?.includes(
                              String(event.id)
                            )}
                            className="border-white/10 rounded bg-white/5 data-[state=checked]:bg-[#34B2DA] data-[state=checked]:text-black"
                          />
                        </div>
                      </DropdownItem>
                    ))}
                    <div className="sticky bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/50 to-transparent pointer-events-none flex items-center justify-center text-white/50 text-xs">
                      Scroll for more
                    </div>
                  </DropdownContent>
                </Dropdown>
              </div>
            </div>
            <div className="flex flex-col gap-3 p-6 pt-0">
              <button
                type="submit"
                disabled={!isEditValid}
                className="w-full bg-white hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed text-black border-white/10 border text-center rounded-full h-9 px-4 focus:outline-none flex items-center justify-center gap-2 font-semibold transition-colors text-sm"
              >
                Update
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Assign Events Dialog */}
      <Dialog
        open={assignEventsDialogOpen}
        onOpenChange={setAssignEventsDialogOpen}
        className="!max-w-[400px] border border-white/10 rounded-xl !p-0 overflow-hidden"
      >
        <DialogContent className="max-h-[90vh] !gap-0">
          <div className="flex flex-col gap-y-3 bg-white/[0.03] border-b border-white/10 p-6">
            <DialogTitle>Assign events</DialogTitle>
            <DialogDescription>
              Select events for {selectedMember?.name}
            </DialogDescription>
          </div>
          <div className="flex flex-col gap-4 p-6 overflow-y-auto hide-scrollbar">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-white">
                  Currently assigned
                </span>
                {sampleEvents.slice(0, 2).map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between gap-3 p-3 bg-white/5 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/10" />
                      <div className="flex flex-col gap-y-2.5">
                        <span className="text-sm font-medium text-white">
                          {event.name}
                        </span>
                        <span className="text-xs text-white/50 flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="15"
                            height="14"
                            viewBox="0 0 15 14"
                            fill="none"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M7.25 14C9.10652 14 10.887 13.2625 12.1997 11.9497C13.5125 10.637 14.25 8.85652 14.25 7C14.25 5.14348 13.5125 3.36301 12.1997 2.05025C10.887 0.737498 9.10652 0 7.25 0C5.39348 0 3.61301 0.737498 2.30025 2.05025C0.987498 3.36301 0.25 5.14348 0.25 7C0.25 8.85652 0.987498 10.637 2.30025 11.9497C3.61301 13.2625 5.39348 14 7.25 14ZM7.90625 2.625C7.90625 2.45095 7.83711 2.28403 7.71404 2.16096C7.59097 2.03789 7.42405 1.96875 7.25 1.96875C7.07595 1.96875 6.90903 2.03789 6.78596 2.16096C6.66289 2.28403 6.59375 2.45095 6.59375 2.625V7C6.59375 7.36225 6.88775 7.65625 7.25 7.65625H10.75C10.924 7.65625 11.091 7.58711 11.214 7.46404C11.3371 7.34097 11.4062 7.17405 11.4062 7C11.4062 6.82595 11.3371 6.65903 11.214 6.53596C11.091 6.41289 10.924 6.34375 10.75 6.34375H7.90625V2.625Z"
                              fill="white"
                              fillOpacity="0.4"
                            />
                          </svg>
                          25 Dec 22:00
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        console.log("Remove event:", event.id);
                      }}
                      className="text-white/50 hover:text-white transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="13"
                        height="14"
                        viewBox="0 0 13 14"
                        fill="none"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M3.75 2.25V3H1.5C1.30109 3 1.11032 3.07902 0.96967 3.21967C0.829018 3.36032 0.75 3.55109 0.75 3.75C0.75 3.94891 0.829018 4.13968 0.96967 4.28033C1.11032 4.42098 1.30109 4.5 1.5 4.5H1.8L2.615 12.65C2.65218 13.0199 2.8254 13.3628 3.10107 13.6123C3.37675 13.8617 3.73523 13.9999 4.107 14H9.392C9.76394 14.0001 10.1227 13.8621 10.3986 13.6126C10.6744 13.3631 10.8478 13.0201 10.885 12.65L11.7 4.5H12C12.1989 4.5 12.3897 4.42098 12.5303 4.28033C12.671 4.13968 12.75 3.94891 12.75 3.75C12.75 3.55109 12.671 3.36032 12.5303 3.21967C12.3897 3.07902 12.1989 3 12 3H9.75V2.25C9.75 1.65326 9.51295 1.08097 9.09099 0.65901C8.66903 0.237053 8.09674 0 7.5 0H6C5.40326 0 4.83097 0.237053 4.40901 0.65901C3.98705 1.08097 3.75 1.65326 3.75 2.25ZM6 1.5C5.80109 1.5 5.61032 1.57902 5.46967 1.71967C5.32902 1.86032 5.25 2.05109 5.25 2.25V3H8.25V2.25C8.25 2.05109 8.17098 1.86032 8.03033 1.71967C7.88968 1.57902 7.69891 1.5 7.5 1.5H6ZM4.8 5C4.89852 4.99502 4.99705 5.00952 5.08996 5.04268C5.18286 5.07584 5.26832 5.127 5.34142 5.19323C5.41453 5.25946 5.47385 5.33946 5.51599 5.42865C5.55813 5.51784 5.58226 5.61447 5.587 5.713L5.862 11.213C5.86933 11.4101 5.79872 11.6022 5.66546 11.7476C5.5322 11.893 5.34702 11.9801 5.15002 11.9899C4.95302 11.9998 4.76007 11.9317 4.61295 11.8003C4.46583 11.6689 4.37639 11.4849 4.364 11.288L4.089 5.788C4.08388 5.68956 4.09821 5.59107 4.13118 5.49818C4.16416 5.40528 4.21511 5.3198 4.28115 5.24661C4.34718 5.17343 4.427 5.11397 4.51603 5.07166C4.60506 5.02934 4.70155 5.00499 4.8 5ZM8.7 5C8.79844 5.00487 8.89496 5.02909 8.98404 5.07129C9.07312 5.11349 9.153 5.17283 9.21913 5.24592C9.28525 5.31901 9.33632 5.40442 9.36942 5.49726C9.40251 5.59011 9.41698 5.68856 9.412 5.787L9.137 11.287C9.12461 11.4839 9.03517 11.6679 8.88805 11.7993C8.74093 11.9307 8.54798 11.9988 8.35098 11.9889C8.15398 11.9791 7.9688 11.892 7.83554 11.7466C7.70228 11.6012 7.63167 11.4091 7.639 11.212L7.914 5.712C7.92409 5.51354 8.01253 5.32719 8.1599 5.19389C8.30727 5.06058 8.50152 4.99021 8.7 5Z"
                          fill="#F43F5E"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-white">
                  Not assigned
                </span>
                {sampleEvents.slice(2).map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between gap-3 p-3 bg-white/5 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/10" />
                      <div className="flex flex-col gap-y-2.5">
                        <span className="text-sm font-medium text-white">
                          {event.name}
                        </span>
                        <span className="text-xs text-white/50">
                          25 Dec 22:00
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        console.log("Add event:", event.id);
                      }}
                      className="text-white/50 hover:text-white transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="17"
                        height="16"
                        viewBox="0 0 17 16"
                        fill="none"
                      >
                        <path
                          d="M9.5 3.75C9.5 3.55109 9.42098 3.36032 9.28033 3.21967C9.13968 3.07902 8.94891 3 8.75 3C8.55109 3 8.36032 3.07902 8.21967 3.21967C8.07902 3.36032 8 3.55109 8 3.75V7.25H4.5C4.30109 7.25 4.11032 7.32902 3.96967 7.46967C3.82902 7.61032 3.75 7.80109 3.75 8C3.75 8.19891 3.82902 8.38968 3.96967 8.53033C4.11032 8.67098 4.30109 8.75 4.5 8.75H8V12.25C8 12.4489 8.07902 12.6397 8.21967 12.7803C8.36032 12.921 8.55109 13 8.75 13C8.94891 13 9.13968 12.921 9.28033 12.7803C9.42098 12.6397 9.5 12.4489 9.5 12.25V8.75H13C13.1989 8.75 13.3897 8.67098 13.5303 8.53033C13.671 8.38968 13.75 8.19891 13.75 8C13.75 7.80109 13.671 7.61032 13.5303 7.46967C13.3897 7.32902 13.1989 7.25 13 7.25H9.5V3.75Z"
                          fill="white"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 p-6 absolute bottom-0 left-0 right-0 bg-[#1A1A1A] border-t border-white/10">
            <button
              onClick={() => setAssignEventsDialogOpen(false)}
              className="w-full bg-white hover:bg-white/90 text-black border-white/10 border text-center rounded-full h-9 px-4 focus:outline-none flex items-center justify-center gap-2 font-semibold transition-colors text-sm"
            >
              Done
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarLayout>
  );
}
