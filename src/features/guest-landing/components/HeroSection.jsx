import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, ShieldCheck } from 'lucide-react';
import heroPoster from '../../../assets/Hero-Section.jpg';

const heroVideo = '/videos/almostashar-hero.mp4';

const trustPills = [
    'محامون موثوقون',
    'خصوصية في كل خطوة',
    'متابعة واضحة للطلب',
];

const HeroSection = () => {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
        updatePreference();
        mediaQuery.addEventListener?.('change', updatePreference);
        return () => mediaQuery.removeEventListener?.('change', updatePreference);
    }, []);

    return (
        <section id="hero" className="bg-brand-page pt-28">
            <div className="section-container">
                <div className="grid items-center gap-10 py-12 lg:min-h-[760px] lg:grid-cols-[minmax(300px,0.92fr)_minmax(0,1.08fr)] lg:gap-16">
                    <div className="order-2 lg:order-2">
                        <div className="mx-auto max-w-[360px] rounded-[28px] border border-primary/10 bg-white p-2 shadow-[0_18px_44px_rgba(13,27,42,0.08)] lg:max-w-[420px]">
                            {prefersReducedMotion ? (
                                <img
                                    src={heroPoster}
                                    alt="لقطة قانونية احترافية لمنصة المستشار"
                                    className="block h-auto w-full rounded-[24px]"
                                />
                            ) : (
                                <video
                                    className="block h-auto w-full rounded-[24px]"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    preload="metadata"
                                    poster={heroPoster}
                                    controls={false}
                                    aria-label="فيديو تعريفي لمنصة المستشار"
                                >
                                    {/* The source video should be exported without letterboxing for best presentation. */}
                                    <source src={heroVideo} type="video/mp4" />
                                </video>
                            )}
                        </div>
                    </div>

                    <div className="order-1 text-right lg:order-1">
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white px-4 py-2 text-xs font-extrabold text-primary shadow-sm">
                            <ShieldCheck className="h-4 w-4 text-gold" />
                            منصة مصرية للخدمات القانونية الرقمية
                        </div>

                        <h1 className="mt-6 max-w-[560px] text-4xl font-black leading-[1.18] text-primary-dark sm:text-5xl lg:text-6xl">
                            أوصل لمستشارك القانوني بثقة
                        </h1>

                        <p className="mt-6 max-w-[560px] text-base leading-9 text-brand-muted sm:text-lg">
                            المستشار منصة مصرية تساعدك تختار الخدمة القانونية المناسبة، تتواصل مع محامين موثوقين، وتتابع طلبك بخطوات واضحة وآمنة.
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Link to="/login" className="premium-button">
                                ابدأ الآن
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                            <a href="#services" className="ghost-button">
                                تصفح الخدمات
                            </a>
                        </div>

                        <div className="mt-7 flex flex-wrap gap-2">
                            {trustPills.map((item) => (
                                <div key={item} className="rounded-full border border-primary/10 bg-white px-4 py-2 text-xs font-extrabold text-primary">
                                    {item}
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 max-w-[560px] rounded-2xl border border-primary/10 bg-white p-3 shadow-sm">
                            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_120px]">
                                <div className="relative">
                                    <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gold" />
                                    <input
                                        type="search"
                                        placeholder="ابحث عن خدمة قانونية أو محامٍ..."
                                        className="h-12 w-full rounded-xl border border-primary/10 bg-brand-page pl-4 pr-12 text-sm font-semibold text-primary outline-none placeholder:text-brand-muted/70 focus:border-gold"
                                        aria-label="البحث عن خدمة قانونية أو محام"
                                    />
                                </div>
                                <button type="button" className="h-12 rounded-xl bg-gold px-5 text-sm font-extrabold text-primary-dark hover:bg-gold-light">
                                    ابحث
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
