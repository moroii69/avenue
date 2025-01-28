import React, { useEffect, useState } from 'react';
import { Calendar, Locate, MinusIcon, Navigation, PlusIcon } from 'lucide-react';
import { IoLocationOutline } from "react-icons/io5";
import axios from 'axios';
import url from "../../constants/url"
import { useNavigate, useParams } from 'react-router-dom';
import { use } from 'react';
import { Spin } from 'antd';
import LoginModal from '../../components/modals/LoginModal';
import { FaEnvelope, FaPhone } from 'react-icons/fa';

const Info = () => {
    const { name } = useParams()
    const [event, setEvent] = useState({});
    const [events, setEvents] = useState([]);
    const [ticketCounts, setTicketCounts] = useState([]);
    const navigate = useNavigate();
    const [organizer, setOrganizer] = useState({});
    const [expandedDescriptions, setExpandedDescriptions] = useState({});
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [eventName, setEventName] = useState("");
    const [organizerName, setOrganizerName] = useState("");
    const [loading, setLoading] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [remain, setRemain] = useState([])

    const id = localStorage.getItem('user_event_id') || {};
    const userId = localStorage.getItem('userID') || "";

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    useEffect(() => {
        const EventName = localStorage.getItem('user_event_name') || "";
        const OrganizerName = localStorage.getItem('user_organizer_name') || "";
        setEventName(EventName)
        setOrganizerName(OrganizerName)
    })

    useEffect(() => {
        const storeVisitData = async () => {
            try {
                const response = await fetch(`${url}/visit/add-visit`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ event_id: id }),
                });

                const data = await response.json();

                if (response.ok) {
                    console.log("Visit data stored:", data);
                } else {
                    console.error("Failed to store visit data:", data.message);
                }
            } catch (error) {
                console.error("Error occurred while storing visit data:", error);
            }
        };

        storeVisitData();
    }, [id]);

    useEffect(() => {
        if (event?.tickets) {
            setTicketCounts(event.tickets.map(() => null));
        }
    }, [event]);

    const handleIncrement = (index) => {
        setTicketCounts((prevCounts) =>
            prevCounts.map((count, i) => {
                if (i === index) {
                    const maxCount = event?.tickets[index]?.max_count;
                    const currentCount = count === null ? 0 : count;
                    const hasValidMaxCount = maxCount !== "undefined" &&
                        maxCount !== undefined &&
                        maxCount !== null &&
                        maxCount !== "" &&
                        !isNaN(Number(maxCount));
                    const updatedCount = hasValidMaxCount
                        ? Math.min(currentCount + 1, Number(maxCount))
                        : currentCount + 1;
                    setSelectedTicket({
                        ...event?.tickets[index],
                        count: updatedCount,
                    });

                    return updatedCount;
                }
                return count;
            })
        );
    };

    const handleDecrement = (index) => {
        setTicketCounts((prevCounts) =>
            prevCounts.map((count, i) => {
                if (i === index) {
                    const updatedCount = count === 1 ? null : count - 1;

                    if (updatedCount === null) {
                        setSelectedTicket(null);
                    } else {
                        setSelectedTicket({
                            ...event?.tickets[index],
                            count: updatedCount,
                        });
                    }

                    return updatedCount;
                }
                return count;
            })
        );
    };

    useEffect(() => {
        console.log('Selected Ticket:', selectedTicket);
    }, [selectedTicket]);

    const handleCheckout = () => {
        localStorage.setItem('selectedTicketPrice', selectedTicket.price);
        localStorage.setItem('count', selectedTicket.count);
        localStorage.setItem('selectedTicketId', selectedTicket._id);
        localStorage.setItem('selectedTicketName', selectedTicket.ticket_name);
        localStorage.setItem('user_organizer_id', event?.organizer_id?._id)
        navigate("/ticket");
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const dayOfWeek = date.toLocaleString('en-US', { weekday: 'short' });
        const day = date.getDate();
        const month = date.toLocaleString('en-US', { month: 'short' });
        const year = "20" + date.getFullYear().toString().slice(-2);
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;

        return `${dayOfWeek}, ${day} ${month} ${year} ${hours}:${minutes} ${ampm}`;
    };

    const fetchEvent = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`${url}/event/get-event-by-id/${id}`);
            setEvent(response.data);
            setOrganizer(response.data?.organizer_id?._id)
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchEvent();
    }, []);

    const handleDetail = (id, creater) => {
        localStorage.setItem('user_organizer_id', id);
        localStorage.setItem('user_organizer_name', creater);
        navigate(`/creater/${creater}`);
    };

    const fetchEvents = async () => {
        if (id) {
            try {
                const response = await axios.get(`${url}/event/get-event-by-organizer-id/${organizer}`);
                setEvents(response.data);
                console.log(response.data)
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        } else {
            console.log("not found")
        }
    }

    useEffect(() => {
        if (organizer) {
            fetchEvents();
        }
    }, [organizer]);

    const toggleDescription = (ticketId) => {
        setExpandedDescriptions(prev => ({
            ...prev,
            [ticketId]: !prev[ticketId]
        }));
    };

    const renderDescription = (description, ticketId) => {
        if (description.length <= 100) {
            return <div className="text-sm text-gray-400" dangerouslySetInnerHTML={{ __html: description }} />;
        }

        const isExpanded = expandedDescriptions[ticketId];
        const displayText = isExpanded ? description : description.slice(0, 100) + '...';

        return (
            <div className="text-sm text-gray-400">
                <div dangerouslySetInnerHTML={{ __html: displayText }} />
                <button
                    onClick={() => toggleDescription(ticketId)}
                    className="text-blue-400 hover:text-blue-500 mt-1 font-medium"
                >
                    {isExpanded ? 'See less' : 'See more'}
                </button>
            </div>
        );
    };

    const fetchRemainEvent = async () => {
        if (id) {
            try {
                const response = await axios.get(`${url}/remain-tickets/${id}`);
                setRemain(response.data);
            } catch (error) {
                console.error("Error fetching remain events:", error);
            }
        } else {
            console.log("not found")
        }
    }

    useEffect(() => {
        fetchRemainEvent()
    }, [id])


    return (
        <>
            {loading
                ?
                <>
                    <div className='text-center mt-10'>
                        <Spin size="large" />
                    </div>
                </>
                : (
                    <>
                        <div className="min-h-screen bg-primary text-white mt-5">
                            {/* <div className="max-w-5xl mx-auto px-7">
                                <p className='font-inter text-sm'><span className='text-[#898989] text-sm font-inter'>Home /</span> {eventName}</p>
                            </div> */}
                            <div className="max-w-5xl mx-auto p-6 flex flex-col lg:flex-row gap-8">
                                <div className="flex-1 border border-gray-300 border-opacity-10 px-4 py-4 rounded-2xl overflow-y-auto">
                                    <div className="bg-neutral-900 rounded-lg overflow-hidden">
                                        <img
                                            src={`${event.flyer}`}
                                            alt=""
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <div className="mt-4 space-y-2">
                                        <div className="flex items-center space-x-2 mb-8">
                                            <span className="text-red-400 border border-[#292929] px-3 py-2 rounded-full font-inter text-sm">♫ <span className='text-white'>{event.category}</span></span>
                                        </div>
                                        <h1 className="text-3xl font-bold font-inter">{event.event_name}</h1>
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center sm sm:space-x-2 text-gray-400 space-y-2 sm:space-y-0">
                                            <div className="flex items-center space-x-2 text-gray-400">
                                                <IoLocationOutline size={14} />
                                                <span className="font-inter text-sm">{event.venue_name}</span>
                                            </div>
                                            <span className="hidden sm:inline">•</span>
                                            <div className="flex items-center space-x-2 text-gray-400">
                                                <Calendar size={16} />
                                                <span className="font-inter text-sm">{formatDate(event.start_date)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => handleDetail(event?.organizer_id?._id, event?.organizer_id?.url.replace(/\s+/g, "-"))} className="flex mt-5 items-center justify-between bg-[#141414] shadow-md rounded-2xl p-2 w-full max-w-xl">
                                        <div className="flex items-center">
                                            <div className={`w-12 h-12 rounded-full overflow-hidden mr-4 ${event?.organizer?.profile_image ? "bg-transparent" : "bg-[#121212] border border-[#cccccc]"} flex items-center justify-center text-white font-semibold`}>
                                                {event?.organizer_id?.profile_image ? (
                                                    <img
                                                        src={event.organizer_id.profile_image}
                                                        alt="Profile"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span>
                                                        {event?.organizer_id?.name?.slice(0, 2).toUpperCase() || ''}
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <h2 className="text-md font-bold text-gray-200 font-inter">{event?.organizer_id?.name}</h2>
                                                <h2 className="text-xs text-gray-400 font-inter">{events.length} Live Events</h2>
                                            </div>
                                        </div>
                                        <div>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 text-gray-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5l7 7-7 7"
                                                />
                                            </svg>
                                        </div>
                                    </button>

                                    <div>
                                        <p className='mt-10 text-gray-400 text-xs font-inter font-semibold'>ABOUT</p>
                                    </div>
                                    <div>
                                        <p className='mt-4 text-gray-300 w-6/7 text-sm leading-relaxed font-inter' dangerouslySetInnerHTML={{ __html: event.event_description }}></p>
                                    </div>

                                    <div className="flex flex-col items-center mt-5">
                                        <button
                                            onClick={toggleDropdown}
                                            className="w-full border border-[#212121] rounded-full py-3 font-inter focus:outline-none"
                                        >
                                            Contact host
                                        </button>
                                        {(event?.organizer_id?.email || event?.organizer_id?.phone) && (
                                            <>
                                                {isDropdownOpen && (
                                                    <div className="mt-2 w-full border border-[#212121] rounded-lg shadow-lg p-4 space-y-3">
                                                        {event?.organizer_id?.email && (
                                                            <div className="flex items-center gap-3">
                                                                <FaEnvelope className="text-[#ffffff]" />
                                                                <a
                                                                    href={`mailto:${event.organizer_id.email}`}
                                                                    className="text-sm font-inter text-[#ffffff] hover:underline"
                                                                >
                                                                    {event.organizer_id.email}
                                                                </a>
                                                            </div>
                                                        )}
                                                        {event?.organizer_id?.phone && (
                                                            <div className="flex items-center gap-3">
                                                                <FaPhone className="text-[#ffffff]" />
                                                                <a
                                                                    href={`tel:${event.organizer_id.phone}`}
                                                                    className="text-sm font-inter text-[#ffffff] hover:underline"
                                                                >
                                                                    {event.organizer_id.phone}
                                                                </a>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </>
                                        )}

                                    </div>
                                    <div className='flex justify-center items-center mt-2'>
                                        <p className='text-sm text-gray-500 font-inter'>To get on the guest list, contact the host</p>
                                    </div>

                                    <div>
                                        <p className='mt-10 text-gray-400 text-xs font-inter font-semibold'>LOCATION</p>
                                    </div>
                                    <div>
                                        <a href={`${event.map_link || '#'}`} target={event.map_link ? '_blank' : ""} className='mt-4 text-white text-lg font-inter hover:underline'>{event.venue_name}</a>
                                    </div>
                                    <div>
                                        <p className=' text-gray-500 text-xs mt-1'>{event.address}</p>
                                    </div>
                                    {/* <div className="mt-4" style={{ position: "relative", paddingBottom: "56.25%", height: "0", overflow: "hidden", maxWidth: "100%" }}>
                                        <iframe
                                            src="https://www.google.com/maps/embed?pb=..."
                                            style={{
                                                position: "absolute",
                                                top: "0",
                                                left: "0",
                                                width: "100%",
                                                height: "100%",
                                                border: "0",
                                                borderRadius: "30px"
                                            }}
                                            allowFullScreen=""
                                            loading="lazy"
                                        ></iframe>
                                    </div> */}

                                </div>

                                {/* Right Section (Tickets) */}
                                <div className="lg:w-96 w-full">
                                    {ticketCounts.some((count) => count > 0) && (
                                        <div className="bg-[#141414] rounded-2xl p-4 mb-4">
                                            <div className="mb-0">
                                                <h3 className="text-gray-400 text-xs mb-1 font-inter">TOTAL AMOUNT</h3>
                                                <div className="flex justify-between items-center">
                                                    {
                                                        event.event_type === 'rsvp' ? (
                                                            <div className="text-2xl font-medium font-inter">
                                                                Free
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <div className="text-2xl font-medium font-inter">
                                                                    ${ticketCounts.reduce((total, count, index) => {
                                                                        return total + (count > 0 ? count * event.tickets[index].price : 0);
                                                                    }, 0).toFixed(2)}
                                                                </div>
                                                            </>
                                                        )
                                                    }
                                                    <div className="flex-grow"></div>
                                                    <div className="flex items-center justify-center">
                                                        <button onClick={handleCheckout} className="bg-white font-inter text-black py-3 px-6 rounded-full hover:bg-gray-100 text-sm">
                                                            Go to checkout
                                                        </button>
                                                    </div>
                                                    <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {event?.tickets?.map((ticket, index) => {
                                        const remainingTicket = remain.find(r => r.ticket_id === ticket.ticket_id);
                                        return (
                                            <div key={ticket.id || index} className="bg-[#141414] rounded-2xl p-4 mb-4">
                                                <div className="rounded-lg">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-center">
                                                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                                            <span className="text-sm text-gray-400 ml-2 font-inter">{ticket.ticket_name}</span>
                                                        </div>
                                                        {remainingTicket && remainingTicket.remaining_tickets === 0 ? (
                                                            <span className="text-sm text-red-500 font-semibold font-inter">Sold Out!</span>
                                                        ) : null}
                                                    </div>
                                                    <div className="mb-4">
                                                        <div className="h-[1px] bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>
                                                    </div>
                                                    <div>
                                                        {
                                                            event.event_type === 'ticket' ? (
                                                                <>
                                                                    <div className="text-2xl font-medium mt-1 mb-1 font-inter">
                                                                        {ticketCounts[index] === null
                                                                            ? `$${ticket.price}`
                                                                            : `$${ticket.price} x ${ticketCounts[index]}`}
                                                                    </div>
                                                                    {renderDescription(ticket.ticket_description, ticket.id || index)}
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <div className="text-2xl font-medium mt-1 mb-1 font-inter">
                                                                        {ticketCounts[index] === null
                                                                            ? `Free`
                                                                            : `Free x ${ticketCounts[index]}`}
                                                                    </div>
                                                                    {renderDescription(ticket.ticket_description, ticket.id || index)}
                                                                </>
                                                            )
                                                        }
                                                    </div>
                                                    {remainingTicket && remainingTicket.remaining_tickets === 0 ? (
                                                        ""
                                                    ) : (
                                                        <div className="flex items-center mt-4 bg-primary px-1 py-1 rounded-full w-max">
                                                            <button
                                                                onClick={() => handleDecrement(index)}
                                                                className={`p-3 font-inter bg-[#141414] text-white rounded-full ${ticketCounts[index] === null
                                                                    ? 'cursor-not-allowed opacity-50'
                                                                    : 'hover:bg-gray-500 hover:bg-opacity-30'}`}
                                                                disabled={ticketCounts[index] === null}
                                                            >
                                                                <MinusIcon size={16} />
                                                            </button>

                                                            <span className="mx-4 font-inter">
                                                                {ticketCounts[index] === null ? 'Choose tickets' : `${ticketCounts[index]} tickets`}
                                                            </span>
                                                            <button
                                                                onClick={() => handleIncrement(index)}
                                                                className="p-3 bg-[#141414] text-white rounded-full hover:bg-gray-500 hover:bg-opacity-30"
                                                            >
                                                                <PlusIcon size={16} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </>
                )}
        </>

    );
};

export default Info;