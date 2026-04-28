import { Search, ChevronDown } from 'lucide-react';
import heroImg from '../../../assets/Hero-Section.jpg';
const HeroSection = () => {
    return (
        <section
            id="hero"
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src={heroImg}
                    alt="Hero background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/80 via-primary-dark/70 to-primary-dark/90" />
            </div>
            {/* Content */}
            <div className="relative z-10 section-container text-center pt-24 pb-16">
                {/* Gold decorative line */}
                <div className="flex items-center justify-center gap-3 mb-6">
                    <span className="w-12 h-px bg-gold/50" />
                    <span className="w-2 h-2 rounded-full bg-gold" />
                    <span className="w-12 h-px bg-gold/50" />
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4">
                    شريكك القانوني الموثوق
                </h1>
                <p className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                    منصة المستشار تقدم لك خدمات قانونية متكاملة بأعلى معايير الجودة والاحترافية مع نخبة من المحامين المعتمدين
                </p>
                {/* Search Bar */}
                <div className="max-w-2xl mx-auto">
                    <div className="flex flex-col sm:flex-row bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
                        {/* Dropdown */}
                        <div className="relative flex-1 border-b sm:border-b-0 sm:border-l border-gray-100">
                            <select
                                className="w-full appearance-none bg-transparent px-5 py-4 text-sm text-primary font-medium outline-none cursor-pointer"
                                defaultValue=""
                            >
                                <option value="" disabled>نوع الخدمة القانونية</option>
                                <option value="commercial">التحكيم التجاري</option>
                                <option value="corporate">قانون الشركات</option>
                                <option value="civil">القانون المدني</option>
                                <option value="criminal">القانون الجنائي</option>
                                <option value="ip">الملكية الفكرية</option>
                                <option value="realestate">العقارات</option>
                            </select>
                            <ChevronDown className="absolute top-1/2 -translate-y-1/2 left-4 w-4 h-4 text-brand-muted pointer-events-none" />
                        </div>
                        {/* Search Input */}
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="ابحث عن محامٍ أو خدمة قانونية..."
                                className="w-full px-5 py-4 text-sm outline-none text-primary placeholder-brand-muted"
                            />
                        </div>
                        {/* Search Button */}
                        <button className="bg-gold hover:bg-gold-dark text-white font-bold px-8 py-4 flex items-center justify-center gap-2 transition-colors duration-200">
                            <Search className="w-4 h-4" />
                            <span className="text-sm">ابحث الآن</span>
                        </button>
                    </div>
                </div>
                {/* Stats row */}
                <div className="flex flex-wrap justify-center gap-8 sm:gap-12 mt-12">
                    {[
                        { value: '+500', label: 'محامي معتمد' },
                        { value: '+10K', label: 'استشارة ناجحة' },
                        { value: '+95%', label: 'نسبة الرضا' },
                    ].map((stat) => (
                        <div key={stat.label} className="text-center">
                            <p className="text-2xl sm:text-3xl font-extrabold text-gold">{stat.value}</p>
                            <p className="text-white/60 text-sm mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
            {/* Bottom wave/gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-brand-page to-transparent" />
        </section>
    );
};
export default HeroSection;
