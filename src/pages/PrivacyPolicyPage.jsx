import React from 'react';

function PrivacyPolicyPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-12 sm:py-16 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-dark-text mb-3">
            Privacy Policy
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
                1. Introduction
              </h2>
              <p className="text-medium-text leading-relaxed">
                Welcome to PlayNation, your trusted platform for booking gaming slots at sports and entertainment venues. We respect your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, store, and safeguard your data when you use our online slot booking services.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold text-dark-text mb-4 border-b-2 border-primary-green pb-2">
                2. Information We Collect
              </h2>
              <p className="text-medium-text leading-relaxed mb-4">
                To provide you with seamless booking experiences, we collect the following information:
              </p>
              
              <div className="space-y-4">
                <div className="bg-light-green-bg p-4 rounded-md border-l-4 border-primary-green">
                  <h3 className="font-semibold text-dark-text mb-2">Personal Information</h3>
                  <p className="text-medium-text text-sm">
                    Full name, email address, phone number, date of birth, and profile picture (optional). Payment details including credit/debit card information or digital wallet details for processing transactions.
                  </p>
                </div>
                
                <div className="bg-light-green-bg p-4 rounded-md border-l-4 border-primary-green">
                  <h3 className="font-semibold text-dark-text mb-2">Booking Information</h3>
                  <p className="text-medium-text text-sm">
                    Venue preferences, game types, slot timings, number of players, special requests, and booking history.
                  </p>
                </div>
                
                <div className="bg-light-green-bg p-4 rounded-md border-l-4 border-primary-green">
                  <h3 className="font-semibold text-dark-text mb-2">Technical Data</h3>
                  <p className="text-medium-text text-sm">
                    IP address, device information, browser type, operating system, location data (with your permission), and usage analytics including pages visited and features used.
                  </p>
                </div>
                
                <div className="bg-light-green-bg p-4 rounded-md border-l-4 border-primary-green">
                  <h3 className="font-semibold text-dark-text mb-2">Communication Data</h3>
                  <p className="text-medium-text text-sm">
                    Messages exchanged with venue owners, customer support interactions, reviews and ratings you provide.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold text-dark-text mb-4 border-b-2 border-primary-green pb-2">
                3. How We Use Your Information
              </h2>
              <p className="text-medium-text leading-relaxed mb-4">
                Your information helps us deliver exceptional service:
              </p>
              <ul className="space-y-2 text-medium-text">
                <li className="flex items-start">
                  <span className="text-primary-green mr-2 mt-1">•</span>
                  <span>Process and confirm your game slot bookings instantly</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-green mr-2 mt-1">•</span>
                  <span>Securely process payments and issue refunds when applicable</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-green mr-2 mt-1">•</span>
                  <span>Send booking confirmations, reminders, and updates via email or SMS</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-green mr-2 mt-1">•</span>
                  <span>Facilitate communication between you and venue owners</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-green mr-2 mt-1">•</span>
                  <span>Personalize your experience with venue recommendations based on your preferences</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-green mr-2 mt-1">•</span>
                  <span>Improve our platform features and user experience</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-green mr-2 mt-1">•</span>
                  <span>Send promotional offers and updates about new venues (with your consent)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-green mr-2 mt-1">•</span>
                  <span>Prevent fraud and ensure platform security</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-green mr-2 mt-1">•</span>
                  <span>Comply with legal requirements and resolve disputes</span>
                </li>
              </ul>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold text-dark-text mb-4 border-b-2 border-primary-green pb-2">
                4. Information Sharing
              </h2>
              <p className="text-medium-text leading-relaxed mb-4">
                We may share your information with trusted third parties only when necessary:
              </p>
              <div className="space-y-3">
                <div className="bg-hover-bg p-3 rounded-md">
                  <p className="text-medium-text">
                    <span className="font-semibold text-dark-text">Venue Partners:</span> Your name, contact details, and booking information are shared with venue owners to facilitate your reservation and ensure smooth service delivery.
                  </p>
                </div>
                <div className="bg-hover-bg p-3 rounded-md">
                  <p className="text-medium-text">
                    <span className="font-semibold text-dark-text">Payment Processors:</span> We use secure third-party payment gateways to process transactions. Your payment information is encrypted and handled according to PCI-DSS standards.
                  </p>
                </div>
                <div className="bg-hover-bg p-3 rounded-md">
                  <p className="text-medium-text">
                    <span className="font-semibold text-dark-text">Service Providers:</span> Cloud hosting services, email delivery platforms, SMS providers, and analytics tools that help us operate our platform.
                  </p>
                </div>
                <div className="bg-hover-bg p-3 rounded-md">
                  <p className="text-medium-text">
                    <span className="font-semibold text-dark-text">Legal Requirements:</span> When required by law, court order, or government authorities, or to protect our rights and prevent fraud.
                  </p>
                </div>
              </div>
              <p className="text-medium-text leading-relaxed mt-4">
                We do not sell your personal information to third parties for marketing purposes.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-bold text-dark-text mb-4 border-b-2 border-primary-green pb-2">
                5. Data Security
              </h2>
              <p className="text-medium-text leading-relaxed mb-4">
                We implement industry-standard security measures to protect your data:
              </p>
              <ul className="space-y-2 text-medium-text">
                <li className="flex items-start">
                  <span className="text-primary-green mr-2 mt-1">•</span>
                  <span>SSL/TLS encryption for all data transmission</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-green mr-2 mt-1">•</span>
                  <span>Secure servers with regular security audits and updates</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-green mr-2 mt-1">•</span>
                  <span>Limited employee access to personal information on a need-to-know basis</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-green mr-2 mt-1">•</span>
                  <span>Regular backup systems to prevent data loss</span>
                </li>
              </ul>
              <p className="text-medium-text leading-relaxed mt-4 italic">
                While we take reasonable measures to protect your information, no system is completely secure. We encourage you to use strong passwords and keep your login credentials confidential.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-bold text-dark-text mb-4 border-b-2 border-primary-green pb-2">
                6. Data Retention
              </h2>
              <p className="text-medium-text leading-relaxed">
                We retain your personal information for as long as your account is active or as needed to provide services. Booking history is maintained for 3 years for record-keeping and dispute resolution. After account deletion, we may retain certain information for legal compliance, fraud prevention, and resolving disputes, typically for up to 7 years as required by Indian law.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-bold text-dark-text mb-4 border-b-2 border-primary-green pb-2">
                7. Your Rights and Choices
              </h2>
              <p className="text-medium-text leading-relaxed mb-4">
                You have the following rights regarding your personal information:
              </p>
              <div className="bg-light-green-bg p-5 rounded-md space-y-3">
                <p className="text-medium-text">
                  <span className="font-semibold text-dark-text">Access:</span> Request a copy of the personal information we hold about you
                </p>
                <p className="text-medium-text">
                  <span className="font-semibold text-dark-text">Correction:</span> Update or correct inaccurate information in your account settings
                </p>
                <p className="text-medium-text">
                  <span className="font-semibold text-dark-text">Deletion:</span> Request deletion of your account and personal data
                </p>
                <p className="text-medium-text">
                  <span className="font-semibold text-dark-text">Opt-out:</span> Unsubscribe from marketing communications at any time
                </p>
                <p className="text-medium-text">
                  <span className="font-semibold text-dark-text">Data Portability:</span> Request your data in a portable format
                </p>
              </div>
              <p className="text-medium-text leading-relaxed mt-4">
                To exercise these rights, contact us at hello@playnation.com. We will respond within 30 days.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-2xl font-bold text-dark-text mb-4 border-b-2 border-primary-green pb-2">
                8. Cookies and Tracking
              </h2>
              <p className="text-medium-text leading-relaxed">
                We use cookies and similar technologies to enhance your browsing experience, analyze platform usage, and deliver personalized content. You can manage cookie preferences through your browser settings, though disabling cookies may affect certain platform features.
              </p>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-2xl font-bold text-dark-text mb-4 border-b-2 border-primary-green pb-2">
                9. Children's Privacy
              </h2>
              <p className="text-medium-text leading-relaxed">
                Our services are intended for users aged 13 and above. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected such information, please contact us immediately.
              </p>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-2xl font-bold text-dark-text mb-4 border-b-2 border-primary-green pb-2">
                10. Changes to This Policy
              </h2>
              <p className="text-medium-text leading-relaxed">
                We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. We will notify you of significant changes via email or platform notification. Your continued use of PlayNation after changes are posted constitutes acceptance of the updated policy.
              </p>
            </section>

            {/* Section 11 */}
            <section className="bg-primary-green-light bg-opacity-10 p-6 rounded-md border border-primary-green-light">
              <h2 className="text-2xl font-bold text-dark-text mb-4">
                11. Contact Us
              </h2>
              <p className="text-medium-text leading-relaxed mb-4">
                If you have questions, concerns, or requests regarding this Privacy Policy or your personal information, please reach out to us:
              </p>
              <div className="space-y-2 text-medium-text">
                <p><span className="font-semibold">Email:</span> <a href="mailto:hello@playnation.com" className="text-primary-green hover:text-primary-green-dark underline">hello@playnation.com</a></p>
                <p><span className="font-semibold">Data Protection Officer:</span> privacy@playnation.com</p>
              </div>
            </section>

          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-light-text text-sm">
            By using PlayNation, you acknowledge that you have read and understood this Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicyPage;