import React from 'react'
import { BiCalendarCheck, BiEnvelope } from 'react-icons/bi'
import { BsLinkedin, BsTwitter, BsYoutube } from 'react-icons/bs'
import { HiHandRaised } from 'react-icons/hi2'
import { LiaLinkedinIn } from 'react-icons/lia';
import newsLetter from "../../assets/home-subscribe.png"
import homeName from "../../assets/home-name.png"

const Footer = () => {
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
                                    Nostrud amet eu ullamco nisi aute in ad minim nostrud
                                    adipisicing velit quis. Duis tempor incididunt dolore.
                                </p>
                                <div className="mt-10 flex flex-col sm:flex-row max-w-xs sm:max-w-md gap-x-4">
                                    <label htmlFor="email-address" className="sr-only">
                                        Email address
                                    </label>
                                    <div className="relative w-full sm:w-auto">
                                        <input
                                            id="email-address"
                                            name="email"
                                            type="email"
                                            required
                                            placeholder="example@gmail.com"
                                            autoComplete="email"
                                            className="min-w-0 flex-auto rounded-md border outline-none border-[#272727] bg-[#141414] px-3.5 py-1 text-white shadow-sm sm:text-sm sm:leading-6 pl-10"
                                        />
                                        <div className="absolute left-3 top-3 transform -translate-y-1 text-white text-opacity-60">
                                            <BiEnvelope className="h-5 w-5" />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="flex-none mt-4 sm:mt-0 font-inter rounded-full bg-white px-3.5 py-1 text-sm font-medium text-primary shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                                    >
                                        Sign up
                                    </button>
                                </div>
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
                                    <span className="text-blue-500 text-2xl">🌐</span>
                                    <span className='text-white font-inter'>Avenue</span>
                                </div>
                                <p className="mt-4 text-sm text-gray-300 font-inter">
                                    © Copyright 2025 Avenue,Inc. All rights reserved.
                                </p>

                            </div>
                            <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:pt-2">
                                <div className="flex flex-col items-start">
                                    <h2 className="text-lg font-semibold text-white font-inter">Useful links</h2>
                                    <ul className="mt-4 space-y-3 leading-7 text-gray-400">
                                        <li>
                                            <a href="/careers" className="hover:text-white transition-colors duration-200 font-inter">
                                                Careers
                                            </a>
                                        </li>
                                        <li>
                                            <a href="/terms" className="hover:text-white transition-colors duration-200 font-inter">
                                                Terms of Service
                                            </a>
                                        </li>
                                        <li>
                                            <a href="/privacy" className="hover:text-white transition-colors duration-200 font-inter">
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
                                                href="https://twitter.com"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 hover:text-white transition-colors duration-200 font-inter"
                                            >
                                                <BsTwitter color='#00dcea' /> Twitter
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="https://linkedin.com"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 hover:text-white transition-colors duration-200 font-inter"
                                            >
                                                <BsLinkedin color='#003cea' /> LinkedIn
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="https://youtube.com"
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