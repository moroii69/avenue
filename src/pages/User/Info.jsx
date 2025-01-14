import React, { useEffect, useState } from 'react';
import { Calendar, Locate, MinusIcon, Navigation, PlusIcon } from 'lucide-react';
import { IoLocationOutline } from "react-icons/io5";
import axios from 'axios';
import url from "../../constants/url"
import { useNavigate, useParams } from 'react-router-dom';

const Info = () => {
    const { name } = useParams()
    const [event, setEvent] = useState({});
    const [events, setEvents] = useState([]);
    const [ticketCounts, setTicketCounts] = useState([]);
    const navigate = useNavigate();
    const [organizer, setOrganizer] = useState({});
    const [expandedDescriptions, setExpandedDescriptions] = useState({});
    const [selectedTicket, setSelectedTicket] = useState(null);

    const id = localStorage.getItem('user_event_id') || {};

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
                    const updatedCount = count === null ? 1 : Math.min(count + 1, 10);

                    setSelectedTicket({
                        ...event?.tickets[index],
                        count: updatedCount,
                    });

                    return updatedCount;
                }
                return null;
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
        navigate("/checkout");
    };

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

    const fetchEvent = async () => {
        try {
            const response = await axios.get(`${url}/event/get-event-by-id/${id}`);
            setEvent(response.data);
            setOrganizer(response.data?.organizer_id?._id)
        } catch (error) {
            console.error('Error fetching events:', error);
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

    return (
        <div className="min-h-screen bg-primary text-white mt-5">
            <div className="max-w-5xl mx-auto p-6 flex gap-8">

                <div className="flex-1 border border-[#111111] px-4 py-4 rounded-2xl overflow-y-auto">
                    <div className="aspect-video bg-[#111111] rounded-lg overflow-hidden">
                        <img
                            src={`${event.flyer}`}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="mt-4 space-y-2">
                        <div className="flex items-center space-x-2 mb-8">
                            <span className="text-red-400 border border-[#292929] px-3 py-2 rounded-full">♫ <span className='text-white'>{event.category}</span></span>
                        </div>
                        <h1 className="text-3xl font-bold">{event.event_name}</h1>
                        <div className="flex items-center space-x-2 text-gray-400">
                            <IoLocationOutline />
                            <span>{event.venue_name}</span>
                            <span>•</span>
                            <Calendar size={16} />
                            <span>{formatDate(event.start_date)}</span>
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
                                <h2 className="text-md font-bold text-gray-200">{event?.organizer_id?.name}</h2>
                                <p className="text-xs text-gray-400">{events.length} Live Events</p>
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
                    <div className="flex items-center mt-10">
                        <div className="flex">
                            <div className="relative -ml-2 first:ml-0">
                                <img
                                    src="https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001882.png"
                                    alt="Image 1"
                                    className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                                />
                            </div>
                            <div className="relative -ml-2">
                                <img
                                    src="https://media.istockphoto.com/id/1437816897/photo/business-woman-manager-or-human-resources-portrait-for-career-success-company-we-are-hiring.jpg?s=612x612&w=0&k=20&c=tyLvtzutRh22j9GqSGI33Z4HpIwv9vL_MZw_xOE19NQ="
                                    alt="Image 2"
                                    className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                                />
                            </div>
                            <div className="relative -ml-2">
                                <img
                                    src="https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg"
                                    alt="Image 3"
                                    className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                                />
                            </div>
                            <div className="relative -ml-2">
                                <img
                                    src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
                                    alt="Image 4"
                                    className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                                />
                            </div>
                            <div className="relative -ml-2">
                                <img
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBwgu1A5zgPSvfE83nurkuzNEoXs9DMNr8Ww&s"
                                    alt="Image 5"
                                    className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <p className='mt-2 text-gray-400'>Cathy and <span className='text-blue-600'>5 others</span> are going</p>
                    </div>
                    <div>
                        <p className='mt-10 text-gray-400 text-sm'>ABOUT</p>
                    </div>
                    <div>
                        <p className='mt-4 text-gray-300 w-6/7 text-sm leading-relaxed' dangerouslySetInnerHTML={{ __html: event.event_description }}></p>
                    </div>
                    <div>
                        <p className='mt-10 text-gray-400 text-sm'>GUEST LIST</p>
                    </div>
                    <div className="flex justify-start gap-4 mt-5">
                        <div className="flex items-center bg-[#141414] shadow-md rounded-full w-1/4">
                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 bg-opacity-10 text-white text-sm font-bold mr-2">
                                AB
                            </div>
                            <h2 className="text-sm font-semibold text-gray-200">Club VIP</h2>
                        </div>
                        <div className="flex items-center bg-[#141414] shadow-md rounded-full w-1/4">
                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-500 bg-opacity-10 text-white text-sm font-bold mr-2">
                                CD
                            </div>
                            <h2 className="text-sm font-semibold text-gray-200">Sarah & Co.</h2>
                        </div>
                        <div className="flex items-center bg-[#141414] shadow-md rounded-full w-1/4">
                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-red-500 bg-opacity-10 text-white text-sm font-bold mr-2">
                                EF
                            </div>
                            <h2 className="text-sm font-semibold text-gray-200">Alex</h2>
                        </div>
                    </div>
                    <div className='flex justify-center items-center mt-5'>
                        <button className='w-full border border-[#212121] rounded-full py-3'>Contact host</button>
                    </div>
                    <div className='flex justify-center items-center mt-2'>
                        <p className='text-sm text-gray-500'>To get on the guest list, contact the host</p>
                    </div>
                    <div>
                        <p className='mt-10 text-gray-400 text-sm'>LOCATION</p>
                    </div>
                    <div>
                        <p className='mt-2 text-white text-lg'>{event.venue_name}</p>
                    </div>
                    <div>
                        <p className=' text-gray-500 text-xs'>{event.address}</p>
                    </div>
                    <div className="mt-4">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.675508482171!2d-122.4194!3d37.7749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808f0dbcd1fd%3A0x4792d1c3f0a0c7ad!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1632412878749!5m2!1sen!2sus"
                            width="500"
                            height="350"
                            style={{ border: 0, borderRadius: "30px" }}
                            allowFullScreen=""
                            loading="lazy"
                        ></iframe>
                    </div>
                </div>

                <div className="w-96 ">
                    {ticketCounts.some((count) => count > 0) && (
                        <div className="bg-[#141414] rounded-2xl p-4 mb-4">
                            <div className="mb-0">
                                <h3 className="text-gray-400 text-xs mb-1">TOTAL AMOUNT</h3>
                                <div className="flex justify-between items-center mb-0">
                                    <div className="text-2xl font-bold">
                                        ${ticketCounts.reduce((total, count, index) => {
                                            return total + (count > 0 ? count * event.tickets[index].price : 0);
                                        }, 0).toFixed(2)}
                                    </div>
                                    <button onClick={handleCheckout} className="bg-white text-black py-2 px-6 rounded-full hover:bg-gray-100">
                                        Go to checkout
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {event?.tickets?.map((ticket, index) => (
                        <div key={ticket.id || index} className="bg-[#141414] rounded-2xl p-4 mb-4">
                            <div className="rounded-lg">
                                <div className="flex items-center mb-4">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                    <span className="text-sm text-gray-400 ml-2">{ticket.ticket_name}</span>
                                </div>
                                <div className="mb-4">
                                    <div className="h-[1px] bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>
                                </div>
                                <div>
                                    <div className="text-2xl mt-1 mb-1">
                                        {ticketCounts[index] === null
                                            ? `$${ticket.price}`
                                            : `$${ticket.price} x ${ticketCounts[index]}`}
                                    </div>
                                    {/* Assuming renderDescription is a provided function */}
                                    {renderDescription(ticket.ticket_description, ticket.id || index)}
                                </div>
                                <div className="flex items-center mt-4 bg-primary px-1 py-1 rounded-full w-max">
                                    <button
                                        onClick={() => handleDecrement(index)}
                                        className={`p-3 bg-[#141414] text-white rounded-full ${ticketCounts[index] === null
                                            ? 'cursor-not-allowed opacity-50'
                                            : 'hover:bg-gray-700'}`}
                                        disabled={ticketCounts[index] === null}
                                    >
                                        <MinusIcon size={16} />
                                    </button>

                                    <span className="mx-4">
                                        {ticketCounts[index] === null ? 'Choose tickets' : `${ticketCounts[index]} tickets`}
                                    </span>
                                    <button
                                        onClick={() => handleIncrement(index)}
                                        className="p-3 bg-[#141414] text-white rounded-full hover:bg-gray-700"
                                    >
                                        <PlusIcon size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Info;