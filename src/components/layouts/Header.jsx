import React, { useEffect, useState } from 'react';
import LoginModal from '../modals/LoginModal';
import { useLocation, useParams } from 'react-router-dom';
import { FaRegCalendarAlt } from 'react-icons/fa';

const Header = () => {
  const { name, id } = useParams();
  const location = useLocation();
  const [activeButton, setActiveButton] = useState('Explore');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventName, setEventName] = useState("");
  const [organizerName, setOrganizerName] = useState("");

  const userId = localStorage.getItem('userID') || "";

  useEffect(() => {
    const EventName = localStorage.getItem('user_event_name') || "";
    const OrganizerName = localStorage.getItem('user_organizer_name') || "";
    setEventName(EventName)
    setOrganizerName(OrganizerName)
  })

  return (
    <nav className={`${location.pathname === '/' ? "bg-primary" : "bg-[#000000]"} text-white flex items-center justify-between px-6 py-3`}>
      <a href='/' className="flex items-center space-x-2 text-lg font-bold">
        <span className="text-blue-500 text-2xl">🌐</span>
        <span className='text-sm'>Avenue</span>
      </a>

      {location.pathname.startsWith('/info') ? (
        <div className="flex space-x-3 bg-opacity-50 rounded-full py-1 px-1">
          <span className="flex items-center space-x-4">
            <span className="text-[#898989] text-xs">Home</span>
            <span className="text-[#898989] text-xs">/</span>
            <span className="text-white font-bold text-xs"> {eventName.replace(/-/g, ' ')}</span>
          </span>
        </div>
      ) : location.pathname.startsWith('/creater') ? (
        <>
          <div className="flex space-x-3 bg-opacity-50 rounded-full py-1 px-1">
            <span className="flex items-center space-x-4">
              <span className="text-[#898989] text-xs">Home</span>
              <span className="text-[#898989] text-xs">/</span>
              <span className="text-[#898989] text-xs">{eventName.replace(/-/g, ' ')}</span>
              <span className="text-[#898989] text-xs">/</span>
              <span className="text-white font-bold text-xs">{organizerName.replace(/-/g, ' ')}</span>
            </span>
          </div>
        </>
      ) : (
        <div className="flex space-x-3 bg-[#4e4e4e] bg-opacity-50 rounded-full py-1 px-1">
          <button
            onClick={() => setActiveButton('Explore')}
            className={`px-4 py-2 text-xs rounded-full font-bold transition ${activeButton === 'Explore'
              ? 'bg-[#F0F0F0] bg-opacity-10 text-white'
              : 'text-white hover:bg-[#F0F0F0] hover:bg-opacity-10'
              }`}
          >
            Explore
          </button>
          <button
            onClick={() => setActiveButton('Create')}
            className={`px-4 py-2 text-xs rounded-full font-bold transition ${activeButton === 'Create'
              ? 'bg-[#F0F0F0] bg-opacity-10 text-white'
              : 'text-white hover:bg-[#F0F0F0] hover:bg-opacity-10'
              }`}
          >
            Create
          </button>
        </div>
      )}

      {
        location.pathname === '/info/:name' || location.pathname === '/creater/:id' ? (
          <div className="flex space-x-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#4e4e4e] bg-opacity-50 text-xs text-white px-5 py-1 rounded-full font-bold hover:bg-[#4e4e4e] transition"
            >
              Explore
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-black px-5 py-1 rounded-full font-medium hover:bg-gray-200 transition flex items-center space-x-2"
            >
              <FaRegCalendarAlt className="text-black h-4 w-4" />
              <span className='text-xs'>Create Event</span>
            </button>
            <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
          </div>
        ) : (
          <>
            {
              userId ? (
                <div className="flex space-x-4">
                  <button
                    onClick={() => { }}
                    className="bg-white text-xs text-black px-5 py-2 rounded-full font-bold hover:bg-gray-200 transition"
                  >
                    Profile
                  </button>
                  <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
                </div>
              ) : (
                <div className="flex space-x-4">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-white text-xs text-black px-5 py-2 rounded-full font-bold hover:bg-gray-200 transition"
                  >
                    Log in
                  </button>
                  <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
                </div>
              )
            }
          </>

        )
      }
    </nav>
  );
};

export default Header;
