import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from '../../../assets/AlMostashar-logo.png';

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
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled
                    ? 'bg-primary-dark/95 backdrop-blur-md shadow-lg py-2'
                    : 'bg-transparent py-4'
            }`}
        >
            <div className="section-container flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex-shrink-0">
                    <img src={logo} alt="المستشار" className="h-12 w-auto" />
                </Link>

                {/* Desktop Nav Links */}
                <ul className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <li key={link.href}>
                            <a
                                href={link.href}
                                className="text-white/80 hover:text-gold text-sm font-medium transition-colors duration-200 relative group"
                            >
                                {link.label}
                                <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full" />
                            </a>
                        </li>
                    ))}
                </ul>

                {/* Login Button */}
                <div className="hidden lg:flex items-center gap-3">
                    <Link
                        to="/login"
                        className="px-5 py-2.5 bg-gold hover:bg-gold-dark text-white text-sm font-bold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                        تسجيل الدخول / إنشاء حساب
                    </Link>
                </div>

                {/* Mobile Hamburger */}
                <button
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                    aria-label="Toggle menu"
                >
                    {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Drawer */}
            <div
                className={`lg:hidden overflow-hidden transition-all duration-300 ${
                    isMobileOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <div className="section-container py-4 border-t border-white/10">
                    <ul className="flex flex-col gap-3">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <a
                                    href={link.href}
                                    onClick={() => setIsMobileOpen(false)}
                                    className="block text-white/80 hover:text-gold py-2 text-sm font-medium transition-colors"
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <Link
                        to="/login"
                        onClick={() => setIsMobileOpen(false)}
                        className="mt-4 block w-full text-center px-5 py-3 bg-gold hover:bg-gold-dark text-white text-sm font-bold rounded-lg transition-all duration-200"
                    >
                        تسجيل الدخول / إنشاء حساب
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
