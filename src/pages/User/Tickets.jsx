import React, { useEffect, useState } from "react";
import url from "../../constants/url";
import axios from "axios";
import { FaArtstation, FaBookmark, FaLocationDot, FaQrcode } from "react-icons/fa6";
import { CiShare2 } from "react-icons/ci";
import { FaCalendarAlt } from "react-icons/fa";
import "../../css/global.css"
import QrTicket from "../../components/modals/QrTicket";
import { Spin } from "antd";

const Tickets = () => {
    const [activeTab, setActiveTab] = useState("upcoming");
    const [events, setEvents] = useState([]);
    const [isModalQrTicket, setIsModalQrTicket] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    const [book, setBook] = useState([]);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(false)

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

    return (
        <div className="bg-black min-h-screen p-6 text-white">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 px-6 md:px-8">
                <div className="text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-bold font-inter">Purchased Tickets</h1>
                    <p className="text-gray-400 mt-2 text-sm md:text-xs font-inter">
                        Here you can see all of your purchased tickets
                    </p>
                </div>
                <div className="flex space-x-2 md:space-x-6 border border-[#2e2e2e] p-1 rounded-full mt-4 md:mt-0">
                    <button
                        className={`px-4 py-2 font-inter rounded-full text-xs md:text-sm transition-all duration-300 ease-in-out ${activeTab === "upcoming" ? "bg-[#131313] text-white" : "text-gray-300"
                            }`}
                        onClick={() => setActiveTab("upcoming")}
                    >
                        Upcoming events
                    </button>
                    <button
                        className={`px-4 py-2 font-inter rounded-full text-xs md:text-sm transition-all duration-300 ease-in-out ${activeTab === "expired" ? "bg-[#131313] text-white" : "text-gray-300"
                            }`}
                        onClick={() => setActiveTab("expired")}
                    >
                        Expired events
                    </button>
                </div>
            </div>

            {activeTab === "upcoming" ? (
                <>
                    {loading ? (
                        <div className='text-center mt-10'>
                            <Spin size="large" />
                        </div>
                    ) : (
                        <div className="mt-3 md:mt-5 mb-10 md:px-2">
                            {(() => {
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);

                                const upcomingBooks = book.filter((card) => {
                                    if (!card?.party_id?.start_date) return false;
                                    const eventDate = new Date(card.party_id.start_date);
                                    eventDate.setHours(0, 0, 0, 0);
                                    return eventDate >= today;
                                });
                                if (upcomingBooks.length > 0) {
                                    return (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16 sm:mt-24 px-4 sm:px-8 md:px-16 lg:px-10 mb-10">
                                            {upcomingBooks.map((card) => (
                                                <button
                                                    key={card.id}
                                                    onClick={() =>
                                                        handleDetail(
                                                            card._id,
                                                            card.party_id.event_name.replace(/\s+/g, "-")
                                                        )
                                                    }
                                                    className="bg-neutral-800 bg-opacity-15 px-4 py-3 rounded-2xl shadow-lg text-left flex flex-col transition-transform duration-300 transform hover:scale-105"
                                                >
                                                    <div className="flex items-center justify-between w-full mb-2 gap-2">
                                                        <div className="flex items-center min-w-0">
                                                            <div className="w-8 h-8 rounded-full flex justify-center items-center flex-shrink-0">
                                                                <FaArtstation className="text-purple-800" size={15} />
                                                            </div>
                                                            <h2 className="text-white/50 text-xs uppercase font-inter ml-2 truncate">
                                                                {card?.party_id?.category}
                                                            </h2>
                                                        </div>
                                                        <p className="text-white/50 text-xs font-inter flex-shrink-0">
                                                            {formatDate(card?.party_id?.start_date)}
                                                        </p>
                                                    </div>

                                                    <div className="relative mb-4">
                                                        <div className="w-full aspect-square">
                                                            <img
                                                                src={card?.party_id?.flyer}
                                                                alt="event"
                                                                className="object-cover rounded-xl w-full h-full"
                                                            />
                                                        </div>
                                                    </div>


                                                    <div className="flex items-center justify-between w-full mb-2 gap-2">
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-center mt-1">
                                                                <span className="text-white text-lg font-inter truncate">
                                                                    {card?.party_id?.event_name}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center mt-1">
                                                                <FaLocationDot className="text-neutral-400 mr-1 flex-shrink-0" size={12} />
                                                                <span className="text-white/50 text-sm font-inter truncate">
                                                                    {card?.party_id?.venue_name}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex-shrink-0">
                                                            <p className="text-white font-medium whitespace-nowrap">
                                                                <span className="text-gray-500 text-2xl font-inter">$</span>
                                                                <span className="text-2xl font-semibold font-inter">
                                                                    {card?.party_id?.ticket_start_price}+
                                                                </span>
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col items-center mt-4">
                                                        <button
                                                            onClick={() => handleOpenQr(card)}
                                                            className="flex text-xs font-inter md:text-sm items-center justify-center px-4 py-3 bg-white text-black rounded-full mb-3 w-full md:w-80 transition-transform duration-300 hover:scale-95"
                                                        >
                                                            <FaQrcode className="mr-2" /> Show QR
                                                        </button>
                                                    </div>

                                                    <div className="flex flex-col items-center mt-2">
                                                        <button
                                                            onClick={() => downloadICSFile(card)}
                                                            className="flex text-xs font-inter items-center justify-center px-4 py-3 border border-gray-800 text-gray-400 rounded-full w-full md:w-80 transition-transform duration-300 hover:scale-95"
                                                        >
                                                            Add to Calendar
                                                        </button>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div className="flex items-center justify-center h-[50vh] w-full text-center text-white font-inter">
                                            No upcoming tickets are available.
                                        </div>
                                    );
                                }
                            })()}

                            <QrTicket
                                card={selectedCard}
                                isOpen={isModalQrTicket}
                                onClose={() => setIsModalQrTicket(false)}
                            />
                        </div>
                    )}
                </>
            ) : (
                <>
                    {loading ? (
                        <div className='text-center mt-10'>
                            <Spin size="large" />
                        </div>
                    ) : (
                        <div className="mt-3 md:mt-5 mb-10 md:px-2">
                            {(() => {
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);

                                const expiredBooks = book.filter((card) => {
                                    if (!card?.party_id?.start_date) return false;
                                    const eventDate = new Date(card.party_id.start_date);
                                    eventDate.setHours(0, 0, 0, 0);
                                    return eventDate < today;
                                });
                                if (expiredBooks.length > 0) {
                                    return (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16 sm:mt-24 px-4 sm:px-8 md:px-16 lg:px-10 mb-10">
                                            {expiredBooks.map((card) => (
                                                <button
                                                    key={card.id}
                                                    onClick={() =>
                                                        handleDetail(
                                                            card._id,
                                                            card.party_id.event_name.replace(/\s+/g, "-")
                                                        )
                                                    }
                                                    className="bg-neutral-800 bg-opacity-15 px-4 py-3 rounded-2xl shadow-lg text-left flex flex-col transition-transform duration-300 transform hover:scale-105"
                                                >
                                                    <div className="flex items-center justify-between w-full mb-2 gap-2">
                                                        <div className="flex items-center min-w-0">
                                                            <div className="w-8 h-8 rounded-full flex justify-center items-center flex-shrink-0">
                                                                <FaArtstation className="text-purple-800" size={15} />
                                                            </div>
                                                            <h2 className="text-white/50 text-xs uppercase font-inter ml-2 truncate">
                                                                {card?.party_id?.category}
                                                            </h2>
                                                        </div>
                                                        <p className="text-white/50 text-xs font-inter flex-shrink-0">
                                                            {formatDate(card?.party_id?.start_date)}
                                                        </p>
                                                    </div>

                                                    <div className="relative mb-4">
                                                        <div className="w-full aspect-square">
                                                            <img
                                                                src={card?.party_id?.flyer}
                                                                alt="event"
                                                                className="object-cover rounded-xl w-full h-full"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between w-full mb-2 gap-2">
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-center mt-1">
                                                                <span className="text-white text-lg font-inter truncate">
                                                                    {card?.party_id?.event_name}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center mt-1">
                                                                <FaLocationDot className="text-neutral-400 mr-1 flex-shrink-0" size={12} />
                                                                <span className="text-white/50 text-sm font-inter truncate">
                                                                    {card?.party_id?.venue_name}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex-shrink-0">
                                                            <p className="text-white font-medium whitespace-nowrap">
                                                                <span className="text-gray-500 text-2xl font-inter">$</span>
                                                                <span className="text-2xl font-semibold font-inter">
                                                                    {card?.party_id?.ticket_start_price}+
                                                                </span>
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* <div className="flex flex-col items-center mt-4">
                                                        <button
                                                            onClick={() => handleOpenQr(card)}
                                                            className="flex text-xs font-inter md:text-sm items-center justify-center px-4 py-3 bg-white text-black rounded-full mb-3 w-full md:w-80 transition-transform duration-300 hover:scale-95"
                                                        >
                                                            <FaQrcode className="mr-2" /> Show QR
                                                        </button>
                                                    </div>

                                                    <div className="flex flex-col items-center mt-2">
                                                        <button
                                                            onClick={() => downloadICSFile(card)}
                                                            className="flex text-xs font-inter items-center justify-center px-4 py-3 border border-gray-800 text-gray-400 rounded-full w-full md:w-80 transition-transform duration-300 hover:scale-95"
                                                        >
                                                            Add to Calendar
                                                        </button>
                                                    </div> */}

                                                    <div className="flex flex-col items-center mt-4">
                                                        <button
                                                            className="flex text-xs font-inter md:text-sm items-center justify-center px-4 py-3 bg-red-600 text-black rounded-full mb-3 w-full md:w-80 transition-transform duration-300 hover:scale-95"
                                                        >
                                                            Ticket expired
                                                        </button>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div className="flex items-center justify-center h-[50vh] w-full text-center text-white font-inter">
                                            No expired tickets are available.
                                        </div>
                                    );
                                }
                            })()}

                            <QrTicket
                                card={selectedCard}
                                isOpen={isModalQrTicket}
                                onClose={() => setIsModalQrTicket(false)}
                            />
                        </div>
                    )}
                </>
            )
            }
        </div >

    );
};

export default Tickets;
