import React, { useState, useEffect } from 'react';
import { Calendar, Calendar1Icon, ChevronDown, CircleUser, Globe, Locate, LockIcon, MinusIcon, Navigation, Paperclip, PlusIcon } from 'lucide-react';
import "../../css/global.css"
import axios from "axios"
import url from "../../constants/url"
import { useParams } from 'react-router-dom';
import { IoLockClosed, IoDocumentTextSharp } from "react-icons/io5";

const Profile = () => {
    const { id } = useParams();
    const [userId, setUserId] = useState(null);
    const [user, setUser] = useState({});
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    const [activeTab, setActiveTab] = useState("live");
    const [organizer, setOrganizer] = useState({});
    const [events, setEvents] = useState([]);
    const [book, setBook] = useState([]);

    const org_id = localStorage.getItem('user_organizer_id') || {};

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

    useEffect(() => {
        if (userId) {
            setLoading(true);
            axios
                .get(`${url}/auth/get-user-by-id/${userId}`)
                .then((response) => {
                    const userData = response.data;
                    setUser(userData)
                    setFirstName(userData.firstName);
                    setEmail(userData.email);
                    setPhoneNumber(userData.phoneNumber);
                    //setProfileImage(userData.profile_image)
                    console.log("show in events", response.data)
                    if (userData.showInEvent === "YES") {
                        setIsChecked(true);
                    } else {
                        setIsChecked(false);
                    }
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching user data", error);
                    setLoading(false);
                });
        }
    }, [userId]);

    const handlePrivacyChange = async (checked) => {
        setIsChecked(checked);

        try {
            const response = await fetch(`${url}/update-privacy-showin-event/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    showInEvent: checked ? "YES" : "NO",
                }),
            });

            const result = await response.json();
            if (response.ok) {
                console.log(result.message);
            } else {
                console.error(result.error);
            }
        } catch (error) {
            console.error('Failed to update privacy status', error);
        }
    };

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

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('firstName', firstName);
        formData.append('email', email);
        formData.append('phoneNumber', "+1" + phoneNumber);
        // if (profilePhoto) {
        //     formData.append('profile_image', profilePhoto);
        // }

        axios
            .put(`${url}/auth/update-user/${userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then((response) => {
                alert('Profile updated successfully!');
                window.location.reload()
                localStorage.setItem('userName', firstName);
            })
            .catch((error) => {
                console.error('Error updating profile:', error);
            });
    };

    const formattedDate = new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
      });

    return (
        <div>
            <div className="min-h-screen bg-primary text-white mt-5">
                <div className="justify-center mx-auto p-6 flex gap-8">

                    <div className="max-w-xs flex-1 border border-[#222222] px-4 py-4 rounded-2xl overflow-y-auto h-full">
                        <div className="flex mt-0 shadow-md rounded-2xl p-3 w-full items-center">
                            <div className="flex items-center">
                                <div className="w-20 h-20 rounded-full overflow-hidden mr-4 bg-[#10b981] flex items-center justify-center">
                                    {organizer?.profile_image ? (
                                        <img
                                            src={organizer.profile_image}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-xl font-inter font-semibold text-black">
                                            {firstName?.slice(0, 2).toUpperCase() || ''}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 space-y-2">
                            <h1 className="text-2xl font-md font-inter">{firstName}</h1>
                        </div>

                        <div className="flex items-center gap-1 mt-2">
                            <Calendar1Icon size={14} />
                            <p className=" text-gray-400 text-xs font-inter">Joined on {formattedDate}</p>
                        </div>

                        <div className="flex bg-[#787878] p-1 rounded-full mt-5 bg-opacity-25">
                            <button
                                onClick={() => setActiveTab("live")}
                                className={`flex-1 py-2 text-center transition-all text-sm font-inter duration-300 ease-in-out ${activeTab === "live"
                                    ? "bg-[#787878] text-white font-medium rounded-full p-2 bg-opacity-25"
                                    : "text-gray-300"
                                    }`}
                            >
                                Attendee
                            </button>
                            <button
                                onClick={() => setActiveTab("past")}
                                className={`flex-1 py-2 text-center transition-all text-sm font-inter duration-300 ease-in-out ${activeTab === "past"
                                    ? "bg-[#787878] text-white font-medium rounded-full p-2 bg-opacity-25"
                                    : "text-gray-300"
                                    }`}
                            >
                                Creator
                            </button>
                        </div>

                        <div className="border border-[#222222] rounded-2xl mt-6 p-3">
                            <div className="flex justify-center items-center space-x-6 flex-nowrap">
                                <div className="flex flex-col items-center">
                                    <span className="text-xs font-inter text-gray-500">Purchased Tickets</span>
                                    <span className="text-lg font-semibold text-white">{book.length}</span>
                                </div>

                                <div className="w-[2px] bg-[#222222] h-10"></div>

                                <div className="flex flex-col items-center">
                                    <span className="text-xs font-inter text-gray-500">Saved Tickets</span>
                                    <span className="text-lg font-semibold text-white">0</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full max-w-2xl">
                        <div className="mx-auto">

                            <div className="" style={{ height: "calc(100vh - 120px)" }}>
                                {activeTab === "live" && (

                                    <div className="h-full overflow-y-auto bg-primary hide-scrollbar">

                                        <div className="max-w-2xl mx-auto text-white">
                                            <div className="rounded-xl bg-zinc-900 border border-[#787878] border-opacity-10 overflow-hidden">

                                                <div className="p-4 border-b border-zinc-800 bg-[#111111] bg-opacity-65 flex items-center gap-2">
                                                    <CircleUser className="w-5 h-5 text-zinc-400" />
                                                    <span className="text-sm font-medium font-inter">Basic details</span>
                                                </div>

                                                <div className="p-6 space-y-6 bg-primary">

                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex flex-col gap-2">
                                                            <span className="text-sm font-medium font-inter">Name</span>
                                                            <span className="text-xs text-zinc-500 font-inter">This is how others will see you</span>
                                                        </div>
                                                        <div className="relative w-1/2">
                                                            <input
                                                                type="text"
                                                                value={firstName}
                                                                onChange={(e) => setFirstName(e.target.value)}
                                                                className="bg-primary border text-sm font-inter border-zinc-800 rounded-full px-5 py-2.5 pr-20 focus:outline-none w-full"

                                                            />
                                                            <button onClick={handleSubmit} className="absolute right-1 top-1/2 transform bg-[#727272] bg-opacity-15 font-inter text-white py-2 px-3 rounded-full -translate-y-1/2 text-sm hover:text-white">
                                                                Change
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex flex-col gap-2">
                                                            <span className="text-sm font-medium">Email</span>
                                                            <span className="text-xs text-zinc-500">Your email for notifications and updates</span>
                                                        </div>
                                                        <div className="relative w-1/2">
                                                            <input
                                                                type="email"
                                                                value={email}
                                                                onChange={(e) => setEmail(e.target.value)}
                                                                className="bg-primary border text-sm font-inter border-zinc-800 rounded-full px-5 py-2.5 pr-20 focus:outline-none w-full"

                                                            />
                                                            <button onClick={handleSubmit} className="absolute right-1 top-1/2 transform bg-[#727272] bg-opacity-15 font-inter text-white py-2 px-3 rounded-full -translate-y-1/2 text-sm hover:text-white">
                                                                Change
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex flex-col gap-2">
                                                            <span className="text-sm font-medium">Phone number</span>
                                                            <span className="text-xs text-zinc-500">Your verified phone number</span>
                                                        </div>
                                                        <div className="relative w-1/2">
                                                            <div className="flex items-center bg-primary border font-inter border-zinc-800 rounded-full px-2 py-2.5 w-full">
                                                                <div className="flex items-center gap-1 px-1">
                                                                    <img
                                                                        src="https://flagcdn.com/w40/us.png"
                                                                        alt="US Flag"
                                                                        className="w-4 h-4 rounded-full"
                                                                    />
                                                                    <span className="text-white text-sm font-inter">+1</span>
                                                                </div>
                                                                <input
                                                                    type="text"
                                                                    value={phoneNumber.startsWith('+1') ? phoneNumber.slice(2) : phoneNumber}
                                                                    onChange={(e) => {
                                                                        setPhoneNumber(e.target.value);
                                                                    }}
                                                                    className="bg-transparent text-sm flex-1 focus:outline-none px-2 text-white mx-3"
                                                                />

                                                                <button onClick={handleSubmit} className="absolute right-1 top-1/2 transform bg-[#727272] bg-opacity-15 font-inter text-white py-2 px-3 rounded-full -translate-y-1/2 text-sm hover:text-white">
                                                                    Change
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>

                                        <div className="max-w-2xl mx-auto text-white mt-8">
                                            <div className="rounded-xl bg-zinc-900 border border-[#787878] border-opacity-10 overflow-hidden">

                                                <div className="p-4 border-b border-zinc-800 bg-[#111111] bg-opacity-65 flex items-center gap-2">
                                                    <IoLockClosed className="w-5 h-5 text-zinc-400" />
                                                    <span className="text-sm font-medium font-inter">Privacy</span>
                                                </div>

                                                <div className="p-6 space-y-6 bg-primary">

                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex flex-col gap-2">
                                                            <span className="text-sm font-medium font-inter">Show me in event page</span>
                                                            <span className="text-xs text-zinc-500 font-inter">Allow others to see you're attending events</span>
                                                        </div>
                                                        <label htmlFor="eventPageToggle" className="inline-flex items-center cursor-pointer">
                                                            <div className="relative">
                                                                <input
                                                                    type="checkbox"
                                                                    id="eventPageToggle"
                                                                    className="sr-only"
                                                                    checked={isChecked}
                                                                    onChange={(e) => handlePrivacyChange(e.target.checked)}
                                                                />
                                                                <div
                                                                    className={`toggle__line w-10 h-6 rounded-full transition-colors duration-300 ease-in-out ${isChecked ? 'bg-green-500' : 'bg-[#727272]'}`}
                                                                ></div>
                                                                <div
                                                                    className={`toggle__dot absolute top-1/2 w-4 h-4 bg-white rounded-full shadow-md transform -translate-y-1/2 transition-transform duration-300 ease-in-out ${isChecked ? 'translate-x-6' : ''}`}
                                                                ></div>
                                                            </div>
                                                        </label>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>

                                        <div className="max-w-2xl mx-auto text-white mt-8">
                                            <div className="rounded-xl bg-zinc-900 border border-[#787878] border-opacity-10 overflow-hidden">

                                                <div className="p-4 border-b border-zinc-800 bg-[#111111] bg-opacity-65 flex items-center gap-2">
                                                    <IoDocumentTextSharp className="w-5 h-5 text-zinc-400" />
                                                    <span className="text-sm font-medium font-inter">Legal</span>
                                                </div>

                                                <div className="p-6 space-y-6 bg-primary">

                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex flex-col gap-2">
                                                            <span className="text-sm font-medium font-inter">Contact support</span>
                                                            <span className="text-xs text-zinc-500 font-inter">Need help? We're here for you</span>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            value="Chat with support"
                                                            className="bg-primary border text-sm font-inter text-center border-zinc-800 rounded-full px-5 py-2.5 focus:outline-none w-52"
                                                            readOnly
                                                        />
                                                    </div>

                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex flex-col gap-2">
                                                            <span className="text-sm font-medium font-inter">Terms and Privacy</span>
                                                            <span className="text-xs text-zinc-500">View legal documents</span>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            value="Terms and Privacy"
                                                            className="bg-primary border text-sm font-inter text-center border-zinc-800 rounded-full px-5 py-2.5 focus:outline-none w-52"
                                                            readOnly
                                                        />
                                                    </div>

                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex flex-col gap-2">
                                                            <span className="text-sm font-medium font-inter">Logout</span>
                                                            <span className="text-xs text-zinc-500">You'ill be logged out from this device</span>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            value="Logout"
                                                            className="bg-primary border text-sm font-inter text-center text-[#f43f5e] border-zinc-800 rounded-full px-5 py-2.5 focus:outline-none w-52"
                                                            readOnly
                                                        />
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {activeTab === "past" && (
                                    <div>
                                        <h2 className="text-xl font-bold mb-1 text-center font-inter">Coming soon</h2>
                                        <p className="text-center font-inter">We are perparing something special</p>
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

export default Profile;