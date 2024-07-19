import React, { useState } from "react";
import Header from "../multipage/Header/Header";
import config from "../config";
import "../multipage/login.scss";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const fetch_users = async () => {
    let message = document.getElementById("message");
    let nn = document.getElementById("nn");
    if (username === "" || username === " ") {
      message.innerText = "Unesete korisničko ime";
      message.classList.add("e_m");
    } else if (password === "") {
      message.innerText = "Unesite lozinku";
      message.classList.add("e_m");
    } else if (password.length < 8) {
      message.innerText = "Lozinka mora da ima barem 8 karaktera";
      message.classList.add("e_m");
    } else if (password !== repeatPassword) {
      message.innerText = "Lozinke se ne poklapaju";
      message.classList.add("e_m");
    } else {
      try {
        const response = await fetch(`${config.backendUrl}napravi_nalog`, {
          method: "POST",
          body: JSON.stringify({
            username: username,
            password: password,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 409) {
            message.innerText = "Korisničko ime je zauzeto";
            message.classList.add("e_m");
          } else {
            throw new Error("Network response was not ok");
          }
        } else {
          const data = await response.json();
          const token = data.token;
          localStorage.setItem("token", token);
          message.innerText = "Nalog uspješno napravljen";
          message.classList.add("s_m");
          nn.style.display = "none";
          setTimeout(() => {
            window.location.href = "/";
          }, 4000);
        }
      } catch (error) {
        console.error("There was a problem");
      }
    }
  };

  return (
    <>
      <Header></Header>
      <h1 id="ps">Napravi nalog</h1>
      <p id="tip">
        Savjet: Kao korisničko ime možete da unesete ime vaše firme, ako je
        imate.
      </p>
      <div className="register_container">
        <input
          type="text"
          placeholder="Korisničko ime"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Lozinka"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Ponovi lozinku"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
        />
        <button onClick={fetch_users} id="nn">
          Napravi nalog
        </button>
        <p id="message"></p>
      </div>
    </>
  );
};

export default Register;
