import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Filter, Loader2, Search, Star, User, X } from 'lucide-react';
import { useLawyers } from '../features/guest-landing/hooks/usePublicLawyers';
import { usePublicServices } from '../features/guest-landing/hooks/usePublicServices';

const useDebounce = (value, delay = 400) => {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const id = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(id);
    }, [value, delay]);

    return debounced;
};

const getInitials = (name) => name?.trim()?.charAt(0) || '؟';

const LawyerCard = ({ lawyer }) => {
    const rating = Number(lawyer.rating || 0);

    return (
        <article className="rounded-2xl border border-primary/10 bg-white p-5 transition hover:border-gold/50">
            <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-page text-xl font-black text-primary ring-1 ring-primary/10">
                    {lawyer.profileImage ? (
                        <img src={lawyer.profileImage} alt={lawyer.fullName} className="h-full w-full object-cover" loading="lazy" />
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
                <span className={`rounded-full px-3 py-1 text-[11px] font-extrabold ${lawyer.isActive ? 'bg-success/10 text-success' : 'bg-gray-100 text-gray-500'
                    }`}>
                    {lawyer.isActive ? 'متاح الآن' : 'غير متاح'}
                </span>
            </div>
        </article>
    );
};

const LawyersListPage = () => {
    const [searchInput, setSearchInput] = useState('');
    const [serviceId, setServiceId] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const debouncedSearch = useDebounce(searchInput);

    const {
        data,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        isError,
    } = useLawyers({
        search: debouncedSearch,
        serviceId: serviceId || undefined,
        pageSize: 12,
    });

    const { data: services } = usePublicServices();
    const allLawyers = data?.pages?.flatMap((page) => page.items || []) || [];
    const sentinelRef = useRef(null);

    const handleObserver = useCallback((entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return undefined;

        const observer = new IntersectionObserver(handleObserver, {
            rootMargin: '220px',
        });
        observer.observe(el);
        return () => observer.disconnect();
    }, [handleObserver]);

    const clearFilters = () => {
        setSearchInput('');
        setServiceId('');
    };

    const hasActiveFilters = Boolean(debouncedSearch || serviceId);

    return (
        <div className="min-h-screen bg-brand-page" dir="rtl">
            <header className="bg-primary-dark text-white">
                <div className="section-container py-12 sm:py-16 lg:py-20">
                    <Link to="/guest" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-white/60 transition hover:text-gold">
                        <ArrowRight className="h-4 w-4" />
                        العودة للرئيسية
                    </Link>
                    <h1 className="mt-5 text-3xl font-black leading-tight sm:text-5xl">ابحث عن المحامي المناسب</h1>
                    <p className="mt-5 max-w-2xl text-sm leading-8 text-white/70 sm:text-base">
                        استخدم البحث أو فلتر الخدمة للوصول إلى محامٍ يناسب طبيعة طلبك، ثم ابدأ التواصل من خلال المنصة.
                    </p>
                </div>
            </header>

            <div className="sticky top-0 z-30 border-b border-primary/10 bg-brand-page/95 backdrop-blur-xl">
                <div className="section-container py-4">
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                            <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gold" />
                            <input
                                type="search"
                                value={searchInput}
                                onChange={(event) => setSearchInput(event.target.value)}
                                placeholder="ابحث باسم المحامي..."
                                className="h-12 w-full rounded-xl border border-primary/10 bg-white pl-4 pr-12 text-sm font-semibold text-primary outline-none placeholder:text-brand-muted/70 focus:border-gold"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowFilters((value) => !value)}
                            className={`inline-flex h-12 w-12 items-center justify-center rounded-xl border transition ${showFilters || serviceId
                                ? 'border-primary bg-primary text-white'
                                : 'border-primary/10 bg-white text-primary hover:border-gold/40'
                                }`}
                            aria-label="عرض الفلاتر"
                            aria-expanded={showFilters}
                        >
                            <Filter className="h-5 w-5" />
                        </button>

                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-error/20 bg-error/10 text-error"
                                aria-label="مسح الفلاتر"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        )}
                    </div>

                    {showFilters && (
                        <div className="mt-4 rounded-2xl border border-primary/10 bg-white p-4">
                            <p className="mb-3 text-xs font-black text-primary">فلترة حسب التخصص</p>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => setServiceId('')}
                                    className={`rounded-full px-4 py-2 text-xs font-extrabold transition ${!serviceId ? 'bg-primary text-white' : 'bg-brand-page text-brand-muted hover:text-primary'}`}
                                >
                                    الكل
                                </button>
                                {services?.map((service) => (
                                    <button
                                        type="button"
                                        key={service.id}
                                        onClick={() => setServiceId(String(service.id))}
                                        className={`rounded-full px-4 py-2 text-xs font-extrabold transition ${String(service.id) === serviceId
                                            ? 'bg-primary text-white'
                                            : 'bg-brand-page text-brand-muted hover:text-primary'
                                            }`}
                                    >
                                        {service.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <main className="section-container py-8 sm:py-12">
                {isLoading && (
                    <div className="flex justify-center py-24">
                        <Loader2 className="h-11 w-11 animate-spin text-gold" />
                    </div>
                )}

                {isError && (
                    <div className="rounded-2xl border border-error/10 bg-white p-8 text-center text-sm font-semibold text-brand-muted">
                        حدث خطأ أثناء تحميل المحامين. يرجى المحاولة لاحقاً.
                    </div>
                )}

                {!isLoading && !isError && allLawyers.length > 0 && (
                    <>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {allLawyers.map((lawyer) => (
                                <LawyerCard key={lawyer.lawyerId} lawyer={lawyer} />
                            ))}
                        </div>

                        <div ref={sentinelRef} className="h-1" />

                        {isFetchingNextPage && (
                            <div className="flex justify-center py-8">
                                <Loader2 className="h-7 w-7 animate-spin text-gold" />
                            </div>
                        )}

                        {!hasNextPage && allLawyers.length > 12 && (
                            <p className="py-8 text-center text-sm font-semibold text-brand-muted">تم عرض جميع النتائج المتاحة</p>
                        )}
                    </>
                )}

                {!isLoading && !isError && allLawyers.length === 0 && (
                    <div className="mx-auto flex max-w-xl flex-col items-center justify-center rounded-2xl border border-primary/10 bg-white p-10 text-center">
                        <User className="h-12 w-12 text-gold" />
                        <p className="mt-4 text-sm font-semibold text-brand-muted">
                            {hasActiveFilters ? 'لا توجد نتائج مطابقة للبحث.' : 'لا يوجد محامون متاحون حالياً.'}
                        </p>
                        {hasActiveFilters && (
                            <button type="button" onClick={clearFilters} className="mt-4 text-sm font-extrabold text-gold">
                                مسح الفلاتر
                            </button>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default LawyersListPage;
