import { ClipboardCheck, ListChecks, MessageCircle } from 'lucide-react';
import GuestSectionHeading from './GuestSectionHeading';

const trustCards = [
    {
        icon: ClipboardCheck,
        title: 'اختر الخدمة',
        description: 'ابدأ من خدمة واضحة تناسب موقفك، بدل ما تضيع وقتك في خطوات غير محددة.',
    },
    {
        icon: MessageCircle,
        title: 'تواصل مع محامٍ',
        description: 'تواصل مع محامين موثوقين حسب نوع الطلب وطبيعة الملف القانوني.',
    },
    {
        icon: ListChecks,
        title: 'تابع طلبك',
        description: 'راجع حالة الطلب والمستندات المطلوبة من مكان واحد وبخطوات منظمة.',
    },
];

const AboutSection = () => {
    return (
        <section id="about" className="guest-section bg-white">
            <div className="section-container">
                <GuestSectionHeading
                    align="right"
                    eyebrow="من نحن"
                    title="منصة مصرية تجعل الخدمات القانونية أقرب وأسهل"
                    description="المستشار يسهّل الوصول للخدمات القانونية في مصر من خلال تجربة رقمية واضحة، تجمع بين اختيار الخدمة المناسبة، التواصل مع محامين موثوقين، ومتابعة الطلب من مكان واحد."
                />

                <div className="mt-9 grid gap-4 md:grid-cols-3">
                    {trustCards.map((card) => (
                        <div key={card.title} className="premium-card p-6">
                            <card.icon className="h-6 w-6 text-gold" />
                            <h3 className="mt-4 text-base font-black text-primary-dark">{card.title}</h3>
                            <p className="mt-3 text-sm leading-7 text-brand-muted">{card.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
