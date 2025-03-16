import React, { useState } from 'react';
import { X, Globe } from 'lucide-react';
import VerificationModal from './VerificationModal';
import { Spin } from 'antd';
import url from '../../constants/url';
import axios from 'axios';
import OnboardVerify from './OnboardVerify';

const OnboardStripe = ({ isOpen, onClose, accountLink }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "phone") {
            let phoneValue = value.replace(/\D/g, '');
            if (phoneValue.length <= 10) {
                setPhoneNumber(phoneValue);
                setIsButtonDisabled(phoneValue.length !== 10);
            }
        } else {
            if (name === "name") {
                setName(value);
            } else if (name === "email") {
                setEmail(value);
            }
        }
    };

    const numberWithCode = '+1' + phoneNumber;

    const handleSendOtp = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${url}/auth/send-otp`, { phone: numberWithCode });
            setLoading(false);
            if (response.data.success) {
                setIsVerificationModalOpen(true);
            } else {
                setIsVerificationModalOpen(true);
            }
        } catch (error) {
            setLoading(false);
            console.error(error);
            alert('Failed to send OTP');
        }
    };

    return (
        <div className="fixed inset-0 z-50">
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xs">
                <div className="bg-[#151515] rounded-xl p-8 shadow-xl relative">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 text-gray-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                    <div className="flex flex-col items-center mb-8">
                        <Globe className="w-8 h-8 text-cyan-400 mb-4" />
                        <h2 className="text-2xl font-semibold text-white font-inter">Stripe</h2>
                        <p className="text-gray-400 text-sm mt-1 font-inter">Let's complete your stripe journey</p>
                    </div>
                    <div className="flex flex-col items-center mb-2">
                        <a
                            href={`${accountLink}`}
                            className={`w-full text-center rounded-full px-4 py-3 font-inter transition duration-200 bg-white text-black hover:bg-[#f2f2f2]`}
                        >
                            Complete stripe
                        </a>
                    </div>
                    <div className="flex flex-col items-center mb-2 text-gray-500">
                        <a>or</a>
                    </div>
                    <div className="flex flex-col items-center mb-8 text-white hover:underline">
                        <a>Skip and continue</a>
                    </div>
                    <OnboardVerify
                        isOpen={isVerificationModalOpen}
                        onClose={() => setIsVerificationModalOpen(false)}
                        phoneNumber={phoneNumber}
                    />
                </div>
            </div>
        </div>
    );
};

export default OnboardStripe;
