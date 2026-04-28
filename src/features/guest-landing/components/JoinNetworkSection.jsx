import { Link } from 'react-router-dom';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import joinImg from '../../../assets/Join-Network-Section.jpg';

const benefits = [
    'الوصول إلى آلاف العملاء في مختلف المجالات القانونية',
    'إدارة مواعيدك واستشاراتك بسهولة عبر المنصة',
    'نظام دفع آمن وموثوق مع تحويلات دورية',
    'دعم فني متواصل وفريق مختص لمساعدتك',
];

const JoinNetworkSection = () => {
    return (
        <section className="py-16 sm:py-24 bg-brand-page">
            <div className="section-container">
                <div className="bg-primary rounded-3xl overflow-hidden shadow-2xl">
                    <div className="grid lg:grid-cols-2">
                        {/* Image Side */}
                        <div className="relative h-64 sm:h-80 lg:h-auto">
                            <img
                                src={joinImg}
                                alt="انضم لشبكة المحامين"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-primary/60 to-transparent" />
                        </div>

                        {/* Content Side */}
                        <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
                            <span className="text-gold text-sm font-semibold tracking-wider mb-3">
                                انضم إلينا
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 leading-tight">
                                انضم لشبكة الريادة القانونية
                            </h2>
                            <p className="text-white/70 text-sm leading-relaxed mb-6">
                                كن جزءاً من أكبر شبكة قانونية في المنطقة. سجّل كمحامٍ معتمد وابدأ في
                                تقديم خدماتك القانونية لعملاء من كل مكان.
                            </p>

                            {/* Benefits List */}
                            <ul className="space-y-3 mb-8">
                                {benefits.map((benefit, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                                        <span className="text-white/80 text-sm">{benefit}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA Button */}
                            <Link
                                to="/lawyer-register"
                                className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl self-start"
                            >
                                <span>سجّل كمحامٍ</span>
                                <ArrowLeft className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default JoinNetworkSection;
