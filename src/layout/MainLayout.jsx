import { Slide } from '../components/Slider/Slider.jsx';
import { Outlet, useLocation  } from 'react-router-dom';
import { Footer } from '../components/Footer/Footer'
import { Nav } from '../components/Nav/Nav';

export const MainLayout = () => {
    const location = useLocation();

    //opbygning af site
    return (
   <>
   <Nav/>
   {location.pathname === "/" && <Slide />}
   <Outlet />
   <Footer />
   </>
   
    )
}

