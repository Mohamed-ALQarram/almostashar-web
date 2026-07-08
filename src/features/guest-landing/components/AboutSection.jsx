import { BrainCircuit, CheckCircle2, Fingerprint, Scale } from 'lucide-react';
import aboutImg from '../../../assets/guest-premium-1.webp';
import GuestSectionHeading from './GuestSectionHeading';

const trustCards = [
    {
        icon: BrainCircuit,
        title: 'ذكاء قانوني',
        description: 'تجربة رقمية تساعدك على الوصول للخدمة المناسبة بسرعة ووضوح.',
    },
    {
        icon: Scale,
        title: 'محامون معتمدون',
        description: 'شبكة مهنية منتقاة للتعامل مع احتياجات الأفراد والشركات.',
    },
    {
        icon: Fingerprint,
        title: 'سرية وأمان',
        description: 'نهتم بخصوصية بياناتك ومستنداتك منذ أول خطوة في الطلب.',
    },
];

const indicators = ['توجيه واضح', 'ملفات منظمة', 'تجربة آمنة'];

const AboutSection = () => {
    return (
        <section id="about" className="guest-section bg-brand-page">
            <div className="section-container">
                <div className="grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
                    <div className="relative order-2 lg:order-1">
                        <div className="absolute -right-6 -top-6 hidden h-28 w-28 border-r border-t border-gold/35 sm:block" aria-hidden="true" />
                        <div className="overflow-hidden rounded-[2rem] border border-white shadow-2xl shadow-primary/10">
                            <img
                                src={aboutImg}
                                alt="محام يقدم استشارة قانونية داخل مكتب فاخر"
                                className="h-[360px] w-full object-cover sm:h-[500px]"
                                loading="lazy"
                            />
                        </div>
                        <div className="absolute -bottom-6 left-5 max-w-xs rounded-3xl border border-white/70 bg-white/90 p-5 shadow-2xl shadow-primary/15 backdrop-blur-xl">
                            <p className="text-xs font-bold text-gold">منصة المستشار</p>
                            <p className="mt-2 text-lg font-black leading-7 text-primary-dark">
                                قانون وتقنية في تجربة واحدة مصممة للثقة.
                            </p>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2">
                        <GuestSectionHeading
                            align="right"
                            eyebrow="من نحن"
                            title="منصة قانونية راقية تربطك بالخبرة المناسبة"
                            description="المستشار يبني تجربة عربية حديثة للخدمات القانونية، تجمع بين وضوح التقنية ورصانة العمل القانوني لتجعل طلب الاستشارة أكثر سهولة وتنظيماً واحترافية."
                        />

                        <div className="mt-8 grid gap-4 sm:grid-cols-3">
                            {trustCards.map((card) => (
                                <div key={card.title} className="premium-card p-5">
                                    <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-gold">
                                        <card.icon className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-black text-primary-dark">{card.title}</h3>
                                    <p className="mt-2 text-sm leading-7 text-brand-muted">{card.description}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 rounded-3xl border border-primary/10 bg-white p-5 shadow-xl shadow-primary/5">
                            <div className="grid gap-3 sm:grid-cols-3">
                                {indicators.map((item) => (
                                    <div key={item} className="flex items-center gap-2 text-sm font-bold text-primary">
                                        <CheckCircle2 className="h-5 w-5 text-gold" />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
