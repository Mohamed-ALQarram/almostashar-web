import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown, LockKeyhole, Search, ShieldCheck, UserCheck, Zap } from 'lucide-react';
import heroPoster from '../../../assets/Hero-Section.jpg';

const heroVideo = '/videos/almostashar-hero.mp4';

const trustBadges = [
    { label: 'محامون معتمدون', icon: UserCheck },
    { label: 'خصوصية تامة', icon: LockKeyhole },
    { label: 'استجابة سريعة', icon: Zap },
];

const serviceOptions = [
    'استشارة قانونية',
    'صياغة عقود',
    'تمثيل قانوني',
    'تأسيس شركات',
    'قضايا عمالية',
    'أحوال شخصية',
];

const HeroSection = () => {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const syncPreference = () => setPrefersReducedMotion(mediaQuery.matches);
        syncPreference();
        mediaQuery.addEventListener?.('change', syncPreference);
        return () => mediaQuery.removeEventListener?.('change', syncPreference);
    }, []);

    return (
        <section id="hero" className="relative overflow-hidden border-b border-primary/10 bg-[#F7F5EF] pt-28 sm:pt-32">
            <div className="absolute inset-x-0 top-0 h-40 bg-white" aria-hidden="true" />
            <div className="section-container relative">
                <div className="grid items-center gap-8 py-8 lg:min-h-[calc(100vh-7rem)] lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-14 lg:py-10">
                    <div className="order-1 text-center lg:order-2 lg:text-right">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/25 bg-white px-4 py-2 text-xs font-extrabold text-primary shadow-sm">
                            <ShieldCheck className="h-4 w-4 text-gold" />
                            منصة قانونية رقمية موثوقة
                        </div>

                        <h1 className="mx-auto max-w-3xl text-3xl font-black leading-[1.2] text-primary-dark sm:text-5xl lg:mx-0 lg:text-7xl">
                            استشارتك القانونية
                            <span className="block text-gold">تبدأ بثقة</span>
                        </h1>

                        <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-brand-muted sm:text-lg lg:mx-0">
                            منصة رقمية تجمعك بمحامين معتمدين وتمنحك تجربة قانونية آمنة، سهلة، واحترافية في كل خطوة.
                        </p>

                        <div className="mt-7 flex flex-col gap-3 sm:flex-row lg:justify-start">
                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-extrabold text-white shadow-xl shadow-primary/15 transition hover:-translate-y-0.5 hover:bg-primary-dark"
                            >
                                ابدأ استشارتك الآن
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                            <a
                                href="#services"
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/15 bg-white px-7 py-4 text-sm font-extrabold text-primary shadow-sm transition hover:-translate-y-0.5 hover:border-gold/50 hover:text-gold"
                            >
                                استكشف الخدمات
                            </a>
                        </div>
                    </div>

                    <div className="order-2 lg:order-1">
                        <div className="relative">
                            <div className="mx-auto w-fit rounded-[1.75rem] border border-primary/10 bg-white p-2 shadow-2xl shadow-primary/15">
                                {prefersReducedMotion ? (
                                    <img
                                        src={heroPoster}
                                        alt="لقطة قانونية احترافية لمنصة المستشار"
                                        className="block max-h-[560px] w-auto max-w-full rounded-[1.35rem] lg:max-h-[640px]"
                                    />
                                ) : (
                                    <video
                                        className="block max-h-[560px] w-auto max-w-full rounded-[1.35rem] lg:max-h-[640px]"
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        preload="metadata"
                                        poster={heroPoster}
                                        aria-label="فيديو تعريفي لمنصة المستشار"
                                    >
                                        <source src={heroVideo} type="video/mp4" />
                                    </video>
                                )}
                            </div>
                            <div className="mt-4 grid grid-cols-3 gap-3">
                                {trustBadges.map((badge) => (
                                    <div key={badge.label} className="rounded-2xl border border-primary/10 bg-white px-3 py-3 text-center shadow-sm">
                                        <badge.icon className="mx-auto h-5 w-5 text-gold" />
                                        <p className="mt-2 text-xs font-extrabold text-primary">{badge.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pb-10 lg:-mt-8">
                    <div className="mx-auto max-w-5xl rounded-[1.35rem] border border-primary/10 bg-white p-3 shadow-xl shadow-primary/5">
                        <div className="grid gap-3 lg:grid-cols-[190px_minmax(0,1fr)_150px]">
                            <div className="relative">
                                <select
                                    className="min-h-[52px] w-full appearance-none rounded-2xl border border-primary/10 bg-brand-page px-4 py-3.5 text-sm font-bold text-primary outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/15"
                                    defaultValue=""
                                    aria-label="نوع الخدمة القانونية"
                                >
                                    <option value="" disabled>نوع الخدمة</option>
                                    {serviceOptions.map((option) => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted" />
                            </div>

                            <div className="relative">
                                <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gold" />
                                <input
                                    type="search"
                                    placeholder="ابحث عن خدمة قانونية أو محامٍ..."
                                    className="min-h-[52px] w-full rounded-2xl border border-primary/10 bg-brand-page py-3.5 pl-4 pr-12 text-sm font-semibold text-primary outline-none transition placeholder:text-brand-muted/70 focus:border-gold focus:ring-4 focus:ring-gold/15"
                                    aria-label="البحث عن خدمة قانونية أو محام"
                                />
                            </div>

                            <button
                                type="button"
                                className="min-h-[52px] rounded-2xl bg-gold px-5 py-3.5 text-sm font-extrabold text-primary-dark transition hover:bg-gold-light"
                            >
                                ابحث الآن
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
