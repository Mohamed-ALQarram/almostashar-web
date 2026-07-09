import phoneMockup from '../../../assets/Mobile-phone-mockup.png';
import logo from '../../../assets/AlMostashar-logo.png';

const MobileAppSection = () => {
    return (
        <div className="section-container my-16 sm:my-24">
            <section id="mobile-app" className="rounded-[2.5rem] py-16 sm:py-24 bg-primary-dark relative overflow-hidden shadow-2xl shadow-primary/10 border border-primary/5">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-10 right-10 w-60 h-60 rounded-full border border-white/20" />
                    <div className="absolute bottom-10 left-10 w-40 h-40 rounded-full border border-white/10" />
                </div>

                <div className="section-container relative z-10">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        {/* Content */}
                        <div className="text-center lg:text-right order-1 lg:order-1">
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-4 leading-tight">
                                مكتبك القانوني
                                <br />
                                <span className="text-gold">في جيبك</span>
                            </h2>
                            <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-8 max-w-md mx-auto lg:mx-0">
                                حمّل تطبيق المستشار واحصل على استشارات قانونية فورية في أي وقت ومن أي مكان
                            </p>
                            {/* Download Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                                <a
                                    href={import.meta.env.VITE_APP_STORE_LINK || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    dir="ltr"
                                    className="group relative flex w-full sm:w-[210px] items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gray-900/80 px-4 py-3.5 text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-black hover:shadow-gold/20 hover:ring-1 hover:ring-gold/50 border border-white/10"
                                >
                                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                                    <svg className="w-8 h-8 transition-transform group-hover:scale-110" viewBox="0 0 384 512" fill="currentColor">
                                        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                                    </svg>
                                    <div className="flex flex-col items-start text-left z-10">
                                        <span className="text-[10px] font-medium tracking-wide text-white/70">Download on the</span>
                                        <span className="font-sans text-[1.1rem] font-semibold leading-tight tracking-wide">App Store</span>
                                    </div>
                                </a>
                                <a
                                    href={import.meta.env.VITE_GOOGLE_PLAY_LINK || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    dir="ltr"
                                    className="group relative flex w-full sm:w-[210px] items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gray-900/80 px-4 py-3.5 text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-black hover:shadow-gold/20 hover:ring-1 hover:ring-gold/50 border border-white/10"
                                >
                                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                                    <svg className="w-8 h-8 transition-transform group-hover:scale-110" viewBox="0 0 512 512">
                                        <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1z" fill="#00e676" />
                                        <path d="M47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0z" fill="#00b0ff" />
                                        <path d="M472.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8z" fill="#ffea00" />
                                        <path d="M104.6 499l280.8-161.2-60.1-60.1L104.6 499z" fill="#ff3d00" />
                                    </svg>
                                    <div className="flex flex-col items-start text-left z-10">
                                        <span className="text-[10px] font-medium tracking-wide text-white/70">GET IT ON</span>
                                        <span className="font-sans text-[1.1rem] font-semibold leading-tight tracking-wide">Google Play</span>
                                    </div>
                                </a>
                            </div>
                        </div>

                        {/* Phone Mockup */}
                        <div className="flex justify-center order-2 lg:order-2">
                            <div className="relative">
                                {/* Phone Frame */}
                                <div className="relative w-56 sm:w-64 lg:w-72 mx-auto">
                                    {/* Outer shell */}
                                    <div className="bg-gray-900 rounded-[2.5rem] p-[6px] shadow-2xl shadow-black/40 border border-gray-700/50">
                                        {/* Inner bezel */}
                                        <div className="bg-black rounded-[2.2rem] overflow-hidden relative">
                                            {/* Notch / Dynamic Island */}
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 bg-black w-24 h-6 rounded-b-2xl flex items-center justify-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-gray-800 border border-gray-700" />
                                                <div className="w-10 h-3 rounded-full bg-gray-800 border border-gray-700" />
                                            </div>

                                            {/* Screenshot */}
                                            <img
                                                src={phoneMockup}
                                                alt="تطبيق المستشار"
                                                className="w-full h-auto block"
                                            />

                                            {/* Bottom bar indicator */}
                                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-white/30 rounded-full" />
                                        </div>
                                    </div>

                                    {/* Side buttons */}
                                    {/* Power button */}
                                    <div className="absolute -left-[2px] top-24 w-[3px] h-10 bg-gray-700 rounded-l-sm" />
                                    {/* Volume up */}
                                    <div className="absolute -right-[2px] top-20 w-[3px] h-6 bg-gray-700 rounded-r-sm" />
                                    {/* Volume down */}
                                    <div className="absolute -right-[2px] top-28 w-[3px] h-6 bg-gray-700 rounded-r-sm" />
                                </div>

                                {/* Glow effect */}
                                <div className="absolute inset-0 bg-gold/10 blur-3xl rounded-full -z-10 scale-75" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MobileAppSection;