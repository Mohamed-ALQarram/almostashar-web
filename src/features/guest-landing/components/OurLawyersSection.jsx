import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Star, UserRoundCheck } from 'lucide-react';
import { useFeaturedLawyers } from '../hooks/usePublicLawyers';
import GuestSectionHeading from './GuestSectionHeading';

const getInitials = (name) => name?.trim()?.charAt(0) || '؟';

const LawyerCard = ({ lawyer }) => {
    const rating = Number(lawyer.rating || 0);

    return (
        <article className="rounded-2xl border border-primary/10 bg-white p-5 transition hover:border-gold/50">
            <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-page text-lg font-black text-primary ring-1 ring-primary/10">
                    {lawyer.photoUrl ? (
                        <img src={lawyer.photoUrl} alt={lawyer.fullName} className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                        getInitials(lawyer.fullName)
                    )}
                </div>
                <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-black text-primary-dark">{lawyer.fullName}</h3>
                    <p className="mt-1 text-xs font-semibold text-brand-muted">مستشار قانوني</p>
                </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, index) => (
                        <Star key={index} className={`h-3.5 w-3.5 ${index < Math.round(rating) ? 'fill-gold text-gold' : 'text-gray-200'}`} />
                    ))}
                    <span className="mr-1 text-xs font-bold text-brand-muted">{rating.toFixed(1)}</span>
                </div>
                <span className={`rounded-full px-3 py-1 text-[11px] font-extrabold ${
                    lawyer.isActive ? 'bg-success/10 text-success' : 'bg-gray-100 text-gray-500'
                }`}>
                    {lawyer.isActive ? 'متاح الآن' : 'غير متاح'}
                </span>
            </div>
        </article>
    );
};

const OurLawyersSection = () => {
    const { data: lawyers, isLoading, isError } = useFeaturedLawyers(8);

    return (
        <section id="lawyers" className="guest-section bg-brand-page">
            <div className="section-container">
                <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                    <GuestSectionHeading
                        align="right"
                        eyebrow="محامونا"
                        title="محامون يمكنك البدء معهم بثقة"
                        description="تصفح المحامين المتاحين واختَر الأنسب لطبيعة طلبك من خلال بيانات واضحة مصدرها النظام."
                    />
                    <Link to="/lawyers" className="ghost-button self-start lg:self-auto">
                        عرض جميع المحامين
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </div>

                {isLoading && (
                    <div className="mt-12 flex justify-center py-16">
                        <Loader2 className="h-10 w-10 animate-spin text-gold" />
                    </div>
                )}

                {isError && (
                    <p className="mt-12 rounded-2xl border border-error/10 bg-white p-8 text-center text-sm font-semibold text-brand-muted">
                        تعذر تحميل قائمة المحامين حالياً. حاول مرة أخرى بعد قليل.
                    </p>
                )}

                {!isLoading && !isError && lawyers?.length > 0 && (
                    <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {lawyers.map((lawyer) => (
                            <LawyerCard key={lawyer.lawyerId} lawyer={lawyer} />
                        ))}
                    </div>
                )}

                {!isLoading && !isError && (!lawyers || lawyers.length === 0) && (
                    <div className="mx-auto mt-12 max-w-xl rounded-2xl border border-primary/10 bg-white p-8 text-center">
                        <UserRoundCheck className="mx-auto h-10 w-10 text-gold" />
                        <p className="mt-4 text-sm font-semibold text-brand-muted">لا توجد بيانات محامين متاحة حالياً.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default OurLawyersSection;
