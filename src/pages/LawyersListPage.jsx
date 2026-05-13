import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Star, User, Loader2, ArrowRight, X } from 'lucide-react';
import { useLawyers } from '../features/guest-landing/hooks/usePublicLawyers';
import { usePublicServices } from '../features/guest-landing/hooks/usePublicServices';

// ─── Debounce hook ──────────────────────────────────────────────────
const useDebounce = (value, delay = 400) => {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const id = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(id);
    }, [value, delay]);
    return debounced;
};

const getInitials = (name) => name ? name.charAt(0) : '؟';

// ─── Single Lawyer Card ─────────────────────────────────────────────
const LawyerCard = ({ lawyer }) => {
    return (
        <div className="group bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full border-3 border-gold/30 overflow-hidden mb-4 bg-primary/5 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">{getInitials(lawyer.fullName)}</span>
            </div>

            <h3 className="font-bold text-primary text-sm mb-1 truncate max-w-full">{lawyer.fullName}</h3>

            <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(lawyer.rating || 0) ? 'text-gold fill-gold' : 'text-gray-200'}`} />
                ))}
                <span className="text-xs text-brand-muted mr-1">({(lawyer.rating || 0).toFixed(1)})</span>
            </div>

            <div className={`text-[10px] font-semibold px-3 py-1 rounded-full ${lawyer.isActive ? 'bg-success/10 text-success' : 'bg-gray-100 text-gray-400'}`}>
                {lawyer.isActive ? 'متاح الآن' : 'غير متاح'}
            </div>
        </div>
    );
};

// ─── Main Page ──────────────────────────────────────────────────────
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

    const allLawyers = data?.pages?.flatMap(p => p.items || []) || [];

    // ── Infinite scroll observer ────────────────────────────────────
    const sentinelRef = useRef(null);

    const handleObserver = useCallback((entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(handleObserver, {
            rootMargin: '200px',
        });
        observer.observe(el);
        return () => observer.disconnect();
    }, [handleObserver]);

    const clearFilters = () => {
        setSearchInput('');
        setServiceId('');
    };

    const hasActiveFilters = debouncedSearch || serviceId;

    return (
        <div className="min-h-screen bg-brand-page" dir="rtl">
            {/* Hero Header */}
            <div className="bg-primary text-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
                    <Link to="/guest" className="inline-flex items-center gap-2 text-white/60 hover:text-gold text-sm mb-6 transition-colors">
                        <ArrowRight className="w-4 h-4" />
                        العودة للرئيسية
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">محامونا المعتمدون</h1>
                    <p className="text-white/60 text-sm sm:text-base max-w-xl">
                        تصفح قائمة المحامين والمستشارين القانونيين المعتمدين واختر الأنسب لقضيتك
                    </p>
                </div>
            </div>

            {/* Search & Filters Bar */}
            <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="ابحث بالاسم..."
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pr-10 pl-4 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 transition-colors"
                            />
                        </div>

                        {/* Filter toggle */}
                        <button
                            type="button"
                            onClick={() => setShowFilters(!showFilters)}
                            className={`p-2.5 rounded-xl border transition-colors ${showFilters || serviceId
                                ? 'bg-primary text-white border-primary'
                                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                                }`}
                        >
                            <Filter className="w-5 h-5" />
                        </button>

                        {/* Clear */}
                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="p-2.5 rounded-xl bg-error/10 text-error border border-error/20 hover:bg-error/20 transition-colors"
                                title="مسح الفلاتر"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {/* Filter panel */}
                    {showFilters && (
                        <div className="mt-4 pt-4 border-t border-gray-100 animate-fadeIn">
                            <p className="text-xs font-semibold text-primary mb-3">فلترة حسب التخصص</p>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => setServiceId('')}
                                    className={`text-xs px-4 py-2 rounded-full transition-colors ${!serviceId
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                                        }`}
                                >
                                    الكل
                                </button>
                                {services?.map(s => (
                                    <button
                                        type="button"
                                        key={s.id}
                                        onClick={() => setServiceId(String(s.id))}
                                        className={`text-xs px-4 py-2 rounded-full transition-colors ${String(s.id) === serviceId
                                            ? 'bg-primary text-white'
                                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                                            }`}
                                    >
                                        {s.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                {/* Initial loading */}
                {isLoading && (
                    <div className="flex justify-center items-center py-24">
                        <Loader2 className="w-10 h-10 text-gold animate-spin" />
                    </div>
                )}

                {/* Error */}
                {isError && (
                    <p className="text-center text-brand-muted py-20">حدث خطأ أثناء تحميل المحامين. يرجى المحاولة لاحقاً.</p>
                )}

                {/* Grid */}
                {!isLoading && !isError && allLawyers.length > 0 && (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                            {allLawyers.map((lawyer) => (
                                <LawyerCard key={lawyer.lawyerId} lawyer={lawyer} />
                            ))}
                        </div>

                        {/* Scroll sentinel */}
                        <div ref={sentinelRef} className="h-1" />

                        {/* Loading more indicator */}
                        {isFetchingNextPage && (
                            <div className="flex justify-center py-8">
                                <Loader2 className="w-6 h-6 text-gold animate-spin" />
                            </div>
                        )}

                        {/* End of list */}
                        {!hasNextPage && allLawyers.length > 12 && (
                            <p className="text-center text-brand-muted text-sm py-8">تم عرض جميع المحامين</p>
                        )}
                    </>
                )}

                {/* Empty */}
                {!isLoading && !isError && allLawyers.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <User className="w-12 h-12 text-gray-200" />
                        <p className="text-brand-muted text-sm">
                            {hasActiveFilters ? 'لا توجد نتائج مطابقة للبحث.' : 'لا يوجد محامون متاحون حالياً.'}
                        </p>
                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="text-gold hover:text-gold-dark text-sm font-semibold"
                            >
                                مسح الفلاتر
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LawyersListPage;
