import React, { useState, useRef, useEffect } from 'react';
import { X, Globe } from 'lucide-react';
import { Modal } from 'antd';
import url from '../../constants/url';
import axios from 'axios';

const VerificationModal = ({ isOpen, onClose, phoneNumber }) => {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef([...Array(6)].map(() => React.createRef()));
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [countdown, setCountdown] = useState(null);


    const handleChange = (index, value) => {
        if (value.length > 1) return;
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        if (newCode.every((digit) => digit !== '')) {
            handleVerify(newCode);
        }

        if (value && index < 5) {
            inputRefs.current[index + 1].current.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1].current.focus();
        }
    };

    const numberWithCode = "+1" + phoneNumber;

    const handleVerify = async (updatedCode) => {
        const otp = updatedCode.join('');
        if (otp.length < 6) {
            return;
        }
        try {
            const response = await axios.post(`${url}/auth/verify-otp`, {
                phone: numberWithCode,
                otp
            });
            if (response.data.success) {
                const { userID, authToken, user, organizer } = response.data;
                if (userID && authToken) {
                    localStorage.setItem('userID', userID);
                    localStorage.setItem('authToken', authToken);
                    if (user?.firstName) {
                        localStorage.setItem('userName', user.firstName);
                    }
                    if (organizer) {
                        localStorage.setItem('organizerId', organizer._id);
                        localStorage.setItem('accountId', organizer.stripeAccountId);
                    }
                    setSuccess(true)
                    setError(null);

                    setCountdown(3);
                    const timer = setInterval(() => {
                        setCountdown((prev) => {
                            if (prev === 1) {
                                clearInterval(timer);
                                window.location.reload();
                            }
                            return prev - 1;
                        });
                    }, 1000);
                } else {
                    setError('Invalid OTP');
                }
            } else {
                setError(`Invalid OTP`);
            }
        } catch (error) {
            console.error('Verification failed:', error);
            setError('Invalid OTP');
        }
    };

    useEffect(() => {
        if (isOpen) {
            inputRefs.current[0].current.focus();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xs">
                <div className="bg-[#151515] rounded-xl p-8 shadow-xl relative flex flex-col items-center">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 text-gray-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                    <Globe className="w-8 h-8 text-cyan-400 mb-4" />
                    <h2 className="text-xl font-semibold text-white mb-2 font-inter">Enter confirmation code</h2>
                    <p className="text-gray-400 text-sm text-center mb-6 font-inter">
                        Please enter verification code we've<br />
                        sent on {phoneNumber}
                    </p>
                    <div className="flex gap-2 mb-6">
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                ref={inputRefs.current[index]}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-10 h-9 bg-[#151515] font-inter rounded-full text-center text-white text-2xl focus:outline-none border border-[#252525]"
                            />
                        ))}
                    </div>
                    {success && (
                        <>
                            <div className="text-green-300 font-inter text-xs bg-green-800 px-16 py-2 bg-opacity-30 border border-green-950 rounded-xl whitespace-nowrap">
                                <p>Logged in successfully! ({countdown})</p>
                            </div>
                        </>
                    )}
                    {error && (
                        <div className="text-red-300 font-inter text-xs bg-red-800 px-16 py-2 bg-opacity-30 border border-red-950 rounded-xl">
                            {error}
                        </div>
                    )}
                    <button className="text-gray-200 text-sm underline mt-5 font-inter">
                        Resend code
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerificationModal;