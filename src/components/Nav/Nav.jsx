import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { UserContext } from "../../context/UserContext";
import style from "./Nav.module.scss";

export const Nav = () => {
  const { userData, logout } = useContext(UserContext);

  return (
    <nav className={style.nav}>
      <h1 className={style.logo}>HomeLands</h1>

      <div className={style.navContent}>
        <ul>
          <li><NavLink to="/">Forside</NavLink></li>
          <li><NavLink to="/boligsalg">Boliger til salg</NavLink></li>

          {/* 🔹 Vis Admin-link KUN hvis bruger er logget ind */}
          {userData && (
            <li><NavLink to="/admin">Admin</NavLink></li>
          )}

          {/* 🔹 Hvis logget ind: Vis Logout, ellers Login */}
          {userData ? (
            <li>
              <button onClick={logout} className={style.authButton}>
                Logout
              </button>
            </li>
          ) : (
            <li><NavLink to="/login">Login</NavLink></li>
          )}
        </ul>

        <div className={style.searchBox}>
          <input type="text" placeholder="Indtast søgeord" />
          <button><FaSearch /></button>
        </div>
      </div>
    </nav>
  );
};
