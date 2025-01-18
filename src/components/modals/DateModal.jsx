import React, { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import VerificationModal from './VerificationModal';
import { Slider, Switch } from 'antd';


const DateModal = ({ isOpen, onClose, onDateChange }) => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectionMode, setSelectionMode] = useState('start');
    const [activeButton, setActiveButton] = useState('');

    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    useEffect(() => {
        if (isOpen) {
            onDateChange(startDate, endDate);
        }
    }, [startDate, endDate, onDateChange, isOpen]);

    if (!isOpen) return null;

    const daysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const startDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const handleDateClick = (day) => {
        const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);

        if (selectionMode === 'start') {
            setStartDate(selectedDate);
            setEndDate(null);
            setSelectionMode('end');
        } else {
            if (selectedDate < startDate) {
                setStartDate(selectedDate);
                setEndDate(null);
            } else {
                setEndDate(selectedDate);
                setSelectionMode('start');
            }
        }
    };

    const handleQuickSelect = (option) => {
        const today = new Date();
        let start = new Date();
        let end = new Date();

        setActiveButton(option);

        switch (option) {
            case 'today':
                setStartDate(start);
                setEndDate(start);
                break;
            case 'tomorrow':
                start.setDate(today.getDate() + 1);
                setStartDate(start);
                setEndDate(start);
                break;
            case 'thisWeek':
                while (start.getDay() !== 0) start.setDate(start.getDate() - 1);
                while (end.getDay() !== 6) end.setDate(end.getDate() + 1);
                setStartDate(start);
                setEndDate(end);
                break;
            case 'thisMonth':
                start = new Date(today.getFullYear(), today.getMonth(), 1);
                end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                setStartDate(start);
                setEndDate(end);
                break;
        }

        setSelectionMode('start');
    };

    const isDateInRange = (day) => {
        if (!startDate || !endDate) return false;
        const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        return currentDate >= startDate && currentDate <= endDate;
    };

    const isStartDate = (day) => {
        if (!startDate) return false;
        return day === startDate.getDate() &&
            currentMonth.getMonth() === startDate.getMonth() &&
            currentMonth.getFullYear() === startDate.getFullYear();
    };

    const isEndDate = (day) => {
        if (!endDate) return false;
        return day === endDate.getDate() &&
            currentMonth.getMonth() === endDate.getMonth() &&
            currentMonth.getFullYear() === endDate.getFullYear();
    };

    const generateCalendarDays = () => {
        const days = [];
        const totalDays = daysInMonth(currentMonth);
        const startDay = startDayOfMonth(currentMonth);

        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
        }

        for (let day = 1; day <= totalDays; day++) {
            const isToday = day === new Date().getDate() &&
                currentMonth.getMonth() === new Date().getMonth() &&
                currentMonth.getFullYear() === new Date().getFullYear();

            const isInRange = isDateInRange(day);
            const isStart = isStartDate(day);
            const isEnd = isEndDate(day);

            days.push(
                <button
                    key={day}
                    className={`h-8 w-8 rounded-lg flex items-center font-inter justify-center text-xs
                ${isToday ? 'bg-white text-black' : ''}
                ${isInRange ? 'bg-white text-black' : 'hover:bg-gray-800'}
                ${isStart ? 'bg-white text-black' : ''}
                ${isEnd ? 'bg-white text-black' : ''}
                ${isStart || isEnd ? 'ring-2 ring-white' : ''}`}
                    onClick={() => handleDateClick(day)}
                >
                    {day}
                </button>
            );
        }
        return days;
    };

    const previousMonth = () => {
        setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
    };

    const clearSelection = () => {
        setStartDate(null);
        setEndDate(null);
        setSelectionMode('start');
        setActiveButton('')
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
                        <h2 className="text-md font-semibold text-white font-inter">Select date</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex flex-col items-start mb-8">
                        <p className="text-gray-400 text-xs mt-1 font-inter">When do you want to go?</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                        <button
                            onClick={() => handleQuickSelect('today')}
                            className={`px-3 py-2 rounded-full border text-xs hover:border-white/10 ${activeButton === 'today' ? 'bg-white text-black' : 'border-white/5'}`}
                        >
                            Today
                        </button>
                        <button
                            onClick={() => handleQuickSelect('tomorrow')}
                            className={`px-3 py-2 rounded-full border text-xs hover:border-white/10 ${activeButton === 'tomorrow' ? 'bg-white text-black' : 'border-white/5'}`}
                        >
                            Tomorrow
                        </button>
                        <button
                            onClick={() => handleQuickSelect('thisWeek')}
                            className={`px-3 py-2 rounded-full border text-xs hover:border-white/10 ${activeButton === 'thisWeek' ? 'bg-white text-black' : 'border-white/5'}`}
                        >
                            This week
                        </button>
                        <button
                            onClick={() => handleQuickSelect('thisMonth')}
                            className={`px-3 py-2 rounded-full border text-xs hover:border-white/10 ${activeButton === 'thisMonth' ? 'bg-white text-black' : 'border-white/5'}`}
                        >
                            This month
                        </button>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                        <div className='text-start'>
                            <span className="text-xs text-[#888888] mb-2">
                                Or select specific date(s)
                            </span><br />
                            <span className="text-sm mb-2">
                                {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button onClick={previousMonth} className="p-3 hover:bg-white/10 rounded-full border border-[#232323]">
                                <ChevronLeft size={14} />
                            </button>
                            <button onClick={nextMonth} className="p-3 hover:bg-white/10 rounded-full border border-[#232323]">
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="grid grid-cols-7 mb-2">
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                <div key={day} className="h-8 flex items-center justify-center text-xs text-gray-400">
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                            {generateCalendarDays()}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <button
                            className="w-full py-3 bg-white text-black rounded-full text-xs font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!startDate || !endDate}
                        >
                            Show events
                        </button>
                        <button
                            className="w-full py-3 border border-[#232323] rounded-full text-xs text-center text-white hover:text-white"
                            onClick={clearSelection}
                        >
                            Clear all selected
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DateModal;