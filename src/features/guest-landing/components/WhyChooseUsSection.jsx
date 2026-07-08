import { Clock3, FileLock2, Landmark, ShieldCheck } from 'lucide-react';
import whyVisual from '../../../assets/guest-premium-3.webp';
import GuestSectionHeading from './GuestSectionHeading';

const features = [
    {
        icon: ShieldCheck,
        title: 'ثقة مهنية',
        description: 'نضع الاعتماد والخبرة والالتزام المهني في مقدمة تجربة كل عميل.',
    },
    {
        icon: FileLock2,
        title: 'خصوصية الملفات',
        description: 'تصميم يحترم حساسية المستندات القانونية ويجعل بياناتك في مسار منظم.',
    },
    {
        icon: Clock3,
        title: 'سرعة في الوصول',
        description: 'واجهة مختصرة تساعدك على تحديد احتياجك وبدء التواصل دون تعقيد.',
    },
    {
        icon: Landmark,
        title: 'تخصص قانوني',
        description: 'خدمات متنوعة تغطي احتياجات الأفراد ورواد الأعمال والشركات.',
    },
];

const WhyChooseUsSection = () => {
    return (
        <section id="why-us" className="guest-section bg-primary-dark text-white">
            <div className="section-container">
                <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
                    <div>
                        <GuestSectionHeading
                            align="right"
                            light
                            eyebrow="لماذا نحن"
                            title="تجربة قانونية تمنحك وضوحاً قبل القرار"
                            description="المستشار لا يقدم واجهة جميلة فقط، بل ينظم الرحلة القانونية من أول بحث إلى اختيار الخدمة والتواصل مع المختص."
                        />

                        <div className="mt-10 grid gap-4 sm:grid-cols-2">
                            {features.map((feature) => (
                                <div key={feature.title} className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/10 backdrop-blur-md transition hover:-translate-y-1 hover:border-gold/35">
                                    <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/10 text-gold">
                                        <feature.icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-lg font-black">{feature.title}</h3>
                                    <p className="mt-3 text-sm leading-7 text-white/70">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -left-6 -top-6 hidden h-36 w-36 rounded-full border border-gold/20 sm:block" aria-hidden="true" />
                        <div className="overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl shadow-black/30">
                            <img
                                src={whyVisual}
                                alt="مصافحة داخل مكتب قانوني فاخر"
                                className="h-[420px] w-full object-cover"
                                loading="lazy"
                            />
                        </div>
                        <div className="absolute -bottom-7 right-7 rounded-3xl border border-gold/25 bg-primary/90 p-5 shadow-2xl backdrop-blur-xl">
                            <p className="text-sm font-bold text-white/70">منهجية المستشار</p>
                            <p className="mt-2 text-2xl font-black text-gold">وضوح، سرية، إنجاز</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUsSection;
