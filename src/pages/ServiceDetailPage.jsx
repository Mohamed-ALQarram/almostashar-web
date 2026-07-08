import { Link, useParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Clock, FileText, Loader2, ShieldCheck } from 'lucide-react';
import { usePublicServices } from '../features/guest-landing/hooks/usePublicServices';

const SERVICE_DESCRIPTIONS = {
    Consultation: 'نوفر لك استشارات قانونية واضحة تساعدك على فهم موقفك القانوني وتحديد الخيارات المتاحة قبل اتخاذ القرار.',
    ContractDrafting: 'صياغة ومراجعة العقود بدقة لحماية مصالح الأطراف وتقليل المخاطر القانونية المحتملة.',
    LegalRepresentation: 'تمثيل قانوني منظم أمام الجهات المختصة، مع متابعة الإجراءات وتجهيز المستندات اللازمة.',
    CompanyFormation: 'تجهيز المتطلبات القانونية لتأسيس الشركات واختيار الإطار الأنسب لطبيعة النشاط.',
    LaborCases: 'دعم قانوني متخصص في النزاعات العمالية وحقوق العامل وصاحب العمل.',
    PersonalStatus: 'تعامل مهني وسري مع قضايا الأسرة والأحوال الشخصية بما يناسب حساسية هذه الملفات.',
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

const DEFAULT_DESCRIPTION = 'خدمة قانونية متخصصة تساعدك على فهم موقفك واتخاذ القرار المناسب بثقة.';

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
                <Link to="/guest" className="font-bold text-gold">العودة للرئيسية</Link>
            </div>
        );
    }

    const service = services?.find((item) => item.id === Number(id));

    if (!service) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-brand-page px-4 text-center" dir="rtl">
                <AlertCircle className="h-12 w-12 text-brand-muted/40" />
                <p className="text-sm font-semibold text-brand-muted">الخدمة غير موجودة.</p>
                <Link to="/guest" className="font-bold text-gold">العودة للرئيسية</Link>
            </div>
        );
    }

    const type = service.serviceType || '';
    const description = service.fullDescription || SERVICE_DESCRIPTIONS[type] || DEFAULT_DESCRIPTION;
    const documents = service.requiredDocuments || SERVICE_DOCUMENTS[type] || 'صورة الهوية، أي مستندات مرتبطة بالخدمة';
    const duration = service.expectedDuration || SERVICE_DURATION[type] || 'حسب طبيعة الخدمة';
    const summary = service.summary || 'خدمة قانونية متخصصة ضمن تجربة آمنة ومنظمة.';

    return (
        <div className="min-h-screen bg-brand-page" dir="rtl">
            <header className="bg-primary-dark text-white">
                <div className="section-container py-12 sm:py-16 lg:py-20">
                    <Link to="/guest#services" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-white/60 transition hover:text-gold">
                        <ArrowRight className="h-4 w-4" />
                        العودة للخدمات
                    </Link>
                    <span className="section-kicker">خدمة قانونية</span>
                    <h1 className="mt-5 max-w-4xl text-3xl font-black leading-tight sm:text-5xl">{service.title}</h1>
                    <p className="mt-5 max-w-3xl text-sm leading-8 text-white/70 sm:text-base">{summary}</p>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-bold">
                            <Clock className="h-4 w-4 text-gold" />
                            {duration}
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-bold">
                            <ShieldCheck className="h-4 w-4 text-gold" />
                            سرية وخصوصية
                        </div>
                    </div>
                </div>
            </header>

            <main className="section-container py-10 sm:py-14">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_350px]">
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
                                    <div key={doc.trim()} className="flex items-start gap-3 rounded-xl bg-brand-page p-4 text-sm font-semibold leading-7 text-brand-muted">
                                        <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-gold" />
                                        {doc.trim()}
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <aside className="lg:sticky lg:top-8 lg:self-start">
                        <div className="rounded-2xl bg-primary-dark p-6 text-white">
                            <h3 className="text-2xl font-black leading-9">ابدأ طلب هذه الخدمة</h3>
                            <p className="mt-4 text-sm leading-8 text-white/70">
                                سجّل الدخول وابدأ طلبك عبر مسار واضح يحافظ على بياناتك ويعرض المتطلبات قبل التواصل.
                            </p>
                            <Link to="/login" className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-extrabold text-primary-dark hover:bg-gold-light">
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
