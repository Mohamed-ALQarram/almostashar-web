import { useParams, Link } from 'react-router-dom';
import { ArrowRight, Clock, FileText, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
import { usePublicServices } from '../features/guest-landing/hooks/usePublicServices';

const DUMMY_DESCRIPTIONS = {
    'Consultation': 'نوفر لك استشارات قانونية شاملة ومتخصصة في جميع فروع القانون. يقوم فريقنا من المحامين المعتمدين بتحليل قضيتك بدقة وتقديم النصيحة القانونية المبنية على أسس علمية وعملية راسخة. سواء كنت تحتاج استشارة فورية أو دراسة معمقة لملفك القانوني، نحن هنا لمساعدتك في اتخاذ القرارات الصحيحة وحماية حقوقك.',
    'ContractDrafting': 'نقدم خدمات صياغة ومراجعة العقود بمختلف أنواعها: العقود التجارية، عقود العمل، عقود الإيجار، عقود الشراكة، واتفاقيات السرية. يحرص فريقنا القانوني على ضمان حماية مصالحك وتجنب أي ثغرات قانونية قد تؤثر على حقوقك مستقبلاً.',
    'LegalRepresentation': 'نوفر تمثيلاً قانونياً متكاملاً أمام جميع الجهات القضائية والمحاكم بمختلف درجاتها. يتولى محامونا المتمرسون الدفاع عن حقوقك ومتابعة إجراءات القضية من البداية وحتى صدور الحكم النهائي، مع إبقائك على اطلاع دائم بمستجدات القضية.',
    'CompanyFormation': 'نقدم خدمات شاملة لتأسيس الشركات بجميع أنواعها، تشمل إعداد عقود التأسيس والنظام الأساسي، استخراج السجل التجاري والتراخيص اللازمة، وتقديم الاستشارات المتعلقة بأفضل الهياكل القانونية المناسبة لنشاطك التجاري.',
    'LaborCases': 'متخصصون في معالجة كافة النزاعات العمالية بين الموظفين وأصحاب العمل. نساعدك في قضايا الفصل التعسفي، المطالبة بالمستحقات المالية، إصابات العمل، وتسوية النزاعات العمالية بالطرق الودية أو القضائية.',
    'PersonalStatus': 'نتعامل مع قضايا الأحوال الشخصية بأقصى درجات السرية والاحترافية. تشمل خدماتنا قضايا الطلاق والخلع، حضانة الأطفال، النفقة، إثبات النسب، قسمة المواريث، والوصايا، مع مراعاة الحساسية الخاصة لهذه القضايا.',
};

const DUMMY_DOCUMENTS = {
    'Consultation': 'صورة بطاقة الرقم القومي، أي مستندات متعلقة بالاستشارة',
    'ContractDrafting': 'صورة بطاقة الرقم القومي، بيانات الأطراف، تفاصيل الاتفاق',
    'LegalRepresentation': 'صورة بطاقة الرقم القومي، التوكيل الرسمي، مستندات القضية',
    'CompanyFormation': 'صور بطاقات الشركاء، عقد الإيجار، شهادة عدم الالتباس',
    'LaborCases': 'صورة بطاقة الرقم القومي، عقد العمل، كشف الراتب',
    'PersonalStatus': 'صورة بطاقة الرقم القومي، عقد الزواج، شهادات الميلاد',
};

const DUMMY_DURATION = {
    'Consultation': 'من ساعة إلى ٣ أيام عمل',
    'ContractDrafting': 'من ٣ إلى ٧ أيام عمل',
    'LegalRepresentation': 'حسب طبيعة القضية',
    'CompanyFormation': 'من أسبوع إلى أسبوعين',
    'LaborCases': 'من أسبوع إلى شهر',
    'PersonalStatus': 'حسب طبيعة القضية',
};

const DEFAULT_DESCRIPTION = 'خدمة قانونية متكاملة يقدمها فريق من المحامين المتخصصين. نحرص على تقديم أعلى مستويات الجودة والاحترافية لضمان حماية حقوقك وتحقيق أهدافك القانونية بأفضل الطرق الممكنة.';

const ServiceDetailPage = () => {
    const { id } = useParams();
    const { data: services, isLoading, isError } = usePublicServices();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-brand-page flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-gold animate-spin" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-brand-page flex flex-col items-center justify-center gap-4">
                <AlertCircle className="w-12 h-12 text-error/60" />
                <p className="text-brand-muted">حدث خطأ أثناء تحميل بيانات الخدمة.</p>
                <Link to="/guest" className="text-gold hover:text-gold-dark text-sm font-semibold">
                    العودة للرئيسية
                </Link>
            </div>
        );
    }

    const service = services?.find(s => s.id === Number(id));

    if (!service) {
        return (
            <div className="min-h-screen bg-brand-page flex flex-col items-center justify-center gap-4">
                <AlertCircle className="w-12 h-12 text-gray-300" />
                <p className="text-brand-muted">الخدمة غير موجودة.</p>
                <Link to="/guest" className="text-gold hover:text-gold-dark text-sm font-semibold">
                    العودة للرئيسية
                </Link>
            </div>
        );
    }

    const type = service.serviceType || '';
    const description = service.fullDescription || DUMMY_DESCRIPTIONS[type] || DEFAULT_DESCRIPTION;
    const documents = service.requiredDocuments || DUMMY_DOCUMENTS[type] || 'صورة بطاقة الرقم القومي';
    const duration = service.expectedDuration || DUMMY_DURATION[type] || 'حسب طبيعة الخدمة';
    const summary = service.summary || 'خدمة قانونية متخصصة يقدمها فريق المستشار';

    return (
        <div className="min-h-screen bg-brand-page" dir="rtl">
            {/* Hero */}
            <div className="bg-primary text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
                    <Link to="/guest#services" className="inline-flex items-center gap-2 text-white/60 hover:text-gold text-sm mb-8 transition-colors">
                        <ArrowRight className="w-4 h-4" />
                        العودة للخدمات
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">{service.title}</h1>
                    <p className="text-white/70 text-sm sm:text-base leading-relaxed max-w-2xl">{summary}</p>

                    <div className="flex flex-wrap gap-4 mt-8">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-xs">
                            <Clock className="w-4 h-4 text-gold" />
                            <span>{duration}</span>
                        </div>
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-xs">
                            <ShieldCheck className="w-4 h-4 text-gold" />
                            <span>{service.serviceType || 'خدمة قانونية'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
                {/* Description Card */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-50">
                    <h2 className="text-lg font-bold text-primary mb-4">تفاصيل الخدمة</h2>
                    <p className="text-gray-600 text-sm leading-loose whitespace-pre-line">{description}</p>
                </div>

                {/* Required Documents */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-50">
                    <h2 className="text-lg font-bold text-primary flex items-center gap-2 mb-4">
                        <FileText className="w-5 h-5 text-gold" />
                        المستندات المطلوبة
                    </h2>
                    <ul className="space-y-3">
                        {documents.split(/[,،]/).map((doc, i) => (
                            <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                                {doc.trim()}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* CTA */}
                <div className="bg-primary/5 rounded-2xl p-6 sm:p-8 text-center border border-primary/10">
                    <h3 className="text-lg font-bold text-primary mb-2">هل تحتاج هذه الخدمة؟</h3>
                    <p className="text-brand-muted text-sm mb-6">سجّل الآن واحصل على أفضل الخدمات القانونية من محامين معتمدين</p>
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-lg"
                    >
                        ابدأ الآن
                        <ArrowRight className="w-4 h-4 rotate-180" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ServiceDetailPage;
