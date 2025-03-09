import React from 'react';

const TermsCondition = () => {
  return (
    <div className="bg-primary min-h-screen flex items-center justify-center px-4 md:px-8">
      <div className="max-w-7xl w-full mx-auto py-16 md:py-20 text-white">
        {/* Privacy Policy Heading */}
        <h1 className="text-2xl md:text-4xl font-semibold text-left tracking-wide">
          Avenue Ticketing, Inc. Terms of Service
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
            <span className="text-white font-semibold">Welcome to Avenue Ticketing, Inc</span> ("Avenue," "we," "us," or "our").
            Avenue Ticketing, Inc. is a Delaware C Corporation that provides an online ticketing and event management platform through
            our website <span className="text-white underline"> www.avenue.tickets</span> and related mobile applications (collectively, the "Services").
            These Terms of Service ("Terms") govern your access to and use of our Services, whether you are an event organizer ("Organizer"),
            event attendee ("Consumer"), or any other user ("User").
            <br /><br />
            BY CLICKING THE “AGREE” BUTTON WHEN CREATING AN ACCOUNT OR LOGGING IN, OR BY ACCESSING OR USING OUR SERVICES, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD,
            AND AGREE TO BE BOUND BY THESE TERMS AND OUR PRIVACY POLICY (INCORPORATED HEREIN BY REFERENCE). YOU REPRESENT THAT YOU ARE OF LEGAL AGE TO ENTER INTO A BINDING
            AGREEMENT AND, IF ACTING ON BEHALF OF AN ENTITY, THAT YOU HAVE THE AUTHORITY AND LEGAL COMPETENCY TO BIND THAT ENTITY. IF YOU DO NOT AGREE WITH THESE TERMS,
            PLEASE DO NOT USE OUR SERVICES.
          </p>
        </div>

        <br />

        {/* Section Heading */}
        <p className="text-lg md:text-xl font-semibold tracking-wide">1. Acceptance of Terms</p>
        <p className="text-md md:text-lg font-semibold tracking-wide">1.1 Personal Data</p>
        <div className="space-y-3 md:space-y-4">
          <p> By accessing, browsing, or using the Services, or by clicking “AGREE” when prompted, you acknowledge that you have read, understood,
            and agree to be bound by these Terms and our Privacy Policy. If you are accepting these Terms on behalf of an entity,
            you represent that you have the authority and legal competency to bind that entity.</p>
        </div>
        <br />
        <p className="text-md md:text-lg font-semibold tracking-wide">1.2 Modifications.</p>
        <div className="space-y-3 md:space-y-4">
          <p> We reserve the right to modify or update these Terms at any time. Any material changes will be posted on our website with an updated "Last Modified" date, and we may
            provide additional notice (e.g., via email to the address affiliated with your Account). Your continued use of the Services after such modifications constitutes your
            acceptance of the revised Terms. It is your responsibility to check our website periodically for changes. Updated Terms will not apply retroactively and will specify
            their effective date.</p>
        </div>

        <div className="mx-auto py-6 text-white">
          {/* Section 2: Information We Collect */}
          <p className="text-lg md:text-xl font-semibold text-left tracking-wide">2. Description of the Services</p>
          <br />

          <p className="text-md md:text-lg font-semibold tracking-wide">2.1 Overview</p>
          <div className="space-y-3 md:space-y-4">
            <p> Avenue provides an end-to-end ticketing and event management solution similar to leading industry platforms. Our Services allow Organizers to create, promote, and
              sell tickets for events and enable Consumers to purchase tickets, interact with event details, and attend events. Avenue acts as a marketplace platform facilitating transactions between
              Users and is not a seller or direct party to such transactions.</p>
          </div>

          <br />

          <p className="text-md md:text-lg font-semibold tracking-wide">2.2 Access</p>
          <div className="space-y-3 md:space-y-4">
            <p> Certain parts of our Services are publicly accessible, while others require registration for an account ("Account"). Use of our Services is subject to these Terms and any
              additional policies that may apply to specific features.</p>
          </div>

          <br />

          <p className="text-md md:text-lg font-semibold tracking-wide">2.3 Geographic Restrictions.</p>
          <div className="space-y-3 md:space-y-4">
            <p> The Services are based in the United States and intended for use by persons located in the United States. If you access the Services from outside the United States, you are responsible for
              compliance with local laws, and you acknowledge that access may not be available or legal in certain jurisdictions.</p>
          </div>

          <br />

          <p className="text-lg md:text-xl font-semibold text-left tracking-wide">3. Account Registration and User Eligibility</p>
          <br />

          <p className="text-md md:text-lg font-semibold tracking-wide">3.1 Eligibility</p>
          <div className="space-y-3 md:space-y-4">
            <p> You must be at least 18 years of age (or the applicable age of majority in your jurisdiction) to register for an Account or use the Services. If you are using the Services on behalf of an entity,
              you represent that you have the authority to bind that entity to these Terms.</p>
          </div>

          <br />

          <p className="text-md md:text-lg font-semibold tracking-wide">3.2 Registration Requirements.</p>
          <div className="space-y-3 md:space-y-4">
            <p> When you register, you agree to provide accurate, current, and complete information and to update this information as necessary. You are solely responsible for safeguarding your Account
              credentials and restricting access to your device. You agree not to: (a) create or control more than one Account without our express written authorization; (b) use a name that is not yours, a
              temporary or secondary email address, or provide falsified information; or (c) allow any other person to use your Account. You accept responsibility for all activities, charges, and damages that
              occur under your Account until you close it or prove that its security was compromised through no fault of your own. Please notify us immediately at support@avenue.tickets if you suspect any
              unauthorized use or security breach of your Account.</p>
          </div>

          <br />

          <p className="text-md md:text-lg font-semibold tracking-wide">3.3 Account Termination.</p>
          <div className="space-y-3 md:space-y-4">
            <p> We reserve the right to suspend or terminate your Account, or restrict your access to the Services, for any violation of these Terms, for conduct we determine in our sole
              discretion may harm our Services, users, or business, or for any reason, including unconfirmed or inactive Accounts, with or without notice and without liability.</p>
          </div>

          <br />
          <p className="text-lg md:text-xl font-semibold text-left tracking-wide">4. Organizer and Consumer Obligations</p>
          <br />

          <p className="text-md md:text-lg font-semibold tracking-wide">4.1 Organizer Responsibilities.</p>
          <p className="text-sm md:text-base text-justify leading-relaxed tracking-wide">
            Organizers must:
          </p>
          <div className="mt-3 space-y-3 md:space-y-4">
            <p> Ensure event legality and obtain all necessary licenses, permits, and authorizations ("Authorizations") prior to offering or selling tickets,
              providing evidence of such Authorizations upon Avenue’s reasonable request.</p>
            <p> Accurately provide event details, including ticket prices, schedules, and venue information, ensuring listings are not misleading or deceptive</p>
            <p> Comply with all applicable laws, rules, and regulations, including venue-specific rules, and honor event-specific refund and cancellation policies.</p>
            <p> Warrant that they have the authority to promote events and that tickets sold through the Services will not require separate delivery or additional
              purchases (e.g., via third-party channels).</p>
          </div>
          <br />

          <p className="text-md md:text-lg font-semibold tracking-wide">4.2 Consumer Responsibilities.</p>
          <p className="text-sm md:text-base text-justify leading-relaxed tracking-wide">
            Organizers must:
          </p>
          <div className="mt-3 space-y-3 md:space-y-4">
            <p> Review event details and refund policies before purchasing tickets, understanding that Avenue does not sell or control events and that event terms are set by Organizers.</p>
            <p> Provide accurate payment information and be responsible for all charges incurred, including taxes and Avenue processing fees.</p>
            <p> Communicate with Organizers directly regarding event-specific concerns; Avenue is not responsible for Organizer-related transactions or disputes.</p>
          </div>
          <br />

          <p className="text-md md:text-lg font-semibold tracking-wide">4.3 User Acknowledgment of Marketplace Platform.</p>
          <div className="space-y-3 md:space-y-4">
            <p> Avenue is a platform facilitating interactions between Users and does not guarantee the pricing, existence, quality, safety, or legality of events or tickets promoted on the Services.
              Transactions and dealings between Users (e.g., ticket purchases, event attendance) are solely between those Users, and Avenue is not involved or liable for any resulting disputes, losses, or damages
              .</p>
          </div>
          <br />

          <p className="text-lg md:text-xl font-semibold text-left tracking-wide">5. Payment, Fees, and Refund Policy</p>
          <br />

          <p className="text-md md:text-lg font-semibold tracking-wide">5.1 Payment Processing.</p>
          <div className="space-y-3 md:space-y-4">
            <p> Payments for tickets are processed via our designated third-party payment providers. By making a purchase, you agree to their respective terms and policies.</p>
          </div>

          <br />

          <p className="text-md md:text-lg font-semibold tracking-wide">5.2 Fees</p>
          <div className="space-y-3 md:space-y-4">
            <p> Avenue charges service fees for ticket purchases. All fees, including processing or convenience fees, will be disclosed during checkout. Fees are non-refundable unless required by
              law or expressly stated in our refund policy.
            </p>
          </div>

          <br />

          <p className="text-md md:text-lg font-semibold tracking-wide">5.3 Refunds and Disputes</p>
          <div className="space-y-3 md:space-y-4">
            <p>Refunds are determined by Organizer-specific refund policies. Consumers seeking refunds must contact the event Organizer directly. If Avenue, at its discretion, issues a refund due to a dispute,
              the Organizer will be liable for the refund amount and any associated fees. Avenue reserves the right to deduct the refund amount from the Organizer’s account balance or future payouts to cover
              the dispute cost. Avenue does not guarantee refunds and is not responsible for refund-related disputes between Organizers and Consumers.</p>
          </div>

          <br />

          <p className="text-lg md:text-xl font-semibold text-left tracking-wide">6. User Content and Intellectual Property</p>
          <br />

          <p className="text-md md:text-lg font-semibold tracking-wide">6.1 Your Content.</p>
          <div className="space-y-3 md:space-y-4">
            <p> By submitting content to the Services ("User Content"), you grant Avenue a non-exclusive, worldwide, royalty-free, irrevocable, transferable, and sublicensable license to use, modify,
              publicly display, reproduce, and distribute such content for operating, promoting, and improving our Services. Avenue may delete, edit, modify, reformat, or translate your User Content
              in its sole discretion to provide the Services.</p>
          </div>

          <br />

          <p className="text-md md:text-lg font-semibold tracking-wide">6.2 Feedback</p>
          <div className="space-y-3 md:space-y-4">
            <p> Any reviews, comments, suggestions, or other feedback ("Feedback") you provide about the Services will be owned exclusively by Avenue, and we may use it for any purpose, including advertising,
              without compensation to you. You waive any “moral rights” in Feedback and agree it contains no confidential or proprietary information
            </p>
          </div>

          <br />

          <p className="text-md md:text-lg font-semibold tracking-wide">6.3 Our Intellectual Property.</p>
          <div className="space-y-3 md:space-y-4">
            <p>All materials provided by Avenue, including logos, images, software, and content ("Avenue Content"), are protected by intellectual property laws. You may not copy, modify, distribute,
              or create derivative works of Avenue Content without prior written consent. You have a limited, revocable, non-exclusive, non-transferable license to use Avenue Content solely for
              permitted activities under these Terms.</p>
          </div>

          <br />

          <p className="text-md md:text-lg font-semibold tracking-wide">6.4 Copyright Policy and DMCA Compliance.</p>
          <div className="space-y-3 md:space-y-4">
            <p>Avenue complies with the Digital Millennium Copyright Act (DMCA). If you believe your work has been infringed, notify our Copyright Agent at support@avenue.tickets with: (a)
              your signature; (b) contact information; (c) a description of the copyrighted work; (d) the location of the infringing material; (e) a good faith statement of unauthorized use; and (f)
              a statement under penalty of perjury that the information is accurate. If your content is removed and you believe it’s not infringing, submit a counter-notice with similar details and
              consent to Delaware court jurisdiction. We may terminate Accounts of repeat infringers.</p>
          </div>
          <br />

          <p className="text-lg md:text-xl font-semibold text-left tracking-wide">7. Privacy and Data Protection</p>
          <br />

          <p className="text-md md:text-lg font-semibold tracking-wide">7.1 Privacy Policy</p>
          <div className="space-y-3 md:space-y-4">
            <p> Your use of the Services is governed by our Privacy Policy, which describes how we collect, use, and protect your data.</p>
          </div>

          <br />

          <p className="text-md md:text-lg font-semibold tracking-wide">7.2 Data Security.</p>
          <div className="space-y-3 md:space-y-4">
            <p> We use industry-standard security measures, but we cannot guarantee absolute security. Avenue is not liable for unauthorized access to user data.
            </p>
          </div>

          <br />

          <p className="text-lg md:text-xl font-semibold text-left tracking-wide">8. Prohibited Conduct</p>
          <br />
          <p className="text-sm md:text-base text-justify leading-relaxed tracking-wide">
            Users may not
          </p>
          <div className="mt-3 space-y-3 md:space-y-4">
            <p> Violate laws, regulations, or third-party rights (e.g., intellectual property, privacy).</p>
            <p> Engage in fraudulent, deceptive, or illegal activities, including competitive analysis or developing competing services.</p>
            <p> Post or transmit false, inaccurate, misleading, defamatory, obscene, harassing, hateful, or pornographic content, or content that threatens violence or harms minors.</p>
            <p> Use automated systems (e.g., bots, scrapers) or attempt to gain unauthorized access to the Services.</p>
            <p> Decipher, decompile, reverse engineer, or derive source code from the Services. Create derivative works, sublicense, or commercially exploit the Services without consent.</p>
            <p> Send unsolicited advertising, spam, or chain letters, or impersonate any person or entity, including Avenue staff.</p>
            <p> Overload our infrastructure, interfere with the Services, or introduce viruses or malicious code.</p>
          </div>
          <br />
          <p> Violations may result in Account termination, removal of content, and legal action, including cooperation with law enforcement.</p>
          <br />

          <p className="text-lg md:text-xl font-semibold text-left tracking-wide">9. Third-Party Links and Hyperlinking</p>
          <br />

          <p className="text-md md:text-lg font-semibold tracking-wide">9.1 Third-Party Sites</p>
          <div className="space-y-3 md:space-y-4">
            <p> The Services may link to third-party websites for convenience. Avenue does not control or endorse these sites, and you use them at your own risk. We are not liable
              for their content or your interactions with them.</p>
          </div>

          <br />

          <p className="text-md md:text-lg font-semibold tracking-wide">9.2 Hyperlinking to Our Services.</p>
          <div className="space-y-3 md:space-y-4">
            <p> Government agencies, search engines, news organizations, and accredited businesses may link to www.avenue.tickets without approval, provided the link is not misleading, does not imply endorsement,
              and fits the context. Other entities (e.g., consumer information sources, charities, portals) must obtain written approval by emailing support@avenue.tickets with their details and intended links.
              Approved links must comply with the same conditions. No use of Avenue’s logo is permitted without a trademark license.
            </p>
          </div>

          <br />

          <p className="text-lg md:text-xl font-semibold text-left tracking-wide">10. Disclaimers and Limitation of Liability</p>
          <br />

          <p className="text-md md:text-lg font-semibold tracking-wide">10.1 Disclaimers</p>
          <div className="space-y-3 md:space-y-4">
            <p> Avenue provides the Services “as is” and “as available,” with no warranties of any kind, express or implied (e.g., merchantability, fitness for a particular purpose, accuracy).
              We do not guarantee uninterrupted operation, error-free performance, or correction of defects. Avenue does not endorse or control events, tickets, or User Content and is not liable for
              their accuracy, quality, or legality. Your use of the Services is at your own risk</p>
          </div>

          <br />

          <p className="text-md md:text-lg font-semibold tracking-wide">10.2 Limitation of Liability.</p>
          <div className="space-y-3 md:space-y-4">
            <p> To the fullest extent permitted by law, Avenue, its affiliates, and their officers, directors, employees, and agents are not liable for indirect, incidental, special, punitive, or consequential damages
              (e.g., lost profits, data loss, service interruption) arising from your use of the Services. Our total liability shall not exceed (i) the amount you paid to Avenue in the past 6 months, or (ii) $100,
              whichever is greater. Some jurisdictions may not allow these limitations, in which case they apply to the maximum extent permitted.
            </p>
          </div>

          <br />

          <p className="text-lg md:text-xl font-semibold text-left tracking-wide">11. Indemnification</p>
          <br />
          <div className="space-y-3 md:space-y-4">
            <p> You agree to indemnify, defend, and hold harmless Avenue, its affiliates, and their respective officers, directors, employees, and agents from any claims, damages, liabilities, costs, or expenses
              (including attorneys’ fees) arising from your use or misuse of the Services, breach of these Terms, violation of laws or third-party rights, or, for Organizers, failure to maintain required Authorizations.</p>
          </div>
          <br />

          <p className="text-lg md:text-xl font-semibold text-left tracking-wide">12. Dispute Resolution and Arbitration</p>
          <br />

          <p className="text-md md:text-lg font-semibold tracking-wide">12.1 Initial Dispute Resolution.</p>
          <div className="space-y-3 md:space-y-4">
            <p> You agree to first contact us at support@avenue.tickets with a written description of any dispute within 30 days of the issue arising.
              We will negotiate in good faith for 60 days to resolve it before proceeding to arbitration.
            </p>
          </div>

          <br />

          <p className="text-md md:text-lg font-semibold tracking-wide">12.2 Binding Arbitration.</p>
          <div className="space-y-3 md:space-y-4">
            <p>Disputes not resolved informally must be settled through binding arbitration under the American Arbitration Association (AAA) Commercial Arbitration Rules, excluding class actions.
              The arbitrator has exclusive authority to resolve disputes, and their award is binding and enforceable in court. Arbitration will occur in Delaware
            </p>
          </div>
          <br />

          <p className="text-md md:text-lg font-semibold tracking-wide">12.3 Class Action Waiver</p>
          <div className="space-y-3 md:space-y-4">
            <p>Arbitration shall be conducted individually, not as a class or representative action. You waive any right to participate in a class action against Avenue. If this waiver is unenforceable,
              the arbitration provision is void.
            </p>
          </div>

          <br />
          <p className="text-md md:text-lg font-semibold tracking-wide">12.4 Opt-Out Option.</p>
          <div className="space-y-3 md:space-y-4">
            <p>You may opt out of arbitration within 30 days of first using the Services by emailing support@avenue.tickets with your intent.
            </p>
          </div>

          <br />

          <p className="text-md md:text-lg font-semibold tracking-wide">12.5 Exceptions.</p>
          <div className="space-y-3 md:space-y-4">
            <p>Either party may seek relief in small claims court or to protect intellectual property rights (e.g., copyrights, trademarks) in state or federal court.
            </p>
          </div>
          <br />

          <p className="text-lg md:text-xl font-semibold text-left tracking-wide">13. Governing Law and Jurisdiction</p>
          <br />
          <div className="space-y-3 md:space-y-4">
            <p> These Terms are governed by Delaware law, without regard to conflict of law principles. Any disputes not subject to arbitration shall be brought in state or federal courts located in
              Delaware, and you waive objections to jurisdiction or venue.</p>
          </div>

          <br />

          <p className="text-lg md:text-xl font-semibold text-left tracking-wide">14. Assignment</p>
          <br />
          <div className="space-y-3 md:space-y-4">
            <p> You may not assign, transfer, or sublicense your rights or obligations under these Terms without Avenue’s prior written consent.
              Avenue may assign its rights and obligations without your consent. Any unauthorized assignment is null and void.</p>
          </div>

          <br />

          <p className="text-lg md:text-xl font-semibold text-left tracking-wide">15. SMS Notification Terms (Optional - Include if Applicable)</p>
          <br />
          <div className="space-y-3 md:space-y-4">
            <p> If you opt in during signup, we may send event-related SMS notifications (e.g., receipts, alerts) to the phone number provided. Message frequency varies, and data rates may apply.
              Text STOP to unsubscribe, or HELP for assistance. Reply to support@avenue.tickets for support. Carriers are not liable for delayed or undelivered messages. See our Privacy Policy for details.</p>
          </div>

          <br />

          <p className="text-lg md:text-xl font-semibold tracking-wide">16. Contact Information</p>
          <div className="mt-3 space-y-3 md:space-y-4">
            <p> Email: privacy@avenue.tickets</p>
            <p> Phone: (855) 550-1080</p>
            <p> Mailing Address: 75-5733 Lamaokeola St, Kailua-Kona, HI 96740</p>
          </div>

          <br />

          <p className="text-sm md:text-base text-justify leading-relaxed tracking-wide">
            By using our Services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
          </p>

        </div>
      </div>
    </div>
  );
};

export default TermsCondition;
