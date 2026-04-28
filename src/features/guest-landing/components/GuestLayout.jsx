import Navbar from './Navbar';
import Footer from './Footer';

const GuestLayout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col font-cairo" dir="rtl">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
};

export default GuestLayout;
