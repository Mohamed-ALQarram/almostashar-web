import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from 'lucide-react';
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
    'تأسيس الشركات',
    'تمثيل قانوني',
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
            <div className="section-container py-14 sm:py-16">
                <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr_0.85fr_1fr]">
                    <div>
                        <Link to="/guest" className="inline-block" aria-label="المستشار">
                            <img src={logo} alt="المستشار" className="h-16 w-auto" loading="lazy" />
                        </Link>
                        <p className="mt-5 max-w-sm text-sm leading-8 text-white/60">
                            منصة مصرية للخدمات القانونية الرقمية، تساعد الأفراد والشركات على الوصول لمحامٍ مناسب ومتابعة الطلب بوضوح وخصوصية.
                        </p>
                        <div className="mt-6 flex gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href="#"
                                    aria-label={social.label}
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/70 transition hover:border-gold/40 hover:text-gold"
                                >
                                    <social.icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-5 text-base font-black">روابط سريعة</h3>
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
                        <h3 className="mb-5 text-base font-black">الخدمات القانونية</h3>
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
                        <h3 className="mb-5 text-base font-black">تواصل معنا</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <Mail className="mt-1 h-4 w-4 shrink-0 text-gold" />
                                <span className="text-sm text-white/60" dir="ltr">info@almostashar.com</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Phone className="mt-1 h-4 w-4 shrink-0 text-gold" />
                                <span className="text-sm text-white/60" dir="ltr">+20 100 000 0000</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin className="mt-1 h-4 w-4 shrink-0 text-gold" />
                                <span className="text-sm leading-7 text-white/60">القاهرة، مصر</span>
                            </li>
                        </ul>

                        <p className="mt-7 text-sm leading-8 text-white/50">
                            للتواصل أو الاستفسار عن الخدمات، استخدم بيانات التواصل الموضحة أو ابدأ طلبك من خلال المنصة.
                        </p>
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
