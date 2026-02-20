import React, { useState, useEffect } from 'react';
import HeroSlider from '../components/HeroSlider';
import { useNavigate } from 'react-router-dom';
import aboutImage from '../assets/hero/about.png';
import mobileAppImage from '../assets/hero/mobile_app.png';
import siteLogo from '../assets/site_ledger_logo-removebg-preview.png';

const Home = () => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const features = [
        { title: 'Analytics', icon: 'fas fa-chart-pie', desc: 'Real-time executive dashboards for data-driven decisions.' },
        { title: 'Projects', icon: 'fas fa-city', desc: 'Comprehensive site management and progress tracking.' },
        { title: 'Manpower', icon: 'fas fa-users-cog', desc: 'Streamlined HR, attendance, and onboarding processes.' },
        { title: 'Assets', icon: 'fas fa-truck-loading', desc: 'Track equipment location, usage, and maintenance.' },
        { title: 'Reports', icon: 'fas fa-file-contract', desc: 'Automated daily status reports (DPR) and insights.' },
        { title: 'Inventory', icon: 'fas fa-boxes', desc: 'Precise material stock tracking and procurement.' },
    ];

    return (
        <div className="min-h-screen bg-background text-text-main font-sans">
            {/* Navbar (Fixed/Sticky) */}
            <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2 sm:py-3' : 'bg-gradient-to-b from-navy-900/80 to-transparent py-3 sm:py-6'
                }`}>
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <img src={siteLogo} alt="Site Ledger" className={`w-auto transition-all duration-300 ${scrolled ? 'h-10 sm:h-12 md:h-14' : 'h-12 sm:h-16 md:h-20'}`} />
                    </div>
                    <button
                        onClick={() => navigate('/login')}
                        className={`font-medium px-4 sm:px-6 py-1.5 sm:py-2 rounded-full backdrop-blur-sm transition-all duration-300 flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base ${scrolled
                            ? 'bg-primary text-white hover:bg-primary-dark shadow-md'
                            : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                            }`}
                    >
                        <i className="fas fa-sign-in-alt text-xs sm:text-base"></i> Login
                    </button>
                </div>
            </nav>

            {/* Section 1: Hero Slider */}
            <HeroSlider />

            {/* Section 2: Why Us (Value Proposition) */}
            <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-white">
                <div className="container mx-auto text-center max-w-4xl">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-navy-900 mb-8 sm:mb-12">
                        Why Choose <span className="text-primary">Site Ledger?</span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
                        <div className="p-4 sm:p-6 rounded-2xl hover:bg-primary-pale transition-colors duration-300">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary-pale text-primary rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-xl sm:text-2xl">
                                <i className="fas fa-eye"></i>
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-navy-800">Real-Time Monitoring</h3>
                            <p className="text-text-light text-sm sm:text-base">See what's happening on every site, instantly, from anywhere in the world.</p>
                        </div>
                        <div className="p-4 sm:p-6 rounded-2xl hover:bg-primary-pale transition-colors duration-300">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary-pale text-primary rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-xl sm:text-2xl">
                                <i className="fas fa-coins"></i>
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-navy-800">Resource Optimization</h3>
                            <p className="text-text-light text-sm sm:text-base">Track every bag of cement and every hour of labor to maximize efficiency.</p>
                        </div>
                        <div className="p-4 sm:p-6 rounded-2xl hover:bg-primary-pale transition-colors duration-300 sm:col-span-2 md:col-span-1">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary-pale text-primary rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-xl sm:text-2xl">
                                <i className="fas fa-network-wired"></i>
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-navy-800">Seamless Connection</h3>
                            <p className="text-text-light text-sm sm:text-base">Bridge the gap between Head Office and remote construction sites effortlessly.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 3: Feature Highlights */}
            <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-primary-pale relative overflow-hidden">
                <div className="container mx-auto relative z-10">
                    <div className="text-center mb-8 sm:mb-12 md:mb-16">
                        <span className="text-primary font-bold uppercase tracking-wider text-xs sm:text-sm">Key Capabilities</span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-2 text-navy-900">Powerful Modules for Every Role</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 md:gap-6">
                        {features.map((feature, idx) => (
                            <div key={idx} className="bg-white p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border border-gray-100 shadow-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-default">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 bg-primary-pale rounded-lg sm:rounded-xl flex items-center justify-center text-base sm:text-lg md:text-xl text-primary mb-2 sm:mb-3 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                    <i className={feature.icon}></i>
                                </div>
                                <h3 className="text-xs sm:text-sm md:text-base font-bold mb-0.5 sm:mb-1 text-navy-900">{feature.title}</h3>
                                <p className="text-gray-500 text-[9px] sm:text-[10px] md:text-xs leading-tight">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 4: About The Platform */}
            <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-white">
                <div className="container mx-auto flex flex-col md:flex-row items-center gap-8 sm:gap-12 md:gap-16">
                    <div className="w-full md:w-1/2">
                        <div className="inline-block bg-primary-pale text-primary font-bold px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm mb-3 sm:mb-4">
                            Project Overview
                        </div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900 mb-4 sm:mb-6 leading-tight">
                            Bridging the Gap Between <span className="text-primary">Site & Office</span>
                        </h2>
                        <p className="text-text-light text-sm sm:text-base md:text-lg mb-4 sm:mb-6 leading-relaxed">
                            Site Ledger is not just a database; it's a living ecosystem for your construction projects.
                            We realized that 60% of construction inefficiencies come from communication delays between
                            the site engineer and the head office.
                        </p>
                        <p className="text-text-light text-sm sm:text-base md:text-lg mb-6 sm:mb-8 leading-relaxed">
                            Our platform eliminates paper logs, WhatsApp updates, and manual excel sheets.
                            Everything from <strong>Manpower Attendance</strong> to <strong>Material Requests</strong> happens
                            in real-time, ensuring transparency and accountability at every layer of the organization.
                        </p>
                        <div className="flex gap-4 sm:gap-6">
                            <div className="border-l-4 border-primary pl-3 sm:pl-4">
                                <h4 className="font-bold text-navy-900 text-lg sm:text-xl">100%</h4>
                                <p className="text-xs sm:text-sm text-gray-500">Digital Workflow</p>
                            </div>
                            <div className="border-l-4 border-primary pl-3 sm:pl-4">
                                <h4 className="font-bold text-navy-900 text-lg sm:text-xl">Zero</h4>
                                <p className="text-xs sm:text-sm text-gray-500">Data Redundancy</p>
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 relative mt-8 md:mt-0">
                        <div className="absolute inset-0 bg-primary rounded-2xl sm:rounded-3xl transform rotate-3 opacity-10"></div>
                        <img
                            src={aboutImage}
                            alt="Construction Team Meeting"
                            className="rounded-2xl sm:rounded-3xl shadow-2xl relative z-10 transform -rotate-2 hover:rotate-0 transition-all duration-500 w-full"
                        />
                    </div>
                </div>
            </section>

            {/* Section 5: How It Works (Workflow) */}
            <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-primary-pale/50">
                <div className="container mx-auto">
                    <div className="text-center mb-8 sm:mb-12 md:mb-16">
                        <h2 className="text-2xl sm:text-3xl font-bold text-navy-900">Seamless Operational Flow</h2>
                        <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base">From request to approval in minutes, not days.</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 md:gap-8 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gray-200 -z-10"></div>

                        {[
                            { step: '01', title: 'Site Request', icon: 'fas fa-mobile-alt', desc: 'Engineer logs attendance, assets, or material requests via mobile.' },
                            { step: '02', title: 'Instant Notify', icon: 'fas fa-bell', desc: 'Admin receives real-time notification on the Head Office dashboard.' },
                            { step: '03', title: 'Admin Action', icon: 'fas fa-check-circle', desc: 'Manager reviews data and approves or rejects the request.' },
                            { step: '04', title: 'Data Sync', icon: 'fas fa-database', desc: 'Inventory and Project status are automatically updated instantly.' }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white p-3 sm:p-4 md:p-6 rounded-xl shadow-card text-center relative group hover:-translate-y-2 transition-transform duration-300">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-primary text-white text-sm sm:text-base md:text-xl font-bold rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4 ring-2 sm:ring-4 ring-white relative z-10">
                                    {item.step}
                                </div>
                                <div className="text-xl sm:text-2xl md:text-3xl text-primary-light mb-2 sm:mb-4">
                                    <i className={item.icon}></i>
                                </div>
                                <h3 className="font-bold text-xs sm:text-base md:text-lg text-navy-900 mb-1 sm:mb-2">{item.title}</h3>
                                <p className="text-gray-500 text-[10px] sm:text-xs md:text-sm leading-tight">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 6: Success Stories (Testimonials) */}
            <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-white">
                <div className="container mx-auto">
                    <div className="text-center mb-8 sm:mb-12 md:mb-16">
                        <span className="text-primary font-bold uppercase tracking-wider text-xs sm:text-sm">Community Feedback</span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-2 text-navy-900">Trusted by Construction Giants</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                        {[
                            { quote: "Site Ledger cut our reporting time by 60%. It's a game changer for DPRs.", name: "Rajesh Kumar", role: "Senior Project Manager" },
                            { quote: "Finally, an app that actually works on site with bad network. Super reliable.", name: "David Chen", role: "Site Engineer" },
                            { quote: "The visibility I get from the head office is unprecedented. Highly recommend.", name: "Sarah Johnson", role: "Operations Director" }
                        ].map((testi, idx) => (
                            <div key={idx} className="bg-gray-50 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300">
                                <div className="text-primary text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-4 opacity-30">
                                    <i className="fas fa-quote-left"></i>
                                </div>
                                <p className="text-navy-800 text-sm sm:text-base md:text-lg mb-4 sm:mb-6 italic">"{testi.quote}"</p>
                                <div>
                                    <h4 className="font-bold text-navy-900 text-sm sm:text-base">{testi.name}</h4>
                                    <p className="text-primary text-xs sm:text-sm">{testi.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 7: Mobile App Promotion */}
            <section className="py-20 px-6 bg-navy-900 text-white relative overflow-hidden">
                <div className="container mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
                    <div className="md:w-1/2">
                        <span className="text-primary font-bold uppercase tracking-wider text-sm">Mobile First</span>
                        <h2 className="text-3xl md:text-5xl font-bold mt-2 mb-6">Manage Your Site From Your Pocket</h2>
                        <ul className="space-y-4 mb-8">
                            {['Offline Mode Support', 'Instant Photo Uploads', 'GPS Attendance Tracking', 'Voice-to-Text Notes'].map((item, idx) => (
                                <li key={idx} className="flex items-center space-x-3">
                                    <i className="fas fa-check-circle text-primary"></i>
                                    <span className="text-gray-300 text-lg">{item}</span>
                                </li>
                            ))}
                        </ul>
                        <button className="bg-primary hover:bg-primary-light text-white px-8 py-3 rounded-xl font-bold transition-colors inline-flex items-center gap-2">
                            <i className="fab fa-apple"></i> <i className="fab fa-google-play"></i> Download App
                        </button>
                    </div>
                    <div className="md:w-1/2 flex justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary opacity-20 blur-3xl rounded-full"></div>
                            <img src={mobileAppImage} alt="Site Ledger Mobile App" className="relative z-10 rounded-3xl shadow-2xl border-4 border-navy-800 transform rotate-3 hover:rotate-0 transition-all duration-500 max-w-xs md:max-w-sm" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 8: User Portals (Login) */}
            <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-background text-center">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-8 sm:mb-12 md:mb-16">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-navy-900 mb-2 sm:mb-4">Access Your Portal</h2>
                        <p className="text-text-light text-sm sm:text-base md:text-lg">Select your role to login to the dashboard.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-12 items-center">
                        {/* Admin Side */}
                        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-soft overflow-hidden group hover:shadow-xl transition-shadow duration-300">
                            <div className="h-32 sm:h-40 md:h-48 bg-gradient-to-r from-navy-900 to-navy-800 flex items-center justify-center p-4 sm:p-8 relative">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                                <i className="fas fa-user-tie text-4xl sm:text-5xl md:text-6xl text-white/90"></i>
                            </div>
                            <div className="p-4 sm:p-6 md:p-8 text-center">
                                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-navy-900 mb-1 sm:mb-2">Head Office</h3>
                                <p className="text-text-light text-sm mb-4 sm:mb-6 md:mb-8">For Super Admins & Managers</p>
                                <button
                                    onClick={() => navigate('/login?role=admin')}
                                    className="w-full py-3 sm:py-4 bg-navy-900 text-white rounded-xl font-bold hover:bg-navy-800 transition-colors shadow-lg shadow-navy-900/20 text-sm sm:text-base"
                                >
                                    Admin Login
                                </button>
                            </div>
                        </div>

                        {/* Engineer Side */}
                        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-soft overflow-hidden group hover:shadow-xl transition-shadow duration-300 border-2 border-transparent hover:border-primary-light/20">
                            <div className="h-32 sm:h-40 md:h-48 bg-gradient-to-r from-primary to-primary-light flex items-center justify-center p-4 sm:p-8 relative">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                                <i className="fas fa-hard-hat text-4xl sm:text-5xl md:text-6xl text-white/90"></i>
                            </div>
                            <div className="p-4 sm:p-6 md:p-8 text-center">
                                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-navy-900 mb-1 sm:mb-2">Site Operations</h3>
                                <p className="text-text-light text-sm mb-4 sm:mb-6 md:mb-8">For Site Engineers & Supervisors</p>
                                <button
                                    onClick={() => navigate('/login?role=engineer')}
                                    className="w-full py-3 sm:py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary-light transition-colors shadow-lg shadow-primary/30 text-sm sm:text-base"
                                >
                                    Engineer Login
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 5: Footer */}
            <footer className="bg-primary-pale text-navy-900 py-8 sm:py-10 md:py-12 border-t border-blue-900/10">
                <div className="container mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
                    <div className="col-span-2">
                        <div className="flex items-center space-x-2 text-navy-900 mb-3 sm:mb-4">
                            <img src={siteLogo} alt="Site Ledger" className="h-8 sm:h-10 w-auto" />
                            <span className="text-lg sm:text-xl font-bold">Site Ledger</span>
                        </div>
                        <p className="text-xs sm:text-sm text-navy-800/70 leading-relaxed max-w-sm">
                            Empowering construction companies with state-of-the-art tools for management, tracking, and execution. Built for efficiency.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-navy-900 font-bold mb-3 sm:mb-4 uppercase text-xs sm:text-sm tracking-wider">Quick Links</h4>
                        <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-navy-800/80">
                            <li><a href="#" className="hover:text-primary transition-colors">Support Center</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">System Status</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-navy-900 font-bold mb-3 sm:mb-4 uppercase text-xs sm:text-sm tracking-wider">Contact IT</h4>
                        <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-navy-800/80">
                            <li className="flex items-center space-x-2">
                                <i className="fas fa-envelope text-primary text-xs"></i>
                                <span className="truncate">support@infolexus.com</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <i className="fas fa-phone text-primary text-xs"></i>
                                <span>+91 98765 43210</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-blue-900/10 mt-8 sm:mt-10 md:mt-12 pt-4 sm:pt-6 text-center text-[10px] sm:text-xs text-navy-800/50">
                    &copy; {new Date().getFullYear()} Site Ledger by Infolexus. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Home;
