import { useState } from "react";
import { BrandingSide } from "../features/auth";
import LawyerRegisterForm from "../features/auth/components/LawyerRegisterForm";
import UploadFilesForm from "../features/auth/components/UploadFilesForm";

const LawyerRegisterPage = () => {
    const [step, setStep] = useState(1);

    return (
        <main
            className="min-h-screen w-full flex items-center justify-center bg-brand-page p-4"
            dir="rtl"
        >
            {/* Card wrapper — acts as the split-screen container */}
            <div
                className={`flex w-full bg-white rounded-3xl shadow-xl overflow-hidden transition-all duration-300 ${step === 1
                        ? 'max-w-[850px] lg:max-h-[90vh] lg:h-[680px]'
                        : 'max-w-[620px]'
                    }`}
            >
                {/* Right side – Branding (only on step 1, hidden on mobile) */}
                {step === 1 && <BrandingSide isLoginPage={false} />}

                {/* Left side – Form */}
                <div className="flex-1 flex items-center justify-center px-3 py-4 sm:px-6 lg:px-8 overflow-y-auto">
                    {step === 1 ? (
                        <LawyerRegisterForm onNext={() => setStep(2)} />
                    ) : (
                        <UploadFilesForm onBack={() => setStep(1)} />
                    )}
                </div>
            </div>
        </main>
    );
};

export default LawyerRegisterPage;