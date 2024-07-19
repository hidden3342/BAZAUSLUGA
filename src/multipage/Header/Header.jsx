import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./header.scss";
import menu from "./header_assets/menu.png";
import close from "./header_assets/close.png";
const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [open, setOpen] = useState(false);
  if (!open) {
    let body = document.querySelector("body");
    body.style.overflowY = "scroll";
  }
  useEffect(() => {
    let menu = document.getElementById("menu");
    menu.addEventListener("click", () => {
      setOpen(true);
    });
    let close = document.getElementById("close");
    close.addEventListener("click", () => {
      setOpen(false);
    });
  }, []);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setIsLoggedIn(decodedToken.isLoggedIn);
      } catch (error) {
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []); // Empty dependency array ensures this effect runs only once
  const openHeader = () => {
    if (open) {
      let responsive_header = document.getElementById("responsive_header");
      let body = document.querySelector("body");
      responsive_header.style.display = "flex";
      body.style.overflowY = "hidden";
    }
  };
  const closeHeader = () => {
    if (!open) {
      let responsive_header = document.getElementById("responsive_header");
      let body = document.querySelector("body");
      responsive_header.style.display = "none";
      body.style.overflowY = "scroll";
    }
  };
  return (
    <>
      <header>
        <div className="logo">
          <Link to="/">BAZA USLUGA</Link>
        </div>
        <nav>
          <Link to="/">Usluge</Link>
          <Link to="/objavi">Objavi uslugu</Link>
          {isLoggedIn ? (
            <Link to="/nalog">Nalog</Link>
          ) : (
            <>
              <Link to="/prijava">Prijavi se</Link>
              <Link to="/napravi_nalog">Napravi nalog</Link>
            </>
          )}
        </nav>
        <img src={menu} alt="" id="menu" onClick={openHeader} />
      </header>
      <div id="responsive_header">
        <div className="logo">
          <Link to="/">BAZA USLUGA</Link>
        </div>
        <nav>
          <Link to="/">Usluge</Link>
          <Link to="/objavi">Objavi uslugu</Link>
          {isLoggedIn ? (
            <Link to="/nalog">Nalog</Link>
          ) : (
            <>
              <Link to="/prijava">Prijavi se</Link>
              <Link to="/napravi_nalog">Napravi nalog</Link>
            </>
          )}
        </nav>
        <img src={close} alt="" id="close" onClick={closeHeader} />
      </div>
    </>
  );
};

export default Header;
