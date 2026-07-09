import { FileLock2, Landmark, MousePointer2, ShieldCheck, UserCheck } from 'lucide-react';
import GuestSectionHeading from './GuestSectionHeading';

const values = [
    {
        icon: ShieldCheck,
        title: 'محامون موثوقون',
        description: 'نساعدك توصل لمحامين مناسبين لطبيعة الخدمة القانونية المطلوبة.',
    },
    {
        icon: FileLock2,
        title: 'خطوات واضحة من البداية',
        description: 'كل خدمة تعرض المطلوب منها بشكل مباشر قبل بدء الطلب.',
    },
    {
        icon: UserCheck,
        title: 'خصوصية للبيانات والمستندات',
        description: 'التجربة مصممة للتعامل مع الملفات القانونية باعتبارها بيانات حساسة.',
    },
    {
        icon: MousePointer2,
        title: 'متابعة منظمة للطلبات',
        description: 'تقدر تتابع طلبك وتراجع التفاصيل المطلوبة من داخل المنصة.',
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
                            title="خدمة قانونية أوضح من أول خطوة"
                            description="المستشار يركز على ما يحتاجه المستخدم فعلاً: اختيار خدمة مناسبة، تواصل واضح، ومتابعة منظمة للطلب."
                        />
                        <div className="mt-8 flex items-center gap-3 text-sm font-bold text-white/70">
                            <Landmark className="h-5 w-5 text-gold" />
                            واجهة هادئة تخدم القرار القانوني بدل ما تشتت المستخدم.
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
