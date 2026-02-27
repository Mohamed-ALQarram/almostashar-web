// import LoginForm from "../features/auth/components/LoginForm";
import {BrandingSide} from "../features/auth";
import {LoginForm} from "../features/auth"

const LoginPage = () => {
    return (
        <main
            className="min-h-screen w-full flex items-center justify-center bg-brand-page p-4"
            dir="rtl"
        >
            {/* Card wrapper — acts as the split-screen container */}
            <div className="flex w-full max-w-[960px] min-h-[680px] bg-white rounded-3xl shadow-xl overflow-hidden">
                {/* Right side – Branding (hidden on mobile) */}
                <BrandingSide />

                {/* Left side – Login Form */}
                <div className="flex-1 flex items-center justify-center px-6 py-12 sm:px-12 lg:px-16">
                    <LoginForm />
                </div>
            </div>
        </main>
    );
};

export default LoginPage;