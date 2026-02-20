import React, { useState, useEffect } from 'react';
import slider1 from '../assets/hero/slider1.png';
import slider2 from '../assets/hero/slider2.png';
import slider3 from '../assets/hero/slider3.png';

const slides = [
    { id: 1, image: slider1, alt: "Construction Site Analysis" },
    { id: 2, image: slider2, alt: "Blueprint Planning" },
    { id: 3, image: slider3, alt: "Sustainable Building" }
];

const HeroSlider = () => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative min-h-screen md:min-h-[750px] w-full flex flex-col md:flex-row font-sans bg-white overflow-hidden">

            {/* Highly Spiky Splat SVG Clip Path Definition (Hidden) */}
            <svg width="0" height="0" className="absolute">
                <defs>
                    <clipPath id="inkSplatMask" clipPathUnits="objectBoundingBox">
                        <path d="M.5,0.05 C0.53,0.01 0.55,0.08 0.58,0.02 C0.61,0.08 0.65,0.01 0.68,0.1 C0.72,0.18 0.78,0.05 0.82,0.15 C0.85,0.22 0.95,0.15 0.92,0.28 C0.89,0.35 1,0.38 0.95,0.45 C0.9,0.52 0.98,0.58 0.92,0.65 C0.86,0.72 1,0.85 0.9,0.88 C0.8,0.91 0.75,1 0.65,0.95 C0.55,0.9 0.52,1 0.45,0.95 C0.38,0.9 0.2,1 0.15,0.9 C0.1,0.8 0,0.85 0.05,0.75 C0.1,0.65 0,0.55 0.08,0.5 C0.15,0.45 0,0.35 0.12,0.28 C0.2,0.21 0.15,0.1 0.25,0.1 C0.35,0.1 0.4,0 0.45,0.08 C0.48,0.15 0.5,0.05 0.5,0.05 Z M0.15,0.2 C0.18,0.22 0.18,0.25 0.15,0.22 Z M0.85,0.4 C0.88,0.42 0.88,0.45 0.85,0.42 Z M0.3,0.85 C0.33,0.87 0.33,0.9 0.3,0.87 Z" />
                    </clipPath>
                </defs>
            </svg>

            {/* Left Content Section */}
            <div className="w-full md:w-1/2 px-5 py-8 pt-24 sm:p-8 md:p-20 md:pt-20 flex flex-col justify-center relative z-20 bg-white">
                <div className="animate-fade-in-left">
                    <div className="inline-flex items-center space-x-2 bg-primary-pale text-navy-900 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full w-fit mb-4 sm:mb-8 border border-primary/20 shadow-sm">
                        <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-primary animate-ping"></span>
                        <span className="text-xs sm:text-sm font-semibold">Live ERP Portal</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-navy-900 leading-[0.95] mb-4 sm:mb-6 tracking-tighter">
                        CONSTRUCT <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-indigo-600">
                            EVERYTHING.
                        </span>
                    </h1>

                    <p className="text-lg sm:text-xl md:text-2xl text-gray-400 mb-6 sm:mb-10 max-w-lg font-medium leading-tight">
                        The spiky edge you need. Real-time manpower & material tracking for <span className="text-navy-900 border-b-4 border-primary">modern giants</span>.
                    </p>

                    <div className="flex flex-col gap-3 sm:gap-5 mb-8 sm:mb-12">
                        <button className="bg-primary hover:bg-primary-dark text-white font-black text-base sm:text-lg py-4 sm:py-5 px-8 sm:px-10 rounded-2xl shadow-2xl shadow-primary/40 transform hover:-translate-y-2 transition-all duration-300 flex items-center justify-center gap-3 active:scale-95">
                            START NOW <i className="fas fa-bolt"></i>
                        </button>
                        <button className="bg-white hover:bg-gray-50 text-navy-900 font-bold py-4 sm:py-5 px-8 sm:px-10 rounded-2xl border-2 border-gray-100 shadow-xl transition-all duration-300 flex items-center justify-center gap-3 group">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-navy-900 text-white flex items-center justify-center transform group-hover:rotate-[360deg] transition-transform duration-700">
                                <i className="fas fa-play text-xs ml-0.5"></i>
                            </div>
                            SEE DEMO
                        </button>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6">
                        <div className="flex -space-x-3 sm:-space-x-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <img key={i} src={`https://i.pravatar.cc/100?img=${i + 30}`} alt="User" className="w-9 h-9 sm:w-12 sm:h-12 rounded-full border-3 sm:border-4 border-white shadow-xl hover:translate-y-[-10px] transition-transform duration-300 cursor-pointer" />
                            ))}
                        </div>
                        <div className="h-8 sm:h-10 w-[2px] bg-gray-100"></div>
                        <div>
                            <div className="flex text-primary text-xs sm:text-sm mb-0.5 sm:mb-1">
                                <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
                            </div>
                            <p className="text-[10px] sm:text-xs text-gray-400 font-bold tracking-wider sm:tracking-widest uppercase">Trusted by 500+ Projects</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Visual Section (Aggressive Splat Mask, Sliding Images) - Hidden on mobile */}
            <div className="hidden md:flex md:w-1/2 relative bg-white items-center justify-center p-4 md:p-8 overflow-hidden">

                {/* Background Spikes */}
                <div className="absolute inset-0 bg-navy-900/5 rotate-45 -z-10 translate-x-1/2"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-gradient-radial from-primary/10 via-transparent to-transparent opacity-50"></div>

                <div className="relative w-full max-w-2xl aspect-square z-10 flex items-center justify-center">

                    {/* Dark Shadow behind Splat */}
                    <div className="absolute inset-5 bg-navy-900/40 blur-[120px] -z-10 animate-pulse-slow"></div>

                    {/* Masked Mask Container using Very Spiky SVG clipPath */}
                    <div
                        className="w-[110%] h-[110%] relative aggressive-splat-animation"
                        style={{
                            clipPath: 'url(#inkSplatMask)',
                            WebkitClipPath: 'url(#inkSplatMask)',
                            backgroundColor: '#0F172A'
                        }}
                    >
                        <div className="flex h-full w-full transition-transform duration-1000 cubic-bezier(0.77, 0, 0.175, 1)" style={{ transform: `translate3d(-${current * 100}%, 0, 0)` }}>
                            {slides.map((slide) => (
                                <div key={slide.id} className="min-w-full h-full relative group">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-navy-900/40 via-transparent to-primary/20 z-10 opacity-60"></div>
                                    <img src={slide.image} alt={slide.alt} className="w-full h-full object-cover transform scale-110 group-hover:scale-125 transition-transform duration-[5s]" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Spiky Accents (Floating Diamonds) */}
                    <div className="absolute top-0 right-0 w-8 h-8 bg-primary/30 rotate-45 animate-bounce-slow"></div>
                    <div className="absolute bottom-10 left-0 w-6 h-6 bg-blue-500/30 rotate-[20deg] animate-bounce-delayed"></div>
                </div>

                {/* Vertical Indicators (Right Side) */}
                <div className="absolute right-10 top-1/2 -translate-y-1/2 z-30 flex flex-col space-y-4 bg-navy-900/5 p-4 rounded-full backdrop-blur-xl border border-white/20">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrent(index)}
                            className={`w-3 rounded-full transition-all duration-700 shadow-2xl ${index === current ? 'bg-primary h-12' : 'bg-navy-200 h-3 hover:bg-primary/40'}`}
                        />
                    ))}
                </div>

                {/* Dynamic Counter Overlay */}
                <div className="absolute bottom-12 left-12 z-30 transform hover:scale-110 transition-transform">
                    <div className="bg-white/90 backdrop-blur-3xl p-6 rounded-3xl shadow-2xl border border-white flex flex-col items-center">
                        <span className="text-4xl font-black text-navy-900 tracking-tighter">0{current + 1}</span>
                        <div className="w-8 h-1 bg-primary mt-1"></div>
                        <span className="text-[10px] font-black text-gray-400 mt-2 uppercase tracking-widest">PHASE</span>
                    </div>
                </div>
            </div>

            <style>
                {`
                    @keyframes splatAggressive {
                        0%, 100% { transform: scale(1) rotate(0deg); }
                        50% { transform: scale(1.05) rotate(-2deg); }
                    }
                    .aggressive-splat-animation {
                        animation: splatAggressive 15s ease-in-out infinite;
                    }
                    @keyframes floatSlow {
                        0%, 100% { transform: translateY(0) rotate(0deg); }
                        50% { transform: translateY(-20px) rotate(5deg); }
                    }
                    .float-animation {
                        animation: floatSlow 8s ease-in-out infinite;
                    }
                    @keyframes fadeInLeft {
                        from { opacity: 0; transform: translateX(-60px) skewX(-5deg); }
                        to { opacity: 1; transform: translateX(0) skewX(0deg); }
                    }
                    .animate-fade-in-left {
                        animation: fadeInLeft 1.5s cubic-bezier(0.19, 1, 0.22, 1) forwards;
                    }
                    @keyframes pulseSlow {
                        0%, 100% { opacity: 0.4; }
                        50% { opacity: 0.8; }
                    }
                    .animate-pulse-slow {
                        animation: pulseSlow 6s ease-in-out infinite;
                    }
                    @keyframes bounceSlow {
                        0%, 100% { transform: translateY(0) rotate(45deg); opacity: 0.4; }
                        50% { transform: translateY(-40px) rotate(90deg); opacity: 0.8; }
                    }
                    .animate-bounce-slow {
                        animation: bounceSlow 7s ease-in-out infinite;
                    }
                    .animate-bounce-delayed {
                        animation: bounceSlow 9s ease-in-out infinite;
                        animation-delay: 3s;
                    }
                `}
            </style>
        </div>
    );
};

export default HeroSlider;
