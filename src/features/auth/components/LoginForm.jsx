import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

// Setup validation schema using Yup
const schema = yup.object().shape({
    email: yup
        .string()
        .required('البريد الإلكتروني مطلوب')
        .email('صيغة البريد الإلكتروني غير صحيحة'),
    password: yup
        .string()
        .required('كلمة المرور مطلوبة')
        .min(6, 'كلمة المرور يجب أن تتكون من 6 أحرف على الأقل'),
});

const LoginForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data) => {
        // API Call logic would go here
        console.log("Form Submitted:", data);
        await new Promise((resolve) => setTimeout(resolve, 1000));
    };

    const GoogleIcon = (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
    );

    const MailIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
        </svg>
    );

    return (
        <div className="w-full max-w-[440px] mx-auto flex flex-col items-center">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-[32px] font-bold text-primary mb-3">أهلاً بك مرة أخرى!</h1>
                <p className="text-brand-muted text-[15px]">سعداء برؤيتك مجدداً، يرجى تسجيل الدخول للمتابعة.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex-col flex gap-5">

                <Input
                    label="البريد الإلكتروني"
                    type="email"
                    placeholder="name@example.com"
                    icon={MailIcon}
                    {...register('email')}
                    error={errors.email?.message}
                />

                <Input
                    label="كلمة المرور"
                    type="password"
                    placeholder="........"
                    labelRight={
                        <a href="#" className="text-brand-muted text-sm hover:text-primary transition-colors font-medium">
                            هل نسيت كلمة المرور؟
                        </a>
                    }
                    {...register('password')}
                    error={errors.password?.message}
                />

                <Button
                    type="submit"
                    variant="primary"
                    className="w-full mt-3"
                    isLoading={isSubmitting}
                >
                    تسجيل الدخول
                </Button>

                <div className="flex items-center my-3">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="mx-4 text-sm text-brand-muted font-medium">أو</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    className="w-full text-primary font-bold shadow-sm"
                    icon={GoogleIcon}
                    onClick={() => console.log('Google login clicked')}
                >
                    المتابعة باستخدام Google
                </Button>
            </form>
        </div>
    );
};

export default LoginForm;
