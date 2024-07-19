import React, { useState } from "react";
import Header from "../multipage/Header/Header";
import config from "../config";
import "../multipage/login.scss";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    let log_msg = document.getElementById("log_msg");
    let ps_b = document.getElementById("ps_b");

    if (username.trim() === "") {
      log_msg.innerText = "Unesite korisničko ime";
      log_msg.classList.add("e_m");
      return;
    } else if (password.trim() === "") {
      log_msg.innerText = "Unesite lozinku";
      log_msg.classList.add("e_m");
      return;
    }

    try {
      const response = await fetch(`${config.backendUrl}prijava`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      const token = data.token;
      localStorage.setItem("token", token);
      if (response.ok) {
        log_msg.innerText = "Prijava uspješna";
        log_msg.classList.add("s_m");
        ps_b.style.display = "none";
        setTimeout(() => {
          window.location.href = "/";
        }, 4000);
      } else {
        log_msg.innerText =
          data.message || "Netačno korisničko ime ili lozinka";
        log_msg.classList.add("e_m");
      }
    } catch (error) {
      log_msg.innerText = "Greška u serveru" + error;
      log_msg.classList.add("e_m");
      console.error("GRESKA");
    }
  };

  return (
    <>
      <Header />
      <h1 id="ps">Prijavi se</h1>
      <div className="login_container">
        <form onSubmit={handleSubmit}>
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
          <button type="submit" id="ps_b">
            Prijavi se
          </button>
        </form>
        <p id="log_msg"></p>
      </div>
    </>
  );
};

export default Login;
