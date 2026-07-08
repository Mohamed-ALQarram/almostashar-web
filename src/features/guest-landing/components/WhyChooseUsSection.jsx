import { Clock3, FileLock2, Landmark, ShieldCheck } from 'lucide-react';
import GuestSectionHeading from './GuestSectionHeading';

const features = [
    {
        icon: ShieldCheck,
        title: 'ثقة مهنية',
        description: 'واجهة وتجربة مصممة حول الجدية والاعتماد، لا حول المؤثرات الزائدة.',
    },
    {
        icon: FileLock2,
        title: 'خصوصية الملفات',
        description: 'كل نقطة في تجربة الطلب تراعي حساسية المستندات القانونية.',
    },
    {
        icon: Clock3,
        title: 'وصول أسرع',
        description: 'المستخدم يصل للخدمة أو المحامي المناسب عبر خطوات مختصرة وواضحة.',
    },
    {
        icon: Landmark,
        title: 'تنوع التخصصات',
        description: 'خدمات تغطي احتياجات الأفراد والشركات بروح قانونية منظمة.',
    },
];

const WhyChooseUsSection = () => {
    return (
        <section id="why-us" className="guest-section">
            <div className="section-container">
                <div className="rounded-[2rem] bg-primary-dark p-6 text-white shadow-2xl shadow-primary/20 sm:p-8 lg:p-12">
                    <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
                        <GuestSectionHeading
                            align="right"
                            light
                            eyebrow="لماذا نحن"
                            title="تصميم يخدم القرار القانوني"
                            description="المستشار يركز على الثقة، وضوح المعلومات، وسهولة بدء الطلب. لذلك الواجهة هادئة، عملية، ومناسبة لطبيعة الخدمات القانونية."
                        />

                        <div className="grid gap-4 sm:grid-cols-2">
                            {features.map((feature) => (
                                <div key={feature.title} className="rounded-3xl border border-white/10 bg-white/[0.06] p-6">
                                    <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/10 text-gold">
                                        <feature.icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-lg font-black">{feature.title}</h3>
                                    <p className="mt-3 text-sm leading-7 text-white/70">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUsSection;
