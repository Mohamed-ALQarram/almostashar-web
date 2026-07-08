import { Bell, Lock, Smartphone } from 'lucide-react';
import phoneMockup from '../../../assets/Mobile-phone-mockup.png';

const appFeatures = [
    { icon: Lock, label: 'متابعة آمنة' },
    { icon: Bell, label: 'تنبيهات منظمة' },
    { icon: Smartphone, label: 'قريباً على الجوال' },
];

const MobileAppSection = () => {
    return (
        <section className="guest-section bg-brand-page">
            <div className="section-container">
                <div className="grid items-center gap-10 lg:grid-cols-[0.78fr_1.22fr]">
                    <div className="mx-auto max-w-xs">
                        <img
                            src={phoneMockup}
                            alt="واجهة تطبيق المستشار على الهاتف"
                            className="w-full rounded-2xl border border-primary/10 bg-white p-2"
                            loading="lazy"
                        />
                    </div>

                    <div className="text-right">
                        <span className="section-kicker">تطبيق المستشار</span>
                        <h2 className="section-heading">تجربة جوال قادمة لمتابعة طلباتك القانونية</h2>
                        <p className="section-subtitle">
                            عندما تتوفر تطبيقات الجوال، ستكون امتداداً هادئاً للتجربة الحالية: متابعة الطلبات، التنبيهات، والمستندات بدون تعقيد.
                        </p>

                        <div className="mt-8 grid gap-3 sm:grid-cols-3">
                            {appFeatures.map((feature) => (
                                <div key={feature.label} className="premium-card p-4">
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
                                    className="rounded-full border border-primary/10 bg-white px-6 py-3 text-sm font-extrabold text-primary/70"
                                    aria-label={`${store} قريباً`}
                                >
                                    {store} - قريباً
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
