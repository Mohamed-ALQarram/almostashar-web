import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import joinImg from '../../../assets/guest-premium-2.webp';

const benefits = [
    'استقبال طلبات قانونية منظمة من عملاء جادين',
    'إدارة مواعيدك وخدماتك من لوحة واحدة',
    'تجربة دفع ومتابعة مصممة للثقة والوضوح',
    'حضور رقمي يبرز خبرتك القانونية باحتراف',
];

const JoinNetworkSection = () => {
    return (
        <section className="guest-section bg-brand-page">
            <div className="section-container">
                <div className="relative overflow-hidden rounded-[2rem] bg-primary-dark shadow-2xl shadow-primary/20">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(212,175,55,0.18),transparent_25%),linear-gradient(135deg,rgba(26,43,74,0.55),transparent)]" aria-hidden="true" />
                    <div className="relative grid items-stretch lg:grid-cols-[1.05fr_0.95fr]">
                        <div className="p-7 sm:p-10 lg:p-14">
                            <span className="text-xs font-black uppercase tracking-[0.24em] text-gold">انضم إلى شبكتنا</span>
                            <h2 className="mt-4 max-w-2xl text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                                منصة تليق بخبرة المحامي المحترف
                            </h2>
                            <p className="mt-5 max-w-2xl text-sm leading-8 text-white/70 sm:text-base">
                                وسّع حضورك الرقمي عبر المستشار، واستقبل طلبات قانونية أكثر تنظيماً ضمن تجربة مصممة للثقة والاحتراف.
                            </p>

                            <div className="mt-8 grid gap-3 sm:grid-cols-2">
                                {benefits.map((benefit) => (
                                    <div key={benefit} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-sm font-semibold leading-7 text-white/80">
                                        <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-gold" />
                                        {benefit}
                                    </div>
                                ))}
                            </div>

                            <Link
                                to="/lawyer-register"
                                className="mt-9 inline-flex items-center justify-center gap-2 rounded-full bg-gold px-8 py-4 text-sm font-extrabold text-primary-dark shadow-2xl shadow-gold/20 transition hover:-translate-y-1 hover:bg-gold-light"
                            >
                                سجّل كمحامٍ
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </div>

                        <div className="relative min-h-[300px] lg:min-h-full">
                            <img
                                src={joinImg}
                                alt="مصافحة قانونية احترافية"
                                className="absolute inset-0 h-full w-full object-cover"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/35 to-transparent lg:bg-gradient-to-r" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default JoinNetworkSection;
