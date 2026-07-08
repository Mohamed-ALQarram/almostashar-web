import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Briefcase, Building2, FileText, Gavel, Loader2, Scale, Users } from 'lucide-react';
import { usePublicServices } from '../hooks/usePublicServices';
import GuestSectionHeading from './GuestSectionHeading';

const SERVICE_ICON_MAP = {
    Consultation: Scale,
    ContractDrafting: FileText,
    LegalRepresentation: Gavel,
    CompanyFormation: Building2,
    LaborCases: Briefcase,
    PersonalStatus: Users,
};

const FALLBACK_ICONS = [Scale, FileText, Gavel, Building2, Briefcase, Users];

const SERVICE_SUMMARIES = {
    Consultation: 'استشارات قانونية واضحة تساعدك على فهم موقفك واتخاذ القرار بثقة.',
    ContractDrafting: 'صياغة ومراجعة العقود باحتراف يحمي مصالحك ويقلل المخاطر.',
    LegalRepresentation: 'تمثيل قانوني منظم ومتابعة دقيقة لإجراءات القضايا والملفات.',
    CompanyFormation: 'تأسيس الشركات وتجهيز المتطلبات القانونية لبداية أعمال مستقرة.',
    LaborCases: 'دعم متخصص في النزاعات العمالية وحقوق الموظفين وأصحاب العمل.',
    PersonalStatus: 'تعامل مهني وسري مع قضايا الأسرة والأحوال الشخصية.',
};

const getIcon = (service, index) => SERVICE_ICON_MAP[service.serviceType] || FALLBACK_ICONS[index % FALLBACK_ICONS.length];
const getSummary = (service) => service.summary || SERVICE_SUMMARIES[service.serviceType] || 'خدمة قانونية متخصصة يقدمها فريق المستشار لمساعدتك على الوصول للحل الأنسب.';

const ServicesSection = () => {
    const { data: services, isLoading, isError } = usePublicServices();

    return (
        <section id="services" className="guest-section bg-white">
            <div className="section-container">
                <GuestSectionHeading
                    eyebrow="خدماتنا"
                    title="خدمات قانونية مصممة لتجربة أكثر وضوحاً"
                    description="اختر الخدمة المناسبة وابدأ طلبك بخطوات مرتبة، مع واجهة تساعدك على فهم المتطلبات والتواصل مع المحامي المناسب."
                />

                {isLoading && (
                    <div className="mt-14 flex justify-center py-20">
                        <Loader2 className="h-10 w-10 animate-spin text-gold" />
                    </div>
                )}

                {isError && (
                    <div className="mx-auto mt-14 max-w-xl rounded-3xl border border-error/10 bg-error/5 p-8 text-center">
                        <AlertCircle className="mx-auto h-10 w-10 text-error/70" />
                        <p className="mt-4 text-sm font-semibold text-brand-muted">حدث خطأ أثناء تحميل الخدمات. يرجى المحاولة لاحقاً.</p>
                    </div>
                )}

                {!isLoading && !isError && services?.length > 0 && (
                    <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {services.map((service, index) => {
                            const Icon = getIcon(service, index);

                            return (
                                <Link
                                    key={service.id}
                                    to={`/services/${service.id}`}
                                    className="premium-card group relative flex min-h-[300px] flex-col overflow-hidden p-6 transition hover:-translate-y-1 hover:border-gold/35 hover:shadow-2xl hover:shadow-primary/10"
                                >
                                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-gold via-gold-light to-transparent opacity-0 transition group-hover:opacity-100" />
                                    <div className="mb-7 flex items-center justify-between gap-4">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-gold/20 bg-gold/10 text-gold transition group-hover:bg-primary group-hover:text-gold-light">
                                            {service.iconUrl ? (
                                                <img
                                                    src={service.iconUrl}
                                                    alt=""
                                                    className="h-9 w-9 object-contain"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <Icon className="h-8 w-8" />
                                            )}
                                        </div>
                                        <span className="rounded-full bg-brand-page px-3 py-1 text-[11px] font-bold text-brand-muted">
                                            خدمة قانونية
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-black leading-8 text-primary-dark">{service.title}</h3>
                                    <p className="mt-4 flex-1 text-sm leading-8 text-brand-muted">{getSummary(service)}</p>

                                    <span className="mt-7 inline-flex items-center gap-2 text-sm font-extrabold text-gold">
                                        عرض التفاصيل
                                        <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {!isLoading && !isError && (!services || services.length === 0) && (
                    <div className="mx-auto mt-14 max-w-xl rounded-3xl border border-primary/10 bg-brand-page p-8 text-center">
                        <p className="text-sm font-semibold text-brand-muted">لا توجد خدمات متاحة حالياً.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ServicesSection;
