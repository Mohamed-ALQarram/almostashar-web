import { useState, useEffect, useCallback } from 'react';
import aboutImg from '../../../assets/About-Section.jpg';
const slides = [
    {
        title: 'استشارات قانونية ذكية',
        description: 'المنصة تستخدم الذكاء الاصطناعي لتوفير استشارات قانونية فورية ومهنية',
    },
    {
        title: 'محامون معتمدون',
        description: 'نخبة من المحامين المعتمدين والمتخصصين في مختلف المجالات القانونية',
    },
    {
        title: 'سرية وخصوصية تامة',
        description: 'نضمن حماية بياناتك ومعلوماتك القانونية بأعلى معايير الأمان والسرية',
    },
];
const AboutSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, []);
    useEffect(() => {
        const interval = setInterval(nextSlide, 4000);
        return () => clearInterval(interval);
    }, [nextSlide]);
    return (
        <section id="about" className="py-16 sm:py-24 bg-brand-page">
            <div className="section-container">
                {/* Section Title */}
                <div className="text-center mb-12">
                    <span className="text-gold text-sm font-semibold tracking-wider">من نحن</span>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary mt-2">
                        "منصة المستشار"
                    </h2>
                    <div className="flex items-center justify-center gap-3 mt-4">
                        <span className="w-10 h-px bg-gold/40" />
                        <span className="w-2 h-2 rounded-full bg-gold" />
                        <span className="w-10 h-px bg-gold/40" />
                    </div>
                </div>
                {/* Content Grid */}
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Text Side */}
                    <div className="order-2 lg:order-1">
                        <p className="text-brand-muted leading-relaxed text-sm sm:text-base mb-8">
                            منصة المستشار هي منصتك القانونية الموثوقة التي تجمع بين التقنية الحديثة والخبرة القانونية العريقة.
                            نقدم لك استشارات قانونية ذكية مدعومة بالذكاء الاصطناعي، مع إمكانية التواصل المباشر مع نخبة من المحامين المعتمدين
                            في مختلف التخصصات القانونية.
                        </p>
                        {/* Slider */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
                            <div className="relative overflow-hidden min-h-[120px]">
                                {slides.map((slide, index) => (
                                    <div
                                        key={index}
                                        className={`transition-all duration-500 ${index === currentSlide
                                                ? 'opacity-100 translate-x-0'
                                                : 'opacity-0 absolute inset-0 translate-x-8'
                                            }`}
                                    >
                                        <h3 className="text-lg sm:text-xl font-bold text-primary mb-3">
                                            {slide.title}
                                        </h3>
                                        <p className="text-brand-muted text-sm leading-relaxed">
                                            {slide.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            {/* Dots */}
                            <div className="flex items-center justify-center gap-2 mt-6">
                                {slides.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentSlide(index)}
                                        className={`rounded-full transition-all duration-300 ${index === currentSlide
                                                ? 'w-8 h-2.5 bg-gold'
                                                : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gold/50'
                                            }`}
                                        aria-label={`Go to slide ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* Image Side */}
                    <div className="order-1 lg:order-2">
                        <div className="relative">
                            <div className="rounded-2xl overflow-hidden shadow-xl">
                                <img
                                    src={aboutImg}
                                    alt="منصة المستشار - استشارات قانونية ذكية"
                                    className="w-full h-[300px] sm:h-[400px] lg:h-[480px] object-cover"
                                />
                            </div>
                            {/* Decorative gold border accent */}
                            <div className="absolute -bottom-3 -right-3 w-full h-full border-2 border-gold/30 rounded-2xl -z-10" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
export default AboutSection;
