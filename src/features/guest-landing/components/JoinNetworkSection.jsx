import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

const benefits = [
    'استقبال طلبات واضحة من عملاء يبحثون عن خدمة قانونية محددة',
    'إدارة حضورك المهني وخدماتك من مكان واحد',
    'متابعة منظمة للطلبات والتواصل مع العملاء',
    'ملف مهني يعرض تخصصك وخبرتك بصورة مناسبة',
];

const JoinNetworkSection = () => {
    return (
        <section className="guest-section bg-white">
            <div className="section-container">
                <div className="rounded-3xl bg-primary-dark p-6 text-white sm:p-8 lg:p-12">
                    <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
                        <div>
                            <span className="section-kicker">للمحامين</span>
                            <h2 className="mt-4 max-w-2xl text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
                                انضم لشبكة المستشار من المحامين
                            </h2>
                            <p className="mt-5 max-w-2xl text-sm leading-8 text-white/70 sm:text-base">
                                لو بتقدم خدمات قانونية باحتراف، المستشار يساعدك توصل لعملاء محتاجين دعم قانوني واضح ومنظم.
                            </p>
                            <Link to="/lawyer-register" className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-extrabold text-primary-dark transition hover:bg-gold-light">
                                سجّل كمحامٍ
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </div>

                        <div className="grid gap-3">
                            {benefits.map((benefit) => (
                                <div key={benefit} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm font-bold leading-7 text-white/80">
                                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-gold" />
                                    {benefit}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default JoinNetworkSection;
