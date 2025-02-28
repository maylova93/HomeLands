export const postLogin = async (event, setUserData, navigate) => {
  event.preventDefault();

  const body = new URLSearchParams();
  body.append("username", event.target.username.value);
  body.append("password", event.target.password.value);

  console.log("📡 Sender login-data:", Object.fromEntries(body));

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body,
  };

  try {
    const response = await fetch("https://api.mediehuset.net/token", options);
    const data = await response.json();

    console.log(" API Response:", data); 

    if (data?.access_token) {
      setUserData(data);
      sessionStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("user", JSON.stringify(data));
      console.log(" Login succesfuldt:", data);
      navigate("/admin");
    } else {
      console.error(" Login fejlede! Ingen token modtaget.", data);
    }
  } catch (error) {
    console.error(" Fejl ved login:", error);
  }
};
