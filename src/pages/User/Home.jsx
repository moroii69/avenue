import React, { useEffect, useState } from 'react';
import { MdWindow } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { AiFillDollarCircle } from "react-icons/ai";
import { MdOutlineDateRange } from "react-icons/md";
import { FaBookmark, FaArtstation } from "react-icons/fa6";
import { FaTicketAlt, FaMusic } from 'react-icons/fa';
import { IoMdMoon } from "react-icons/io";
import PriceModal from '../../components/modals/PriceModal';
import PlaceModal from '../../components/modals/PlaceModal';
import url from '../../constants/url';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [isModalPriceOpen, setIsModalPriceOpen] = useState(false);
  const [isModalPlaceOpen, setIsModalPlaceOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  const cards = [
    { id: 1, icon: <MdWindow size={20} color='#898989' />, text: 'Type' },
    { id: 2, icon: <FaLocationDot size={20} color='#898989' />, text: 'Place', onClick: () => { setIsModalPlaceOpen(true); } },
    { id: 3, icon: <AiFillDollarCircle size={20} color='#898989' />, text: 'Price', onClick: () => { setIsModalPriceOpen(true); } },
    { id: 4, icon: <MdOutlineDateRange size={20} color='#898989' />, text: 'Date' },
  ];

  const clients = [
    {
      id: 1,
      logo: <IoMdMoon className="text-white" size={15} />,
      title: "NIGHTLIFE",
      date: "20 Jan 2025 22:00",
      image: "https://banner2.cleanpng.com/20180821/bo/cce051a88d8bd9b01c4f77d10c29693b.webp",
      location: "New York",
      price: "50"
    },
    {
      id: 2,
      logo: <FaMusic className="text-white" size={15} />,
      title: "MUSIC",
      date: "21 Jan 2025 18:00",
      image: "https://img.freepik.com/premium-photo/colorful-confetti-falling-crowd-party-photo_1233553-2491.jpg?semt=ais_hybrid",
      location: "Los Angeles",
      price: "20"
    },
    {
      id: 3,
      logo: <FaArtstation className="text-white" size={15} />,
      title: "ARTS & CULTURE",
      date: "22 Jan 2025 20:00",
      image: "https://hips.hearstapps.com/hmg-prod/images/family-toasting-on-christmas-dinner-at-home-royalty-free-image-1699896250.jpg?crop=1xw:0.84236xh;center,top&resize=1200:*",
      location: "Chicago",
      price: "37"
    },
    {
      id: 4,
      logo: <FaMusic className="text-white" size={15} />,
      title: "MUSIC",
      date: "21 Jan 2025 18:00",
      image: "https://plus.unsplash.com/premium_photo-1683129651802-1c7ba429a137?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cGFydHl8ZW58MHx8MHx8fDA%3D",
      location: "Los Angeles",
      price: "20"
    },
    {
      id: 5,
      logo: <FaArtstation className="text-white" size={15} />,
      title: "ARTS & CULTURE",
      date: "22 Jan 2025 20:00",
      image: "https://media.istockphoto.com/id/1324561072/photo/party-people-enjoy-concert-at-festival-summer-music-festival.jpg?s=612x612&w=0&k=20&c=rT--yThoBJSdYFUb9nm-7oDvBZuhNE9LmB5uYmlxvSs=",
      location: "Chicago",
      price: "37"
    },
  ];

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

  const handleDetail = (id, name) => {
    localStorage.setItem('user_event_id', id);
    localStorage.setItem('user_event_name', name);
    navigate(`/info/${name}`);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center mt-28 bg-primary">
      <h1 className="text-7xl font-medium text-white tracking-tighter">
        Find <img src="https://static.vecteezy.com/system/resources/thumbnails/028/653/192/small/casino-poker-game-card-icon-png.png" alt="event icon" className="w-36 h-36 inline-block" /> events
      </h1>
      <h1 className="text-7xl font-medium text-white mb-4 mx-[-4px] tracking-tighter">
        in <span className='text-[#938c8c] underline'>your</span> area
      </h1>
      <p className="text-lg text-[#b4b4b4] max-w-xl mt-4">
        Avenue streamlines event discovery,
      </p>
      <p className="text-lg text-[#b4b4b4] max-w-xl">
        creation, ticketing, and management.
      </p>

      <div className="flex justify-center mt-10 gap-1 bg-black px-1 py-1 rounded-3xl">
        {cards.map(card => (
          <button onClick={card.onClick} key={card.id} className="bg-primary px-10 py-4 rounded-3xl shadow-lg text-center flex flex-col items-center transition-transform duration-300 transform hover:scale-90">
            <div className="mb-2 text-white flex justify-center">{card.icon}</div>
            <p className="text-lg text-white font-medium">{card.text}</p>
          </button>
        ))}
      </div>
      <PriceModal isOpen={isModalPriceOpen} onClose={() => setIsModalPriceOpen(false)} />
      <PlaceModal isOpen={isModalPlaceOpen} onClose={() => setIsModalPlaceOpen(false)} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mt-32 mb-10 bg-primary px-32">
        {events.map(card => (
          <button
            onClick={() => handleDetail(card._id, card.event_name.replace(/\s+/g, "-"))}
            key={card.id} className="bg-[#3e3e3e] bg-opacity-15 px-3 py-2 rounded-2xl shadow-lg text-center flex flex-col transition-transform duration-300 transform hover:scale-105">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full flex justify-center items-center">
                  <FaArtstation className="text-white" size={15} />
                </div>
                <h2 className="text-white text-xs">{card.category}</h2>
              </div>
              <p className="text-white text-xs">{formatDate(card.start_date)}</p>
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
          </button>
        ))}
      </div>

      <div>
        <div className="bg-primary py-20 sm:py-18">
          <div className="mx-auto max-w-7xl px-20 lg:px-20">
            <div className="mx-auto mt-0 grid max-w-lg grid-cols-4 items-center gap-x-16 gap-y-16 sm:max-w-xl sm:grid-cols-6 sm:gap-x-20 lg:mx-0 lg:max-w-none lg:grid-cols-5">
              <img
                alt="Transistor"
                src="https://tailwindui.com/plus/img/logos/158x48/transistor-logo-white.svg"
                width={158}
                height={48}
                className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
              />
              <img
                alt="Reform"
                src="https://tailwindui.com/plus/img/logos/158x48/reform-logo-white.svg"
                width={158}
                height={48}
                className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
              />
              <img
                alt="Tuple"
                src="https://tailwindui.com/plus/img/logos/158x48/tuple-logo-white.svg"
                width={158}
                height={48}
                className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
              />
              <img
                alt="SavvyCal"
                src="https://tailwindui.com/plus/img/logos/158x48/savvycal-logo-white.svg"
                width={158}
                height={48}
                className="col-span-2 max-h-12 w-full object-contain sm:col-start-2 lg:col-span-1"
              />
              <img
                alt="Statamic"
                src="https://tailwindui.com/plus/img/logos/158x48/statamic-logo-white.svg"
                width={158}
                height={48}
                className="col-span-2 col-start-2 max-h-12 w-full object-contain sm:col-start-auto lg:col-span-1"
              />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;
