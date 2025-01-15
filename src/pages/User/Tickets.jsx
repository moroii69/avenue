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
            <div className="flex justify-between items-center mb-8 px-8">
                <div>
                    <h1 className="text-4xl font-bold">Purchased Tickets</h1>
                    <p className="text-gray-400 mt-2 text-xs">
                        Here you can see all of your purchased tickets
                    </p>
                </div>
                <div className="flex space-x-6 border border-[#2e2e2e] p-1 rounded-full">
                    <button
                        className={`px-5 py-2 rounded-full text-sm transition-all duration-300 ease-in-out ${activeTab === "upcoming"
                            ? "bg-[#131313] text-white"
                            : "text-gray-300"
                            }`}
                        onClick={() => setActiveTab("upcoming")}
                    >
                        Upcoming events
                    </button>
                    <button
                        className={`px-5 py-2 rounded-full text-sm transition-all duration-300 ease-in-out ${activeTab === "expired"
                            ? "bg-[#131313] text-white"
                            : "text-gray-300"
                            }`}
                        onClick={() => setActiveTab("expired")}
                    >
                        Expired events
                    </button>
                </div>
            </div>

            {
                activeTab === 'upcoming' ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mt-10 mb-10 px-8">
                            {book.map((card) => (
                                <>
                                    <button
                                        key={card.id}
                                        onClick={() => handleDetail(card._id, card.party_id.event_name.replace(/\s+/g, "-"))}
                                        className="bg-[#3e3e3e] bg-opacity-15 px-5 py-2 rounded-2xl shadow-lg text-center flex flex-col transition-transform duration-300 transform hover:scale-105"
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-full flex justify-center items-center">
                                                    <FaArtstation className="text-[#cccccc]" size={15} />
                                                </div>
                                                <h2 className="text-[#cccccc] text-xs ml-2">{card.party_id.category}</h2>
                                            </div>
                                            <p className="text-[#cccccc] text-xs">{formatDate(card.party_id.start_date)}</p>
                                        </div>

                                        <div className="relative mb-4">
                                            <img
                                                src={card.party_id.flyer}
                                                alt="event"
                                                className="w-full h-72 object-cover rounded-xl"
                                            />
                                            <div className="absolute top-2 right-2 bg-gray-500 bg-opacity-50 p-2 rounded-full text-white">
                                                <CiShare2 />
                                            </div>
                                            <div className="absolute bottom-0 w-full text-white text-start px-2 py-1 rounded-b-xl striped-background">
                                                <span className="text-xs font-medium">{card?.tickets?.ticket_name}</span>
                                            </div>
                                        </div>

                                        <h2 className="text-white text-sm text-start font-semibold">
                                            {card.party_id.event_name}
                                        </h2>

                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center">
                                                <FaLocationDot className="text-[#a2a2a2] mr-1" />
                                                <span className="text-[#878787] text-sm">{card.party_id.venue_name}</span>
                                            </div>
                                            <p className="text-white font-medium text-xl">
                                                <span className="text-gray-500 text-xl">$</span>
                                                {card.party_id.ticket_start_price}+
                                            </p>
                                        </div>

                                        <div className="flex flex-col items-center mt-4">
                                            <button
                                                onClick={() => handleOpenQr(card)}
                                                className="flex text-sm items-center justify-center px-4 py-3 bg-white text-black rounded-full mb-3 w-full"
                                            >
                                                <FaQrcode className="mr-2" /> Show QR
                                            </button>
                                            <button className="flex text-sm items-center justify-center px-4 py-3 border border-[#131313] text-gray-400 rounded-full w-full">
                                                <FaCalendarAlt className="mr-2" /> Add to Calendar
                                            </button>
                                        </div>
                                    </button>
                                </>
                            ))}
                            <QrTicket card={selectedCard} isOpen={isModalQrTicket} onClose={() => setIsModalQrTicket(false)} />
                        </div>

                    </>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mt-10 mb-10 px-8">
                            <div className="">
                                {events.map(card => (
                                    <button
                                        onClick={() => handleDetail(card._id, card.event_name.replace(/\s+/g, "-"))}
                                        key={card.id} className="bg-[#3e3e3e] bg-opacity-15 px-5 py-2 rounded-2xl shadow-lg text-center flex flex-col transition-transform duration-300 transform hover:scale-105">
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-full flex justify-center items-center">
                                                    <FaArtstation className="text-[#cccccc]" size={15} />
                                                </div>
                                                <h2 className="text-[#cccccc] text-xs">{card.category}</h2>
                                            </div>
                                            <p className="text-[#cccccc] text-xs">{formatDate(card.start_date)}</p>
                                        </div>

                                        <div className="relative mb-4">
                                            <img
                                                src={card.flyer}
                                                alt="event"
                                                className="w-full h-72 object-cover rounded-xl"
                                            />
                                            <div className="absolute top-2 right-2 bg-gray-500 bg-opacity-50 p-2 rounded-full text-white">
                                                <CiShare2 />
                                            </div>
                                            <div className="absolute bottom-0 w-full text-white text-start px-2 py-1 rounded-b-xl striped-background">
                                                <span className="text-xs font-medium">Regular Pass</span>
                                            </div>

                                        </div>


                                        <h2 className="text-white text-sm text-start font-semibold">{card.event_name}</h2>

                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center">
                                                <FaLocationDot className="text-[#a2a2a2] mr-1" />
                                                <span className="text-[#878787] text-sm">{card.venue_name}</span>
                                            </div>
                                            <p className="text-white font-medium text-xl">
                                                <span className="text-gray-500 text-xl">$</span>{card.ticket_start_price}+
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-center mt-4">
                                            <button className="flex text-sm items-center justify-center px-4 py-3 bg-white text-black rounded-full mb-3 w-full">
                                                <FaQrcode className="mr-2" /> Show QR
                                            </button>
                                            <button className="flex text-sm items-center justify-center px-4 py-3 border border-[#131313] text-gray-400 rounded-full w-full">
                                                <FaCalendarAlt className="mr-2" /> Add to Calendar
                                            </button>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )
            }
        </div>
    );
};

export default Tickets;
