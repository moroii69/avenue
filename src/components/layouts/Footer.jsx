import React, { useState } from 'react'
import { BiCalendarCheck, BiEnvelope } from 'react-icons/bi'
import { BsLinkedin, BsTwitter, BsYoutube } from 'react-icons/bs'
import { HiHandRaised } from 'react-icons/hi2'
import { LiaLinkedinIn } from 'react-icons/lia';
import newsLetter from "../../assets/home-subscribe.png"
import homeName from "../../assets/home-name.png"
import logo from "../../assets/logo.png"
import url from "../../constants/url"
import axios from 'axios';
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
    const [email, setEmail] = useState("");
    const [showNotifier, setShowNotifier] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { email };

        try {
            const response = await axios.post(`${url}/subscribe/add-subscribe`, payload);
            if (response.status === 201) {
                setEmail("")
                setShowNotifier(true)
                setTimeout(() => {
                    setShowNotifier(false);
                }, 2000);
            } else {
                alert("Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Error saving email:", error);
            alert("Failed to save email. Please check the console for details.");
        }
    };

    return (
        <>
            <div className='bg-primary'>
                <div className="relative isolate overflow-hidden bg-gradient-to-b bg-opacity-75 from-[#0f0f0f] via-[#0D0D0D] to-[#0D0D0D] py-16 sm:py-24 lg:py-8 rounded-t-3xl">

                    <div className="mx-auto max-w-8xl md:max-w-5xl lg:max-w-6xl px-6 py-3 lg:px-8 bg-[#141414] rounded-2xl border border-[#242424]">
                        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
                            <div className="max-w-xl lg:max-w-lg mt-10">
                                <h2 className="text-4xl font-inter font-medium tracking-tight text-white">
                                    Subscribe to our newsletter
                                </h2>
                                <p className="mt-4 text-xs font-inter text-gray-300 w-80">
                                    Enter your email below:
                                </p>
                                <div className="mt-10 flex flex-col sm:flex-row max-w-xs sm:max-w-md gap-x-4">
                                    <label htmlFor="email-address" className="sr-only">
                                        Email address
                                    </label>
                                    <form onSubmit={handleSubmit} className="relative w-full sm:w-auto">
                                        <input
                                            id="email-address"
                                            name="email"
                                            type="email"
                                            required
                                            placeholder="example@gmail.com"
                                            autoComplete="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="min-w-0 flex-auto rounded-md border outline-none border-[#272727] bg-[#141414] px-3.5 py-1 text-white shadow-sm sm:text-sm sm:leading-6 pl-10"
                                        />
                                        <div className="absolute left-3 top-3 transform -translate-y-1 text-white text-opacity-60">
                                            <BiEnvelope className="h-5 w-5" />
                                        </div>
                                        <button
                                            type="submit"
                                            className="flex-none mt-4 sm:mt-0 ml-3 font-inter rounded-full bg-white px-3.5 py-2 text-sm font-medium text-primary shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                                        >
                                            Sign up
                                        </button>
                                    </form>
                                </div>
                                {
                                    showNotifier && (
                                        <>
                                            <div className="bg-green-600 w-full sm:w-64 p-1.5 mt-3 bg-opacity-30 rounded-lg shadow-lg flex items-center justify-center">
                                                <p className="font-inter text-sm text-center text-white">
                                                    Request sent successfully!
                                                </p>
                                            </div>
                                        </>
                                    )
                                }
                            </div>
                            <div className="relative flex items-end justify-center h-full mt-3">
                                <img
                                    src={newsLetter}
                                    alt="Newsletter Graphic"
                                    className="w-[75%] h-auto object-cover mt-0 lg:mt-8 ml-36"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8 mt-10">
                        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-64 gap-y-16 lg:max-w-none lg:grid-cols-2">
                            <div className="max-w-xl lg:max-w-lg">
                                <div className="flex items-center space-x-2 text-lg font-bold">
                                    <a href="/" className="flex items-center space-x-2 text-lg font-bold">
                                        <img src={logo} alt="logo" className="w-14 sm:w-20" />
                                    </a>
                                </div>
                                <p className="mt-4 text-sm text-gray-300 font-inter">
                                    © Copyright 2025 Avenue Ticketing, Inc. All rights reserved.
                                </p>

                            </div>
                            <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:pt-2">
                                <div className="flex flex-col items-start">
                                    <h2 className="text-lg font-semibold text-white font-inter">Useful links</h2>
                                    <ul className="mt-4 space-y-3 leading-7 text-gray-400">
                                        <li>
                                            <a className="hover:text-white transition-colors duration-200 font-inter">
                                                Careers
                                            </a>
                                        </li>
                                        <li>
                                            <a href='/terms-and-conditions' className="hover:text-white transition-colors duration-200 font-inter">
                                                Terms of Service
                                            </a>
                                        </li>
                                        <li>
                                            <a href='/privacy-policy' className="hover:text-white transition-colors duration-200 font-inter">
                                                Privacy Policy
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="flex flex-col items-start">
                                    <h2 className="text-lg font-semibold text-white font-inter">Follow us</h2>
                                    <ul className="mt-4 space-y-3 leading-7 text-gray-400">
                                        <li>
                                            <a

                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 hover:text-white transition-colors duration-200 font-inter"
                                            >
                                                <FaXTwitter color='#00dcea' /> x
                                            </a>
                                        </li>
                                        <li>
                                            <a

                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 hover:text-white transition-colors duration-200 font-inter"
                                            >
                                                <BsLinkedin color='#003cea' /> LinkedIn
                                            </a>
                                        </li>
                                        <li>
                                            <a

                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 hover:text-white transition-colors duration-200 font-inter"
                                            >
                                                <BsYoutube color='#ea1c00' /> YouTube
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='mt-20'>
                        <img
                            src={homeName}
                            alt="image"
                            className="w-full h-auto md:h-full object-cover"
                        />
                    </div>

                </div>
            </div>
        </>
    )
}

export default Footer