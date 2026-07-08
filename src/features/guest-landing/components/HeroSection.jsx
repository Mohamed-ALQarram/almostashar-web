import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown, LockKeyhole, Search, ShieldCheck, UserCheck, Zap } from 'lucide-react';
import heroPoster from '../../../assets/Hero-Section.jpg';

const heroVideo = '/videos/almostashar-hero.mp4';

const trustPills = [
    { label: 'محامون معتمدون', icon: UserCheck },
    { label: 'خصوصية وأمان', icon: LockKeyhole },
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
        const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
        updatePreference();
        mediaQuery.addEventListener?.('change', updatePreference);
        return () => mediaQuery.removeEventListener?.('change', updatePreference);
    }, []);

    return (
        <section id="hero" className="bg-[linear-gradient(180deg,#FFFFFF_0%,#FAF9F6_58%,#F4F1E8_100%)] pt-28">
            <div className="section-container">
                <div className="grid min-h-[calc(100vh-7rem)] items-center gap-10 py-10 lg:grid-cols-[minmax(320px,0.92fr)_minmax(0,1.08fr)] lg:gap-16">
                    <div className="order-2 lg:order-2">
                        <div className="mx-auto max-w-[620px] rounded-[28px] border border-gold/25 bg-primary-dark p-3 shadow-xl shadow-primary/15">
                            <div className="mb-3 flex items-center justify-between px-2 text-xs font-bold text-white/70">
                                <span>تجربة المستشار</span>
                                <span className="text-gold">فيديو تعريفي</span>
                            </div>
                            {prefersReducedMotion ? (
                                <img
                                    src={heroPoster}
                                    alt="لقطة قانونية احترافية لمنصة المستشار"
                                    className="h-auto max-h-[520px] w-full rounded-[22px] object-contain"
                                />
                            ) : (
                                <video
                                    className="h-auto max-h-[520px] w-full rounded-[22px] object-contain"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    preload="metadata"
                                    poster={heroPoster}
                                    controls={false}
                                    aria-label="فيديو تعريفي لمنصة المستشار"
                                >
                                    <source src={heroVideo} type="video/mp4" />
                                </video>
                            )}
                        </div>
                    </div>

                    <div className="order-1 text-right lg:order-1">
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white px-4 py-2 text-xs font-extrabold text-primary shadow-sm">
                            <ShieldCheck className="h-4 w-4 text-gold" />
                            منصة قانونية رقمية موثوقة
                        </div>

                        <h1 className="mt-6 max-w-[560px] text-4xl font-black leading-[1.18] text-primary-dark sm:text-5xl lg:text-6xl">
                            استشارتك القانونية تبدأ بثقة
                        </h1>

                        <p className="mt-6 max-w-[560px] text-base leading-9 text-brand-muted sm:text-lg">
                            منصة رقمية تجمعك بمحامين معتمدين وتمنحك تجربة قانونية آمنة، سهلة، واحترافية في كل خطوة.
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Link to="/login" className="premium-button">
                                ابدأ استشارتك الآن
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                            <a href="#services" className="ghost-button">
                                استكشف الخدمات
                            </a>
                        </div>

                        <div className="mt-7 flex flex-wrap gap-2">
                            {trustPills.map((item) => (
                                <div key={item.label} className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white px-4 py-2 text-xs font-extrabold text-primary">
                                    <item.icon className="h-4 w-4 text-gold" />
                                    {item.label}
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 max-w-[620px] rounded-2xl border border-primary/10 bg-white p-3 shadow-sm">
                            <div className="grid gap-3 md:grid-cols-[180px_minmax(0,1fr)_130px]">
                                <div className="relative">
                                    <select
                                        className="h-12 w-full appearance-none rounded-xl border border-primary/10 bg-brand-page px-4 text-sm font-bold text-primary outline-none focus:border-gold"
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
                                        className="h-12 w-full rounded-xl border border-primary/10 bg-brand-page pl-4 pr-12 text-sm font-semibold text-primary outline-none placeholder:text-brand-muted/70 focus:border-gold"
                                        aria-label="البحث عن خدمة قانونية أو محام"
                                    />
                                </div>
                                <button type="button" className="h-12 rounded-xl bg-gold px-5 text-sm font-extrabold text-primary-dark hover:bg-gold-light">
                                    ابحث الآن
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
