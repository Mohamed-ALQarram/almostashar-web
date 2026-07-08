import Navbar from './Navbar';
import Footer from './Footer';

const GuestLayout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col font-cairo bg-brand-page" dir="rtl">
            <Navbar />
            <main className="relative flex-1 overflow-hidden bg-brand-page">{children}</main>
            <Footer />
        </div>
    );
};

export default GuestLayout;
