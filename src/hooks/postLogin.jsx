// Importerer nødvendige moduler og funktioner
export const postLogin = async (event, setUserData, navigate) => {
  event.preventDefault(); // Forhindrer siden i at genindlæses ved form-submit

  // Opretter en URLSearchParams-instans for at formatere login-data korrekt
  const body = new URLSearchParams();
  body.append("username", event.target.username.value); // Tilføjer brugernavn til body
  body.append("password", event.target.password.value); // Tilføjer adgangskode til body

  // Konfigurerer HTTP-anmodningen
  const options = {
    method: "POST", // API’et skal modtage data, derfor bruges POST-metoden
    headers: { "Content-Type": "application/x-www-form-urlencoded" }, // Fortæller API'et, at vi sender form-data
    body: body, // Indeholder de formaterede login-oplysninger
  };

  try {
    // `await` kan kun bruges inde i en `async` funktion.
    // `async` gør, at vi kan bruge `await` til at vente på asynkrone operationer, såsom API-kald.
    // Det betyder, at koden venter på, at fetch() returnerer et svar, før den fortsætter.
    const response = await fetch("https://api.mediehuset.net/token", options);

    // Konverterer API-responsen til JSON-format. `await` sikrer, at koden venter på, at dette sker.
    const data = await response.json();

    // Tjekker, om API’et returnerer en access_token (brugeren er logget ind)
    if (data?.access_token) {
      setUserData(data); // Opdaterer login-status i UserContext
      sessionStorage.setItem("user", JSON.stringify(data)); // Gemmer login-data i sessionStorage
      navigate("/admin"); // Omdirigerer brugeren til admin-sektionen
    } else {
      console.error("Login fejlede! Ingen token modtaget."); // Logger en fejl, hvis login ikke lykkes
    }
  } catch (error) {
    // Hvis der opstår en fejl i fetch() eller json()-metoden, bliver den fanget her.
    console.error("Fejl ved login:", error); // Håndterer fejl, hvis API-kaldet mislykkes
  }
};
