import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "../../components/ui/Dailog";

import {
    Dropdown,
    DropdownTrigger,
    DropdownContent,
    DropdownItem,
} from "../../components/ui/Dropdown";
import url from "../../constants/url"
import axios from "axios";

const ticketTypesIcons = {
    regular: (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
        >
            <path
                d="M8.372 1.34876C8.2587 1.28404 8.13048 1.25 8 1.25C7.86952 1.25 7.7413 1.28404 7.628 1.34876L2.818 4.09676L8 7.13076L13.182 4.09676L8.372 1.34876ZM14 5.35676L8.75 8.42976V14.4348L13.622 11.6508C13.7368 11.5852 13.8322 11.4904 13.8986 11.3761C13.965 11.2618 14 11.132 14 10.9998V5.35676ZM7.25 14.4348V8.42976L2 5.35676V10.9998C2 11.2698 2.144 11.5178 2.378 11.6508L7.25 14.4348Z"
                fill="#34B2DA"
            />
        </svg>
    ),
    vip: (
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
                d="M7.99904 1.75C8.14711 1.7501 8.29184 1.79403 8.41498 1.87624C8.53813 1.95846 8.63419 2.07529 8.69104 2.212L10.101 5.605L13.765 5.898C13.9127 5.90988 14.0535 5.9652 14.1697 6.05699C14.286 6.14878 14.3724 6.27293 14.4182 6.41379C14.464 6.55464 14.467 6.7059 14.4269 6.84849C14.3869 6.99108 14.3055 7.11861 14.193 7.215L11.402 9.605L12.255 13.18C12.2893 13.324 12.2802 13.475 12.2288 13.6138C12.1774 13.7527 12.0861 13.8733 11.9663 13.9603C11.8466 14.0473 11.7037 14.097 11.5558 14.103C11.4079 14.109 11.2615 14.0711 11.135 13.994L7.99704 12.08L4.86204 13.995C4.73562 14.0721 4.58922 14.11 4.44129 14.104C4.29336 14.098 4.15051 14.0483 4.03074 13.9613C3.91097 13.8743 3.81965 13.7537 3.76828 13.6149C3.7169 13.476 3.70777 13.325 3.74204 13.181L4.59404 9.607L1.80404 7.217C1.69129 7.12074 1.6096 6.99323 1.56928 6.85056C1.52896 6.7079 1.53183 6.55648 1.57753 6.41545C1.62322 6.27441 1.70968 6.15008 1.826 6.05816C1.94232 5.96624 2.08327 5.91086 2.23104 5.899L5.89404 5.606L7.30404 2.213C7.36094 2.07563 7.45739 1.95826 7.58114 1.87582C7.70489 1.79338 7.85035 1.74959 7.99904 1.75Z"
                fill="#A3E635"
            />
        </svg>
    ),
    "early bird": (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
        >
            <path
                d="M10.6693 4.66781H10.6759M2.26927 12.0012H8.0026C9.41709 12.0012 10.7736 11.4393 11.7738 10.4391C12.774 9.43889 13.3359 8.08234 13.3359 6.66785V4.66785M13.3359 4.66785C13.3374 4.09979 13.1575 3.5461 12.8223 3.08744C12.4872 2.62879 12.0143 2.28916 11.4726 2.11803C10.931 1.94689 10.3488 1.95321 9.81096 2.13605C9.27313 2.31889 8.80774 2.66871 8.4826 3.13452L1.33594 13.3345M13.3359 4.66785L14.6693 5.00114L13.3359 5.33447M6.66927 12.0011V14.0011M9.33594 11.8345V14.0011M4.66927 12.0011C5.49135 12.001 6.29345 11.7477 6.96642 11.2755C7.63939 10.8034 8.15054 10.1354 8.43031 9.36235C8.71008 8.58934 8.74488 7.7489 8.52998 6.95541C8.31507 6.16191 7.8609 5.45391 7.22927 4.92773"
                stroke="#F97316"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),
};

const initialTickets = [
    {
        id: 1,
        type: "regular",
        price: 39,
        sold: 180,
        total: 250,
        description: "Standard admission after 11 PM",
        status: "active",
    },
    {
        id: 2,
        type: "vip",
        price: 199,
        sold: 45,
        total: 150,
        description: "Standard admission after 11 PM",
        status: "active",
    },
    {
        id: 3,
        type: "early bird",
        price: 39,
        sold: 296,
        total: 500,
        description: "Standard admission after 11 PM",
        status: "paused",
    },
];

const ticketTypeFormSchema = z.object({
    name: z.string().min(1, "Ticket name is required"),
    type: z.enum(["regular", "vip", "early bird"], {
        required_error: "Please select a ticket type",
    }),
    price: z.number().min(0, "Price must be a positive number"),
    total: z.number().min(1, "Total tickets must be at least 1"),
    description: z.string().max(10, "Description cannot exceed 10 words"),
    minPurchase: z.number().min(1, "Minimum purchase must be at least 1"),
    maxPurchase: z.number().min(1, "Maximum purchase must be at least 1"),
});

export default function TicketTab({ event }) {
    const [tickets, setTickets] = useState(initialTickets);
    const [newTicketTypeDialogOpen, setNewTicketTypeDialogOpen] = useState(false);
    const [editTicketDialogOpen, setEditTicketDialogOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [pauseDialogOpen, setPauseDialogOpen] = useState(false);
    const [ticketToPause, setTicketToPause] = useState(null);
    const [renewDialogOpen, setRenewDialogOpen] = useState(false);
    const [ticketToRenew, setTicketToRenew] = useState(null);

    const [soldTickets, setSoldTickets] = useState(0);
    const [remainCount, setRemainCount] = useState(0);

    const {
        register: registerTicket,
        handleSubmit: handleSubmitTicket,
        watch: watchTicket,
        formState: { errors: errorsTicket, isValid: isValidTicket },
        reset: resetTicket,
    } = useForm({
        resolver: zodResolver(ticketTypeFormSchema),
        defaultValues: {
            name: "",
            type: "regular",
            price: "",
            total: "",
            description: "",
            minPurchase: 1,
            maxPurchase: 10,
        },
    });

    const {
        register: registerEditTicket,
        handleSubmit: handleSubmitEditTicket,
        watch: watchEditTicket,
        formState: { errors: errorsEditTicket, isValid: isValidEditTicket },
        reset: resetEditTicket,
        setValue: setEditTicketValue,
    } = useForm({
        resolver: zodResolver(ticketTypeFormSchema),
        defaultValues: {
            name: "",
            type: "regular",
            price: "",
            total: "",
            description: "",
            minPurchase: 1,
            maxPurchase: 10,
        },
    });

    const onSubmitTicket = (data) => {
        console.log("Ticket form submitted:", data);
        setTickets((prev) => [
            ...prev,
            {
                id: prev.length + 1,
                ...data,
                sold: 0,
                status: "active",
            },
        ]);
        resetTicket();
        setNewTicketTypeDialogOpen(false);
    };

    const handleRenewSales = (ticket) => {
        setTicketToRenew(ticket);
        setRenewDialogOpen(true);
    };

    const confirmRenew = () => {
        setTickets((prev) =>
            prev.map((ticket) =>
                ticket.id === ticketToRenew.id
                    ? {
                        ...ticket,
                        status: "active",
                    }
                    : ticket
            )
        );
        setRenewDialogOpen(false);
        setTicketToRenew(null);
    };

    const handlePause = (ticket) => {
        setTicketToPause(ticket);
        setPauseDialogOpen(true);
    };

    const confirmPause = () => {
        setTickets((prev) =>
            prev.map((ticket) =>
                ticket.id === ticketToPause.id
                    ? {
                        ...ticket,
                        status: "paused",
                    }
                    : ticket
            )
        );
        setPauseDialogOpen(false);
        setTicketToPause(null);
    };

    const handleEditTicket = (ticket) => {
        setSelectedTicket(ticket);
        // Set form values
        Object.keys(ticket).forEach((key) => {
            if (key !== "id" && key !== "sold" && key !== "status") {
                setEditTicketValue(key, ticket[key]);
            }
        });
        setEditTicketDialogOpen(true);
    };

    const onSubmitEditTicket = (data) => {
        console.log("Edit ticket form submitted:", data);
        setTickets((prev) =>
            prev.map((ticket) =>
                ticket.id === selectedTicket.id
                    ? {
                        ...ticket,
                        ...data,
                    }
                    : ticket
            )
        );
        resetEditTicket();
        setEditTicketDialogOpen(false);
        setSelectedTicket(null);
    };

    useEffect(() => {
        const fetchEarnings = async () => {
            await fetchRemainEvent(event._id);
        };

        fetchEarnings();
    }, [event]);

    const fetchRemainEvent = async (id) => {
        try {
            const response = await axios.get(`${url}/remain-tickets/${id}`);
            console.log(response.data);

            if (response.data) {
                const soldData = {};
                const remainingData = {};

                response.data.forEach(ticket => {
                    soldData[ticket.ticket_name] = ticket.tickets_sold;
                    remainingData[ticket.ticket_name] = ticket.remaining_tickets;
                });

                setSoldTickets(soldData);
                setRemainCount(remainingData);
            }
        } catch (error) {
            console.error(`Error fetching remain events for id: ${id}`, error);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setNewTicketTypeDialogOpen(true)}
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
                    Add ticket type
                </button>
            </div>
            <div className="flex items-center gap-2 p-3 border-2 border-dashed border-white/5 rounded-lg">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                >
                    <path
                        d="M3 2C2.73478 2 2.48043 2.10536 2.29289 2.29289C2.10536 2.48043 2 2.73478 2 3V4C2 4.26522 2.10536 4.51957 2.29289 4.70711C2.48043 4.89464 2.73478 5 3 5H13C13.2652 5 13.5196 4.89464 13.7071 4.70711C13.8946 4.51957 14 4.26522 14 4V3C14 2.73478 13.8946 2.48043 13.7071 2.29289C13.5196 2.10536 13.2652 2 13 2H3Z"
                        fill="white"
                        fillOpacity="0.5"
                    />
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M3 6H13V12C13 12.5304 12.7893 13.0391 12.4142 13.4142C12.0391 13.7893 11.5304 14 11 14H5C4.46957 14 3.96086 13.7893 3.58579 13.4142C3.21071 13.0391 3 12.5304 3 12V6ZM6 8.75C6 8.55109 6.07902 8.36032 6.21967 8.21967C6.36032 8.07902 6.55109 8 6.75 8H9.25C9.44891 8 9.63968 8.07902 9.78033 8.21967C9.92098 8.36032 10 8.55109 10 8.75C10 8.94891 9.92098 9.13968 9.78033 9.28033C9.63968 9.42098 9.44891 9.5 9.25 9.5H6.75C6.55109 9.5 6.36032 9.42098 6.21967 9.28033C6.07902 9.13968 6 8.94891 6 8.75Z"
                        fill="white"
                        fillOpacity="0.5"
                    />
                </svg>
                <p className="text-white/70 text-sm">You have an uncompleted draft</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                {event?.tickets?.map((ticket) => {
                    const totalTickets = (soldTickets[ticket.ticket_name] || 0) + (remainCount[ticket.ticket_name] || 0);
                    const soldPercentage = totalTickets > 0 ? (soldTickets[ticket.ticket_name] || 0) / totalTickets * 100 : 0;
                    return (
                        <div key={ticket.id} className="bg-white/[0.03] rounded-2xl space-y-2">
                            <div className="flex w-full">
                                <div className="w-full">
                                    <div className="w-full flex items-center justify-between p-4 border-b-2 border-dashed border-[#0F0F0F]">
                                        <div className="flex items-center gap-2">
                                            {ticketTypesIcons['regular']}
                                            <span className="flex items-center uppercase text-sm">
                                                {ticket.ticket_name}
                                            </span>
                                        </div>
                                        <div className="text-white/70">
                                            <div className="flex items-center gap-3">
                                                <div className="flex gap-0.5">
                                                    {[...Array(4)].map((_, i) => {
                                                        const barFillPercentage = Math.min(Math.max(soldPercentage - i * 25, 0), 25);

                                                        let barColor;
                                                        if (soldPercentage <= 25) {
                                                            barColor = "#10B981";
                                                        } else if (soldPercentage <= 50) {
                                                            barColor = "#A3E635";
                                                        } else {
                                                            barColor = "#F97316";
                                                        }

                                                        return (
                                                            <div
                                                                key={i}
                                                                className="h-4 w-1.5 rounded-full bg-white/10 overflow-hidden"
                                                            >
                                                                <div
                                                                    className="h-full transition-all duration-300 ease-out"
                                                                    style={{
                                                                        transform: `scaleY(${barFillPercentage / 25})`,
                                                                        transformOrigin: "bottom",
                                                                        backgroundColor: barColor,
                                                                    }}
                                                                />
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                <span>
                                                    {soldTickets[ticket.ticket_name] || 0}/
                                                    {totalTickets || 0}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-baseline gap-y-2.5 p-4">
                                        <p className="text-2xl font-bold">
                                            {ticket.status === "paused" && (
                                                <span className="text-white/70">Paused – {""}</span>
                                            )}
                                            <span className="text-white/70">$ </span>
                                            {ticket.price}
                                        </p>

                                        <p className="text-white/70" dangerouslySetInnerHTML={{ __html: ticket.ticket_description }}></p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4">
                                {ticket.status === "paused" ? (
                                    <button
                                        onClick={() => handleRenewSales(ticket)}
                                        className="bg-[#0F0F0F] rounded-full px-4 py-2 h-10 flex items-center gap-2"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 16 16"
                                            fill="none"
                                        >
                                            <path
                                                d="M3 3.73173C3.00012 3.46303 3.07242 3.19929 3.20934 2.96809C3.34626 2.73689 3.54277 2.54671 3.77833 2.41744C4.01389 2.28816 4.27985 2.22453 4.54841 2.2332C4.81697 2.24187 5.07827 2.32253 5.305 2.46673L12.011 6.73373C12.2239 6.86921 12.3992 7.0562 12.5206 7.27741C12.642 7.49862 12.7057 7.74688 12.7057 7.99923C12.7057 8.25158 12.642 8.49984 12.5206 8.72105C12.3992 8.94226 12.2239 9.12925 12.011 9.26473L5.305 13.5327C5.0782 13.677 4.81681 13.7576 4.54816 13.7663C4.27951 13.7749 4.01348 13.7112 3.77789 13.5818C3.5423 13.4524 3.3458 13.2621 3.20896 13.0307C3.07211 12.7994 2.99994 12.5355 3 12.2667V3.73173Z"
                                                fill="white"
                                                fillOpacity="0.5"
                                            />
                                        </svg>
                                        <span>Renew sales</span>
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => handleEditTicket(ticket)}
                                            className="bg-[#0F0F0F] rounded-full px-4 py-2 h-10 flex items-center gap-2"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 16 16"
                                                fill="none"
                                            >
                                                <path
                                                    d="M13.4872 2.51263C13.3247 2.3501 13.1318 2.22118 12.9194 2.13323C12.7071 2.04527 12.4795 2 12.2497 2C12.0199 2 11.7923 2.04527 11.58 2.13323C11.3676 2.22118 11.1747 2.3501 11.0122 2.51263L6.74919 6.77363C6.49389 7.02895 6.29137 7.33205 6.15319 7.66563L5.30519 9.71263C5.24839 9.84968 5.23351 10.0005 5.26244 10.146C5.29137 10.2915 5.36281 10.4252 5.46772 10.5301C5.57262 10.635 5.70629 10.7064 5.8518 10.7354C5.99731 10.7643 6.14814 10.7494 6.28519 10.6926L8.33219 9.84463C8.66577 9.70644 8.96887 9.50392 9.22419 9.24863L13.4852 4.98663C13.8131 4.65847 13.9973 4.21354 13.9973 3.74963C13.9973 3.28571 13.8131 2.84078 13.4852 2.51263H13.4872Z"
                                                    fill="white"
                                                    fillOpacity="0.5"
                                                />
                                                <path
                                                    d="M4.75 3.5C4.06 3.5 3.5 4.06 3.5 4.75V11.25C3.5 11.94 4.06 12.5 4.75 12.5H11.25C11.94 12.5 12.5 11.94 12.5 11.25V9C12.5 8.80109 12.579 8.61032 12.7197 8.46967C12.8603 8.32902 13.0511 8.25 13.25 8.25C13.4489 8.25 13.6397 8.32902 13.7803 8.46967C13.921 8.61032 14 8.80109 14 9V11.25C14 11.9793 13.7103 12.6788 13.1945 13.1945C12.6788 13.7103 11.9793 14 11.25 14H4.75C4.02065 14 3.32118 13.7103 2.80546 13.1945C2.28973 12.6788 2 11.9793 2 11.25V4.75C2 4.02065 2.28973 3.32118 2.80546 2.80546C3.32118 2.28973 4.02065 2 4.75 2H7C7.19891 2 7.38968 2.07902 7.53033 2.21967C7.67098 2.36032 7.75 2.55109 7.75 2.75C7.75 2.94891 7.67098 3.13968 7.53033 3.28033C7.38968 3.42098 7.19891 3.5 7 3.5H4.75Z"
                                                    fill="white"
                                                    fillOpacity="0.5"
                                                />
                                            </svg>
                                            <span>Edit Ticket</span>
                                        </button>
                                        <button
                                            onClick={() => handlePause(ticket)}
                                            className="bg-[#0F0F0F] rounded-full w-10 h-10 flex items-center justify-center"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="17"
                                                height="16"
                                                viewBox="0 0 17 16"
                                                fill="none"
                                            >
                                                <path
                                                    d="M5 2C4.86739 2 4.74021 2.05268 4.64645 2.14645C4.55268 2.24021 4.5 2.36739 4.5 2.5V13.5C4.5 13.6326 4.55268 13.7598 4.64645 13.8536C4.74021 13.9473 4.86739 14 5 14H6C6.13261 14 6.25979 13.9473 6.35355 13.8536C6.44732 13.7598 6.5 13.6326 6.5 13.5V2.5C6.5 2.36739 6.44732 2.24021 6.35355 2.14645C6.25979 2.05268 6.13261 2 6 2H5ZM11 2C10.8674 2 10.7402 2.05268 10.6464 2.14645C10.5527 2.24021 10.5 2.36739 10.5 2.5V13.5C10.5 13.6326 10.5527 13.7598 10.6464 13.8536C10.7402 13.9473 10.8674 14 11 14H12C12.1326 14 12.2598 13.9473 12.3536 13.8536C12.4473 13.7598 12.5 13.6326 12.5 13.5V2.5C12.5 2.36739 12.4473 2.24021 12.3536 2.14645C12.2598 2.05268 12.1326 2 12 2H11Z"
                                                    fill="white"
                                                />
                                            </svg>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* New Ticket Type Dialog */}
            <Dialog
                open={newTicketTypeDialogOpen}
                onOpenChange={(open) => {
                    setNewTicketTypeDialogOpen(open);
                    if (!open) resetTicket();
                }}
                className="!max-w-[400px] border border-white/10 rounded-xl !p-0 overflow-hidden"
            >
                <DialogContent className="max-h-[90vh] overflow-y-auto hide-scrollbar !gap-0">
                    <form onSubmit={handleSubmitTicket(onSubmitTicket)}>
                        <div className="flex flex-col gap-y-3 bg-white/[0.03] border-b rounded-t-xl border-white/10 p-6">
                            <DialogTitle>Add new ticket type</DialogTitle>
                            <DialogDescription>
                                Create a new ticket type for your event.
                            </DialogDescription>
                        </div>
                        <div className="flex flex-col gap-4 p-6">
                            {/* Price - First */}
                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-medium text-white">
                                    Ticket price
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70">
                                        $
                                    </span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        {...registerTicket("price", {
                                            valueAsNumber: true,
                                            setValueAs: (v) => (v === "" ? undefined : parseFloat(v)),
                                            onChange: (e) => {
                                                // Remove leading zeros
                                                if (
                                                    e.target.value.startsWith("0") &&
                                                    e.target.value.length > 1 &&
                                                    !e.target.value.startsWith("0.")
                                                ) {
                                                    e.target.value = e.target.value.replace(/^0+/, "");
                                                }
                                            },
                                        })}
                                        className="border bg-primary text-white text-sm border-white/10 h-10 rounded-lg pl-7 pr-3 focus:outline-none w-full"
                                        placeholder="0.00"
                                    />
                                </div>
                                {errorsTicket.price && (
                                    <span className="text-xs text-red-500">
                                        {errorsTicket.price.message}
                                    </span>
                                )}
                            </div>

                            {/* Ticket Icon - Second */}
                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-medium text-white">
                                    Ticket icon
                                </label>
                                <Dropdown>
                                    <DropdownTrigger>
                                        <button
                                            type="button"
                                            className="flex items-center justify-between w-full border bg-primary text-white text-sm border-white/10 h-10 rounded-lg px-3 focus:outline-none"
                                        >
                                            <div className="flex items-center gap-2">
                                                {ticketTypesIcons[watchTicket("type")] ||
                                                    ticketTypesIcons["regular"]}
                                                <span>
                                                    {watchTicket("type") === "early bird"
                                                        ? "Early Bird"
                                                        : watchTicket("type").charAt(0).toUpperCase() +
                                                        watchTicket("type").slice(1)}
                                                </span>
                                            </div>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 16 16"
                                                fill="none"
                                                className="text-white/50"
                                            >
                                                <path
                                                    d="M4 6L8 10L12 6"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </button>
                                    </DropdownTrigger>
                                    <DropdownContent className="bg-[#1C1C1C] w-full border border-white/10 rounded-lg shadow-lg overflow-hidden">
                                        {Object.entries(ticketTypesIcons).map(([type, icon]) => (
                                            <DropdownItem
                                                key={type}
                                                onClick={() => {
                                                    const { onChange } = registerTicket("type");
                                                    onChange({ target: { value: type } });
                                                }}
                                                className="flex items-center gap-2 px-3 py-2 hover:bg-white/5"
                                            >
                                                {icon}
                                                <span className="capitalize">
                                                    {type === "early bird" ? "Early Bird" : type}
                                                </span>
                                            </DropdownItem>
                                        ))}
                                    </DropdownContent>
                                </Dropdown>
                                {errorsTicket.type && (
                                    <span className="text-xs text-red-500">
                                        {errorsTicket.type.message}
                                    </span>
                                )}
                            </div>

                            {/* Ticket Name - Third */}
                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-medium text-white">
                                    Ticket name
                                </label>
                                <input
                                    type="text"
                                    {...registerTicket("name")}
                                    className="border bg-primary text-white text-sm border-white/10 h-10 rounded-lg px-3 focus:outline-none w-full"
                                    placeholder="After Hours, Electric Dreams, etc."
                                />
                                {errorsTicket.name && (
                                    <span className="text-xs text-red-500">
                                        {errorsTicket.name.message}
                                    </span>
                                )}
                            </div>

                            {/* Description - Fourth */}
                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-medium text-white">
                                    Ticket description
                                </label>
                                <div className="relative">
                                    <textarea
                                        {...registerTicket("description")}
                                        className="border bg-primary text-white text-sm border-white/10 rounded-lg px-3 py-2 focus:outline-none w-full min-h-[80px] resize-none"
                                        placeholder="e.g. Standard admission after 11 PM"
                                    />
                                    <div className="absolute right-3 bottom-3 text-xs text-white/50">
                                        Max 10 words
                                    </div>
                                </div>
                                {errorsTicket.description && (
                                    <span className="text-xs text-red-500">
                                        {errorsTicket.description.message}
                                    </span>
                                )}
                            </div>

                            {/* Total Tickets */}
                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-medium text-white">
                                    Total available ticket quantity
                                </label>
                                <input
                                    type="number"
                                    {...registerTicket("total", {
                                        valueAsNumber: true,
                                        setValueAs: (v) => (v === "" ? undefined : parseInt(v)),
                                        onChange: (e) => {
                                            // Remove leading zeros
                                            if (
                                                e.target.value.startsWith("0") &&
                                                e.target.value.length > 1
                                            ) {
                                                e.target.value = e.target.value.replace(/^0+/, "");
                                            }
                                        },
                                    })}
                                    className="border bg-primary text-white text-sm border-white/10 h-10 rounded-lg px-3 focus:outline-none w-full"
                                    placeholder="0"
                                />
                                {errorsTicket.total && (
                                    <span className="text-xs text-red-500">
                                        {errorsTicket.total.message}
                                    </span>
                                )}
                            </div>

                            {/* Min/Max Purchase */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-3">
                                    <label className="text-sm font-medium text-white">
                                        Min purchase power
                                    </label>
                                    <input
                                        type="number"
                                        {...registerTicket("minPurchase", {
                                            valueAsNumber: true,
                                            onChange: (e) => {
                                                if (
                                                    e.target.value.startsWith("0") &&
                                                    e.target.value.length > 1
                                                ) {
                                                    e.target.value = e.target.value.replace(/^0+/, "");
                                                }
                                            },
                                        })}
                                        className="border bg-primary text-white text-sm border-white/10 h-10 rounded-lg px-3 focus:outline-none w-full"
                                        placeholder="1"
                                    />
                                    {errorsTicket.minPurchase && (
                                        <span className="text-xs text-red-500">
                                            {errorsTicket.minPurchase.message}
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-col gap-3">
                                    <label className="text-sm font-medium text-white">
                                        Max purchase power
                                    </label>
                                    <input
                                        type="number"
                                        {...registerTicket("maxPurchase", {
                                            valueAsNumber: true,
                                            onChange: (e) => {
                                                if (
                                                    e.target.value.startsWith("0") &&
                                                    e.target.value.length > 1
                                                ) {
                                                    e.target.value = e.target.value.replace(/^0+/, "");
                                                }
                                            },
                                        })}
                                        className="border bg-primary text-white text-sm border-white/10 h-10 rounded-lg px-3 focus:outline-none w-full"
                                        placeholder="10"
                                    />
                                    {errorsTicket.maxPurchase && (
                                        <span className="text-xs text-red-500">
                                            {errorsTicket.maxPurchase.message}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row border-t border-white/10 sticky bottom-0 bg-white/[0.03] backdrop-blur-xl justify-between w-full gap-3 p-4">
                            <button
                                type="button"
                                onClick={() => setNewTicketTypeDialogOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-white hover:bg-white/10 rounded-full border border-white/10 w-full"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!isValidTicket}
                                className="bg-white hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed text-black px-4 py-2 w-full rounded-full text-sm font-medium"
                            >
                                Add ticket type
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Ticket Dialog */}
            <Dialog
                open={editTicketDialogOpen}
                onOpenChange={(open) => {
                    setEditTicketDialogOpen(open);
                    if (!open) {
                        resetEditTicket();
                        setSelectedTicket(null);
                    }
                }}
                className="!max-w-[400px] border border-white/10 rounded-xl !p-0 overflow-hidden"
            >
                <DialogContent className="max-h-[90vh] overflow-y-auto hide-scrollbar !gap-0">
                    <form onSubmit={handleSubmitEditTicket(onSubmitEditTicket)}>
                        <div className="flex flex-col gap-y-3 bg-white/[0.03] border-b rounded-t-xl border-white/10 p-6">
                            <DialogTitle>Edit ticket</DialogTitle>
                            <DialogDescription>
                                Update the details of your ticket type.
                            </DialogDescription>
                        </div>
                        <div className="flex flex-col gap-4 p-6">
                            {/* Price */}
                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-medium text-white">
                                    Ticket price
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70">
                                        $
                                    </span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        {...registerEditTicket("price", {
                                            valueAsNumber: true,
                                            setValueAs: (v) => (v === "" ? undefined : parseFloat(v)),
                                            onChange: (e) => {
                                                if (
                                                    e.target.value.startsWith("0") &&
                                                    e.target.value.length > 1 &&
                                                    !e.target.value.startsWith("0.")
                                                ) {
                                                    e.target.value = e.target.value.replace(/^0+/, "");
                                                }
                                            },
                                        })}
                                        className="border bg-primary text-white text-sm border-white/10 h-10 rounded-lg pl-7 pr-3 focus:outline-none w-full"
                                        placeholder="0.00"
                                    />
                                </div>
                                {errorsEditTicket.price && (
                                    <span className="text-xs text-red-500">
                                        {errorsEditTicket.price.message}
                                    </span>
                                )}
                            </div>

                            {/* Ticket Icon */}
                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-medium text-white">
                                    Ticket icon
                                </label>
                                <Dropdown>
                                    <DropdownTrigger>
                                        <button
                                            type="button"
                                            className="flex items-center justify-between w-full border bg-primary text-white text-sm border-white/10 h-10 rounded-lg px-3 focus:outline-none"
                                        >
                                            <div className="flex items-center gap-2">
                                                {ticketTypesIcons[watchEditTicket("type")] ||
                                                    ticketTypesIcons["regular"]}
                                                <span>
                                                    {watchEditTicket("type") === "early bird"
                                                        ? "Early Bird"
                                                        : watchEditTicket("type").charAt(0).toUpperCase() +
                                                        watchEditTicket("type").slice(1)}
                                                </span>
                                            </div>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 16 16"
                                                fill="none"
                                                className="text-white/50"
                                            >
                                                <path
                                                    d="M4 6L8 10L12 6"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </button>
                                    </DropdownTrigger>
                                    <DropdownContent className="bg-[#1C1C1C] w-full border border-white/10 rounded-lg shadow-lg overflow-hidden">
                                        {Object.entries(ticketTypesIcons).map(([type, icon]) => (
                                            <DropdownItem
                                                key={type}
                                                onClick={() => {
                                                    const { onChange } = registerEditTicket("type");
                                                    onChange({ target: { value: type } });
                                                }}
                                                className="flex items-center gap-2 px-3 py-2 hover:bg-white/5"
                                            >
                                                {icon}
                                                <span className="capitalize">
                                                    {type === "early bird" ? "Early Bird" : type}
                                                </span>
                                            </DropdownItem>
                                        ))}
                                    </DropdownContent>
                                </Dropdown>
                                {errorsEditTicket.type && (
                                    <span className="text-xs text-red-500">
                                        {errorsEditTicket.type.message}
                                    </span>
                                )}
                            </div>

                            {/* Ticket Name */}
                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-medium text-white">
                                    Ticket name
                                </label>
                                <input
                                    type="text"
                                    {...registerEditTicket("name")}
                                    className="border bg-primary text-white text-sm border-white/10 h-10 rounded-lg px-3 focus:outline-none w-full"
                                    placeholder="After Hours, Electric Dreams, etc."
                                />
                                {errorsEditTicket.name && (
                                    <span className="text-xs text-red-500">
                                        {errorsEditTicket.name.message}
                                    </span>
                                )}
                            </div>

                            {/* Description */}
                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-medium text-white">
                                    Ticket description
                                </label>
                                <div className="relative">
                                    <textarea
                                        {...registerEditTicket("description")}
                                        className="border bg-primary text-white text-sm border-white/10 rounded-lg px-3 py-2 focus:outline-none w-full min-h-[80px] resize-none"
                                        placeholder="e.g. Standard admission after 11 PM"
                                    />
                                    <div className="absolute right-3 bottom-3 text-xs text-white/50">
                                        Max 10 words
                                    </div>
                                </div>
                                {errorsEditTicket.description && (
                                    <span className="text-xs text-red-500">
                                        {errorsEditTicket.description.message}
                                    </span>
                                )}
                            </div>

                            {/* Total Tickets */}
                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-medium text-white">
                                    Total available ticket quantity
                                </label>
                                <input
                                    type="number"
                                    {...registerEditTicket("total", {
                                        valueAsNumber: true,
                                        setValueAs: (v) => (v === "" ? undefined : parseInt(v)),
                                        onChange: (e) => {
                                            // Remove leading zeros
                                            if (
                                                e.target.value.startsWith("0") &&
                                                e.target.value.length > 1
                                            ) {
                                                e.target.value = e.target.value.replace(/^0+/, "");
                                            }
                                        },
                                    })}
                                    className="border bg-primary text-white text-sm border-white/10 h-10 rounded-lg px-3 focus:outline-none w-full"
                                    placeholder="0"
                                />
                                {errorsEditTicket.total && (
                                    <span className="text-xs text-red-500">
                                        {errorsEditTicket.total.message}
                                    </span>
                                )}
                            </div>

                            {/* Min/Max Purchase */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-3">
                                    <label className="text-sm font-medium text-white">
                                        Min purchase power
                                    </label>
                                    <input
                                        type="number"
                                        {...registerEditTicket("minPurchase", {
                                            valueAsNumber: true,
                                            onChange: (e) => {
                                                if (
                                                    e.target.value.startsWith("0") &&
                                                    e.target.value.length > 1
                                                ) {
                                                    e.target.value = e.target.value.replace(/^0+/, "");
                                                }
                                            },
                                        })}
                                        className="border bg-primary text-white text-sm border-white/10 h-10 rounded-lg px-3 focus:outline-none w-full"
                                        placeholder="1"
                                    />
                                    {errorsEditTicket.minPurchase && (
                                        <span className="text-xs text-red-500">
                                            {errorsEditTicket.minPurchase.message}
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-col gap-3">
                                    <label className="text-sm font-medium text-white">
                                        Max purchase power
                                    </label>
                                    <input
                                        type="number"
                                        {...registerEditTicket("maxPurchase", {
                                            valueAsNumber: true,
                                            onChange: (e) => {
                                                if (
                                                    e.target.value.startsWith("0") &&
                                                    e.target.value.length > 1
                                                ) {
                                                    e.target.value = e.target.value.replace(/^0+/, "");
                                                }
                                            },
                                        })}
                                        className="border bg-primary text-white text-sm border-white/10 h-10 rounded-lg px-3 focus:outline-none w-full"
                                        placeholder="10"
                                    />
                                    {errorsEditTicket.maxPurchase && (
                                        <span className="text-xs text-red-500">
                                            {errorsEditTicket.maxPurchase.message}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row border-t border-white/10 sticky bottom-0 bg-primary justify-between w-full gap-3 p-4">
                            <button
                                type="button"
                                onClick={() => setEditTicketDialogOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-white hover:bg-white/10 rounded-full border border-white/10 w-full"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!isValidEditTicket}
                                className="bg-white hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed text-black px-4 py-2 w-full rounded-full text-sm font-medium"
                            >
                                Save changes
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Add Pause Dialog */}
            <Dialog
                open={pauseDialogOpen}
                onOpenChange={(open) => {
                    setPauseDialogOpen(open);
                    if (!open) setTicketToPause(null);
                }}
                className="!max-w-[350px] border border-white/10 rounded-3xl !p-0 overflow-hidden"
            >
                <DialogContent className="!p-0 gap-0" closeClassName="!rounded-2xl">
                    <div className="flex flex-col gap-8 p-4">
                        <div className="flex items-center justify-between">
                            <div className="bg-[#F97316] bg-opacity-10 w-10 h-10 rounded-lg flex items-center justify-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="17"
                                    height="16"
                                    viewBox="0 0 17 16"
                                    fill="none"
                                >
                                    <path
                                        d="M5 2C4.86739 2 4.74021 2.05268 4.64645 2.14645C4.55268 2.24021 4.5 2.36739 4.5 2.5V13.5C4.5 13.6326 4.55268 13.7598 4.64645 13.8536C4.74021 13.9473 4.86739 14 5 14H6C6.13261 14 6.25979 13.9473 6.35355 13.8536C6.44732 13.7598 6.5 13.6326 6.5 13.5V2.5C6.5 2.36739 6.44732 2.24021 6.35355 2.14645C6.25979 2.05268 6.13261 2 6 2H5ZM11 2C10.8674 2 10.7402 2.05268 10.6464 2.14645C10.5527 2.24021 10.5 2.36739 10.5 2.5V13.5C10.5 13.6326 10.5527 13.7598 10.6464 13.8536C10.7402 13.9473 10.8674 14 11 14H12C12.1326 14 12.2598 13.9473 12.3536 13.8536C12.4473 13.7598 12.5 13.6326 12.5 13.5V2.5C12.5 2.36739 12.4473 2.24021 12.3536 2.14645C12.2598 2.05268 12.1326 2 12 2H11Z"
                                        fill="#F97316"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="flex flex-col items-start gap-2">
                            <div className="flex flex-col gap-2">
                                <h3 className="text-xl font-semibold">
                                    Pause {ticketToPause?.type} ticket sales?
                                </h3>
                                <p className="text-white/70">
                                    No one will be able to purchase this ticket while paused
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={confirmPause}
                            className="w-full flex items-center justify-center gap-2 bg-white text-black rounded-full font-medium h-10 text-sm"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="17"
                                height="16"
                                viewBox="0 0 17 16"
                                fill="none"
                            >
                                <path
                                    d="M5 2C4.86739 2 4.74021 2.05268 4.64645 2.14645C4.55268 2.24021 4.5 2.36739 4.5 2.5V13.5C4.5 13.6326 4.55268 13.7598 4.64645 13.8536C4.74021 13.9473 4.86739 14 5 14H6C6.13261 14 6.25979 13.9473 6.35355 13.8536C6.44732 13.7598 6.5 13.6326 6.5 13.5V2.5C6.5 2.36739 6.44732 2.24021 6.35355 2.14645C6.25979 2.05268 6.13261 2 6 2H5ZM11 2C10.8674 2 10.7402 2.05268 10.6464 2.14645C10.5527 2.24021 10.5 2.36739 10.5 2.5V13.5C10.5 13.6326 10.5527 13.7598 10.6464 13.8536C10.7402 13.9473 10.8674 14 11 14H12C12.1326 14 12.2598 13.9473 12.3536 13.8536C12.4473 13.7598 12.5 13.6326 12.5 13.5V2.5C12.5 2.36739 12.4473 2.24021 12.3536 2.14645C12.2598 2.05268 12.1326 2 12 2H11Z"
                                    fill="#0F0F0F"
                                />
                            </svg>
                            Pause sales
                        </button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Renew Sales Dialog */}
            <Dialog
                open={renewDialogOpen}
                onOpenChange={(open) => {
                    setRenewDialogOpen(open);
                    if (!open) setTicketToRenew(null);
                }}
                className="!max-w-[350px] border border-white/10 rounded-3xl !p-0 overflow-hidden"
            >
                <DialogContent className="!p-0 gap-0" closeClassName="!rounded-2xl">
                    <div className="flex flex-col gap-8 p-4">
                        <div className="flex items-center justify-between">
                            <div className="bg-[#10B981] bg-opacity-10 w-10 h-10 rounded-lg flex items-center justify-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                >
                                    <path
                                        d="M3 3.73173C3.00012 3.46303 3.07242 3.19929 3.20934 2.96809C3.34626 2.73689 3.54277 2.54671 3.77833 2.41744C4.01389 2.28816 4.27985 2.22453 4.54841 2.2332C4.81697 2.24187 5.07827 2.32253 5.305 2.46673L12.011 6.73373C12.2239 6.86921 12.3992 7.0562 12.5206 7.27741C12.642 7.49862 12.7057 7.74688 12.7057 7.99923C12.7057 8.25158 12.642 8.49984 12.5206 8.72105C12.3992 8.94226 12.2239 9.12925 12.011 9.26473L5.305 13.5327C5.0782 13.677 4.81681 13.7576 4.54816 13.7663C4.27951 13.7749 4.01348 13.7112 3.77789 13.5818C3.5423 13.4524 3.3458 13.2621 3.20896 13.0307C3.07211 12.7994 2.99994 12.5355 3 12.2667V3.73173Z"
                                        fill="#10B981"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="flex flex-col items-start gap-2">
                            <div className="flex flex-col gap-2">
                                <h3 className="text-xl font-semibold">
                                    Renew {ticketToRenew?.type} ticket sales?
                                </h3>
                                <p className="text-white/70">
                                    People will be able to purchase this ticket again
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={confirmRenew}
                            className="w-full flex items-center justify-center gap-2 bg-white text-black rounded-full font-medium h-10 text-sm"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                            >
                                <path
                                    d="M3 3.73173C3.00012 3.46303 3.07242 3.19929 3.20934 2.96809C3.34626 2.73689 3.54277 2.54671 3.77833 2.41744C4.01389 2.28816 4.27985 2.22453 4.54841 2.2332C4.81697 2.24187 5.07827 2.32253 5.305 2.46673L12.011 6.73373C12.2239 6.86921 12.3992 7.0562 12.5206 7.27741C12.642 7.49862 12.7057 7.74688 12.7057 7.99923C12.7057 8.25158 12.642 8.49984 12.5206 8.72105C12.3992 8.94226 12.2239 9.12925 12.011 9.26473L5.305 13.5327C5.0782 13.677 4.81681 13.7576 4.54816 13.7663C4.27951 13.7749 4.01348 13.7112 3.77789 13.5818C3.5423 13.4524 3.3458 13.2621 3.20896 13.0307C3.07211 12.7994 2.99994 12.5355 3 12.2667V3.73173Z"
                                    fill="#0F0F0F"
                                />
                            </svg>
                            Renew sales
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}