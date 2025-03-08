import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="bg-primary min-h-screen flex items-center justify-center p-6">
            <div className="max-w-7xl mx-auto p-6 py-20 bg-primary">
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
                <br />
                <p className="text-white/50 text-md md:text-base text-justify leading-relaxed font-semibold">
                    3. How We Use Your Information
                </p>
                <p className="text-white/50 text-md md:text-base text-justify leading-relaxed font-semibold">
                    We use your data to:
                </p>
                <div className="max-w-5xl mx-auto">
                    <ul className="list-disc list-inside text-white/60 space-y-2">
                        <li>Provide and improve our Services.</li>
                        <li>Process payments and issue refunds</li>
                        <li>Prevent fraud and enhance security.</li>
                        <li>Send promotional emails and event notifications (you may opt out).</li>
                        <li>Comply with legal obligations</li>
                        <li>Conduct analytics and improve user experience.</li>
                    </ul>
                </div>
                <br />
                <p className="text-white/50 text-md md:text-base text-justify leading-relaxed font-semibold">
                    Legal Basis for Processing:
                </p>
                <div className="max-w-5xl mx-auto">
                    <ul className="list-disc list-inside text-white/60 space-y-2">
                        <li>Your consent (e.g., for marketing emails).</li>
                        <li>Performance of a contract (e.g., processing ticket purchases).</li>
                        <li>Legitimate interest (e.g., fraud prevention and analytics).</li>
                        <li>Compliance with legal requirements.</li>
                    </ul>
                </div>
                <br />
                <p className="text-white/50 text-md md:text-base text-justify leading-relaxed font-semibold">
                    4. Sharing Your Information
                </p>
                <p className="text-white/50 text-md md:text-base text-justify leading-relaxed font-semibold">
                    We do not sell your Personal Data. However, we may share it:
                </p>
                <div className="max-w-5xl mx-auto">
                    <ul className="list-disc list-inside text-white/60 space-y-2">
                        <li>With Event Organizers: When you purchase tickets</li>
                        <li>With Service Providers: Payment processors, marketing tools, analytics services.</li>
                        <li>With Legal Authorities: If required by law.</li>
                        <li>In Business Transfers: If Avenue is acquired or merged with another entity.</li>
                        <li>With Affiliates and Subsidiaries: Entities under our common ownership.</li>
                    </ul>
                </div>
                <br />
                <p className="text-white/50 text-md md:text-base text-justify leading-relaxed font-semibold">
                    5. Your Rights & How to Exercise Them
                </p>
                <p className="text-white/50 text-md md:text-base text-justify leading-relaxed font-semibold">
                    Users may exercise the following rights under applicable privacy laws:
                </p>
                <div className="max-w-5xl mx-auto">
                    <ul className="list-disc list-inside text-white/60 space-y-2">
                        <li>Right to Access: Request a copy of your data.</li>
                        <li>Right to Correct: Update inaccurate or incomplete data.</li>
                        <li>Right to Delete: Request deletion of your personal information.</li>
                        <li>Right to Restrict Processing: Limit how we use your data.</li>
                        <li>Right to Object: Opt out of marketing communications.</li>
                        <li>Right to Data Portability: Receive your data in a usable format.</li>
                        <li>Right to Opt-Out of Sale: We do not sell personal data, but you can still request to opt out of data sharing</li>
                    </ul>
                </div>
                <br />
                <p className="text-white/50 text-md md:text-base text-justify leading-relaxed font-semibold">
                    To exercise your rights, contact privacy@avenue.tickets. We will respond within 45 days (extendable to 90 days if necessary).
                </p>
                <br />
                <p className="text-white/50 text-md md:text-base text-justify leading-relaxed font-semibold">
                    6. Compliance with State & International Laws
                </p>
                <p className="text-white/50 text-md md:text-base text-justify leading-relaxed font-semibold">
                    California, Virginia, and Nevada Privacy Rights
                </p>
                <div className="max-w-5xl mx-auto">
                    <ul className="list-disc list-inside text-white/60 space-y-2">
                        <li>Avenue complies with the California Consumer Privacy Act (CCPA), Virginia Consumer Data Protection Act (VCDPA), and Nevada online privacy laws.</li>
                        <li>California residents may request access to their data and deletion of personal information.</li>
                    </ul>
                </div>
                <br />
                <p className="text-white/50 text-md md:text-base text-justify leading-relaxed font-semibold">
                    General Data Protection Regulation (GDPR) Compliance
                </p>
                <p className="text-white/50 text-md md:text-base text-justify leading-relaxed font-semibold">
                    If you reside in the European Economic Area (EEA), you have additional rights under GDPR, including:
                </p>
                <div className="max-w-5xl mx-auto">
                    <ul className="list-disc list-inside text-white/60 space-y-2">
                        <li>The right to restrict processing.</li>
                        <li>The right to withdraw consent.</li>
                        <li>The right to file a complaint with a data protection authority</li>
                    </ul>
                </div>
                <br />
                <p className="text-white/50 text-md md:text-base text-justify leading-relaxed font-semibold">
                    7. Security Measures & Data Retention
                </p>
                <p className="text-white/50 text-md md:text-base text-justify leading-relaxed font-semibold">
                    We implement industry-standard security measures, including:
                </p>
                <div className="max-w-5xl mx-auto">
                    <ul className="list-disc list-inside text-white/60 space-y-2">
                        <li>Encryption: Protects sensitive data</li>
                        <li>Access Controls: Limits access to authorized personnel only</li>
                        <li>Regular Security Audits: To identify and mitigate risks.</li>
                    </ul>
                </div>
                <br />
                <p className="text-white/50 text-md md:text-base text-justify leading-relaxed font-semibold">
                    However, no method is 100% secure. Users should also take precautions to protect their accounts.
                </p>
                <p className="text-white/50 text-md md:text-base text-justify leading-relaxed font-semibold">
                    Data Retention
                </p>
                <p className="text-white/50 text-md md:text-base text-justify leading-relaxed font-semibold">
                    We retain data based on the following policies:
                </p>
                <div className="max-w-5xl mx-auto">
                    <ul className="list-disc list-inside text-white/60 space-y-2">
                        <li>Account Information: Until you delete your account.</li>
                        <li>Transaction Data: Retained for tax and legal compliance.</li>
                        <li>Marketing Data: Until you opt out.</li>
                        <li>Aggregated Data: May be stored indefinitely for analytics</li>
                    </ul>
                </div>
                <br />
                <p className="text-white/50 text-md md:text-base text-justify leading-relaxed font-semibold">
                    8. Cookies, Tracking & Do Not Track (DNT)
                </p>
                <p className="text-white/50 text-md md:text-base text-justify leading-relaxed font-semibold">
                    Avenue uses cookies to enhance user experience. Types of cookies we use:
                </p>
                <div className="max-w-5xl mx-auto">
                    <ul className="list-disc list-inside text-white/60 space-y-2">
                        <li>Essential Cookies: Required for platform functionality.</li>
                        <li>Performance Cookies: Track website performance and analytics.</li>
                        <li>Advertising Cookies: Deliver relevant ads.</li>
                    </ul>
                </div>
                <p className="text-white/50 text-md md:text-base text-justify leading-relaxed font-semibold">
                    Do Not Track: Avenue does not track users across third-party websites for targeted advertising.
                </p>
                <br />
                <p className="text-white/50 text-md md:text-base text-justify leading-relaxed font-semibold">
                    9. Security Breach Notification
                </p>
                <p className="text-white/50 text-md md:text-base text-justify leading-relaxed font-semibold">
                    In case of a security breach, we will notify affected users via email or platform announcement.
                </p>
                <br />
                <p className="text-white/50 text-md md:text-base text-justify leading-relaxed font-semibold">
                    10. Successors in Interest (Mergers & Acquisitions)
                </p>
                <p className="text-white/50 text-md md:text-base text-justify leading-relaxed font-semibold">
                    If Avenue undergoes a merger, acquisition, or sale, user data may be transferred as part of the business transaction. Users will be notified via email or a public announcement.
                </p>
                <br />
                <p className="text-white/50 text-md md:text-base text-justify leading-relaxed font-semibold">
                    11. Children's Privacy
                </p>
                <p className="text-white/50 text-md md:text-base text-justify leading-relaxed font-semibold">
                    Our Services are not intended for children under 16. If we discover such data, we will delete it.
                </p>
                <br />
                <p className="text-white/50 text-md md:text-base text-justify leading-relaxed font-semibold">
                    12. Changes to This Privacy Policy
                </p>
                <p className="text-white/50 text-md md:text-base text-justify leading-relaxed font-semibold">
                    We may update this Privacy Policy. If significant changes are made, we will notify users via email or platform announcements.
                </p>
                <br />
                <p className="text-white/50 text-md md:text-base text-justify leading-relaxed font-semibold">
                    13. Contact Information
                </p>
                <p className="text-white/50 text-md md:text-base text-justify leading-relaxed font-semibold">
                    For privacy-related inquiries, contact us at:
                </p>
                <div className="max-w-5xl mx-auto">
                    <ul className="list-disc list-inside text-white/60 space-y-2">
                        <li>Email: privacy@avenue.tickets</li>
                        <li>Phone: (855) 550-1080</li>
                        <li>Mailing Address: 75-5733 Lamaokeola St, Kailua-Kona, HI 96740</li>
                    </ul>
                </div>
                <br />
                <p className="text-white/50 text-md md:text-base text-justify leading-relaxed font-semibold">
                    By using our Services, you acknowledge that you have read and understand this Privacy Policy
                </p>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
