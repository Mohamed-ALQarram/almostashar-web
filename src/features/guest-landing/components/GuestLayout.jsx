import Navbar from './Navbar';
import Footer from './Footer';

const GuestLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-brand-page font-cairo" dir="rtl">
            <Navbar />
            <main className="overflow-hidden">{children}</main>
            <Footer />
        </div>
    );
};

export default GuestLayout;
