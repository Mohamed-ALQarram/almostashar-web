import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { useLawyerRegisterStore } from '../store/lawyerRegisterStore';

// ── Icons ──────────────────────────────────────────────────────────────
const UserIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
);

const MailIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
    </svg>
);

const PhoneIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
    </svg>
);

const LockIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
);

const MapPinIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
);

// ── Validation ─────────────────────────────────────────────────────────
const schema = yup.object().shape({
    firstName: yup.string().required('الاسم الأول مطلوب'),
    lastName: yup.string().required('الاسم الأخير مطلوب'),
    email: yup.string().email('صيغة البريد الإلكتروني غير صحيحة').required('البريد الإلكتروني مطلوب'),
    phoneNo: yup.string().required('رقم الهاتف مطلوب'),
    password: yup.string().min(6, 'كلمة المرور يجب أن تتكون من 6 أحرف على الأقل').required('كلمة المرور مطلوبة'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'كلمتا المرور غير متطابقتين')
        .required('تأكيد كلمة المرور مطلوب'),
    governorate: yup.string().required('المحافظة مطلوبة'),
    city: yup.string().required('المدينة مطلوبة'),
});

// ── Step indicator shared between both steps ───────────────────────────
export const StepIndicator = ({ currentStep }) => (
    <div className="flex items-center justify-center gap-8 mb-6">
        <button
            type="button"
            className={`pb-2 text-sm font-semibold transition-colors border-b-2 ${currentStep === 1
                ? 'text-gold border-gold'
                : 'text-brand-muted border-transparent'
                }`}
        >
            1. المعلومات الشخصية
        </button>
        <button
            type="button"
            className={`pb-2 text-sm font-semibold transition-colors border-b-2 ${currentStep === 2
                ? 'text-gold border-gold'
                : 'text-brand-muted border-transparent'
                }`}
        >
            2. التوثيق
        </button>
    </div>
);

// ── Component ──────────────────────────────────────────────────────────
const LawyerRegisterForm = ({ onNext }) => {
    const setFormData = useLawyerRegisterStore((s) => s.setFormData);
    const savedData = useLawyerRegisterStore((s) => s.formData);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: savedData || {},
    });

    const onSubmit = (data) => {
        // Remove confirmPassword before storing
        const { confirmPassword, ...formData } = data;
        setFormData(formData);
        onNext();
    };

    return (
        <div className="w-full max-w-[480px] mx-auto flex flex-col items-center" dir="rtl">
            {/* Header */}
            <div className="text-center mb-4">
                <h1 className="text-[26px] font-bold text-primary mb-1">إنشاء حساب جديد</h1>
                <p className="text-brand-muted text-[13px]">
                    ابدأ رحلتك المهنية معنا وانضم لنخبة المحامين.
                </p>
            </div>

            {/* Step Indicator */}
            <StepIndicator currentStep={1} />

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
                {/* First & Last Name — side by side */}
                <div className="grid grid-cols-2 gap-3">
                    <Input
                        label="الاسم الأول"
                        type="text"
                        placeholder="أدخل اسمك الأول"
                        icon={UserIcon}
                        {...register('firstName')}
                        error={errors.firstName?.message}
                    />
                    <Input
                        label="الاسم الأخير"
                        type="text"
                        placeholder="أدخل اسمك الأخير"
                        icon={UserIcon}
                        {...register('lastName')}
                        error={errors.lastName?.message}
                    />
                </div>

                {/* Email */}
                <Input
                    label="البريد الإلكتروني"
                    type="email"
                    placeholder="name@example.com"
                    icon={MailIcon}
                    {...register('email')}
                    error={errors.email?.message}
                />

                {/* Phone */}
                <Input
                    label="رقم الهاتف"
                    type="text"
                    placeholder="+20 100 xxx xxxx"
                    icon={PhoneIcon}
                    {...register('phoneNo')}
                    error={errors.phoneNo?.message}
                />

                {/* Password & Confirm — side by side */}
                <div className="grid grid-cols-2 gap-3">
                    <Input
                        label="كلمة المرور"
                        type="password"
                        placeholder="••••••••"
                        icon={LockIcon}
                        {...register('password')}
                        error={errors.password?.message}
                    />
                    <Input
                        label="تأكيد كلمة المرور"
                        type="password"
                        placeholder="••••••••"
                        icon={LockIcon}
                        {...register('confirmPassword')}
                        error={errors.confirmPassword?.message}
                    />
                </div>

                {/* Governorate & City — side by side */}
                <div className="grid grid-cols-2 gap-3">
                    <Input
                        label="المحافظة"
                        type="text"
                        placeholder="أدخل المحافظة"
                        icon={MapPinIcon}
                        {...register('governorate')}
                        error={errors.governorate?.message}
                    />
                    <Input
                        label="المدينة"
                        type="text"
                        placeholder="أدخل المدينة"
                        icon={MapPinIcon}
                        {...register('city')}
                        error={errors.city?.message}
                    />
                </div>

                {/* Next Button */}
                <Button type="submit" variant="primary" className="w-full mt-2">
                    التالي ←
                </Button>
            </form>
        </div>
    );
};

export default LawyerRegisterForm;
