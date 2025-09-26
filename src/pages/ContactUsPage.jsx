import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaUser, FaQuoteLeft } from 'react-icons/fa';

function ContactUsPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically handle form submission, e.g., send data to an API
        console.log('Form submitted:', formData);
        alert('Thank you for your message! We will get back to you shortly.');
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <div className="bg-background">
            <div className="container mx-auto px-4 py-16">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-extrabold text-dark-text mb-4">
                        Get in Touch
                    </h1>
                    <p className="text-xl text-medium-text max-w-3xl mx-auto">
                        We'd love to hear from you. Whether you have a question about venues, an offer, or just want to give feedback, our team is ready to help.
                    </p>
                </div>

                {/* Main Content Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Contact Info Card */}
                    <div className="lg:col-span-1 bg-card-bg rounded-3xl p-8 shadow-lg border border-border-color-light transition-all duration-300 hover:shadow-xl hover:scale-105">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-primary-green/20 rounded-full flex items-center justify-center mb-4">
                                <FaEnvelope className="text-2xl text-primary-green" />
                            </div>
                            <h3 className="text-2xl font-bold text-dark-text mb-2">
                                Contact Information
                            </h3>
                            <p className="text-medium-text text-sm mb-6">
                                Reach out to our team via email or phone.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-hover-bg rounded-xl">
                                <FaMapMarkerAlt className="text-primary-green text-lg flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-dark-text">Our Office</h4>
                                    <p className="text-medium-text text-sm">Surat, Gujarat, India</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-hover-bg rounded-xl">
                                <FaPhone className="text-primary-green text-lg flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-dark-text">Phone</h4>
                                    <p className="text-medium-text text-sm">+91 6353040453</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-hover-bg rounded-xl">
                                <FaEnvelope className="text-primary-green text-lg flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-dark-text">Email</h4>
                                    <p className="text-medium-text text-sm">hello@playnation.com</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2 bg-card-bg rounded-3xl p-8 shadow-lg border border-border-color-light">
                        <h2 className="text-3xl font-bold text-dark-text mb-6">
                            Send Us a Message
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-dark-text mb-2">
                                    Your Name
                                </label>
                                <div className="relative">
                                    <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-light-text" />
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 border border-border-color-light rounded-xl focus:ring focus:ring-primary-green/20 focus:border-primary-green transition-all duration-200"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-dark-text mb-2">
                                    Your Email
                                </label>
                                <div className="relative">
                                    <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-light-text" />
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 border border-border-color-light rounded-xl focus:ring focus:ring-primary-green/20 focus:border-primary-green transition-all duration-200"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-dark-text mb-2">
                                    Message
                                </label>
                                <div className="relative">
                                    <FaQuoteLeft className="absolute left-4 top-4 text-light-text" />
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows="6"
                                        className="w-full pl-12 pr-4 py-3 border border-border-color-light rounded-xl focus:ring focus:ring-primary-green/20 focus:border-primary-green transition-all duration-200"
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-4 px-6 bg-primary-green text-white font-semibold rounded-xl shadow-md transition-all duration-200 hover:bg-primary-green-dark hover:-translate-y-0.5"
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <FaPaperPlane />
                                    <span>Send Message</span>
                                </div>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContactUsPage;