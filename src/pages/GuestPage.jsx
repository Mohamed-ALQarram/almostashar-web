import {
    GuestLayout,
    HeroSection,
    AboutSection,
    WhyChooseUsSection,
    ServicesSection,
    OurLawyersSection,
    JoinNetworkSection,
    MobileAppSection
} from '../features/guest-landing';

const GuestPage = () => {
    return (
        <GuestLayout>
            <HeroSection />
            <AboutSection />
            <ServicesSection />
            <WhyChooseUsSection />
            <OurLawyersSection />
            <JoinNetworkSection />
            <MobileAppSection />
        </GuestLayout>
    );
};

export default GuestPage;
