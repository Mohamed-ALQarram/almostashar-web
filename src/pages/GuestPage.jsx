import {
    GuestLayout,
    HeroSection,
    AboutSection,
    WhyChooseUsSection,
    ServicesSection,
    JoinNetworkSection,
    MobileAppSection,
} from '../features/guest-landing';

const GuestPage = () => {
    return (
        <GuestLayout>
            <HeroSection />
            <AboutSection />
            <ServicesSection />
            <WhyChooseUsSection />
            <JoinNetworkSection />
            <MobileAppSection />
        </GuestLayout>
    );
};

export default GuestPage;
