import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, Menu, X } from 'lucide-react';
import logo from '../../../assets/AlMostashar-logo-new.png';

const navLinks = [
    { label: 'الرئيسية', href: '#hero' },
    { label: 'من نحن', href: '#about' },
    { label: 'خدماتنا', href: '#services' },
    { label: 'لماذا نحن', href: '#why-us' },
    { label: 'تواصل معنا', href: '#footer' },
];

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 24);
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isMobileOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileOpen]);

    return (
        <nav
            className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
                isScrolled || isMobileOpen
                    ? 'border-b border-primary/10 bg-white/95 py-2 shadow-xl shadow-primary/10 backdrop-blur-xl'
                    : 'border-b border-primary/10 bg-white/90 py-3 shadow-lg shadow-primary/5 backdrop-blur-xl'
            }`}
        >
            <div className="section-container flex items-center justify-between gap-6">
                <Link to="/guest" className="flex items-center gap-3" aria-label="العودة إلى الصفحة الرئيسية">
                    <img src={logo} alt="المستشار" className="h-14 w-auto sm:h-16" />
                </Link>

                <ul className="hidden items-center gap-1 rounded-full border border-primary/10 bg-brand-page/80 p-1 text-sm lg:flex">
                    {navLinks.map((link) => (
                        <li key={link.href}>
                            <a
                                href={link.href}
                                className="group relative block rounded-full px-4 py-2.5 font-semibold text-primary/75 transition hover:bg-white hover:text-primary"
                            >
                                {link.label}
                                <span className="absolute inset-x-5 bottom-1 h-px origin-right scale-x-0 bg-gold transition-transform duration-300 group-hover:scale-x-100" />
                            </a>
                        </li>
                    ))}
                </ul>

                <div className="hidden items-center gap-3 lg:flex">
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary px-5 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-primary/15 transition hover:-translate-y-0.5 hover:bg-primary-dark"
                    >
                        <LogIn className="h-4 w-4" />
                        تسجيل الدخول
                    </Link>
                </div>

                <button
                    type="button"
                    onClick={() => setIsMobileOpen((value) => !value)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-primary/10 bg-brand-page text-primary transition hover:border-gold/50 hover:bg-white lg:hidden"
                    aria-label={isMobileOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
                    aria-expanded={isMobileOpen}
                >
                    {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            <div
                className={`overflow-hidden transition-all duration-300 lg:hidden ${
                    isMobileOpen ? 'max-h-[420px] opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <div className="section-container pt-3">
                    <div className="rounded-3xl border border-primary/10 bg-white p-3 shadow-2xl shadow-primary/10">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMobileOpen(false)}
                                className="block rounded-2xl px-4 py-3 text-sm font-bold text-primary/75 transition hover:bg-brand-page hover:text-primary"
                            >
                                {link.label}
                            </a>
                        ))}
                        <Link
                            to="/login"
                            onClick={() => setIsMobileOpen(false)}
                            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-extrabold text-white transition hover:bg-primary-dark"
                        >
                            <LogIn className="h-4 w-4" />
                            تسجيل الدخول / إنشاء حساب
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
