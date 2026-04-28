import React from "react";
import { Check, Hourglass, Lock, Info, ArrowLeft } from "lucide-react";
import Button from "../../../components/ui/Button";
import { useNavigate } from "react-router-dom";
const AccountStatus = () => {
    // Timeline steps data for easy management and scalability
    const navigate= useNavigate();
    const steps = [
        {
            id: 1,
            title: "تم استلام البيانات",
            subtitle: "مكتمل",
            icon: <Check size={20} className="text-white" />,
            iconBg: "bg-green-700",
            titleColor: "text-gray-900",
            subtitleColor: "text-green-700",
            showLine: true,
            lineColor: "bg-gray-200",
        },
        {
            id: 2,
            title: "قيد المراجعة",
            subtitle: "جاري العمل على طلبك...",
            icon: <Hourglass size={20} className="text-yellow-600" />,
            iconBg: "bg-yellow-100 border-4 border-yellow-50",
            titleColor: "text-yellow-600",
            subtitleColor: "text-gray-500",
            showLine: true,
            lineColor: "bg-gray-200",
        },
        {
            id: 3,
            title: "تفعيل الحساب",
            subtitle: "الخطوة القادمة",
            icon: <Lock size={20} className="text-gray-400" />,
            iconBg: "bg-gray-50 border border-gray-200",
            titleColor: "text-gray-400",
            subtitleColor: "text-gray-400",
            showLine: false,
            lineColor: "",
        },
    ];

    return (
        // Main container with RTL direction
        <div
            dir="rtl"
            className="min-h-screen bg-white flex justify-center items-center p-4 font-sans"
        >
            <div className="max-w-2xl w-full flex flex-col items-center">
                {/* Header Section */}
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex justify-center items-center mb-6">
                        <div className="w-12 h-12 rounded-full border-4 border-green-700 flex justify-center items-center">
                            <Check size={24} className="text-green-700" strokeWidth={3} />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">
                        تم إرسال بياناتك بنجاح!
                    </h1>
                    <p className="text-gray-500 text-lg leading-relaxed max-w-lg">
                        سيقوم فريقنا القانوني بمراجعة طلبك والتحقق من صحة البيانات والرد
                        عليك خلال 48 ساعة عمل.
                    </p>
                </div>

                {/* Timeline Component */}
                <div className="w-full bg-slate-50 border border-gray-100 rounded-2xl p-8 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-8 ms-2">
                        مراحل الطلب
                    </h2>

                    <div className="flex flex-col ms-4">
                        {steps.map((step) => (
                            <div key={step.id} className="relative flex items-start gap-2">
                                {/* Vertical Line Connector */}
                                {step.showLine && (
                                    <div
                                        className={`absolute top-10 right-5 w-0.5 h-full ${step.lineColor} -z-10`}
                                        style={{ right: "1.35rem" }}
                                    ></div>
                                )}

                                {/* Icon Circle */}
                                <div className="flex-shrink-0 z-10">
                                    <div
                                        className={`w-12 h-12 rounded-full flex justify-center items-center ${step.iconBg}`}
                                    >
                                        {step.icon}
                                    </div>
                                </div>

                                {/* Text Content */}
                                <div className="me-6 pb-10 pt-1">
                                    <h3 className={`text-lg font-bold mb-1 ${step.titleColor}`}>
                                        {step.title}
                                    </h3>
                                    <p className={`text-sm ${step.subtitleColor}`}>
                                        {step.subtitle}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Info Alert Box */}
                <div className="w-full bg-orange-50 border border-orange-100 rounded-xl p-4 flex items-start gap-3 mb-6">
                    <Info className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
                    <p className="text-gray-700 text-sm leading-relaxed">
                        يرجى تفقد بريدك الإلكتروني بشكل دوري للحصول على تحديثات فورية حول
                        حالة طلبك. يمكنك أيضًا متابعة الحالة من خلال لوحة التحكم.
                    </p>
                </div>

                {/* Action Button */}
                <Button 
                className="w-full bg-gold hover:bg-gold-dark transition-colors text-white font-bold text-lg py-4 rounded-xl flex justify-center items-center gap-2"
                variant="primary"
                onClick={()=>{navigate('/login')}}
                >
                    تسجيل الدخول لمتابعة الطلب
                    <ArrowLeft size={20} />
                </Button>
            </div>
        </div>
    );
};

export default AccountStatus;
