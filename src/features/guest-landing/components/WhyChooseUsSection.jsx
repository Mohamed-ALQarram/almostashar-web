import { FileLock2, Landmark, MousePointer2, ShieldCheck, UserCheck } from 'lucide-react';
import GuestSectionHeading from './GuestSectionHeading';

const values = [
    {
        icon: ShieldCheck,
        title: 'موثوقية عالية',
        description: 'تجربة مبنية حول الاعتماد، وضوح المعلومات، وحماية مصالح العميل.',
    },
    {
        icon: FileLock2,
        title: 'أمان وخصوصية',
        description: 'نهتم بطريقة عرض البيانات والمستندات بما يناسب حساسية العمل القانوني.',
    },
    {
        icon: UserCheck,
        title: 'محامون متخصصون',
        description: 'تسهيل الوصول إلى المختص المناسب حسب الخدمة والاحتياج.',
    },
    {
        icon: MousePointer2,
        title: 'تجربة رقمية سهلة',
        description: 'واجهة عربية مباشرة، واضحة، وتعمل بسلاسة على مختلف الأجهزة.',
    },
];

const WhyChooseUsSection = () => {
    return (
        <section id="why-us" className="guest-section bg-primary-dark text-white">
            <div className="section-container">
                <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
                    <div>
                        <GuestSectionHeading
                            align="right"
                            light
                            eyebrow="لماذا نحن"
                            title="تجربة قانونية أكثر وضوحاً من أول خطوة"
                            description="كل عنصر في الواجهة يخدم هدفاً واضحاً: فهم الخدمة، تقليل التشتت، وبناء ثقة حقيقية مع المستخدم."
                        />
                        <div className="mt-8 flex items-center gap-3 text-sm font-bold text-white/70">
                            <Landmark className="h-5 w-5 text-gold" />
                            تصميم يناسب طبيعة الخدمات القانونية، لا مجرد صفحة تسويقية.
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        {values.map((value) => (
                            <div key={value.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                                <value.icon className="h-6 w-6 text-gold" />
                                <h3 className="mt-5 text-lg font-black">{value.title}</h3>
                                <p className="mt-3 text-sm leading-7 text-white/70">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUsSection;
