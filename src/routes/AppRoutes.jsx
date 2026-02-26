import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import LawyerRegister from '../pages/LawyerRegister';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/lawyer-register" element={<LawyerRegister />} />
        </Routes>
    );
};

export default AppRoutes;
