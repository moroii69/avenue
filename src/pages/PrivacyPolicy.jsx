import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="bg-primary min-h-screen flex items-center justify-center px-4 md:px-8">
            <div className="max-w-7xl w-full mx-auto py-16 md:py-20 text-white">
                {/* Privacy Policy Heading */}
                <h1 className="text-2xl md:text-4xl font-semibold text-left tracking-wide">
                    Avenue Ticketing, Inc. Privacy Policy
                </h1>

                {/* Horizontal Line */}
                <hr className="border-white/20 my-4" />

                {/* Effective Date */}
                <p className="text-white/50 text-sm md:text-base text-justify leading-relaxed tracking-wide font-semibold">
                    <span className="text-white">Effective Date:</span> January 28th, 2025
                </p>

                {/* Last Modified Date */}
                <p className="text-white/50 text-sm md:text-base text-justify leading-relaxed tracking-wide font-semibold">
                    <span className="text-white">Last Modified:</span> January 28th, 2025
                </p>

                <br />

                <div className="mt-3 space-y-3 md:space-y-4">
                    <p>
                        <span className="text-white font-semibold">Avenue Ticketing, Inc.</span> ("Avenue," "we," "us," or "our") values your privacy.
                        This Privacy Policy outlines how we collect, use, store, and share your
                        information when you use our services, including our website
                        <span className="text-white underline"> www.avenue.tickets</span>,
                        mobile applications, and any related features (collectively, the <span className="italic">"Services"</span>).
                        <br /><br />
                        By accessing or using our Services, you agree to this Privacy Policy.
                        If you do not agree, you must not use our Services.
                    </p>
                </div>

                <br />

                {/* Section Heading */}
                <p className="text-lg md:text-xl font-semibold tracking-wide">1. Summary of Data Collection & Disclosure</p>

                {/* Section Description */}

                <div className="mt-3 space-y-3 md:space-y-4">
                    <p> To provide transparency, below is a summary of the types of data Avenue collects, whether it is disclosed, and whether it is sold.</p>
                </div>


                {/* Responsive Table Container */}
                <div className="overflow-x-auto mt-5">
                    <table className="w-full min-w-[700px] border border-white/20 text-white text-sm md:text-base">
                        <thead>
                            <tr className="bg-white/10 text-left">
                                <th className="p-3 border border-white/20 whitespace-nowrap">Data Type</th>
                                <th className="p-3 border border-white/20 whitespace-nowrap">Do We Collect?</th>
                                <th className="p-3 border border-white/20 whitespace-nowrap">Do We Disclose?</th>
                                <th className="p-3 border border-white/20 whitespace-nowrap">Do We Sell?</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { type: "Identifiers (Name, Email, Phone, Address, Account Name)", collect: "Yes", disclose: "Yes", sell: "No" },
                                { type: "Payment Information (Credit/Debit Card, Bank Account)", collect: "Yes (via third-party processors)", disclose: "Yes", sell: "No" },
                                { type: "Commercial Information (Transactions, Purchase History)", collect: "Yes", disclose: "Yes", sell: "No" },
                                { type: "Geolocation Data", collect: "Yes (if enabled)", disclose: "Yes", sell: "No" },
                                { type: "Online Activity (Browsing, Search, Interactions)", collect: "Yes", disclose: "Yes", sell: "No" },
                                { type: "Inferences (Preferences, Interests)", collect: "Yes", disclose: "Yes", sell: "No" },
                                { type: "Audio, Visual Data (Profile Photos)", collect: "Yes (optional)", disclose: "Yes", sell: "No" },
                                { type: "Biometric Information (Face Imagery)", collect: "No", disclose: "No", sell: "No" },
                                { type: "Protected Class Information (Age, Gender, etc.)", collect: "No", disclose: "No", sell: "No" },
                            ].map((row, index) => (
                                <tr key={index} className="hover:bg-white/10">
                                    <td className="p-3 border border-white/20">{row.type}</td>
                                    <td className="p-3 border border-white/20">{row.collect}</td>
                                    <td className="p-3 border border-white/20">{row.disclose}</td>
                                    <td className="p-3 border border-white/20">{row.sell}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <br />
                <div className="mx-auto px-4 md:px-6 py-6 text-white">
                    {/* Section 2: Information We Collect */}
                    <p className="text-lg md:text-xl font-semibold text-left tracking-wide">2. Information We Collect</p>
                    <br />

                    <p className="text-md md:text-lg font-semibold tracking-wide">2.1 Personal Data</p>
                    <p className="text-sm md:text-base text-justify leading-relaxed tracking-wide">
                        We may collect the following types of personal data:
                    </p>
                    <div className="mt-3 space-y-3 md:space-y-4">
                        <p> Identifiers: Name, email, phone number, billing/shipping address, and username.</p>
                        <p> Payment Information: Processed through third-party providers like Stripe; Avenue does not store payment details.</p>
                        <p> Account Credentials: Passwords or authentication methods.</p>
                        <p> Social Media Data: If you link your social accounts to our platform.</p>
                        <p> User-Generated Content: Event details, profile photos, and other materials you upload.</p>
                        <p> Geolocation Data: If enabled, we may collect location information.</p>
                    </div>

                    <br />

                    <p className="text-md md:text-lg font-semibold tracking-wide">2.2 Non-Personal Data</p>
                    <div className="mt-3 space-y-3 md:space-y-4">
                        <p> Device Information: IP address, browser type, and operating system.</p>
                        <p> Usage Data: Pages viewed, time spent on our site, and interactions with the platform.</p>
                        <p> Cookies & Tracking Technologies: Used for analytics, security, and personalization.</p>
                    </div>

                    <br />

                    {/* Section 3: How We Use Your Information */}
                    <p className="text-lg md:text-xl font-semibold tracking-wide">3. How We Use Your Information</p>
                    <p className="text-sm md:text-base text-justify leading-relaxed tracking-wide">
                        We use your data to:
                    </p>
                    <div className="mt-3 space-y-3 md:space-y-4">
                        <p> Provide and improve our Services.</p>
                        <p> Process payments and issue refunds.</p>
                        <p> Prevent fraud and enhance security.</p>
                        <p> Send promotional emails and event notifications (you may opt out).</p>
                        <p> Comply with legal obligations.</p>
                        <p> Conduct analytics and improve user experience.</p>
                    </div>

                    <br />

                    <p className="text-lg md:text-xl font-semibold tracking-wide">Legal Basis for Processing</p>
                    <div className="mt-3 space-y-3 md:space-y-4">
                        <p> Your consent (e.g., for marketing emails).</p>
                        <p> Performance of a contract (e.g., processing ticket purchases).</p>
                        <p> Legitimate interest (e.g., fraud prevention and analytics).</p>
                        <p> Compliance with legal requirements.</p>
                    </div>

                    <br />

                    {/* Section 4: Sharing Your Information */}
                    <p className="text-lg md:text-xl font-semibold tracking-wide">4. Sharing Your Information</p>
                    <p className="text-sm md:text-base text-justify leading-relaxed tracking-wide">
                        We do not sell your Personal Data. However, we may share it:
                    </p>
                    <div className="mt-3 space-y-3 md:space-y-4">
                        <p> With Event Organizers: When you purchase tickets.</p>
                        <p> With Service Providers: Payment processors, marketing tools, analytics services.</p>
                        <p> With Legal Authorities: If required by law.</p>
                        <p> In Business Transfers: If Avenue is acquired or merged with another entity.</p>
                        <p> With Affiliates and Subsidiaries: Entities under our common ownership.</p>
                    </div>

                    <br />

                    {/* Section 5: Your Rights */}
                    <p className="text-lg md:text-xl font-semibold tracking-wide">5. Your Rights & How to Exercise Them</p>
                    <div className="mt-3 space-y-3 md:space-y-4">
                        <p> Right to Access: Request a copy of your data.</p>
                        <p> Right to Correct: Update inaccurate or incomplete data.</p>
                        <p> Right to Delete: Request deletion of your personal information.</p>
                        <p> Right to Restrict Processing: Limit how we use your data.</p>
                        <p> Right to Object: Opt out of marketing communications.</p>
                        <p> Right to Data Portability: Receive your data in a usable format.</p>
                    </div>

                    <br />

                    {/* Section 6: Compliance with Laws */}
                    <p className="text-lg md:text-xl font-semibold tracking-wide">6. Compliance with State & International Laws</p>
                    <div className="mt-3 space-y-3 md:space-y-4">
                        <p> Avenue complies with the California Consumer Privacy Act (CCPA), Virginia Consumer Data Protection Act (VCDPA), and Nevada online privacy laws.</p>
                        <p> California residents may request access to their data and deletion of personal information.</p>
                    </div>

                    <br />

                    {/* Section 7: Security & Data Retention */}
                    <p className="text-lg md:text-xl font-semibold tracking-wide">7. Security Measures & Data Retention</p>
                    <p className="text-sm md:text-base text-justify leading-relaxed tracking-wide">
                        We implement industry-standard security measures, including:
                    </p>
                    <div className="mt-3 space-y-3 md:space-y-4">
                        <p> Encryption: Protects sensitive data.</p>
                        <p> Access Controls: Limits access to authorized personnel only.</p>
                        <p> Regular Security Audits: To identify and mitigate risks.</p>
                    </div>

                    <br />

                    {/* Section 8: Cookies & Tracking */}
                    <p className="text-lg md:text-xl font-semibold tracking-wide">8. Cookies, Tracking & Do Not Track (DNT)</p>
                    <div className="mt-3 space-y-3 md:space-y-4">
                        <p> Essential Cookies: Required for platform functionality.</p>
                        <p> Performance Cookies: Track website performance and analytics.</p>
                        <p> Advertising Cookies: Deliver relevant ads.</p>
                    </div>

                    <br />

                    {/* Section 9: Security Breach Notification */}
                    <p className="text-lg md:text-xl font-semibold tracking-wide">9. Security Breach Notification</p>
                    <div className="mt-3 space-y-3 md:space-y-4">
                        <p>In case of a security breach, we will notify affected users via email or platform announcement.</p>
                    </div>
                    <br />

                    {/* Section 10: Successors in Interest */}
                    <p className="text-lg md:text-xl font-semibold tracking-wide">10. Successors in Interest (Mergers & Acquisitions)</p>
                    <div className="mt-3 space-y-3 md:space-y-4">
                        <p> If Avenue undergoes a merger, acquisition, or sale, user data may be transferred as part of the business transaction.
                            Users will be notified via email or a public announcement.</p>
                    </div>

                    <br />

                    {/* Section 11: Children's Privacy */}
                    <p className="text-lg md:text-xl font-semibold tracking-wide">11. Children's Privacy</p>
                    <div className="mt-3 space-y-3 md:space-y-4">
                        <p> Our Services are not intended for children under 16. If we discover such data, we will delete it.</p>
                    </div>

                    <br />

                    {/* Section 12: Changes to This Privacy Policy */}
                    <p className="text-lg md:text-xl font-semibold tracking-wide">12. Changes to This Privacy Policy</p>
                    <div className="mt-3 space-y-3 md:space-y-4">
                        <p> We may update this Privacy Policy. If significant changes are made, we will notify users via email or platform announcements.</p>
                    </div>
                    <br />


                    {/* Contact Information */}
                    <p className="text-lg md:text-xl font-semibold tracking-wide">13. Contact Information</p>
                    <div className="mt-3 space-y-3 md:space-y-4">
                        <p> Email: privacy@avenue.tickets</p>
                        <p> Phone: (855) 550-1080</p>
                        <p> Mailing Address: 75-5733 Lamaokeola St, Kailua-Kona, HI 96740</p>
                    </div>

                    <br />

                    <p className="text-sm md:text-base text-justify leading-relaxed tracking-wide">
                        By using our Services, you acknowledge that you have read and understand this Privacy Policy.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
