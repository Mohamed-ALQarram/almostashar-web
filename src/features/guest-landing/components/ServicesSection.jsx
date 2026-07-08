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
const getSummary = (service) => service.summary || SERVICE_SUMMARIES[service.serviceType] || 'خدمة قانونية متخصصة تساعدك على الوصول إلى الإجراء المناسب بوضوح واحتراف.';

const ServicesSection = () => {
    const { data: services, isLoading, isError } = usePublicServices();

    return (
        <section id="services" className="guest-section bg-white">
            <div className="section-container">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <GuestSectionHeading
                        align="right"
                        eyebrow="خدماتنا"
                        title="خدمات قانونية منظمة حسب احتياجك"
                        description="كل خدمة مصممة لتوضح المطلوب، تختصر خطوات البداية، وتساعدك على الوصول للمحامي أو الإجراء القانوني الأنسب."
                    />
                    <div className="hidden max-w-xs rounded-3xl border border-primary/10 bg-brand-page p-5 text-sm leading-7 text-brand-muted lg:block">
                        اختر الخدمة، راجع التفاصيل، ثم ابدأ طلبك عبر مسار واضح ومناسب لطبيعة الملف القانوني.
                    </div>
                </div>

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
                    <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {services.map((service, index) => {
                            const Icon = getIcon(service, index);

                            return (
                                <Link
                                    key={service.id}
                                    to={`/services/${service.id}`}
                                    className="group flex min-h-[230px] flex-col rounded-[1.35rem] border border-primary/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-gold/40 hover:shadow-xl hover:shadow-primary/10"
                                >
                                    <div className="mb-4 flex items-start gap-4">
                                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-page ring-1 ring-primary/10 transition group-hover:bg-primary">
                                            {service.iconUrl ? (
                                                <img
                                                    src={service.iconUrl}
                                                    alt={service.title}
                                                    className="h-11 w-11 object-contain"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <Icon className="h-8 w-8 text-gold transition group-hover:text-gold-light" />
                                            )}
                                        </div>
                                        <h3 className="pt-2 text-lg font-black leading-7 text-primary-dark">{service.title}</h3>
                                    </div>

                                    <p className="line-clamp-3 flex-1 text-sm leading-7 text-brand-muted">{getSummary(service)}</p>

                                    <span className="mt-6 inline-flex items-center gap-2 border-t border-primary/10 pt-4 text-sm font-extrabold text-primary transition group-hover:text-gold">
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
