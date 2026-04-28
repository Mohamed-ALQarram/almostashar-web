import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import logo from '../../../assets/AlMostashar-logo.png';

const quickLinks = [
    { label: 'الرئيسية', href: '#hero' },
    { label: 'من نحن', href: '#about' },
    { label: 'لماذا نحن', href: '#why-us' },
    { label: 'سجّل كمحامٍ', to: '/lawyer-register' },
];

const serviceLinks = [
    'التحكيم التجاري',
    'قانون الشركات',
    'القانون المدني',
    'الملكية الفكرية',
    'القانون الجنائي',
    'العقارات',
];

const Footer = () => {
    return (
        <footer id="footer" className="bg-primary-dark text-white">
            {/* Main Footer */}
            <div className="section-container py-12 sm:py-16">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
                    {/* About Column */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <Link to="/" className="inline-block mb-4">
                            <img src={logo} alt="المستشار" className="h-14 w-auto" />
                        </Link>
                        <p className="text-white/60 text-sm leading-relaxed mb-5">
                            منصة المستشار - شريكك القانوني الموثوق. نقدم لك أفضل الخدمات القانونية مع نخبة من
                            المحامين المعتمدين.
                        </p>
                        {/* Social Icons */}
                        <div className="flex gap-3">
                            {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                                <a
                                    key={social}
                                    href="#"
                                    className="w-9 h-9 rounded-lg bg-white/10 hover:bg-gold/20 flex items-center justify-center transition-all duration-200 hover:scale-110"
                                    aria-label={social}
                                >
                                    <SocialIcon name={social} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-base font-bold mb-4 text-white">روابط سريعة</h3>
                        <ul className="space-y-2.5">
                            {quickLinks.map((link) => (
                                <li key={link.label}>
                                    {link.to ? (
                                        <Link
                                            to={link.to}
                                            className="text-white/60 hover:text-gold text-sm transition-colors duration-200"
                                        >
                                            {link.label}
                                        </Link>
                                    ) : (
                                        <a
                                            href={link.href}
                                            className="text-white/60 hover:text-gold text-sm transition-colors duration-200"
                                        >
                                            {link.label}
                                        </a>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services Links */}
                    <div>
                        <h3 className="text-base font-bold mb-4 text-white">الخدمات</h3>
                        <ul className="space-y-2.5">
                            {serviceLinks.map((service) => (
                                <li key={service}>
                                    <a
                                        href="#services"
                                        className="text-white/60 hover:text-gold text-sm transition-colors duration-200"
                                    >
                                        {service}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact & Newsletter */}
                    <div>
                        <h3 className="text-base font-bold mb-4 text-white">تواصل معنا</h3>
                        <ul className="space-y-3 mb-6">
                            <li className="flex items-start gap-3">
                                <Mail className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                                <span className="text-white/60 text-sm" dir="ltr">info@almostashar.com</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Phone className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                                <span className="text-white/60 text-sm" dir="ltr">+966 50 000 0000</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                                <span className="text-white/60 text-sm">الرياض، المملكة العربية السعودية</span>
                            </li>
                        </ul>

                        {/* Newsletter */}
                        <p className="text-white/80 text-sm font-semibold mb-2">النشرة البريدية</p>
                        <div className="flex">
                            <input
                                type="email"
                                placeholder="بريدك الإلكتروني"
                                className="flex-1 bg-white/10 border border-white/20 rounded-r-lg px-3 py-2.5 text-sm text-white placeholder-white/40 outline-none focus:border-gold transition-colors"
                            />
                            <button className="bg-gold hover:bg-gold-dark px-4 py-2.5 rounded-l-lg transition-colors duration-200">
                                <Send className="w-4 h-4 text-white" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright Bar */}
            <div className="border-t border-white/10">
                <div className="section-container py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p className="text-white/40 text-xs">
                        © {new Date().getFullYear()} المستشار. جميع الحقوق محفوظة.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="text-white/40 hover:text-white/70 text-xs transition-colors">
                            سياسة الخصوصية
                        </a>
                        <a href="#" className="text-white/40 hover:text-white/70 text-xs transition-colors">
                            الشروط والأحكام
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

// Simple inline social icons
const SocialIcon = ({ name }) => {
    const icons = {
        facebook: (
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
        ),
        twitter: (
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
        ),
        instagram: (
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
        ),
        linkedin: (
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
        ),
    };
    return icons[name] || null;
};

export default Footer;
