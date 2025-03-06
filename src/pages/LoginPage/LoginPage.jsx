import { useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { postLogin } from "../../hooks/postLogin";  
import { Title } from "../../components/Title/Title"; 
import styles from "./LoginPage.module.scss"; 

/**
 * LoginPage-komponenten håndterer login-processen for brugeren.
 * Den indeholder inputfelter til brugernavn og adgangskode og håndterer validering samt navigation efter login.
 */
export const LoginPage = () => {
  /**
   * Henter setUserData fra UserContext.
   * - UserContext er en global tilstand (context), der holder information om den aktuelle bruger.
   * - setUserData er en funktion, der opdaterer brugerens oplysninger i konteksten efter login.
   * - Når en bruger logger ind, gemmer vi deres data (fx brugernavn, ID, token) via setUserData,
   *   så vi kan tilgå disse oplysninger på tværs af applikationen.
   */
  const { setUserData } = useContext(UserContext);

  /**
   * useNavigate bruges til at omdirigere brugeren til en ny side efter succesfuldt login.
   * - Eksempel: Efter login kan vi navigere brugeren til deres AdminPage.
   */
  const navigate = useNavigate();
  
  /**
   * State til at håndtere brugerens login-oplysninger.
   * - credentials indeholder brugernavn og adgangskode.
   * - setCredentials opdaterer værdierne, når brugeren skriver i inputfelterne.
   */
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });

  /**
   * Håndterer login-processen ved at kalde postLogin-funktionen.
   * - e.preventDefault() forhindrer standard form-submission.
   * - postLogin(e, setUserData, navigate) sender login-oplysninger til backend,
   *   opdaterer brugerens tilstand via setUserData og omdirigerer brugeren.
   */
  const handleLogin = (e) => {
    postLogin(e, setUserData, navigate);
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.loginContainer}>
        {/* Titelkomponent med login-overskrift */}
        <Title text="Login" />

        <p>Indtast dit brugernavn og adgangskode for at logge ind</p>

        <div className={styles.formWrapper}>
          {/* Form-element med onSubmit for at håndtere login */}
          <form onSubmit={handleLogin} className={styles.loginForm}>
            {/* Inputfelt til brugernavn */}
            <input
              name="username"
              placeholder="Brugernavn"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              className={styles.inputField}
            />
            
            {/* Inputfelt til adgangskode (type="password" for sikkerhed) */}
            <input
              type="password"
              name="password"
              placeholder="Adgangskode"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className={styles.inputField}
            />

            <div className={styles.buttonContainer}>
              {/* Login-knap til at sende formen */}
              <button className={styles.loginButton}>Login</button>

              {/* Annuller-knap til at nulstille inputfelterne */}
              <button type="reset" className={styles.cancelButton}>Annuller</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
