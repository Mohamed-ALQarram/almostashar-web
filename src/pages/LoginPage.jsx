// import LoginForm from "../features/auth/components/LoginForm";
import { BrandingSide } from "../features/auth";
import { LoginForm } from "../features/auth"

const LoginPage = () => {
    return (
        <main
            className="min-h-screen w-full flex items-center justify-center bg-brand-page p-4"
            dir="rtl"
        >
            {/* Card wrapper — acts as the split-screen container */}
            <div className="flex w-full max-w-[850px] lg:max-h-[90vh] lg:h-[680px] bg-white rounded-3xl shadow-xl overflow-hidden">
                {/* Right side – Branding (hidden on mobile) */}
                <BrandingSide isLoginPage={true} />
                {/* Left side – Login Form */}
                <div className="flex-1 flex items-center justify-center px-3 py-4 sm:px-6 lg:px-8">
                    <LoginForm />
                </div>

            </div>
        </main>
    );
};

export default LoginPage;