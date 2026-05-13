import { Link } from 'react-router-dom';
import { Star, ArrowLeft, Loader2 } from 'lucide-react';
import { useFeaturedLawyers } from '../hooks/usePublicLawyers';

const getInitials = (name) => name ? name.charAt(0) : '؟';

// ─── Single Lawyer Card ─────────────────────────────────────────────
const LawyerCard = ({ lawyer }) => {
    return (
        <div className="group bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full border-3 border-gold/30 overflow-hidden mb-4 bg-primary/5 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">{getInitials(lawyer.fullName)}</span>
            </div>

            {/* Name */}
            <h3 className="font-bold text-primary text-sm mb-1 truncate max-w-full">
                {lawyer.fullName}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < Math.round(lawyer.rating || 0) ? 'text-gold fill-gold' : 'text-gray-200'}`}
                    />
                ))}
                <span className="text-xs text-brand-muted mr-1">
                    ({(lawyer.rating || 0).toFixed(1)})
                </span>
            </div>

            {/* Status */}
            <div className={`text-[10px] font-semibold px-3 py-1 rounded-full ${lawyer.isActive
                ? 'bg-success/10 text-success'
                : 'bg-gray-100 text-gray-400'
                }`}>
                {lawyer.isActive ? 'متاح الآن' : 'غير متاح'}
            </div>
        </div>
    );
};

// ─── Section Component ──────────────────────────────────────────────
const OurLawyersSection = () => {
    const { data: lawyers, isLoading, isError } = useFeaturedLawyers(10);

    return (
        <section id="lawyers" className="py-16 sm:py-24 bg-brand-page">
            <div className="section-container">
                {/* Section Title */}
                <div className="text-center mb-16">
                    <span className="text-gold text-sm font-semibold tracking-wider">محامونا</span>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary mt-2">
                        نخبة من المحامين المعتمدين
                    </h2>
                    <div className="flex items-center justify-center gap-3 mt-4">
                        <span className="w-10 h-px bg-gold/40" />
                        <span className="w-2 h-2 rounded-full bg-gold" />
                        <span className="w-10 h-px bg-gold/40" />
                    </div>
                    <p className="text-brand-muted mt-6 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                        فريق متميز من المحامين والمستشارين القانونيين المعتمدين، جاهزون لمساعدتك في كافة القضايا القانونية
                    </p>
                </div>

                {/* Loading */}
                {isLoading && (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-8 h-8 text-gold animate-spin" />
                    </div>
                )}

                {/* Error */}
                {isError && (
                    <p className="text-center text-brand-muted py-16">حدث خطأ أثناء تحميل المحامين.</p>
                )}

                {/* Lawyers Grid */}
                {!isLoading && !isError && lawyers?.length > 0 && (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                            {lawyers.map((lawyer) => (
                                <LawyerCard key={lawyer.lawyerId} lawyer={lawyer} />
                            ))}
                        </div>

                        {/* View All Button */}
                        <div className="flex justify-center mt-12">
                            <Link
                                to="/lawyers"
                                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-lg group"
                            >
                                عرض جميع المحامين
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </>
                )}

                {/* Empty */}
                {!isLoading && !isError && (!lawyers || lawyers.length === 0) && (
                    <p className="text-center text-brand-muted py-16">لا يوجد محامون متاحون حالياً.</p>
                )}
            </div>
        </section>
    );
};

export default OurLawyersSection;
