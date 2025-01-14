import React, { useState, useEffect } from 'react';
import { Calendar, Calendar1Icon, Globe, Locate, MinusIcon, Navigation, PlusIcon } from 'lucide-react';
import { IoLocationOutline } from "react-icons/io5";
import { BsInstagram, BsTwitterX } from 'react-icons/bs';
import { MdWindow } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { AiFillDollarCircle } from "react-icons/ai";
import { MdOutlineDateRange } from "react-icons/md";
import { FaBookmark, FaArtstation } from "react-icons/fa6";
import { FaTicketAlt, FaMusic } from 'react-icons/fa';
import { IoMdMoon } from "react-icons/io";
import "../../css/global.css"
import axios from "axios"
import url from "../../constants/url"
import { useParams } from 'react-router-dom';

const Creater = () => {
    const { id } = useParams();
    const [tickets, setTickets] = useState(2);
    const [activeTab, setActiveTab] = useState("live");
    const [organizer, setOrganizer] = useState({});
    const [events, setEvents] = useState([]);

    const handleIncrement = () => setTickets(prev => Math.min(prev + 1, 10));
    const handleDecrement = () => setTickets(prev => Math.max(prev - 1, 1));

    const org_id = localStorage.getItem('user_organizer_id') || {};

    // useEffect(() => {
    //     localStorage.setItem('user_organizer_name', id)
    // },[id])

    const fetchOrganizer = async () => {
        if (org_id) {
            try {
                const response = await axios.get(`${url}/get-organizer/${org_id}`);
                setOrganizer(response.data);
            } catch (error) {
                console.error("Error fetching organizer:", error);
            }
        } else {
            console.log("not found")
        }
    };

    const fetchEvents = async () => {
        if (org_id) {
            try {
                const response = await axios.get(`${url}/event/get-event-by-organizer-id/${org_id}`);
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
        if (org_id) {
            fetchOrganizer();
            fetchEvents()
        }
    }, [org_id]);

    return (
        <div>
            <div className="min-h-screen bg-primary text-white mt-5">
                <div className="justify-center mx-auto p-6 flex gap-8">

                    <div className="max-w-xs flex-1 border border-[#222222] px-4 py-4 rounded-2xl overflow-y-auto h-full">
                        <div className="flex mt-0 shadow-md rounded-2xl p-2 w-full">
                            <div className="flex items-center">
                                <div className="w-20 h-20 rounded-full overflow-hidden mr-4">
                                    {organizer?.profile_image ? (
                                        <img
                                            src={organizer.profile_image}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span>
                                            {organizer?.name?.slice(0, 2).toUpperCase() || ''}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 space-y-2">
                            <h1 className="text-2xl font-md">{organizer.name}</h1>
                        </div>
                        <div className="flex items-center gap-1 mt-2">
                            <Calendar1Icon size={14} />
                            <p className=" text-gray-400 text-sm">Organizer since December 2024</p>
                        </div>

                        <div className="border border-[#222222] rounded-2xl mt-6 p-3">
                            <div className="flex justify-center items-center space-x-14">
                                <div className="flex flex-col items-center">
                                    <span className="text-xs font-bold text-white">Live</span>
                                    <span className="text-xl font-semibold text-white">{events.length}</span>
                                </div>

                                <div className="w-[2px] bg-[#222222] h-10"></div>

                                <div className="flex flex-col items-center">
                                    <span className="text-xs font-bold text-white">Past</span>
                                    <span className="text-xl font-semibold text-white">0</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-center space-y-4 mt-5">
                            <div className="flex space-x-4">
                                <a href={organizer.twitter} className="card bg-primary border border-[#222222] text-white p-2 rounded-full shadow-lg flex items-center justify-center w-20 h-12">
                                    <BsTwitterX size={14} />
                                </a>
                                <a href={organizer.instagram} className="card bg-primary border border-[#222222] text-white p-2 rounded-full shadow-lg flex items-center justify-center w-20 h-12">
                                    <BsInstagram size={14} />
                                </a>
                                <a href={organizer.website} className="card bg-primary border border-[#222222] text-white p-2 rounded-full shadow-lg flex items-center justify-center w-20 h-12">
                                    <Globe size={14} />
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="w-full max-w-2xl">
                        <div className="mx-auto">
                            <div className="flex border border-[#222222] p-1 rounded-full">
                                <button
                                    onClick={() => setActiveTab("live")}
                                    className={`flex-1 py-2 text-center transition-all duration-300 ease-in-out ${activeTab === "live"
                                        ? "bg-[#131313] text-white font-medium rounded-full p-2"
                                        : "text-gray-500"
                                        }`}
                                >
                                    Live Events
                                </button>
                                <button
                                    onClick={() => setActiveTab("past")}
                                    className={`flex-1 py-2 text-center transition-all duration-300 ease-in-out ${activeTab === "past"
                                        ? "bg-[#131313] text-white font-medium rounded-full p-2"
                                        : "text-gray-500"
                                        }`}
                                >
                                    Past Events
                                </button>
                            </div>

                            <div className="mt-6" style={{ height: "calc(100vh - 120px)" }}>
                                {activeTab === "live" && (
                                    <div className="h-full overflow-y-auto bg-primary hide-scrollbar">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-10">
                                            {events.map(card => (
                                                <div key={card._id} className="bg-[#3e3e3e] bg-opacity-15 px-3 py-2 rounded-2xl shadow-lg text-center flex flex-col transition-transform duration-300 transform hover:scale-95">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <div className="flex items-center">
                                                            <div className="w-8 h-8 rounded-full flex justify-center items-center">
                                                                <FaArtstation className="text-white" size={15} />
                                                            </div>
                                                            <h2 className="text-white text-xs">{card.category}</h2>
                                                        </div>
                                                        <p className="text-white text-xs">{card.start_date}</p>
                                                    </div>

                                                    <div className="relative mb-4">
                                                        <img
                                                            src={card.flyer}
                                                            alt="event"
                                                            className="w-full h-72 object-cover rounded-xl"
                                                        />
                                                        <div className="absolute top-2 right-2 bg-gray-500 bg-opacity-50 p-2 rounded-full text-white">
                                                            <FaBookmark />
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
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {activeTab === "past" && (
                                    <div>
                                        <h2 className="text-xl font-bold mb-1 text-center">No Past Events</h2>
                                        <p className="text-center">No past events for this creator.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Creater;