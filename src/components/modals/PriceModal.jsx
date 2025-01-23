import React, { useState } from 'react'
import { X, Globe } from 'lucide-react';
import VerificationModal from './VerificationModal';
import { Slider, Switch } from 'antd';

const PriceModal = ({ isOpen, onClose, sliderValue, setSliderValue, filteredEvents, showFreeOnly, setShowFreeOnly }) => {

    if (!isOpen) return null;

    const handleSliderChange = (value) => {
        setSliderValue(value);
    };

    const formatDisplayValue = (value) => {
        return value.map((val) => (val === 0 ? "Free" : val === 100 ? "All" : `$ ${val}`));
    };


    return (
        <div className="fixed inset-0 z-50">
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xs">
                <div className="bg-[#151515] rounded-xl p-6 shadow-xl relative">
                    <div className="flex justify-between items-center">
                        <h2 className="text-md font-semibold text-white">Price range</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <div className="flex flex-col items-start mb-8">
                        <p className="text-gray-400 text-xs mt-1.5">Show events within your budget</p>
                    </div>

                    <div className="mb-6">
                        <Slider
                            range
                            defaultValue={sliderValue}
                            min={0}
                            max={100}
                            onChange={handleSliderChange}
                            className="text-black"
                            tooltip={{
                                formatter: (val) => (val === 0 ? "Free" : val === 100 ? "All" : `$ ${val}`),
                            }}
                            disabled={showFreeOnly}
                            trackStyle={{ backgroundColor: '#34b2da' }}
                            railStyle={{ backgroundColor: '#2a2a2a' }} 
                            handleStyle={{
                                backgroundColor: '#141414',
                                borderColor: '#34b2da'
                            }}
                        />

                    </div>

                    <div className="flex justify-between mb-6">
                        <input
                            type="text"
                            value={formatDisplayValue(sliderValue)[0]}
                            readOnly
                            className={`w-[48%] p-3 text-xs rounded-xl ${showFreeOnly ? "bg-[#cacaca] bg-opacity-10 text-[#cccccc]" : "bg-[#151515]"} bg-[#151515] border border-[#222222] text-white focus:outline-none"`}
                            placeholder="$0"
                            disabled={showFreeOnly}
                        />
                        <input
                            type="text"
                            value={formatDisplayValue(sliderValue)[1]}
                            readOnly
                            className={`w-[48%] p-3 text-xs rounded-xl ${showFreeOnly ? "bg-[#cacaca] bg-opacity-10 text-[#cccccc]" : "bg-[#151515]"} bg-[#151515] border border-[#222222] text-white focus:outline-none"`}
                            placeholder="$1,000"
                            disabled={showFreeOnly}
                        />
                    </div>
                    <label className="flex items-center gap-3 mb-6 cursor-pointer">
                        <div
                            className={`relative w-9 h-5 rounded-full transition-colors duration-200 ease-in-out ${showFreeOnly ? 'bg-blue-500' : 'bg-gray-600'
                                }`}
                            onClick={() => setShowFreeOnly(!showFreeOnly)}
                        >
                            <div
                                className={`absolute w-4 h-4 bg-white rounded-full top-0.5 transition-transform duration-200 ease-in-out ${showFreeOnly ? 'translate-x-4 left-0.5' : 'left-0.5'
                                    }`}
                            />
                        </div>
                        <span className="text-sm text-white">Show free events only</span>
                    </label>

                    <button
                        onClick={onClose}
                        className={`w-full rounded-full px-4 py-3 transition duration-200 bg-white text-black hover:bg-[#f2f2f2] text-xs`}
                    >
                        See {filteredEvents} matching events
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PriceModal;