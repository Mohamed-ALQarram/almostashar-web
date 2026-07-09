import {
    GuestLayout,
    HeroSection,
    AboutSection,
    WhyChooseUsSection,
    ServicesSection,
    OurLawyersSection,
    JoinNetworkSection,
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
        </GuestLayout>
    );
};

export default GuestPage;
