import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, ShieldCheck } from 'lucide-react';
import heroBg from '../../../assets/guest-trust-handshake.webp';
import heroPoster from '../../../assets/Hero-Section.jpg';

const heroVideo = '/videos/almostashar-hero.mp4';

const trustPills = [
    'منصة مصرية',
    'خصوصية في كل خطوة',
    'محامون موثوقون',
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
        <section id="hero" className="relative overflow-hidden bg-primary-dark pt-28">
            <img
                src={heroBg}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,27,42,0.34)_0%,rgba(13,27,42,0.58)_42%,rgba(13,27,42,0.86)_100%)]" />
            <div className="absolute inset-0 bg-primary-dark/10" />

            <div className="section-container relative z-10">
                <div className="grid items-center gap-10 py-12 lg:min-h-[760px] lg:grid-cols-[minmax(300px,0.92fr)_minmax(0,1.08fr)] lg:gap-16">
                    <div className="order-2 lg:order-2">
                        <div className="mx-auto flex w-full max-w-[500px] justify-center rounded-[24px] border border-white/20 bg-white/10 p-2 shadow-xl shadow-primary-dark/20 backdrop-blur-md">
                            {prefersReducedMotion ? (
                                <img
                                    src={heroPoster}
                                    alt="لقطة قانونية احترافية لمنصة المستشار"
                                    className="block h-auto max-h-[360px] w-auto max-w-full rounded-[18px]"
                                />
                            ) : (
                                <video
                                    className="block h-auto max-h-[360px] w-auto max-w-full rounded-[18px]"
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
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-extrabold text-white backdrop-blur-md">
                            <ShieldCheck className="h-4 w-4 text-gold" />
                            منصة مصرية للخدمات القانونية الرقمية
                        </div>

                        <h1 className="mt-6 max-w-[560px] text-4xl font-black leading-[1.18] text-white drop-shadow-sm sm:text-5xl lg:text-6xl">
                            شريكك القانوني في كل خطوة
                        </h1>

                        <p className="mt-6 max-w-[560px] text-base leading-9 text-white/[0.82] sm:text-lg">
                            المستشار منصة مصرية تساعدك تختار الخدمة القانونية المناسبة، تتواصل مع محامين موثوقين، وتتابع طلبك بخطوات واضحة وآمنة.
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Link to="/login" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-6 py-3 text-sm font-extrabold text-primary-dark transition hover:bg-gold-light">
                                ابدأ الآن
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                            <a href="#services" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3 text-sm font-extrabold text-white transition hover:bg-white/[0.16]">
                                تصفح الخدمات
                            </a>
                        </div>

                        <div className="mt-7 flex flex-wrap gap-2">
                            {trustPills.map((item) => (
                                <div key={item} className="rounded-full border border-white/[0.18] bg-white/10 px-4 py-2 text-xs font-extrabold text-white/90 backdrop-blur-md">
                                    {item}
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 max-w-[560px] rounded-2xl border border-white/[0.18] bg-white/[0.12] p-3 shadow-sm backdrop-blur-md">
                            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_120px]">
                                <div className="relative">
                                    <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gold" />
                                    <input
                                        type="search"
                                        placeholder="اكتب اسم الخدمة أو المحامي..."
                                        className="h-12 w-full rounded-xl border border-white/[0.18] bg-white/[0.92] pl-4 pr-12 text-sm font-semibold text-primary outline-none placeholder:text-brand-muted/70 focus:border-gold"
                                        aria-label="البحث عن خدمة قانونية أو محام"
                                    />
                                </div>
                                <button type="button" className="h-12 rounded-xl bg-gold px-5 text-sm font-extrabold text-primary-dark hover:bg-gold-light">
                                    بحث
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
