import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Star, UserRoundCheck } from 'lucide-react';
import { useFeaturedLawyers } from '../hooks/usePublicLawyers';
import GuestSectionHeading from './GuestSectionHeading';

const getInitials = (name) => name?.trim()?.charAt(0) || '؟';

const LawyerCard = ({ lawyer }) => {
    const rating = Number(lawyer.rating || 0);

    return (
        <article className="rounded-[1.25rem] border border-primary/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-gold/40 hover:shadow-xl hover:shadow-primary/10">
            <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-brand-page text-xl font-black text-primary ring-1 ring-primary/10">
                    {lawyer.photoUrl ? (
                        <img src={lawyer.photoUrl} alt={lawyer.fullName} className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                        getInitials(lawyer.fullName)
                    )}
                </div>
                <div className="min-w-0 flex-1 text-right">
                    <h3 className="truncate text-sm font-black text-primary-dark">{lawyer.fullName}</h3>
                    <p className="mt-1 text-xs font-semibold text-brand-muted">مستشار قانوني</p>
                    <div className="mt-3 flex items-center justify-start gap-1">
                        {[...Array(5)].map((_, index) => (
                            <Star key={index} className={`h-3.5 w-3.5 ${index < Math.round(rating) ? 'fill-gold text-gold' : 'text-gray-200'}`} />
                        ))}
                        <span className="mr-1 text-xs font-bold text-brand-muted">{rating.toFixed(1)}</span>
                    </div>
                </div>
            </div>

            <div className={`mt-5 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-extrabold ${
                lawyer.isActive ? 'bg-success/10 text-success' : 'bg-gray-100 text-gray-500'
            }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${lawyer.isActive ? 'bg-success' : 'bg-gray-400'}`} />
                {lawyer.isActive ? 'متاح الآن' : 'غير متاح'}
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
                        title="محامون معتمدون بتجربة عرض واضحة"
                        description="اعرض المحامين بشكل مباشر، بدون صور وهمية أو وعود مبالغ فيها. البيانات تأتي كما يوفرها النظام."
                    />
                    <Link
                        to="/lawyers"
                        className="inline-flex shrink-0 items-center gap-2 rounded-full border border-primary/15 bg-white px-6 py-3 text-sm font-extrabold text-primary shadow-sm transition hover:-translate-y-0.5 hover:border-gold/40 hover:text-gold"
                    >
                        عرض جميع المحامين
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </div>

                {isLoading && (
                    <div className="mt-14 flex justify-center py-20">
                        <Loader2 className="h-10 w-10 animate-spin text-gold" />
                    </div>
                )}

                {isError && (
                    <p className="mt-14 rounded-3xl border border-error/10 bg-error/5 p-8 text-center text-sm font-semibold text-brand-muted">
                        حدث خطأ أثناء تحميل المحامين.
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
                    <div className="mx-auto mt-14 max-w-xl rounded-3xl border border-primary/10 bg-white p-8 text-center">
                        <UserRoundCheck className="mx-auto h-10 w-10 text-gold" />
                        <p className="mt-4 text-sm font-semibold text-brand-muted">لا يوجد محامون متاحون حالياً.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default OurLawyersSection;
