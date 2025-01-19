import React, { useEffect, useState } from "react";
import url from "../../constants/url";
import axios from "axios";
import { FaArtstation, FaBookmark, FaLocationDot, FaQrcode } from "react-icons/fa6";
import { CiShare2 } from "react-icons/ci";
import { FaCalendarAlt } from "react-icons/fa";
import "../../css/global.css"
import QrTicket from "../../components/modals/QrTicket";

const Tickets = () => {
    const [activeTab, setActiveTab] = useState("upcoming");
    const [events, setEvents] = useState([]);
    const [isModalQrTicket, setIsModalQrTicket] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    const [book, setBook] = useState([]);
    const [userId, setUserId] = useState(null);

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

        return `${day} ${month} ${year} ${hours}:${minutes} ${ampm}`;
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
        try {
            const response = await axios.get(`${url}/get-booking-lists/${userId}`);
            setBook(response.data);
        } catch (error) {
            console.error('Error fetching events:', error);
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-6 md:mt-10 mb-10 px-4 md:px-8">
                    {book.map((card) => (
                        <button
                            key={card.id}
                            onClick={() =>
                                handleDetail(
                                    card._id,
                                    card.party_id.event_name.replace(/\s+/g, "-")
                                )
                            }
                            className="bg-[#3e3e3e] bg-opacity-15 px-4 py-4 rounded-xl shadow-lg text-center flex flex-col transition-transform duration-300 transform hover:scale-105"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full flex justify-center items-center">
                                        <FaArtstation className="text-purple-800" size={15} />
                                    </div>
                                    <h2 className="text-[#cccccc] text-xs ml-1 font-inter">
                                        {card.party_id.category}
                                    </h2>
                                </div>
                                <p className="text-[#cccccc] text-xs font-inter">
                                    {formatDate(card.party_id.start_date)}
                                </p>
                            </div>

                            <div className="relative mb-4">
                                <img
                                    src={card.party_id.flyer}
                                    alt="event"
                                    className="w-full h-auto object-cover rounded-xl"
                                />
                                <div className="absolute top-2 right-2 bg-gray-500 bg-opacity-50 p-2 rounded-full text-white">
                                    <CiShare2 />
                                </div>
                                <div className="absolute bottom-0 w-full text-white text-start px-2 py-1 rounded-b-xl striped-background">
                                    <span className="text-xs font-medium font-inter">
                                        {card?.tickets?.ticket_name}
                                    </span>
                                </div>
                            </div>

                            <h2 className="text-white text-sm text-start font-semibold font-inter">
                                {card.party_id.event_name}
                            </h2>

                            <div className="flex justify-between items-center mt-2">
                                <div className="flex items-center">
                                    <FaLocationDot className="text-[#a2a2a2] mr-1" />
                                    <span className="text-[#878787] text-xs md:text-sm font-inter">
                                        {card.party_id.venue_name}
                                    </span>
                                </div>
                                <p className="text-white font-medium text-sm md:text-xl">
                                    <span className="text-gray-500 font-inter">$</span>
                                    {card.party_id.ticket_start_price}+
                                </p>
                            </div>

                            <div className="flex flex-col items-center mt-4">
                                <button
                                    onClick={() => handleOpenQr(card)}
                                    className="flex text-xs font-inter md:text-sm items-center justify-center px-3 md:px-4 py-2 bg-white text-black rounded-full mb-3 w-full"
                                >
                                    <FaQrcode className="mr-2" /> Show QR
                                </button>
                            </div>
                            <div className="flex flex-row items-center gap-2">
                                <button
                                    onClick={() => downloadICSFile(card)}
                                    className="flex text-xs font-inter items-center justify-center px-3 py-2 border border-[#131313] text-gray-400 rounded-full w-full"
                                >
                                    Add to Calendar
                                </button>
                            </div>
                        </button>
                    ))}
                    <QrTicket
                        card={selectedCard}
                        isOpen={isModalQrTicket}
                        onClose={() => setIsModalQrTicket(false)}
                    />
                </div>
            ) : (
                <div className="text-center font-inter mt-20 md:mt-52">
                    <p>No tickets have expired</p>
                </div>
            )}
        </div>

    );
};

export default Tickets;
