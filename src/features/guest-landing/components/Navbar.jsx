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
        const onScroll = () => setIsScrolled(window.scrollY > 20);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <nav
            className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
                isScrolled || isMobileOpen
                    ? 'border-white/10 bg-primary-dark/90 text-white shadow-lg shadow-primary-dark/15 backdrop-blur-xl'
                    : 'border-primary/10 bg-white/90 text-primary backdrop-blur-xl'
            }`}
        >
            <div className="section-container flex h-[76px] items-center justify-between gap-6">
                <Link to="/guest" className="flex items-center" aria-label="المستشار">
                    <img src={logo} alt="المستشار" className="h-14 w-auto" />
                </Link>

                <ul className="hidden items-center gap-1 lg:flex">
                    {navLinks.map((link) => (
                        <li key={link.href}>
                            <a
                                href={link.href}
                                className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                                    isScrolled || isMobileOpen
                                        ? 'text-white/75 hover:bg-white/10 hover:text-white'
                                        : 'text-primary/70 hover:bg-primary/5 hover:text-primary'
                                }`}
                            >
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>

                <Link
                    to="/login"
                    className={`hidden items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-extrabold transition lg:inline-flex ${
                        isScrolled || isMobileOpen
                            ? 'bg-gold text-primary-dark hover:bg-gold-light'
                            : 'bg-primary text-white hover:bg-primary-dark'
                    }`}
                >
                    <LogIn className="h-4 w-4" />
                    تسجيل الدخول
                </Link>

                <button
                    type="button"
                    onClick={() => setIsMobileOpen((value) => !value)}
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border transition lg:hidden ${
                        isScrolled || isMobileOpen
                            ? 'border-white/15 bg-white/10 text-white'
                            : 'border-primary/10 bg-white text-primary'
                    }`}
                    aria-label={isMobileOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
                    aria-expanded={isMobileOpen}
                >
                    {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            <div className={`overflow-hidden transition-all duration-300 lg:hidden ${isMobileOpen ? 'max-h-96' : 'max-h-0'}`}>
                <div className="section-container pb-4">
                    <div className="rounded-2xl border border-white/10 bg-primary-dark p-2">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMobileOpen(false)}
                                className="block rounded-xl px-4 py-3 text-sm font-bold text-white/75 hover:bg-white/10 hover:text-white"
                            >
                                {link.label}
                            </a>
                        ))}
                        <Link
                            to="/login"
                            onClick={() => setIsMobileOpen(false)}
                            className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gold px-4 py-3 text-sm font-extrabold text-primary-dark"
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
