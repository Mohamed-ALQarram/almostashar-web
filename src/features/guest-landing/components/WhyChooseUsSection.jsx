import { Shield, Scale, Users, Clock } from 'lucide-react';
import whyUs1 from '../../../assets/Why-Us1.1.jpg';
import whyUs2 from '../../../assets/Why-Us1.2.png';
import whyUs3 from '../../../assets/Why-Us1.3.jpg';
const features = [
    {
        icon: Shield,
        title: 'موثوقية عالية',
        description: 'محامون معتمدون ومرخصون بخبرات واسعة في مختلف المجالات القانونية',
    },
    {
        icon: Scale,
        title: 'عدالة وشفافية',
        description: 'نلتزم بأعلى معايير الشفافية والنزاهة في جميع الاستشارات القانونية',
    },
    {
        icon: Users,
        title: 'فريق متخصص',
        description: 'نخبة من المحامين المتخصصين في كافة فروع القانون لخدمتك',
    },
    {
        icon: Clock,
        title: 'استجابة سريعة',
        description: 'نوفر لك استشارات قانونية فورية على مدار الساعة بدون انتظار',
    },
];
const WhyChooseUsSection = () => {
    return (
        <section id="why-us" className="py-16 sm:py-24 bg-white">
            <div className="section-container">
                {/* Section Title */}
                <div className="text-center mb-12">
                    <span className="text-gold text-sm font-semibold tracking-wider">لماذا نحن</span>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary mt-2">
                        التميز في كل التفاصيل
                    </h2>
                    <div className="flex items-center justify-center gap-3 mt-4">
                        <span className="w-10 h-px bg-gold/40" />
                        <span className="w-2 h-2 rounded-full bg-gold" />
                        <span className="w-10 h-px bg-gold/40" />
                    </div>
                </div>
                {/* Content Grid */}
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Feature Cards */}
                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group bg-brand-page border border-gray-100 rounded-2xl p-5 sm:p-6 hover:shadow-lg hover:border-gold/30 transition-all duration-300"
                            >
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors duration-300">
                                    <feature.icon className="w-6 h-6 text-primary group-hover:text-gold transition-colors duration-300" />
                                </div>
                                <h3 className="text-base font-bold text-primary mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-brand-muted text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                    {/* Image Collage */}
                    <div className="relative grid grid-cols-2 gap-3 sm:gap-4">
                        <div className="col-span-2 rounded-2xl overflow-hidden shadow-lg">
                            <img
                                src={whyUs1}
                                alt="فريق المحامين"
                                className="w-full h-48 sm:h-64 object-cover hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        <div className="rounded-2xl overflow-hidden shadow-lg">
                            <img
                                src={whyUs2}
                                alt="خبرة قانونية"
                                className="w-full h-32 sm:h-44 object-cover hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        <div className="rounded-2xl overflow-hidden shadow-lg">
                            <img
                                src={whyUs3}
                                alt="استشارات قانونية"
                                className="w-full h-32 sm:h-44 object-cover hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        {/* Decorative badge */}
                        <div className="absolute top-4 right-4 bg-gold text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                            +15 سنة خبرة
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
export default WhyChooseUsSection;