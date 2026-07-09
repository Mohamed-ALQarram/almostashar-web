import { Link } from 'react-router-dom';
import { Scale, FileText, Gavel, Building2, Briefcase, Users, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { usePublicServices } from '../hooks/usePublicServices';

// Map service types to icons (fallback mapping)
const SERVICE_ICON_MAP = {
    'Consultation': Scale,
    'ContractDrafting': FileText,
    'LegalRepresentation': Gavel,
    'CompanyFormation': Building2,
    'LaborCases': Briefcase,
    'PersonalStatus': Users,
};

// Fallback icons by index when serviceType doesn't match
const FALLBACK_ICONS = [Scale, FileText, Gavel, Building2, Briefcase, Users];

// Dummy descriptions when summary is null
const DUMMY_SUMMARIES = {
    'Consultation': 'احصل على استشارات قانونية دقيقة وموثوقة من نخبة من المحامين المعتمدين في مختلف التخصصات.',
    'ContractDrafting': 'صياغة ومراجعة كافة أنواع العقود التجارية والمدنية باحترافية عالية لحماية حقوقك.',
    'LegalRepresentation': 'تمثيل قانوني متكامل أمام كافة المحاكم والجهات القضائية للدفاع عن مصالحك.',
    'CompanyFormation': 'خدمات متكاملة لتأسيس الشركات واستخراج التراخيص اللازمة لبدء نشاطك التجاري.',
    'LaborCases': 'متخصصون في حل النزاعات العمالية وحماية حقوق الموظفين وأصحاب العمل.',
    'PersonalStatus': 'معالجة قضايا الأسرة والأحوال الشخصية بسرية تامة واحترافية عالية.',
};

const DEFAULT_SUMMARY = 'خدمة قانونية متكاملة يقدمها فريق من المحامين المتخصصين لمساعدتك في تحقيق أهدافك القانونية.';

const getIcon = (service, index) => {
    return SERVICE_ICON_MAP[service.serviceType] || FALLBACK_ICONS[index % FALLBACK_ICONS.length];
};

const getSummary = (service) => {
    return service.summary || DUMMY_SUMMARIES[service.serviceType] || DEFAULT_SUMMARY;
};

const ServicesSection = () => {
    const { data: services, isLoading, isError } = usePublicServices();

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

                {/* Loading */}
                {isLoading && (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-8 h-8 text-gold animate-spin" />
                    </div>
                )}

                {/* Error */}
                {isError && (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <AlertCircle className="w-10 h-10 text-error/60" />
                        <p className="text-brand-muted text-sm">حدث خطأ أثناء تحميل الخدمات. يرجى المحاولة لاحقاً.</p>
                    </div>
                )}

                {/* Services Grid */}
                {!isLoading && !isError && services?.length > 0 && (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {services.map((service, index) => {
                            const Icon = getIcon(service, index);
                            const summary = getSummary(service);

                            return (
                                <Link
                                    key={service.id}
                                    to={`/services/${service.id}`}
                                    className="flex flex-col items-center justify-center group bg-brand-page border border-gray-100 rounded-2xl p-6 sm:p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                                >
                                    <div className="w-16 h-16 rounded-xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300 border border-gray-100 group-hover:border-primary">
                                        <img src={service.iconUrl} alt={service.title} className="w-full h-full rounded-xl text-gold group-hover:text-white transition-colors duration-300" />
                                    </div>
                                    <h3 className="text-xl font-bold text-primary mb-3">
                                        {service.title}
                                    </h3>
                                    <p className="text-brand-muted text-sm leading-relaxed text-center mb-4">
                                        {summary}
                                    </p>
                                    <span className="inline-flex items-center gap-1 text-gold text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        عرض التفاصيل
                                        <ArrowLeft className="w-3.5 h-3.5" />
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {/* Empty state */}
                {!isLoading && !isError && (!services || services.length === 0) && (
                    <p className="text-center text-brand-muted py-16">لا توجد خدمات متاحة حالياً.</p>
                )}
            </div>
        </section>
    );
};

export default ServicesSection;