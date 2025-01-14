import React, { useState } from 'react';
import LoginModal from '../modals/LoginModal';

const Header2 = () => {
  const [activeButton, setActiveButton] = useState('Explore');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <nav className="bg-primary text-white flex items-center justify-between px-6 py-3">
      <div className="flex items-center space-x-2 text-lg font-bold">
        <span className="text-blue-500 text-2xl">🌐</span>
        <span>Avenue</span>
      </div>
      <div className="flex space-x-3 bg-[#4e4e4e] bg-opacity-50 rounded-full py-1 px-1">
        <button
          onClick={() => setActiveButton('Explore')}
          className={`px-5 py-2 rounded-full font-bold transition ${activeButton === 'Explore'
            ? 'bg-[#F0F0F0] bg-opacity-10 text-white'
            : 'text-white hover:bg-[#F0F0F0] hover:bg-opacity-10'
            }`}
        >
          Explore
        </button>
        <button
          onClick={() => setActiveButton('Create')}
          className={`px-5 py-2 rounded-full font-bold transition ${activeButton === 'Create'
            ? 'bg-[#F0F0F0] bg-opacity-10 text-white'
            : 'text-white hover:bg-[#F0F0F0] hover:bg-opacity-10'
            }`}
        >
          Create
        </button>
      </div>

      <div className="flex space-x-4">
        {/* <button className="text-white border border-[#5c5c5c] px-5 py-2 rounded-full hover:bg-white hover:text-black transition">
          Log in
        </button> */}
        <button onClick={() => setIsModalOpen(true)} className="bg-white text-black px-5 py-2 rounded-full font-bold hover:bg-gray-200 transition">
          Log in
        </button>
        <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </nav>
  );
};

export default Header2;
