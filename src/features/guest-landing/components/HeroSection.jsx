import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown, LockKeyhole, Search, ShieldCheck, Sparkles, UserCheck, Zap } from 'lucide-react';
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
        <section id="hero" className="relative min-h-screen overflow-hidden bg-primary-dark">
            <div className="absolute inset-0">
                {prefersReducedMotion ? (
                    <img
                        src={heroPoster}
                        alt=""
                        className="h-full w-full object-cover"
                        aria-hidden="true"
                    />
                ) : (
                    <video
                        className="absolute inset-0 h-full w-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        poster={heroPoster}
                        aria-hidden="true"
                    >
                        <source src={heroVideo} type="video/mp4" />
                    </video>
                )}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_28%,rgba(212,175,55,0.18),transparent_28%),linear-gradient(90deg,rgba(13,27,42,0.56),rgba(13,27,42,0.9)_58%,rgba(13,27,42,0.98))]" />
                <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-brand-page via-brand-page/45 to-transparent" />
            </div>

            <div className="section-container relative z-10 flex min-h-screen items-center pb-36 pt-32 lg:pb-44">
                <div className="grid w-full items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.72fr)]">
                    <div className="max-w-3xl text-right">
                        <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-gold/25 bg-white/10 px-4 py-2 text-xs font-bold text-white shadow-2xl shadow-primary-dark/20 backdrop-blur-md">
                            <Sparkles className="h-4 w-4 text-gold" />
                            تجربة قانونية رقمية بمعايير راقية
                        </div>

                        <h1 className="text-4xl font-black leading-[1.25] text-white sm:text-5xl lg:text-7xl">
                            استشارتك القانونية
                            <span className="mt-2 block text-gold">تبدأ بثقة</span>
                        </h1>

                        <p className="mt-6 max-w-2xl text-base leading-9 text-white/75 sm:text-lg">
                            منصة رقمية تجمعك بمحامين معتمدين وتمنحك تجربة قانونية آمنة، سهلة، واحترافية في كل خطوة.
                        </p>

                        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-4 text-sm font-extrabold text-primary-dark shadow-2xl shadow-gold/20 transition hover:-translate-y-1 hover:bg-gold-light"
                            >
                                ابدأ استشارتك الآن
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                            <a
                                href="#services"
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-4 text-sm font-bold text-white backdrop-blur-md transition hover:-translate-y-1 hover:border-gold/50 hover:bg-white/15"
                            >
                                استكشف الخدمات
                            </a>
                        </div>

                        <div className="mt-9 grid gap-3 sm:grid-cols-3">
                            {trustBadges.map((badge) => (
                                <div
                                    key={badge.label}
                                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.08] px-4 py-3 text-sm font-bold text-white/90 backdrop-blur-md"
                                >
                                    <badge.icon className="h-5 w-5 text-gold" />
                                    {badge.label}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="hidden lg:block" aria-hidden="true">
                        <div className="relative mr-auto h-[430px] max-w-sm">
                            <div className="absolute left-0 top-8 h-56 w-56 rounded-full border border-gold/25" />
                            <div className="absolute bottom-0 right-0 w-72 rounded-3xl border border-white/10 bg-white/[0.08] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
                                <div className="mb-5 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-bold text-gold">ملف آمن</p>
                                        <p className="mt-1 text-lg font-black text-white">مراجعة قانونية</p>
                                    </div>
                                    <ShieldCheck className="h-10 w-10 text-gold" />
                                </div>
                                <div className="space-y-3">
                                    <span className="block h-2 rounded-full bg-white/25" />
                                    <span className="block h-2 w-10/12 rounded-full bg-white/20" />
                                    <span className="block h-2 w-8/12 rounded-full bg-white/10" />
                                </div>
                                <div className="mt-6 rounded-2xl border border-gold/20 bg-gold/10 p-4">
                                    <p className="text-xs leading-6 text-white/70">خصوصية المستندات والبيانات جزء أساسي من تجربة المستشار.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="section-container relative z-20 -mt-20 pb-10">
                <div className="premium-glass mx-auto max-w-5xl p-3 sm:p-4">
                    <div className="grid gap-3 lg:grid-cols-[220px_minmax(0,1fr)_170px]">
                        <div className="relative">
                            <select
                                className="h-full min-h-14 w-full appearance-none rounded-2xl border border-white/10 bg-white px-5 py-4 text-sm font-bold text-primary outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/15"
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
                            <Search className="pointer-events-none absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 text-gold" />
                            <input
                                type="search"
                                placeholder="ابحث عن خدمة قانونية أو محامٍ..."
                                className="min-h-14 w-full rounded-2xl border border-white/10 bg-white py-4 pl-5 pr-12 text-sm font-semibold text-primary outline-none transition placeholder:text-brand-muted/75 focus:border-gold focus:ring-4 focus:ring-gold/15"
                                aria-label="البحث عن خدمة قانونية أو محام"
                            />
                        </div>

                        <button
                            type="button"
                            className="min-h-14 rounded-2xl bg-primary px-6 py-4 text-sm font-extrabold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary-dark"
                        >
                            ابحث الآن
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
