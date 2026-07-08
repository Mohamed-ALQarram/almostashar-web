import { BrainCircuit, CheckCircle2, Fingerprint, Scale } from 'lucide-react';
import GuestSectionHeading from './GuestSectionHeading';

const trustCards = [
    {
        icon: BrainCircuit,
        title: 'تقنية تخدم القانون',
        description: 'واجهة واضحة تساعدك على الوصول للخدمة المناسبة بدون تعقيد أو ازدحام.',
    },
    {
        icon: Scale,
        title: 'خبرة مهنية',
        description: 'تجربة مصممة حول احتياجات العملاء القانونية، من أول بحث حتى بدء الطلب.',
    },
    {
        icon: Fingerprint,
        title: 'خصوصية محترمة',
        description: 'تقديم الملفات والبيانات القانونية في مسار منظم وهادئ يحافظ على الثقة.',
    },
];

const indicators = ['رحلة طلب واضحة', 'لغة قانونية مفهومة', 'تجربة عربية RTL'];

const AboutSection = () => {
    return (
        <section id="about" className="guest-section">
            <div className="section-container">
                <div className="rounded-[2rem] border border-primary/10 bg-white/95 p-6 shadow-xl shadow-primary/5 backdrop-blur sm:p-8 lg:p-12">
                    <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
                        <div>
                            <GuestSectionHeading
                                align="right"
                                eyebrow="من نحن"
                                title="المستشار منصة قانونية رقمية بهوية مهنية واضحة"
                                description="نبني تجربة قانونية عربية حديثة، هادئة، وموثوقة. الهدف ليس استعراضاً بصرياً، بل مسار عملي يساعد العميل على فهم احتياجه وبدء التواصل بثقة."
                            />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            {trustCards.map((card) => (
                                <div key={card.title} className="rounded-3xl border border-primary/10 bg-brand-page/80 p-5">
                                    <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-gold">
                                        <card.icon className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-black text-primary-dark">{card.title}</h3>
                                    <p className="mt-2 text-sm leading-7 text-brand-muted">{card.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 grid gap-3 border-t border-primary/10 pt-6 sm:grid-cols-3">
                        {indicators.map((item) => (
                            <div key={item} className="flex items-center gap-2 text-sm font-bold text-primary">
                                <CheckCircle2 className="h-5 w-5 text-gold" />
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
