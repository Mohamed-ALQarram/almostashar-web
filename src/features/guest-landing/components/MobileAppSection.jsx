import { Bell, Lock, Smartphone } from 'lucide-react';
import phoneMockup from '../../../assets/Mobile-phone-mockup.png';

const appFeatures = [
    { icon: Lock, label: 'ملفات آمنة' },
    { icon: Bell, label: 'تنبيهات فورية' },
    { icon: Smartphone, label: 'تجربة جوال قادمة' },
];

const MobileAppSection = () => {
    return (
        <section className="guest-section bg-white">
            <div className="section-container">
                <div className="grid items-center gap-10 rounded-[2rem] border border-primary/10 bg-brand-page p-6 sm:p-8 lg:grid-cols-[0.8fr_1.2fr] lg:p-12">
                    <div className="relative flex justify-center">
                        <div className="relative w-56 rounded-[2.4rem] border border-primary/10 bg-primary-dark p-2 shadow-2xl shadow-primary/20 sm:w-64">
                            <div className="overflow-hidden rounded-[2rem] bg-black">
                                <img
                                    src={phoneMockup}
                                    alt="واجهة تطبيق المستشار على الهاتف"
                                    className="w-full"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="text-right">
                        <span className="text-xs font-black uppercase tracking-[0.24em] text-gold">تطبيق المستشار</span>
                        <h2 className="mt-4 text-3xl font-black leading-tight text-primary-dark sm:text-4xl lg:text-5xl">
                            متابعة قانونية أسهل من الهاتف
                        </h2>
                        <p className="mt-5 max-w-2xl text-sm leading-8 text-brand-muted sm:text-base">
                            قسم التطبيق يظهر كامتداد طبيعي للتجربة، بدون الادعاء بروابط تحميل غير متاحة. الأزرار واضحة كحالة “قريباً”.
                        </p>

                        <div className="mt-8 grid gap-3 sm:grid-cols-3">
                            {appFeatures.map((feature) => (
                                <div key={feature.label} className="rounded-2xl border border-primary/10 bg-white p-4">
                                    <feature.icon className="h-5 w-5 text-gold" />
                                    <p className="mt-3 text-sm font-extrabold text-primary">{feature.label}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            {['App Store', 'Google Play'].map((store) => (
                                <button
                                    key={store}
                                    type="button"
                                    disabled
                                    className="inline-flex items-center justify-center rounded-2xl border border-primary/10 bg-primary-dark px-6 py-4 text-right text-white opacity-90"
                                    aria-label={`${store} قريباً`}
                                >
                                    <span>
                                        <span className="block text-[11px] font-semibold text-white/50">قريباً على</span>
                                        <span className="block text-sm font-black">{store}</span>
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MobileAppSection;
