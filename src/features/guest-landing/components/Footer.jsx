import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Send, Twitter } from 'lucide-react';
import logo from '../../../assets/AlMostashar-logo-new.png';

const quickLinks = [
    { label: 'الرئيسية', href: '#hero' },
    { label: 'من نحن', href: '#about' },
    { label: 'خدماتنا', href: '#services' },
    { label: 'لماذا نحن', href: '#why-us' },
    { label: 'سجّل كمحامٍ', to: '/lawyer-register' },
];

const serviceLinks = [
    'استشارات قانونية',
    'صياغة العقود',
    'تمثيل قانوني',
    'تأسيس الشركات',
    'قضايا عمالية',
    'أحوال شخصية',
];

const socialLinks = [
    { label: 'Facebook', icon: Facebook },
    { label: 'Twitter', icon: Twitter },
    { label: 'Instagram', icon: Instagram },
    { label: 'LinkedIn', icon: Linkedin },
];

const Footer = () => {
    return (
        <footer id="footer" className="bg-primary-dark text-white">
            <div className="section-container py-14 sm:py-20">
                <div className="grid gap-10 lg:grid-cols-[1.2fr_0.7fr_0.8fr_1fr]">
                    <div>
                        <Link to="/guest" className="inline-block" aria-label="المستشار">
                            <img src={logo} alt="المستشار" className="h-20 w-auto" loading="lazy" />
                        </Link>
                        <p className="mt-5 max-w-sm text-sm leading-8 text-white/60">
                            المستشار منصة قانونية عربية تجمع بين الثقة المهنية والتجربة الرقمية الراقية لخدمة الأفراد والشركات.
                        </p>
                        <div className="mt-6 flex gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href="#"
                                    aria-label={social.label}
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white/75 transition hover:border-gold/40 hover:bg-gold/15 hover:text-gold"
                                >
                                    <social.icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-5 text-base font-black text-white">روابط سريعة</h3>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.label}>
                                    {link.to ? (
                                        <Link to={link.to} className="text-sm font-semibold text-white/60 transition hover:text-gold">
                                            {link.label}
                                        </Link>
                                    ) : (
                                        <a href={link.href} className="text-sm font-semibold text-white/60 transition hover:text-gold">
                                            {link.label}
                                        </a>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-5 text-base font-black text-white">الخدمات القانونية</h3>
                        <ul className="space-y-3">
                            {serviceLinks.map((service) => (
                                <li key={service}>
                                    <a href="#services" className="text-sm font-semibold text-white/60 transition hover:text-gold">
                                        {service}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-5 text-base font-black text-white">تواصل معنا</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <Mail className="mt-1 h-4 w-4 shrink-0 text-gold" />
                                <span className="text-sm text-white/60" dir="ltr">info@almostashar.com</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Phone className="mt-1 h-4 w-4 shrink-0 text-gold" />
                                <span className="text-sm text-white/60" dir="ltr">+966 50 000 0000</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin className="mt-1 h-4 w-4 shrink-0 text-gold" />
                                <span className="text-sm leading-7 text-white/60">الرياض، المملكة العربية السعودية</span>
                            </li>
                        </ul>

                        <div className="mt-7 rounded-3xl border border-white/10 bg-white/[0.06] p-3">
                            <p className="mb-3 px-2 text-xs font-bold text-white/60">النشرة البريدية</p>
                            <div className="flex overflow-hidden rounded-2xl bg-white">
                                <input
                                    type="email"
                                    placeholder="بريدك الإلكتروني"
                                    className="min-w-0 flex-1 px-4 py-3 text-sm font-semibold text-primary outline-none placeholder:text-brand-muted/70"
                                    aria-label="البريد الإلكتروني للنشرة البريدية"
                                />
                                <button
                                    type="button"
                                    className="bg-gold px-4 text-primary-dark transition hover:bg-gold-light"
                                    aria-label="إرسال البريد الإلكتروني"
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-white/10">
                <div className="section-container flex flex-col items-center justify-between gap-3 py-5 text-center sm:flex-row">
                    <p className="text-xs font-semibold text-white/40">
                        © {new Date().getFullYear()} المستشار. جميع الحقوق محفوظة.
                    </p>
                    <div className="flex gap-5">
                        <a href="#" className="text-xs font-semibold text-white/40 transition hover:text-white/70">سياسة الخصوصية</a>
                        <a href="#" className="text-xs font-semibold text-white/40 transition hover:text-white/70">الشروط والأحكام</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
