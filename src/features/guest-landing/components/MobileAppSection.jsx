import { Bell, FileText, Smartphone } from 'lucide-react';

const appFeatures = [
    { icon: FileText, label: 'متابعة الطلبات' },
    { icon: Bell, label: 'تنبيهات مهمة' },
    { icon: Smartphone, label: 'مستنداتك في مكان واحد' },
];

const MobileAppSection = () => {
    return (
        <section className="bg-brand-page py-12 sm:py-14">
            <div className="section-container">
                <div className="rounded-[26px] border border-primary/10 bg-white p-5 sm:p-7">
                    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                        <div className="text-right">
                            <span className="section-kicker">قريباً</span>
                            <h2 className="mt-3 text-2xl font-black leading-tight text-primary-dark sm:text-3xl">
                                تطبيق الموبايل لمتابعة طلباتك بسهولة
                            </h2>
                            <p className="mt-4 max-w-3xl text-sm leading-8 text-brand-muted sm:text-base">
                                نعمل على تجربة موبايل تكمل المنصة، تقدر من خلالها تتابع طلباتك، تنبيهاتك، ومستنداتك القانونية بشكل أبسط.
                            </p>
                        </div>

                        <div className="flex flex-col gap-4 lg:items-end">
                            <div className="flex flex-wrap gap-2">
                                {appFeatures.map((feature) => (
                                    <span key={feature.label} className="inline-flex items-center gap-2 rounded-full bg-brand-page px-4 py-2 text-xs font-extrabold text-primary">
                                        <feature.icon className="h-4 w-4 text-gold" />
                                        {feature.label}
                                    </span>
                                ))}
                            </div>
                            <span className="inline-flex w-fit rounded-full border border-gold/35 bg-gold/10 px-5 py-2 text-sm font-black text-primary-dark">
                                قريباً
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MobileAppSection;
