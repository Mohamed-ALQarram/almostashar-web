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
    Consultation: 'رأي قانوني واضح يساعدك تفهم موقفك وتختار الخطوة الأنسب.',
    ContractDrafting: 'صياغة ومراجعة عقود تحفظ الحقوق وتوضح التزامات كل طرف.',
    LegalRepresentation: 'متابعة قانونية منظمة للقضايا والإجراءات أمام الجهات المختصة.',
    CompanyFormation: 'تجهيز متطلبات تأسيس الشركات واختيار الشكل القانوني المناسب.',
    LaborCases: 'دعم متخصص في النزاعات العمالية وحقوق الموظفين وأصحاب العمل.',
    PersonalStatus: 'تعامل مهني وسري مع ملفات الأسرة والأحوال الشخصية.',
};

const getIcon = (service, index) => SERVICE_ICON_MAP[service.serviceType] || FALLBACK_ICONS[index % FALLBACK_ICONS.length];
const getSummary = (service) => service.summary || SERVICE_SUMMARIES[service.serviceType] || 'خدمة قانونية تساعدك تبدأ الإجراء المناسب بخطوات واضحة.';

const ServicesSection = () => {
    const { data: services, isLoading, isError } = usePublicServices();

    return (
        <section id="services" className="guest-section bg-brand-page">
            <div className="section-container">
                <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                    <GuestSectionHeading
                        align="right"
                        eyebrow="الخدمات القانونية"
                        title="ابدأ من الخدمة المناسبة لموقفك"
                        description="سواء كنت تحتاج استشارة، صياغة عقد، تأسيس شركة، أو متابعة إجراء قانوني، ستجد الخدمة واضحة وخطواتها منظمة."
                    />
                    <Link to="/login" className="ghost-button self-start lg:self-auto">
                        ابدأ طلبك
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
                    <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {services.map((service, index) => {
                            const Icon = getIcon(service, index);

                            return (
                                <Link
                                    key={service.id}
                                    to={`/services/${service.id}`}
                                    className="group flex min-h-[220px] flex-col overflow-hidden rounded-[22px] border border-primary/10 bg-white p-5 transition duration-200 hover:border-gold/40"
                                >
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-page text-primary ring-1 ring-primary/10">
                                        <Icon className="h-5 w-5" />
                                    </div>

                                    <h3 className="mt-5 text-base font-black leading-7 text-primary-dark">{service.title}</h3>
                                    <p className="mt-4 line-clamp-3 flex-1 text-sm leading-7 text-brand-muted">{getSummary(service)}</p>

                                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-primary transition group-hover:text-gold">
                                        عرض التفاصيل
                                        <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
                                    </span>
                                    <span className="mt-4 h-px w-10 bg-gold/45" />
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
