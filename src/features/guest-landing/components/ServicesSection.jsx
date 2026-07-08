import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Briefcase, Building2, FileText, Gavel, Loader2, Scale, ShieldCheck, Users } from 'lucide-react';
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

const FALLBACK_ICONS = [Scale, FileText, Gavel, Building2, Briefcase, ShieldCheck, Users];

const SERVICE_SUMMARIES = {
    Consultation: 'استشارات قانونية واضحة تساعدك على فهم موقفك واتخاذ القرار بثقة.',
    ContractDrafting: 'صياغة ومراجعة العقود باحتراف يحمي مصالحك ويقلل المخاطر.',
    LegalRepresentation: 'تمثيل قانوني منظم ومتابعة دقيقة لإجراءات القضايا والملفات.',
    CompanyFormation: 'تأسيس الشركات وتجهيز المتطلبات القانونية لبداية أعمال مستقرة.',
    LaborCases: 'دعم متخصص في النزاعات العمالية وحقوق الموظفين وأصحاب العمل.',
    PersonalStatus: 'تعامل مهني وسري مع قضايا الأسرة والأحوال الشخصية.',
};

const getIcon = (service, index) => SERVICE_ICON_MAP[service.serviceType] || FALLBACK_ICONS[index % FALLBACK_ICONS.length];
const getSummary = (service) => service.summary || SERVICE_SUMMARIES[service.serviceType] || 'خدمة قانونية متخصصة تساعدك على الوصول إلى الإجراء المناسب بوضوح واحتراف.';

const ServicesSection = () => {
    const { data: services, isLoading, isError } = usePublicServices();

    return (
        <section id="services" className="guest-section bg-brand-page">
            <div className="section-container">
                <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                    <GuestSectionHeading
                        align="right"
                        eyebrow="خدماتنا"
                        title="خدمات قانونية منظمة حسب احتياجك"
                        description="اختر الخدمة المناسبة وراجع التفاصيل قبل البدء. كل بطاقة تعرض المعلومات الأساسية بدون ازدحام أو وعود مبالغ فيها."
                    />
                    <Link to="/login" className="ghost-button self-start lg:self-auto">
                        ابدأ طلب خدمة
                    </Link>
                </div>

                {isLoading && (
                    <div className="mt-12 flex justify-center py-16">
                        <Loader2 className="h-10 w-10 animate-spin text-gold" />
                    </div>
                )}

                {isError && (
                    <div className="mx-auto mt-12 max-w-xl rounded-2xl border border-error/10 bg-white p-8 text-center">
                        <AlertCircle className="mx-auto h-10 w-10 text-error/70" />
                        <p className="mt-4 text-sm font-semibold text-brand-muted">حدث خطأ أثناء تحميل الخدمات. يرجى المحاولة لاحقاً.</p>
                    </div>
                )}

                {!isLoading && !isError && services?.length > 0 && (
                    <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {services.map((service, index) => {
                            const Icon = getIcon(service, index);

                            return (
                                <Link
                                    key={service.id}
                                    to={`/services/${service.id}`}
                                    className="group flex min-h-[236px] flex-col rounded-2xl border border-primary/10 bg-white p-5 transition hover:border-gold/50"
                                >
                                    <div className="h-1 w-12 rounded-full bg-gold" />
                                    <div className="mt-5 flex items-start gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-page ring-1 ring-primary/10">
                                            {service.iconUrl ? (
                                                <img src={service.iconUrl} alt={service.title} className="h-8 w-8 object-contain" loading="lazy" />
                                            ) : (
                                                <Icon className="h-6 w-6 text-primary" />
                                            )}
                                        </div>
                                        <h3 className="pt-1 text-base font-black leading-7 text-primary-dark">{service.title}</h3>
                                    </div>

                                    <p className="mt-4 line-clamp-3 flex-1 text-sm leading-7 text-brand-muted">{getSummary(service)}</p>

                                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-primary transition group-hover:text-gold">
                                        عرض التفاصيل
                                        <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {!isLoading && !isError && (!services || services.length === 0) && (
                    <div className="mx-auto mt-12 max-w-xl rounded-2xl border border-primary/10 bg-white p-8 text-center">
                        <p className="text-sm font-semibold text-brand-muted">لا توجد خدمات متاحة حالياً.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ServicesSection;
