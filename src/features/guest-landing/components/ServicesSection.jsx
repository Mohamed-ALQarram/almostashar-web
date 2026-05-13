import { Scale, FileText, Gavel, Building2, Briefcase, Users } from 'lucide-react';

const services = [
    {
        icon: Scale,
        title: 'الاستشارات القانونية',
        description: 'احصل على استشارات قانونية دقيقة وموثوقة من نخبة من المحامين المعتمدين في مختلف التخصصات.',
    },
    {
        icon: FileText,
        title: 'صياغة العقود',
        description: 'صياغة ومراجعة كافة أنواع العقود التجارية والمدنية باحترافية عالية لحماية حقوقك.',
    },
    {
        icon: Gavel,
        title: 'التمثيل القانوني',
        description: 'تمثيل قانوني متكامل أمام كافة المحاكم والجهات القضائية للدفاع عن مصالحك.',
    },
    {
        icon: Building2,
        title: 'تأسيس الشركات',
        description: 'خدمات متكاملة لتأسيس الشركات واستخراج التراخيص اللازمة لبدء نشاطك التجاري.',
    },
    {
        icon: Briefcase,
        title: 'القضايا العمالية',
        description: 'متخصصون في حل النزاعات العمالية وحماية حقوق الموظفين وأصحاب العمل.',
    },
    {
        icon: Users,
        title: 'الأحوال الشخصية',
        description: 'معالجة قضايا الأسرة والأحوال الشخصية بسرية تامة واحترافية عالية.',
    },
];

const ServicesSection = () => {
    return (
        <section id="services" className="py-16 sm:py-24 bg-white">
            <div className="section-container">
                {/* Section Title */}
                <div className="text-center mb-16">
                    <span className="text-gold text-sm font-semibold tracking-wider">خدماتنا</span>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary mt-2">
                        خدمات قانونية متكاملة
                    </h2>
                    <div className="flex items-center justify-center gap-3 mt-4">
                        <span className="w-10 h-px bg-gold/40" />
                        <span className="w-2 h-2 rounded-full bg-gold" />
                        <span className="w-10 h-px bg-gold/40" />
                    </div>
                    <p className="text-brand-muted mt-6 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                        نقدم مجموعة شاملة من الخدمات القانونية لتلبية كافة احتياجاتك الفردية والتجارية،
                        من خلال فريق عمل متخصص من المحامين والمستشارين.
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center justify-center group bg-brand-page border border-gray-100 rounded-2xl p-6 sm:p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="w-14 h-14 rounded-xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300 border border-gray-100 group-hover:border-primary">
                                <service.icon className="w-7 h-7 text-gold group-hover:text-white transition-colors duration-300" />
                            </div>
                            <h3 className="text-xl font-bold text-primary mb-3">
                                {service.title}
                            </h3>
                            <p className="text-brand-muted text-sm leading-relaxed">
                                {service.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;
