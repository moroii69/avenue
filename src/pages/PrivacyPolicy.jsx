import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="bg-primary min-h-screen flex items-center justify-center p-6">
            <div className="max-w-6xl mx-auto p-6 py-20 bg-primary">
                <h1 className="text-3xl md:text-4xl font-semibold text-left text-white">
                    Avenue Ticketing, Inc. Privacy Policy
                </h1>
                <hr className="border-white/20 my-4" />
                <p className="text-white/50 text-md md:text-base text-justify leading-relaxed font-semibold">
                    Effective Date: January 28th 2025
                </p>
                <p className="text-white/50 text-md md:text-base text-justify leading-relaxed font-semibold">
                    Last Modified: January 28th 2025
                </p>
                <br />
                <p className="text-white/50 text-md md:text-base text-justify leading-relaxed font-semibold">
                    Avenue Ticketing, Inc. ("Avenue," "we," "us," or "our") values your privacy.
                    This Privacy Policy outlines how we collect, use, store, and share your
                    information when you use our services, including our website www.avenue.tickets,
                    mobile applications, and any related features (collectively, the "Services").
                    <br />
                    By accessing or using our Services, you agree to this Privacy Policy.
                    If you do not agree, you must not use our Services.
                </p>
                <br />
                <p className="text-white/50 text-md md:text-base text-justify leading-relaxed font-semibold">
                    1. Summary of Data Collection & Disclosure
                </p>
                <p className="text-white/50 text-xs md:text-base text-justify leading-relaxed">
                    To provide transparency, below is a summary of the types of data Avenue collects, whether it is disclosed, and whether it is sold.
                </p>
                <div className="overflow-x-auto mt-5">
                    <table className="w-full border border-white/20 text-white">
                        <thead>
                            <tr className="bg-white/10 text-left">
                                <th className="p-3 border border-white/20">Data Type</th>
                                <th className="p-3 border border-white/20">Do We Collect?</th>
                                <th className="p-3 border border-white/20">Do We Disclose?</th>
                                <th className="p-3 border border-white/20">Do We Sell?</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="hover:bg-white/10">
                                <td className="p-3 border border-white/20">Identifiers (Name, Email, Phone, Address, Account Name)</td>
                                <td className="p-3 border border-white/20">Yes</td>
                                <td className="p-3 border border-white/20">Yes</td>
                                <td className="p-3 border border-white/20">No</td>
                            </tr>
                            <tr className="hover:bg-white/10">
                                <td className="p-3 border border-white/20">Payment Information (Credit/Debit Card, Bank Account)</td>
                                <td className="p-3 border border-white/20">Yes (via third-party processors)</td>
                                <td className="p-3 border border-white/20">Yes</td>
                                <td className="p-3 border border-white/20">No</td>
                            </tr>
                            <tr className="hover:bg-white/10">
                                <td className="p-3 border border-white/20">Commercial Information (Transactions, Purchase History)</td>
                                <td className="p-3 border border-white/20">Yes</td>
                                <td className="p-3 border border-white/20">Yes</td>
                                <td className="p-3 border border-white/20">No</td>
                            </tr>
                            <tr className="hover:bg-white/10">
                                <td className="p-3 border border-white/20">Geolocation Data</td>
                                <td className="p-3 border border-white/20">Yes (if enabled)</td>
                                <td className="p-3 border border-white/20">Yes</td>
                                <td className="p-3 border border-white/20">No</td>
                            </tr>
                            <tr className="hover:bg-white/10">
                                <td className="p-3 border border-white/20">Online Activity (Browsing, Search, Interactions)</td>
                                <td className="p-3 border border-white/20">Yes</td>
                                <td className="p-3 border border-white/20">Yes</td>
                                <td className="p-3 border border-white/20">No</td>
                            </tr>
                            <tr className="hover:bg-white/10">
                                <td className="p-3 border border-white/20">Inferences (Preferences, Interests)</td>
                                <td className="p-3 border border-white/20">Yes</td>
                                <td className="p-3 border border-white/20">Yes</td>
                                <td className="p-3 border border-white/20">No</td>
                            </tr>
                            <tr className="hover:bg-white/10">
                                <td className="p-3 border border-white/20">Audio, Visual Data (Profile Photos)</td>
                                <td className="p-3 border border-white/20">Yes (optional)</td>
                                <td className="p-3 border border-white/20">Yes</td>
                                <td className="p-3 border border-white/20">No</td>
                            </tr>
                            <tr className="hover:bg-white/10">
                                <td className="p-3 border border-white/20">Biometric Information (Face Imagery)</td>
                                <td className="p-3 border border-white/20">No</td>
                                <td className="p-3 border border-white/20">No</td>
                                <td className="p-3 border border-white/20">No</td>
                            </tr>
                            <tr className="hover:bg-white/10">
                                <td className="p-3 border border-white/20">Protected Class Information (Age, Gender, etc.)</td>
                                <td className="p-3 border border-white/20">No</td>
                                <td className="p-3 border border-white/20">No</td>
                                <td className="p-3 border border-white/20">No</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <br />
                <p className="text-white/50 text-md md:text-base text-justify leading-relaxed font-semibold">
                    2. Information We Collect
                </p>
                <p className="text-white/50 text-md md:text-base text-justify leading-relaxed font-semibold">
                    2.1 Personal Data
                </p>
                <p className="text-white/50 text-md md:text-base text-justify leading-relaxed font-semibold">
                    We may collect the following types of personal data:
                </p>
                <div className="max-w-5xl mx-auto">
                    <ul className="list-disc list-inside text-white/60 space-y-2">
                        <li>Identifiers: Name, email, phone number, billing/shipping address, and username.</li>
                        <li>Payment Information: Processed through third-party providers like Stripe; Avenue does not store payment details.</li>
                        <li>Account Credentials: Passwords or authentication methods.</li>
                        <li>Social Media Data: If you link your social accounts to our platform.</li>
                        <li>User-Generated Content: Event details, profile photos, and other materials you upload.</li>
                        <li>Geolocation Data: If enabled, we may collect location information.</li>
                    </ul>
                </div>
                <br />
                <p className="text-white/50 text-md md:text-base text-justify leading-relaxed font-semibold">
                    2.2 Non-Personal Data
                </p>
                <div className="max-w-5xl mx-auto">
                    <ul className="list-disc list-inside text-white/60 space-y-2">
                        <li>Device Information: IP address, browser type, and operating system</li>
                        <li>Usage Data: Pages viewed, time spent on our site, and interactions with the platform.</li>
                        <li>Cookies & Tracking Technologies: Used for analytics, security, and personalization.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
