import { useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { postLogin } from "../../hooks/postLogin";  
import { Title } from "../../components/Title/Title"; 
import styles from "./LoginPage.module.scss"; 

export const LoginPage = () => {
  const { setUserData } = useContext(UserContext);
  const navigate = useNavigate();
  
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });
  
  const handleLogin = (e) => {
    postLogin(e, setUserData, navigate);
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.loginContainer}>
        <Title text="Login" />

        <p>Indtast dit brugernavn og adgangskode for at logge ind</p>

        <div className={styles.formWrapper}>
          <form onSubmit={handleLogin} className={styles.loginForm}>
            <input
              name="username"
              placeholder="Brugernavn"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              className={styles.inputField}
            />
            
            <input
              type="password"
              name="password"
              placeholder="Adgangskode"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className={styles.inputField}
            />

            <div className={styles.buttonContainer}>
              <button className={styles.loginButton}>Login</button>
              <button type="reset" className={styles.cancelButton}>Annuller</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
