import React from 'react';

function TermsOfServicePage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-12 sm:py-16 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-dark-text mb-3">
            Terms of Service
          </h1>
          <p className="text-lg text-medium-text">
            Last updated: November 12, 2025
          </p>
        </div>

        {/* Content Section */}
        <div className="bg-card-bg rounded-lg shadow-sm border border-border-color p-6 sm:p-10">
          <div className="space-y-8">
            
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-bold text-dark-text mb-4 border-b-2 border-primary-green pb-2">
                1. Acceptance of Terms
              </h2>
              <p className="text-medium-text leading-relaxed">
                Welcome to PlayNation! By accessing or using our online game slot booking platform, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our services. These terms constitute a legally binding agreement between you and PlayNation.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold text-dark-text mb-4 border-b-2 border-primary-green pb-2">
                2. Platform Overview
              </h2>
              <p className="text-medium-text leading-relaxed">
                PlayNation is an online marketplace connecting users with sports and gaming venues for slot bookings. We act as an intermediary platform and do not own, operate, or manage the venues listed on our platform. Venue owners are independent service providers responsible for their facilities and services.
              </p>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold text-dark-text mb-4 border-b-2 border-primary-green pb-2">
                3. User Account and Eligibility
              </h2>
              <div className="space-y-4">
                <div className="bg-light-green-bg p-4 rounded-md">
                  <h3 className="font-semibold text-dark-text mb-2">Account Creation</h3>
                  <p className="text-medium-text text-sm">
                    You must create an account to book slots. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.
                  </p>
                </div>
                
                <div className="bg-light-green-bg p-4 rounded-md">
                  <h3 className="font-semibold text-dark-text mb-2">Age Requirement</h3>
                  <p className="text-medium-text text-sm">
                    You must be at least 13 years old to use our platform. Users under 18 may require parental consent for certain bookings.
                  </p>
                </div>
                
                <div className="bg-light-green-bg p-4 rounded-md">
                  <h3 className="font-semibold text-dark-text mb-2">Accurate Information</h3>
                  <p className="text-medium-text text-sm">
                    You agree to provide accurate, current, and complete information during registration and to update it as necessary.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold text-dark-text mb-4 border-b-2 border-primary-green pb-2">
                4. Booking Process and Payments
              </h2>
              <p className="text-medium-text leading-relaxed mb-4">
                Understanding the booking and payment process:
              </p>
              
              <div className="space-y-3">
                <div className="bg-hover-bg p-3 rounded-md">
                  <p className="text-medium-text">
                    <span className="font-semibold text-dark-text">Slot Availability:</span> All bookings are subject to real-time availability. Venues reserve the right to decline bookings at their discretion.
                  </p>
                </div>
                
                <div className="bg-hover-bg p-3 rounded-md">
                  <p className="text-medium-text">
                    <span className="font-semibold text-dark-text">Payment Authorization:</span> By confirming a booking, you authorize us to charge the total amount to your selected payment method. All prices are displayed in Indian Rupees (INR).
                  </p>
                </div>
                
                <div className="bg-hover-bg p-3 rounded-md">
                  <p className="text-medium-text">
                    <span className="font-semibold text-dark-text">Booking Confirmation:</span> You will receive a confirmation email and SMS upon successful booking. This confirmation serves as your booking receipt.
                  </p>
                </div>
                
                <div className="bg-hover-bg p-3 rounded-md">
                  <p className="text-medium-text">
                    <span className="font-semibold text-dark-text">Platform Fee:</span> PlayNation charges a service fee for facilitating bookings, which is included in the total price displayed.
                  </p>
                </div>
                
                <div className="bg-hover-bg p-3 rounded-md">
                  <p className="text-medium-text">
                    <span className="font-semibold text-dark-text">Payment Security:</span> All transactions are processed through PCI-DSS compliant payment gateways. We do not store your complete credit card information.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-bold text-dark-text mb-4 border-b-2 border-primary-green pb-2">
                5. Cancellations and Refunds
              </h2>
              <p className="text-medium-text leading-relaxed mb-4">
                Cancellation policies vary by venue and are clearly displayed before booking:
              </p>
              
              <ul className="space-y-2 text-medium-text mb-4">
                <li className="flex items-start">
                  <span className="text-primary-green mr-2 mt-1">•</span>
                  <span><span className="font-semibold">Flexible Cancellation:</span> Full refund if cancelled 24+ hours before the slot time</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-green mr-2 mt-1">•</span>
                  <span><span className="font-semibold">Moderate Cancellation:</span> 50% refund if cancelled 12-24 hours before, no refund within 12 hours</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-green mr-2 mt-1">•</span>
                  <span><span className="font-semibold">Strict Cancellation:</span> No refunds for cancellations</span>
                </li>
              </ul>
              
              <div className="bg-primary-green-light bg-opacity-10 p-4 rounded-md border-l-4 border-primary-green">
                <p className="text-medium-text text-sm">
                  <span className="font-semibold">Important:</span> Refunds are processed within 7-10 business days. Platform fees may be non-refundable depending on the venue's policy. In case of venue-initiated cancellations, you will receive a full refund including platform fees.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-bold text-dark-text mb-4 border-b-2 border-primary-green pb-2">
                6. User Conduct and Responsibilities
              </h2>
              <p className="text-medium-text leading-relaxed mb-4">
                You agree to use PlayNation responsibly and lawfully. The following actions are prohibited:
              </p>
              
              <ul className="space-y-2 text-medium-text">
                <li className="flex items-start">
                  <span className="text-primary-green mr-2 mt-1">•</span>
                  <span>Making fraudulent bookings or providing false information</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-green mr-2 mt-1">•</span>
                  <span>Engaging in abusive, threatening, or harassing behavior toward venue staff or other users</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-green mr-2 mt-1">•</span>
                  <span>Attempting to manipulate reviews, ratings, or platform algorithms</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-green mr-2 mt-1">•</span>
                  <span>Using automated systems or bots to make bookings</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-green mr-2 mt-1">•</span>
                  <span>Reselling or transferring bookings without authorization</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-green mr-2 mt-1">•</span>
                  <span>Interfering with the platform's security features or functionality</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-green mr-2 mt-1">•</span>
                  <span>Violating venue rules or local laws during your visit</span>
                </li>
              </ul>
              
              <p className="text-medium-text leading-relaxed mt-4">
                Violation of these terms may result in account suspension or termination and legal action if necessary.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-bold text-dark-text mb-4 border-b-2 border-primary-green pb-2">
                7. Venue Responsibilities
              </h2>
              <p className="text-medium-text leading-relaxed mb-4">
                Venue owners on our platform must:
              </p>
              <ul className="space-y-2 text-medium-text">
                <li className="flex items-start">
                  <span className="text-primary-green mr-2 mt-1">•</span>
                  <span>Maintain accurate information about facilities, availability, and pricing</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-green mr-2 mt-1">•</span>
                  <span>Honor all confirmed bookings made through the platform</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-green mr-2 mt-1">•</span>
                  <span>Provide safe, clean, and functional facilities as advertised</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-green mr-2 mt-1">•</span>
                  <span>Comply with local regulations and safety standards</span>
                </li>
              </ul>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-2xl font-bold text-dark-text mb-4 border-b-2 border-primary-green pb-2">
                8. Intellectual Property Rights
              </h2>
              <p className="text-medium-text leading-relaxed">
                All content on PlayNation, including but not limited to text, graphics, logos, images, software, and design elements, is the property of PlayNation or its licensors and is protected by Indian and international copyright, trademark, and intellectual property laws. You may not copy, reproduce, distribute, modify, or create derivative works without our express written permission.
              </p>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-2xl font-bold text-dark-text mb-4 border-b-2 border-primary-green pb-2">
                9. Reviews and User Content
              </h2>
              <p className="text-medium-text leading-relaxed mb-4">
                Users may submit reviews, ratings, and feedback about venues:
              </p>
              <div className="space-y-3">
                <p className="text-medium-text">
                  • By posting content, you grant PlayNation a non-exclusive, royalty-free license to use, display, and distribute your content on our platform
                </p>
                <p className="text-medium-text">
                  • Reviews must be honest, factual, and based on personal experience
                </p>
                <p className="text-medium-text">
                  • We reserve the right to remove content that is offensive, defamatory, or violates our community guidelines
                </p>
                <p className="text-medium-text">
                  • You are responsible for the content you post and its consequences
                </p>
              </div>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-2xl font-bold text-dark-text mb-4 border-b-2 border-primary-green pb-2">
                10. Disclaimers and Limitation of Liability
              </h2>
              <div className="bg-light-green-bg p-5 rounded-md space-y-4">
                <p className="text-medium-text leading-relaxed">
                  <span className="font-semibold text-dark-text">Platform Services:</span> PlayNation provides the platform "as is" without warranties of any kind, express or implied. We do not guarantee uninterrupted, error-free, or secure access to our services.
                </p>
                
                <p className="text-medium-text leading-relaxed">
                  <span className="font-semibold text-dark-text">Venue Quality:</span> We are not responsible for the quality, safety, or legality of venues or services provided by venue owners. Disputes regarding venue services should be resolved directly with the venue.
                </p>
                
                <p className="text-medium-text leading-relaxed">
                  <span className="font-semibold text-dark-text">Limitation of Liability:</span> To the maximum extent permitted by law, PlayNation shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising from your use of our platform. Our total liability shall not exceed the amount you paid for the booking in question.
                </p>
                
                <p className="text-medium-text leading-relaxed">
                  <span className="font-semibold text-dark-text">Personal Safety:</span> Users are responsible for their own safety during venue visits. We recommend following all venue rules and safety guidelines.
                </p>
              </div>
            </section>

            {/* Section 11 */}
            <section>
              <h2 className="text-2xl font-bold text-dark-text mb-4 border-b-2 border-primary-green pb-2">
                11. Dispute Resolution
              </h2>
              <p className="text-medium-text leading-relaxed mb-4">
                In case of disputes:
              </p>
              <div className="space-y-3 text-medium-text">
                <p>
                  <span className="font-semibold">First Step:</span> Contact our customer support team at hello@playnation.com. We will attempt to resolve issues amicably within 15 business days.
                </p>
                <p>
                  <span className="font-semibold">Mediation:</span> If direct resolution fails, both parties agree to attempt mediation before pursuing legal action.
                </p>
                <p>
                  <span className="font-semibold">Jurisdiction:</span> Any legal disputes shall be subject to the exclusive jurisdiction of courts in Surat, Gujarat, India.
                </p>
              </div>
            </section>

            {/* Section 12 */}
            <section>
              <h2 className="text-2xl font-bold text-dark-text mb-4 border-b-2 border-primary-green pb-2">
                12. Governing Law
              </h2>
              <p className="text-medium-text leading-relaxed">
                These Terms of Service shall be governed by and construed in accordance with the laws of India, without regard to conflict of law principles. You agree to comply with all applicable local, state, national, and international laws and regulations.
              </p>
            </section>

            {/* Section 13 */}
            <section>
              <h2 className="text-2xl font-bold text-dark-text mb-4 border-b-2 border-primary-green pb-2">
                13. Modifications to Terms
              </h2>
              <p className="text-medium-text leading-relaxed">
                PlayNation reserves the right to modify these Terms of Service at any time. We will notify users of significant changes via email or platform notification at least 7 days before the changes take effect. Continued use of the platform after changes are implemented constitutes acceptance of the modified terms.
              </p>
            </section>

            {/* Section 14 */}
            <section>
              <h2 className="text-2xl font-bold text-dark-text mb-4 border-b-2 border-primary-green pb-2">
                14. Account Termination
              </h2>
              <p className="text-medium-text leading-relaxed">
                We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent activity. You may delete your account at any time through account settings. Upon termination, your access to bookings and platform features will cease, though certain legal obligations may continue.
              </p>
            </section>

            {/* Section 15 */}
            <section>
              <h2 className="text-2xl font-bold text-dark-text mb-4 border-b-2 border-primary-green pb-2">
                15. Force Majeure
              </h2>
              <p className="text-medium-text leading-relaxed">
                PlayNation shall not be liable for any failure to perform obligations due to circumstances beyond our reasonable control, including natural disasters, government actions, pandemics, technical failures, or venue closures. In such cases, bookings may be cancelled with full refunds.
              </p>
            </section>

            {/* Section 16 */}
            <section className="bg-primary-green-light bg-opacity-10 p-6 rounded-md border border-primary-green-light">
              <h2 className="text-2xl font-bold text-dark-text mb-4">
                16. Contact Information
              </h2>
              <p className="text-medium-text leading-relaxed mb-4">
                For questions, concerns, or support regarding these Terms of Service:
              </p>
              <div className="space-y-2 text-medium-text">
                <p><span className="font-semibold">Email:</span> <a href="mailto:hello@playnation.com" className="text-primary-green hover:text-primary-green-dark underline">hello@playnation.com</a></p>
                <p><span className="font-semibold">Customer Support:</span> support@playnation.com</p>
                <p><span className="font-semibold">Legal Inquiries:</span> legal@playnation.com</p>
              </div>
            </section>

          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-light-text text-sm">
            By using PlayNation's services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
}

export default TermsOfServicePage;