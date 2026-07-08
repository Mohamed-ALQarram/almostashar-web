import { Link, useParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Clock, FileText, Loader2, ShieldCheck } from 'lucide-react';
import { usePublicServices } from '../features/guest-landing/hooks/usePublicServices';

const SERVICE_DESCRIPTIONS = {
    Consultation: 'نوفر لك استشارات قانونية واضحة ومباشرة تساعدك على فهم موقفك القانوني وتحديد الخيارات المتاحة قبل اتخاذ القرار. يتم التعامل مع الطلب بعناية وخصوصية، مع تقديم توجيه مهني مناسب لطبيعة الحالة.',
    ContractDrafting: 'خدمة صياغة ومراجعة العقود تساعدك على بناء اتفاقات دقيقة ومتوازنة، مع الانتباه للبنود الحساسة والمخاطر المحتملة قبل التوقيع أو الاعتماد النهائي.',
    LegalRepresentation: 'تمثيل قانوني منظم أمام الجهات المختصة، يشمل متابعة الإجراءات وتجهيز المستندات والتواصل الواضح حول تطورات الملف حسب طبيعة القضية.',
    CompanyFormation: 'نساعدك في تجهيز المتطلبات القانونية لتأسيس شركتك واختيار الإطار المناسب لنشاطك، مع توضيح الخطوات الأساسية لتبدأ بشكل أكثر استقراراً.',
    LaborCases: 'دعم قانوني متخصص في النزاعات العمالية وحقوق العامل وصاحب العمل، مع توجيه واضح حول المستندات المطلوبة وخيارات التسوية أو التصعيد.',
    PersonalStatus: 'تعامل مهني وسري مع قضايا الأسرة والأحوال الشخصية، مع مراعاة حساسية هذه الملفات واحتياجها إلى وضوح وهدوء في كل خطوة.',
};

const SERVICE_DOCUMENTS = {
    Consultation: 'صورة الهوية، المستندات المرتبطة بالاستشارة، ملخص مختصر للوقائع',
    ContractDrafting: 'بيانات الأطراف، تفاصيل الاتفاق، أي مسودات أو مراسلات سابقة',
    LegalRepresentation: 'صورة الهوية، الوكالة إن وجدت، مستندات القضية',
    CompanyFormation: 'بيانات الشركاء، نشاط الشركة، المستندات الرسمية المتاحة',
    LaborCases: 'عقد العمل، كشف الراتب، المراسلات أو القرارات محل النزاع',
    PersonalStatus: 'صورة الهوية، المستندات الأسرية ذات الصلة، ملخص الحالة',
};

const SERVICE_DURATION = {
    Consultation: 'من ساعة إلى 3 أيام عمل',
    ContractDrafting: 'من 3 إلى 7 أيام عمل',
    LegalRepresentation: 'حسب طبيعة القضية',
    CompanyFormation: 'من أسبوع إلى أسبوعين',
    LaborCases: 'حسب تفاصيل النزاع',
    PersonalStatus: 'حسب طبيعة الملف',
};

const DEFAULT_DESCRIPTION = 'خدمة قانونية متخصصة يقدمها فريق من المحامين والمستشارين القانونيين لمساعدتك على فهم موقفك واتخاذ القرار المناسب بثقة.';

const ServiceDetailPage = () => {
    const { id } = useParams();
    const { data: services, isLoading, isError } = usePublicServices();

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-brand-page">
                <Loader2 className="h-11 w-11 animate-spin text-gold" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-brand-page px-4 text-center" dir="rtl">
                <AlertCircle className="h-12 w-12 text-error/70" />
                <p className="text-sm font-semibold text-brand-muted">حدث خطأ أثناء تحميل بيانات الخدمة.</p>
                <Link to="/guest" className="font-bold text-gold transition hover:text-gold-dark">العودة للرئيسية</Link>
            </div>
        );
    }

    const service = services?.find((item) => item.id === Number(id));

    if (!service) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-brand-page px-4 text-center" dir="rtl">
                <AlertCircle className="h-12 w-12 text-brand-muted/40" />
                <p className="text-sm font-semibold text-brand-muted">الخدمة غير موجودة.</p>
                <Link to="/guest" className="font-bold text-gold transition hover:text-gold-dark">العودة للرئيسية</Link>
            </div>
        );
    }

    const type = service.serviceType || '';
    const description = service.fullDescription || SERVICE_DESCRIPTIONS[type] || DEFAULT_DESCRIPTION;
    const documents = service.requiredDocuments || SERVICE_DOCUMENTS[type] || 'صورة الهوية، أي مستندات مرتبطة بالخدمة';
    const duration = service.expectedDuration || SERVICE_DURATION[type] || 'حسب طبيعة الخدمة';
    const summary = service.summary || 'خدمة قانونية متخصصة يقدمها فريق المستشار ضمن تجربة آمنة ومنظمة.';

    return (
        <div className="min-h-screen bg-brand-page" dir="rtl">
            <header className="relative overflow-hidden bg-primary-dark text-white">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(212,175,55,0.18),transparent_28%),linear-gradient(135deg,rgba(26,43,74,0.8),rgba(13,27,42,1))]" />
                <div className="section-container relative py-12 sm:py-20 lg:py-24">
                    <Link to="/guest#services" className="mb-9 inline-flex items-center gap-2 text-sm font-bold text-white/60 transition hover:text-gold">
                        <ArrowRight className="h-4 w-4" />
                        العودة للخدمات
                    </Link>

                    <div className="max-w-4xl">
                        <span className="rounded-full border border-gold/25 bg-gold/10 px-4 py-2 text-xs font-black text-gold">
                            خدمة قانونية
                        </span>
                        <h1 className="mt-6 text-3xl font-black leading-tight sm:text-5xl">{service.title}</h1>
                        <p className="mt-5 max-w-3xl text-sm leading-8 text-white/70 sm:text-base">{summary}</p>
                    </div>

                    <div className="mt-9 flex flex-wrap gap-3">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold backdrop-blur-md">
                            <Clock className="h-4 w-4 text-gold" />
                            {duration}
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold backdrop-blur-md">
                            <ShieldCheck className="h-4 w-4 text-gold" />
                            سرية وخصوصية
                        </div>
                    </div>
                </div>
            </header>

            <main className="section-container py-10 sm:py-14">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                    <div className="space-y-6">
                        <section className="premium-card p-6 sm:p-8">
                            <h2 className="text-xl font-black text-primary-dark">تفاصيل الخدمة</h2>
                            <p className="mt-5 whitespace-pre-line text-sm leading-9 text-brand-muted sm:text-base">{description}</p>
                        </section>

                        <section className="premium-card p-6 sm:p-8">
                            <h2 className="flex items-center gap-2 text-xl font-black text-primary-dark">
                                <FileText className="h-5 w-5 text-gold" />
                                المستندات المطلوبة
                            </h2>
                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                {documents.split(/[,،]/).map((doc) => (
                                    <div key={doc.trim()} className="flex items-start gap-3 rounded-2xl bg-brand-page p-4 text-sm font-semibold leading-7 text-brand-muted">
                                        <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-gold" />
                                        {doc.trim()}
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <aside className="lg:sticky lg:top-8 lg:self-start">
                        <div className="overflow-hidden rounded-[2rem] bg-primary-dark p-6 text-white shadow-2xl shadow-primary/20">
                            <div className="h-1 w-16 rounded-full bg-gold" />
                            <h3 className="mt-6 text-2xl font-black leading-9">جاهز تبدأ طلبك؟</h3>
                            <p className="mt-4 text-sm leading-8 text-white/70">
                                سجّل الآن وابدأ تجربة قانونية منظمة مع محامين معتمدين وخطوات واضحة.
                            </p>
                            <Link
                                to="/login"
                                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gold px-6 py-4 text-sm font-extrabold text-primary-dark transition hover:bg-gold-light"
                            >
                                ابدأ الآن
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
};

export default ServiceDetailPage;
