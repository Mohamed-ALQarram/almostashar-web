import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

const benefits = [
    'استقبال طلبات قانونية منظمة من عملاء جادين',
    'إدارة مواعيدك وخدماتك من لوحة واحدة',
    'تجربة دفع ومتابعة مصممة للثقة والوضوح',
    'حضور رقمي يبرز خبرتك القانونية باحتراف',
];

const JoinNetworkSection = () => {
    return (
        <section className="guest-section">
            <div className="section-container">
                <div className="rounded-[2rem] border border-primary/10 bg-white/95 p-6 shadow-xl shadow-primary/5 backdrop-blur sm:p-8 lg:p-12">
                    <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
                        <div>
                            <span className="text-xs font-black uppercase tracking-[0.24em] text-gold">انضم إلى شبكتنا</span>
                            <h2 className="mt-4 max-w-2xl text-3xl font-black leading-tight text-primary-dark sm:text-4xl lg:text-5xl">
                                منصة تليق بخبرة المحامي المحترف
                            </h2>
                            <p className="mt-5 max-w-2xl text-sm leading-8 text-brand-muted sm:text-base">
                                وسّع حضورك الرقمي عبر المستشار، واستقبل طلبات قانونية أكثر تنظيماً ضمن تجربة مصممة للثقة والاحتراف.
                            </p>
                        </div>

                        <div>
                            <div className="grid gap-3">
                                {benefits.map((benefit) => (
                                    <div key={benefit} className="flex items-start gap-3 rounded-2xl border border-primary/10 bg-brand-page/80 p-4 text-sm font-bold leading-7 text-primary">
                                        <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-gold" />
                                        {benefit}
                                    </div>
                                ))}
                            </div>

                            <Link
                                to="/lawyer-register"
                                className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-extrabold text-white shadow-xl shadow-primary/15 transition hover:-translate-y-0.5 hover:bg-primary-dark"
                            >
                                سجّل كمحامٍ
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default JoinNetworkSection;
