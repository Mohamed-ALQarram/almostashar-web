import phoneMockup from '../../../assets/Mobile-phone-mockup.png';
import logo from '../../../assets/AlMostashar-logo.png';

const MobileAppSection = () => {
    return (
        <section className="py-16 sm:py-24 bg-primary-dark relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-10 right-10 w-60 h-60 rounded-full border border-white/20" />
                <div className="absolute bottom-10 left-10 w-40 h-40 rounded-full border border-white/10" />
            </div>

            <div className="section-container relative z-10">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Content */}
                    <div className="text-center lg:text-right order-1 lg:order-1">
                        <img
                            src={logo}
                            alt="المستشار"
                            className="h-16 w-auto mx-auto lg:mx-0 mb-6"
                        />
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
                                href="#"
                                className="inline-flex items-center justify-center gap-3 bg-white/10 hover:bg-white/15 border border-white/20 hover:border-gold/50 rounded-xl px-6 py-3.5 transition-all duration-200"
                            >
                                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                                </svg>
                                <div className="text-right">
                                    <p className="text-white/60 text-[10px]">Download on the</p>
                                    <p className="text-white font-bold text-sm">App Store</p>
                                </div>
                            </a>
                            <a
                                href="#"
                                className="inline-flex items-center justify-center gap-3 bg-white/10 hover:bg-white/15 border border-white/20 hover:border-gold/50 rounded-xl px-6 py-3.5 transition-all duration-200"
                            >
                                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M3.18 23.49c-.36-.15-.59-.46-.64-.87L1.36 12.96c-.03-.33.07-.64.3-.89L12.3 1.55c.22-.23.53-.34.82-.3.3.04.56.21.72.47l8.47 14.13c.15.25.18.55.08.83-.1.27-.32.49-.59.6l-18.6 6.21zm1.33-2.09l15.14-5.06L13 5.35 4.51 21.4zM20.18 16.8L13.72 6.03l6.46 10.77z" />
                                </svg>
                                <div className="text-right">
                                    <p className="text-white/60 text-[10px]">Get it on</p>
                                    <p className="text-white font-bold text-sm">Google Play</p>
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* Phone Mockup */}
                    <div className="flex justify-center order-2 lg:order-2">
                        <div className="relative">
                            <img
                                src={phoneMockup}
                                alt="تطبيق المستشار"
                                className="w-56 sm:w-64 lg:w-72 h-auto drop-shadow-2xl"
                            />
                            {/* Glow effect */}
                            <div className="absolute inset-0 bg-gold/10 blur-3xl rounded-full -z-10 scale-75" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MobileAppSection;
