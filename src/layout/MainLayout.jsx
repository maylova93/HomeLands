import { Slide } from '../components/Slider/Slider.jsx';
import { Outlet, useLocation  } from 'react-router-dom';
import { Footer } from '../components/Footer/Footer';
import { Nav } from '../components/Nav/Nav';

export const MainLayout = () => {
    const location = useLocation(); // Henter den aktuelle URL-sti vha. useLocation fra react-router-dom

    return (
        <>
            <Nav /> {/* Viser navigationen på alle sider */}
             {/* && er en logisk AND-operator i JavaScript.  */}  {/* === er den strikte lighedsoperator i JavaScript. "/" er en streng (string)  */}
            {location.pathname === "/" && <Slide />} 
            {/* 
                Betinget rendering: 
                - Tjekker, om den aktuelle sti (pathname) er "/". 
                - Hvis ja, renderes <Slide />.
                - Hvis nej, vises ingenting.
                - &&-operatoren sikrer, at <Slide /> kun renderes, hvis betingelsen er sand.
            */}
            
            <Outlet /> {/* Pladsholder for den aktuelle side, som matcher den aktive route */}
            
            <Footer /> {/* Viser footer på alle sider */}
        </>
    );
};
