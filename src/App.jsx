import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/global.scss'; 
import { MainLayout } from './layout/MainLayout';
import { HomePage } from './pages/HomePage/HomePage';
import { BoligSalg } from "./pages/BoligSalg/BoligSalg";
import { PropertyPage } from "./pages/PropertyPage/PropertyPage";
import { LoginPage } from './pages/LoginPage/LoginPage';
import { AdminPage } from './pages/AdminPage/AdminPage';
import { ErrorPage } from './pages/ErrorPage/ErrorPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<MainLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="/boligsalg" element={<BoligSalg />} />
                    <Route path="/bolig/:propertyId" element={<PropertyPage />} />
                    <Route path='/login' element={<LoginPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path='/*' element={<ErrorPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
