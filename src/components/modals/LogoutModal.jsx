import React, { useState } from 'react'
import { X, Globe } from 'lucide-react';
import VerificationModal from './VerificationModal';
import { Slider, Switch } from 'antd';

const LogoutModal = ({ isOpen, onClose }) => {
    const [showFreeOnly, setShowFreeOnly] = useState(false);
    const [sliderValue, setSliderValue] = useState([0, 100]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50">
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xs">
                <div className="bg-[#151515] rounded-xl p-6 shadow-xl relative">
                    <div className="flex justify-between items-center">
                        <h2 className="text-md font-semibold text-white font-inter">Are you sure?</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex flex-col items-start mb-4">
                        <p className="text-gray-400 text-xs mt-1 font-inter">you will be logged out from this device</p>
                    </div>

                    <div className="flex justify-between">
                        <button
                            onClick={() => {
                                localStorage.clear();
                                window.location.href = "/";
                            }}
                            className="w-full p-2 font-inter rounded-full bg-[#95000e] text-sm text-white focus:outline-none"
                            placeholder="Type and select from list"
                        >Logout</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogoutModal;