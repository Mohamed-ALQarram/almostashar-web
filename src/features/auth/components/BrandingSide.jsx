import logo from "../../../assets/AlMostashar-logo.png";
import React from "react";
import { Link } from "react-router-dom";
import Button from "../../../components/ui/Button";

const BrandingSide = () => {
    return (
        <div
            className="hidden lg:flex flex-col items-center justify-between w-full max-w-[360px] self-stretch bg-primary-dark py-6 px-8 text-brand-light rounded-s-3xl overflow-y-auto"
            dir="rtl"
        >
            {/* Upper Section: Logo and Brand Name */}
            <div className=" rounded-full opacity-60 bg-primary-light/10 flex items-center justify-center border border-primary-light/20 mb-4">
                <img className="rounded-[40%] w-[270px] h-[270px] object-cover" src={logo} alt="AlMostashar logo" />
            </div>

            {/* Middle Section: Welcome Text */}
            <div className="text-center space-y-3">
                <h2 className="text-3xl font-bold text-white">أهلاً بكم</h2>
                <p className="text-brand-muted text-base leading-relaxed max-w-[300px] mx-auto">
                    منصتكم القانونية الأولى للوصول إلى أفضل الخدمات والاستشارات القانونية
                    الموثوقة بكل سهولة وأمان.
                </p>
            </div>

            {/* Bottom Section: Action Box */}
            <div className="w-full bg-primary-light/5 border border-primary-light/10 rounded-2xl p-6 mb-2 text-center">
                <p className="text-brand-light/80 mb-4">
                    ليس لديك حساب؟
                    <Link
                        to="/lawyer-register"
                        className="text-gold hover:text-gold-light font-semibold mr-2 transition-colors"
                    >
                        إنشاء حساب
                    </Link>
                </p>

                {/* Outline Button for Lawyers team */}
                <Link to="/lawyer-register">
                    <Button
                        variant="outline-dark"
                        className="w-full"
                    >
                        انضم لفريق المحامين
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default BrandingSide;
