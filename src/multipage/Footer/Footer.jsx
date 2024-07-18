import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // You'll need to install this package
import "./footer.scss";

const Footer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false); // Add a state to track if the message has been sent

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, []);

  const toggleModal = (e) => {
    e.preventDefault();
    setIsModalOpen(!isModalOpen);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      let sup_msg = document.getElementById("sup_msg");

      if (email === "" || email === " ") {
        sup_msg.innerText = "Unesite email";
        sup_msg.classList.add("s_e");
      } else if (!email.includes("@") || !email.includes(".")) {
        sup_msg.innerText = "Unesite ispravan email";
        sup_msg.classList.add("s_e");
      } else if (message === "" || message === " ") {
        sup_msg.innerText = "Unesite poruku";
        sup_msg.classList.add("s_e");
      } else {
        sup_msg.innerText = "Poruka je poslata";
        sup_msg.classList.add("s_s");

        const response = await fetch(
          "https://6694026dc6be000fa07de485.mockapi.io/support",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, message }),
          }
        );
        if (response.ok) {
          setSent(true);
          setMessage("");
          setEmail("");
        } else {
          console.error("Error sending message:", response.status);
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <>
      <footer>
        <div className="logo">
          <Link to="/">BAZA USLUGA</Link>
        </div>
        <nav>
          <Link to="/">Usluge</Link>
          <Link to="/objavi">Objavi uslugu</Link>
          <a href="#" onClick={toggleModal}>
            Podrška
          </a>
          {isLoggedIn ? (
            <Link to="/nalog">Nalog</Link>
          ) : (
            <>
              <Link to="/prijava">Prijavi se</Link>
              <Link to="/napravi_nalog">Napravi nalog</Link>
            </>
          )}
        </nav>
      </footer>
      <div className="post_footer">
        <p>Copyright © 2024 BAZA USLUGA.</p>
      </div>
      {isModalOpen && (
        <div className="modal">
          <div className="modal_content">
            <span className="close" onClick={toggleModal}>
              &times;
            </span>
            <h2>Podrška</h2>
            <input
              type="text"
              placeholder="Upišite vaš email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="text"
              placeholder="Upišite vaše pitanje"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={handleSendMessage}>Pošalji</button>
            <p id="sup_msg"></p>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
