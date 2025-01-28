import React, { useEffect, useState } from "react";
import url from "../../constants/url";
import axios from "axios";
import { FaArtstation, FaBookmark, FaLocationDot, FaQrcode } from "react-icons/fa6";
import { CiShare2 } from "react-icons/ci";
import { FaCalendarAlt } from "react-icons/fa";
import "../../css/global.css"
import QrTicket from "../../components/modals/QrTicket";
import { Spin } from "antd";
import { GoBookmark, GoBookmarkSlash, GoBookmarkSlashFill } from "react-icons/go";
import { FiSearch } from "react-icons/fi";

const Saved = () => {
    const [activeTab, setActiveTab] = useState("upcoming");
    const [events, setEvents] = useState([]);
    const [savedEvents, setSavedEvents] = useState([])
    const [isModalQrTicket, setIsModalQrTicket] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    const [book, setBook] = useState([]);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [savedEventIds, setSavedEventIds] = useState(new Set());

    const generateICSFile = (event) => {
        const formatDateForICS = (dateString) => {
            const date = new Date(dateString);
            const pad = (num) => String(num).padStart(2, '0');
            return (
                date.getFullYear() +
                pad(date.getMonth() + 1) +
                pad(date.getDate()) +
                'T' +
                pad(date.getHours()) +
                pad(date.getMinutes()) +
                pad(date.getSeconds())
            );
        };

        const startDate = formatDateForICS(event?.party_id?.start_date);
        const endDate = formatDateForICS(event?.party_id?.end_date);

        const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'BEGIN:VEVENT',
            `DTSTART:${startDate}`,
            `DTEND:${endDate}`,
            `SUMMARY:${event?.party_id?.event_name}`,
            `DESCRIPTION:${event?.party_id?.event_name}`,
            `LOCATION:${event?.party_id?.venue_name}`,
            'END:VEVENT',
            'END:VCALENDAR',
        ].join('\n');

        return icsContent;
    };

    const downloadICSFile = (card) => {
        console.log(card)
        const icsContent = generateICSFile(card);
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', `${card?.party_id?.event_name}.ics`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    const fetchEvents = async () => {
        try {
            const response = await axios.get(`${url}/event/get-event`);
            setEvents(response.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('en-US', { month: 'short' });
        const year = date.getFullYear().toString().slice(-2);

        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;

        return `${month} ${day}, ${hours}:${minutes} ${ampm}`;
    };

    const handleOpenQr = (card) => {
        setSelectedCard(card);
        setIsModalQrTicket(true);
    };

    useEffect(() => {
        const loadFromLocalStorage = () => {
            const storedUserId = localStorage.getItem('userID');
            setUserId(storedUserId);
        };
        loadFromLocalStorage();
        const handleStorageChange = () => {
            loadFromLocalStorage();
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const fetchBook = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`${url}/get-booking-lists/${userId}`);
            setBook(response.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchBook();
    }, [userId]);

    const handleBookmark = async (eventId) => {
        try {
            if (savedEventIds.has(eventId)) {
                const response = await axios.delete(`${url}/saved/delete-saved/${eventId}`, {
                    data: { user_id: userId },
                });

                if (response.status === 200) {
                    console.log("Event unsaved successfully:", response.data);
                    setSavedEventIds((prevState) => {
                        const newSavedEventIds = new Set(prevState);
                        newSavedEventIds.delete(eventId);
                        return newSavedEventIds;
                    });
                }
            } else {
                const response = await axios.post(`${url}/saved/add-saved`, {
                    event_id: eventId,
                    user_id: userId,
                });

                if (response.status === 201) {
                    console.log("Event saved successfully:", response.data);
                    setSavedEventIds((prevState) => {
                        const newSavedEventIds = new Set(prevState);
                        newSavedEventIds.add(eventId);
                        return newSavedEventIds;
                    });
                }
            }
        } catch (error) {
            console.error("Error updating bookmark status:", error);
        }
    };

    const fetchSavedEvents = async () => {
        try {
            const response = await axios.get(`${url}/saved/get-saved-id/${userId}`);
            setSavedEvents(response.data.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    useEffect(() => {
        fetchSavedEvents()
    }, [userId]);

    const fetchSavedEventsList = async () => {
        try {
            const response = await axios.get(`${url}/saved/get-saved-id/${userId}`);

            if (response.status === 200 && response.data.data) {
                console.log("Fetched saved events:", response.data.data);
                const savedIds = new Set(
                    response.data.data.map((event) => event.event_id._id)
                );
                setSavedEventIds(savedIds);
            } else {
                console.error("No saved events found in the database.");
                setSavedEventIds(new Set());
            }
        } catch (error) {
            console.error("Error fetching saved events:", error);
        }
    };

    useEffect(() => {
        fetchSavedEventsList()
    }, [userId])

    const handleDeleteSavedEvent = async (id) => {
        try {
            const response = await axios.delete(`${url}/saved/delete-saved/${id}`);
            if (response.status === 200) {
                window.location.reload();
            } else {
                console.error("Failed to delete the saved event");
            }
        } catch (error) {
            console.error("Error deleting the saved event:", error);
        }
    };

    return (
        <div className="bg-black min-h-screen p-6 text-white">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 px-6 md:px-8">
                <div className="text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-bold font-inter">Saved Events</h1>
                    <p className="text-gray-400 mt-2 text-sm md:text-xs font-inter">
                        Here you can see all of your saved events
                    </p>
                </div>
                <div className="flex flex-wrap gap-8 items-center space-y-4 md:space-y-0 justify-between md:justify-start mt-4 md:mt-0">
                    {/* <div className="flex items-center border border-[#2e2e2e] rounded-full px-4 py-3">
                        <div className="text-gray-400 mr-3">
                            <FiSearch className="w-4 h-4" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search for saved events..."
                            className="bg-transparent text-gray-300 text-sm focus:outline-none w-full"
                        />
                    </div> */}
                    <div className="flex space-x-2 md:space-x-6 border border-[#2e2e2e] p-1 rounded-full">
                        <button
                            className={`px-4 py-2 font-inter rounded-full text-xs md:text-sm transition-all duration-300 ease-in-out ${activeTab === "upcoming" ? "bg-[#131313] text-white" : "text-gray-300"
                                }`}
                            onClick={() => setActiveTab("upcoming")}
                        >
                            All Events
                        </button>
                        <button
                            className={`px-4 py-2 font-inter rounded-full text-xs md:text-sm transition-all duration-300 ease-in-out ${activeTab === "expired" ? "bg-[#131313] text-white" : "text-gray-300"
                                }`}
                            onClick={() => setActiveTab("expired")}
                        >
                            Only Available
                        </button>
                    </div>
                </div>

            </div>

            {activeTab === "upcoming" ? (
                <>
                    {
                        loading ? (
                            <div className='text-center mt-10'>
                                <Spin size="large" />
                            </div>
                        ) : (
                            <div className="mt-6 md:mt-10 mb-10 px-4 md:px-8">
                                {savedEvents.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                        {savedEvents.map((card) => (
                                            <button
                                                key={card.id}
                                                onClick={() =>
                                                    handleDetail(
                                                        card._id,
                                                        card.event_id.event_name.replace(/\s+/g, "-")
                                                    )
                                                }
                                                className="bg-[#3e3e3e] bg-opacity-15 px-4 py-4 rounded-xl shadow-lg text-center flex flex-col transition-transform duration-300 transform hover:scale-105"
                                            >
                                                <div className="flex items-center justify-between w-full mb-2 gap-2">
                                                    <div className="flex items-center min-w-0">
                                                        <div className="w-8 h-8 rounded-full flex justify-center items-center flex-shrink-0">
                                                            <FaArtstation className="text-purple-800" size={15} />
                                                        </div>
                                                        <h2 className="text-white/50 text-xs uppercase font-inter ml-2 truncate">
                                                            {card?.event_id?.category}
                                                        </h2>
                                                    </div>
                                                    <p className="text-white/50 text-xs font-inter flex-shrink-0">
                                                        {formatDate(card?.event_id?.start_date)}
                                                    </p>
                                                </div>

                                                <div className="relative mb-4">
                                                    <div className="w-full h-72 aspect-square">
                                                        <img
                                                            src={card?.event_id?.flyer}
                                                            alt="event"
                                                            className="w-full h-full object-cover rounded-xl"
                                                        />
                                                    </div>
                                                    <div
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleBookmark(card?.event_id?._id);
                                                        }}
                                                        className="absolute top-2 right-2 bg-gray-500/50 p-2 rounded-full text-white border border-opacity-10 border-gray-50"
                                                    >
                                                        {savedEventIds.has(card?.event_id?._id) ? (
                                                            <GoBookmarkSlash className="text-[#9b9b9b]" />
                                                        ) : (
                                                            <GoBookmark className="text-[#9b9b9b]" />
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between w-full mb-2 gap-2">
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center mt-1">
                                                            <span className="text-white text-lg font-inter truncate">
                                                                {card?.event_id?.event_name}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center mt-1">
                                                            <FaLocationDot className="text-neutral-400 mr-1 flex-shrink-0" size={12} />
                                                            <span className="text-white/50 text-sm font-inter truncate">
                                                                {card?.event_id?.venue_name}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex-shrink-0">
                                                        <p className="text-white font-medium whitespace-nowrap">
                                                            <span className="text-gray-500 text-2xl font-inter">$</span>
                                                            <span className="text-2xl font-semibold font-inter">
                                                                {card?.event_id?.ticket_start_price}+
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-[50vh] w-full text-center text-white font-inter">
                                        No events are saved.
                                    </div>
                                )}
                                <QrTicket
                                    card={selectedCard}
                                    isOpen={isModalQrTicket}
                                    onClose={() => setIsModalQrTicket(false)}
                                />
                            </div>

                        )
                    }
                </>
            ) : (
                <div className="text-center font-inter mt-20 md:mt-52">
                    <p>No available events are saved</p>
                </div>
            )
            }
        </div >

    );
};

export default Saved;
