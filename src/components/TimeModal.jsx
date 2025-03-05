import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Dropdown, DropdownTrigger, DropdownContent, DropdownItem } from './ui/Dropdown';

const TimeModal = ({ isOpen, onClose, onTimeChange }) => {
    const [selectedHour, setSelectedHour] = useState('12');
    const [selectedMinute, setSelectedMinute] = useState('00');
    const [selectedPeriod, setSelectedPeriod] = useState('PM');
    const [activeButton, setActiveButton] = useState('');

    if (!isOpen) return null;

    const hours = Array.from({ length: 12 }, (_, i) => ({
        label: (i + 1).toString().padStart(2, '0'),
        value: (i + 1).toString().padStart(2, '0')
    }));

    const minutes = Array.from({ length: 60 }, (_, i) => ({
        label: i.toString().padStart(2, '0'),
        value: i.toString().padStart(2, '0')
    }));

    const periods = [
        { label: 'AM', value: 'AM' },
        { label: 'PM', value: 'PM' }
    ];

    const handleQuickSelect = (option) => {
        setActiveButton(option);
        const now = new Date();

        switch (option) {
            case 'now':
                setSelectedHour(now.getHours() % 12 || 12);
                setSelectedMinute(now.getMinutes().toString().padStart(2, '0'));
                setSelectedPeriod(now.getHours() >= 12 ? 'PM' : 'AM');
                break;
            case 'evening':
                setSelectedHour('07');
                setSelectedMinute('00');
                setSelectedPeriod('PM');
                break;
            case 'night':
                setSelectedHour('09');
                setSelectedMinute('00');
                setSelectedPeriod('PM');
                break;
            case 'midnight':
                setSelectedHour('12');
                setSelectedMinute('00');
                setSelectedPeriod('AM');
                break;
            default:
                break;
        }
    };

    const handleConfirm = () => {
        const timeString = `${selectedHour}:${selectedMinute} ${selectedPeriod}`;
        onTimeChange(timeString);
        onClose();
    };

    const clearSelection = () => {
        setSelectedHour('12');
        setSelectedMinute('00');
        setSelectedPeriod('PM');
        setActiveButton('');
    };

    return (
        <div className="fixed inset-0 z-50">
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xs">
                <div className="bg-[#151515] text-white p-4 rounded-xl w-[300px] shadow-xl">
                    <div className="flex justify-between items-center">
                        <h2 className="text-md font-semibold text-white font-inter">Select time</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex flex-col items-start mb-8">
                        <p className="text-gray-400 text-xs mt-1.5 font-inter">What time do you want to set?</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                        <button
                            onClick={() => handleQuickSelect('now')}
                            className={`px-3 py-2 rounded-full border text-xs hover:border-white/10 ${activeButton === 'now' ? 'bg-white text-black' : 'border-white/5'}`}
                        >
                            Now
                        </button>
                        <button
                            onClick={() => handleQuickSelect('evening')}
                            className={`px-3 py-2 rounded-full border text-xs hover:border-white/10 ${activeButton === 'evening' ? 'bg-white text-black' : 'border-white/5'}`}
                        >
                            Evening (7 PM)
                        </button>
                        <button
                            onClick={() => handleQuickSelect('night')}
                            className={`px-3 py-2 rounded-full border text-xs hover:border-white/10 ${activeButton === 'night' ? 'bg-white text-black' : 'border-white/5'}`}
                        >
                            Night (9 PM)
                        </button>
                        <button
                            onClick={() => handleQuickSelect('midnight')}
                            className={`px-3 py-2 rounded-full border text-xs hover:border-white/10 ${activeButton === 'midnight' ? 'bg-white text-black' : 'border-white/5'}`}
                        >
                            Midnight
                        </button>
                    </div>

                    <div className="text-xs text-[#888888] mb-4">Or select specific time</div>

                    <div className="flex justify-center items-center gap-2 mb-6">
                        <Dropdown>
                            <DropdownTrigger>
                                <button className="w-20 bg-transparent border border-white/5 rounded-lg p-2 text-sm">
                                    {selectedHour}
                                </button>
                            </DropdownTrigger>
                            <DropdownContent className="bg-[#151515] border border-white/5 rounded-lg py-1 mt-1 max-h-[200px] overflow-auto">
                                {hours.map((hour) => (
                                    <DropdownItem
                                        key={hour.value}
                                        onClick={() => setSelectedHour(hour.value)}
                                        className="px-3 py-1.5 hover:bg-white/5 text-sm cursor-pointer"
                                    >
                                        {hour.label}
                                    </DropdownItem>
                                ))}
                            </DropdownContent>
                        </Dropdown>

                        <span className="text-xl">:</span>

                        <Dropdown>
                            <DropdownTrigger>
                                <button className="w-20 bg-transparent border border-white/5 rounded-lg p-2 text-sm">
                                    {selectedMinute}
                                </button>
                            </DropdownTrigger>
                            <DropdownContent className="bg-[#151515] border border-white/5 rounded-lg py-1 mt-1 max-h-[200px] overflow-auto">
                                {minutes.map((minute) => (
                                    <DropdownItem
                                        key={minute.value}
                                        onClick={() => setSelectedMinute(minute.value)}
                                        className="px-3 py-1.5 hover:bg-white/5 text-sm cursor-pointer"
                                    >
                                        {minute.label}
                                    </DropdownItem>
                                ))}
                            </DropdownContent>
                        </Dropdown>

                        <Dropdown>
                            <DropdownTrigger>
                                <button className="w-20 bg-transparent border border-white/5 rounded-lg p-2 text-sm">
                                    {selectedPeriod}
                                </button>
                            </DropdownTrigger>
                            <DropdownContent className="bg-[#151515] border border-white/5 rounded-lg py-1 mt-1">
                                {periods.map((period) => (
                                    <DropdownItem
                                        key={period.value}
                                        onClick={() => setSelectedPeriod(period.value)}
                                        className="px-3 py-1.5 hover:bg-white/5 text-sm cursor-pointer"
                                    >
                                        {period.label}
                                    </DropdownItem>
                                ))}
                            </DropdownContent>
                        </Dropdown>
                    </div>

                    <div className="flex flex-col gap-2">
                        <button
                            onClick={handleConfirm}
                            className="w-full py-3 bg-white text-black rounded-full text-xs font-medium hover:bg-gray-100"
                        >
                            Confirm time
                        </button>
                        <button
                            className="w-full py-3 border border-[#232323] rounded-full text-xs text-center text-white hover:text-white"
                            onClick={clearSelection}
                        >
                            Clear selection
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimeModal;