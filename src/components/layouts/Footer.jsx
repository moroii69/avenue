import React from 'react'
import { BiCalendarCheck } from 'react-icons/bi'
import { BsLinkedin, BsTwitter, BsYoutube } from 'react-icons/bs'
import { HiHandRaised } from 'react-icons/hi2'
import { LiaLinkedinIn } from 'react-icons/lia'

const Footer = () => {
    return (
        <>
            <div className='bg-primary'>
                <div className="relative isolate overflow-hidden bg-gradient-to-b from-[#141414] via-[#0D0D0D] to-primary py-16 sm:py-24 lg:py-8 rounded-t-3xl">
                    <div className="mx-auto max-w-7xl md:max-w-6xl px-6 py-10 lg:px-8 bg-[#141414] rounded-2xl border border-[#242424]">
                        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
                            <div className="max-w-xl lg:max-w-lg">
                                <h2 className="text-4xl font-medium tracking-tight text-white">
                                    Subscribe to our newsletter
                                </h2>
                                <p className="mt-4 text-lg text-gray-300">
                                    Nostrud amet eu ullamco nisi aute in ad minim nostrud
                                    adipisicing velit quis. Duis tempor incididunt dolore.
                                </p>
                                <div className="mt-6 flex max-w-md gap-x-4">
                                    <label htmlFor="email-address" className="sr-only">
                                        Email address
                                    </label>
                                    <input
                                        id="email-address"
                                        name="email"
                                        type="email"
                                        required
                                        placeholder="example@gmail.com"
                                        autoComplete="email"
                                        className="min-w-0 flex-auto rounded-md border outline-none border-[#323232] bg-[#141414] px-3.5 py-2 text-white shadow-sm sm:text-sm sm:leading-6"
                                    />
                                    <button
                                        type="submit"
                                        className="flex-none rounded-full bg-white px-3.5 py-2.5 text-sm font-semibold text-primary shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                                    >
                                        Sign up
                                    </button>
                                </div>
                            </div>
                            <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:pt-2">
                                <div className="flex flex-col items-start">
                                    <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                                        <BiCalendarCheck
                                            aria-hidden="true"
                                            className="h-6 w-6 text-white"
                                        />
                                    </div>
                                    <dt className="mt-4 font-semibold text-white">
                                        Weekly articles
                                    </dt>
                                    <dd className="mt-2 leading-7 text-gray-400">
                                        Non laboris consequat cupidatat laborum magna. Eiusmod non
                                        irure cupidatat duis commodo amet.
                                    </dd>
                                </div>
                                <div className="flex flex-col items-start">
                                    <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                                        <HiHandRaised
                                            aria-hidden="true"
                                            className="h-6 w-6 text-white"
                                        />
                                    </div>
                                    <dt className="mt-4 font-semibold text-white">No spam</dt>
                                    <dd className="mt-2 leading-7 text-gray-400">
                                        Officia excepteur ullamco ut sint duis proident non
                                        adipisicing. Voluptate incididunt anim.
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8 mt-10">
                        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-64 gap-y-16 lg:max-w-none lg:grid-cols-2">
                            <div className="max-w-xl lg:max-w-lg">
                                <div className="flex items-center space-x-2 text-lg font-bold">
                                    <span className="text-blue-500 text-2xl">🌐</span>
                                    <span className='text-white'>Avenue</span>
                                </div>
                                <p className="mt-4 text-sm text-gray-300">
                                    © Copyright 2025 Avenue,Inc. All rights reserved.
                                </p>

                            </div>
                            <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:pt-2">
                                <div className="flex flex-col items-start">
                                    <h2 className="text-lg font-semibold text-white">Useful links</h2>
                                    <ul className="mt-4 space-y-4 leading-7 text-gray-400">
                                        <li>
                                            <a href="/careers" className="hover:text-white transition-colors duration-200">
                                                Careers
                                            </a>
                                        </li>
                                        <li>
                                            <a href="/terms" className="hover:text-white transition-colors duration-200">
                                                Terms of Service
                                            </a>
                                        </li>
                                        <li>
                                            <a href="/privacy" className="hover:text-white transition-colors duration-200">
                                                Privacy Policy
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="flex flex-col items-start">
                                    <h2 className="text-lg font-semibold text-white">Follow us</h2>
                                    <ul className="mt-4 space-y-4 leading-7 text-gray-400">
                                        <li>
                                            <a
                                                href="https://twitter.com"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 hover:text-white transition-colors duration-200"
                                            >
                                                <BsTwitter color='#00dcea' /> Twitter
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="https://linkedin.com"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 hover:text-white transition-colors duration-200"
                                            >
                                                <BsLinkedin color='#003cea' /> LinkedIn
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="https://youtube.com"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 hover:text-white transition-colors duration-200"
                                            >
                                                <BsYoutube color='#ea1c00' /> YouTube
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-screen md:h-64 relative overflow-hidden">
                        <div className="absolute inset-0">
                            <div className="relative w-full h-full flex items-center justify-center">
                                <h1
                                    className="text-[8rem] sm:text-[10rem] md:text-[14rem] lg:text-[20rem] xl:text-[20rem] 
                                        font-bold text-center w-full leading-none"
                                    style={{
                                        WebkitTextStroke: '1px #333',
                                        WebkitTextFillColor: '#151515'
                                    }}
                                >
                                    avenue
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Footer