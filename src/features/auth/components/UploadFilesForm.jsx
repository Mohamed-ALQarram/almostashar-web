import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { StepIndicator } from './LawyerRegisterForm';
import { useLawyerRegisterStore } from '../store/lawyerRegisterStore';
import useUploadIdentityDocuments from '../hooks/useUploadIdentityDocuments';
import useRegisterLawyer from '../hooks/useRegisterLawyer';

// ── Icons ──────────────────────────────────────────────────────────────
const BadgeIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15A2.25 2.25 0 0 0 2.25 6.75v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
    </svg>
);

const IdCardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gold">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15A2.25 2.25 0 0 0 2.25 6.75v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
    </svg>
);

const CertificateIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gold">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.745 3.745 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
    </svg>
);

const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gold shrink-0">
        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
    </svg>
);

// ── Validation ─────────────────────────────────────────────────────────
const schema = yup.object().shape({
    syndicateId: yup
        .number()
        .typeError('رقم القيد مطلوب ويجب أن يكون رقماً')
        .required('رقم القيد بالنقابة مطلوب'),
    acknowledged: yup
        .boolean()
        .oneOf([true], 'يجب الموافقة على الشروط')
        .required(),
});

// ── File upload card sub-component ─────────────────────────────────────
const FileUploadCard = ({ icon, title, subtitle, onFileSelect, selectedFile }) => {
    const inputRef = useRef(null);

    return (
        <div className="flex flex-col items-center gap-2 bg-brand-light border border-gray-100 rounded-2xl p-5 text-center">
            <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                {icon}
            </div>
            <h4 className="text-sm font-bold text-primary">{title}</h4>
            {subtitle && <p className="text-xs text-brand-muted">{subtitle}</p>}

            {selectedFile ? (
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-success font-medium truncate max-w-[120px]">
                        {selectedFile.name}
                    </span>
                    <button
                        type="button"
                        onClick={() => onFileSelect(null)}
                        className="text-error text-xs hover:underline"
                    >
                        إزالة
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="mt-1 px-4 py-1.5 bg-gold text-white text-xs font-bold rounded-lg hover:bg-gold-dark transition-colors"
                >
                    اختيار ملف
                </button>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,application/pdf"
                className="hidden"
                onChange={(e) => onFileSelect(e.target.files?.[0] || null)}
            />
        </div>
    );
};

// ── Main Component ─────────────────────────────────────────────────────
const UploadFilesForm = ({ onBack }) => {
    const formData = useLawyerRegisterStore((s) => s.formData);
    const { mutateAsync: uploadDocs, isPending: isUploading } = useUploadIdentityDocuments();
    const { mutateAsync: registerLawyer, isPending: isRegistering } = useRegisterLawyer();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: { syndicateId: '', acknowledged: false },
    });

    // File state
    const [ssnFile, setSsnFile] = useState(null);
    const [syndicateCardFile, setSyndicateCardFile] = useState(null);
    const [practiceFile, setPracticeFile] = useState(null);
    const [fileError, setFileError] = useState('');
    const [serverError, setServerError] = useState('');

    const isLoading = isUploading || isRegistering;

    const onSubmit = async (data) => {
        setFileError('');
        setServerError('');

        // Validate required files
        if (!ssnFile || !syndicateCardFile) {
            setFileError('يجب رفع صورة البطاقة الشخصية وصورة كارنيه النقابة');
            return;
        }

        try {
            // Step A: Upload files
            const urls = await uploadDocs({
                SSN: ssnFile,
                SyndicateCard: syndicateCardFile,
                PracticeCertificates: practiceFile || ssnFile, // fallback if optional
            });

            // Step B: Register with merged data
            const payload = {
                ...formData,
                syndicateId: Number(data.syndicateId),
                ssN_Url: urls.ssN_Url,
                syndicateCardUrl: urls.syndicateCardUrl,
                practiceCertificatesUrl: urls.practiceCertificatesUrl,
            };

            const result = await registerLawyer(payload);
            console.log('Registration successful:', result);
            // TODO: navigate to success/pending page with result
        } catch (err) {
            setServerError(err?.message || 'حدث خطأ أثناء التسجيل. يرجى المحاولة لاحقاً.');
        }
    };

    return (
        <div className="w-full max-w-[560px] mx-auto flex flex-col items-center py-6 px-4" dir="rtl">
            {/* Header */}
            <div className="text-center mb-4">
                <h1 className="text-[26px] font-bold text-primary mb-1">توثيق الحساب المهني</h1>
                <p className="text-brand-muted text-[13px]">
                    يرجى رفع المستندات الرسمية لإثبات هويتك المهنية وتفعيل حسابك كمحامٍ معتمد.
                </p>
            </div>

            {/* Step Indicator */}
            <StepIndicator currentStep={2} />

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-5">
                {/* Syndicate ID */}
                <Input
                    label="رقم القيد بالنقابة *"
                    type="text"
                    placeholder="مثال: 12345/2023"
                    icon={BadgeIcon}
                    {...register('syndicateId')}
                    error={errors.syndicateId?.message}
                />

                {/* Documents section */}
                <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-bold text-primary text-center">المستندات المطلوبة *</h3>

                    <div className="grid grid-cols-2 gap-3">
                        <FileUploadCard
                            icon={<IdCardIcon />}
                            title="صورة البطاقة الشخصية"
                            subtitle="سارية المفعول"
                            selectedFile={ssnFile}
                            onFileSelect={setSsnFile}
                        />
                        <FileUploadCard
                            icon={<IdCardIcon />}
                            title="صورة كارنيه النقابة"
                            subtitle="(PDF, JPG, PNG) أمام وخلف"
                            selectedFile={syndicateCardFile}
                            onFileSelect={setSyndicateCardFile}
                        />
                    </div>

                    {/* Practice Certificate — full width */}
                    <div className="flex justify-center">
                        <div className="w-full max-w-[260px]">
                            <FileUploadCard
                                icon={<CertificateIcon />}
                                title="شهادة مزاولة المهنة"
                                subtitle="إن وجدت (اختياري)"
                                selectedFile={practiceFile}
                                onFileSelect={setPracticeFile}
                            />
                        </div>
                    </div>

                    {fileError && (
                        <p className="text-xs text-error text-center font-medium">{fileError}</p>
                    )}
                </div>

                {/* Info Banner */}
                <div className="flex items-start gap-3 bg-gold/5 border border-gold/20 rounded-xl p-4">
                    <InfoIcon />
                    <div>
                        <h4 className="text-sm font-bold text-primary mb-1">عملية المراجعة</h4>
                        <p className="text-xs text-brand-muted leading-relaxed">
                            سيتم مراجعة كافة المستندات المرفقة يدوياً من قبل فريق "المستشار" للتأكد من صحة
                            البيانات. قد تستغرق هذه العملية ما يصل إلى 24 ساعة عمل.
                        </p>
                    </div>
                </div>

                {/* Acknowledgment checkbox */}
                <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                        type="checkbox"
                        {...register('acknowledged')}
                        className="mt-1 w-4 h-4 accent-gold rounded border-gray-300 shrink-0"
                    />
                    <span className="text-xs text-brand-muted leading-relaxed">
                        أقر بأن جميع البيانات والمستندات المرفقة صحيحة وحديثة، وأتحمل المسؤولية القانونية الكاملة
                        عن صحتها.
                    </span>
                </label>
                {errors.acknowledged && (
                    <p className="text-xs text-error -mt-3 px-1">{errors.acknowledged.message}</p>
                )}

                {/* Server error */}
                {serverError && (
                    <div className="w-full p-3 bg-red-50 border border-red-200 rounded-xl text-center">
                        <p className="text-error text-sm font-medium">{serverError}</p>
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full"
                        isLoading={isLoading}
                        disabled={isLoading}
                    >
                        {isUploading ? 'جاري رفع الملفات...' : isRegistering ? 'جاري التسجيل...' : 'إرسال للمراجعة ←'}
                    </Button>

                    <button
                        type="button"
                        onClick={onBack}
                        disabled={isLoading}
                        className="text-sm text-brand-muted hover:text-primary transition-colors font-medium disabled:opacity-50"
                    >
                        → العودة للخطوة السابقة
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UploadFilesForm;
