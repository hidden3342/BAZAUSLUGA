import React, { useState, useEffect } from "react";
import Header from "../multipage/Header/Header";
import config from "../config";
import { jwtDecode } from "jwt-decode"; // Corrected import statement
import Footer from "../multipage/Footer/Footer";
import "./post.scss";
import { Link } from "react-router-dom";
import { IKContext, IKUpload } from "imagekitio-react";

const publicKey = "public_uqqXNbl29ErMld8UZ/AQ3NFNWBM=";
const urlEndpoint = "https://ik.imagekit.io/ndnqlrl7ez";

const Post = () => {
  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [desc, setDesc] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [urlI, setUrlI] = useState("");
  const countries = ["BiH", "Srbija", "Crna Gora", "Hrvatska"];
  const [selectedCountry, setSelectedCountry] = useState("BiH");

  const authenticator = async () => {
    try {
      const response = await fetch(`${config.backendUrl}auth`);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`
        );
      }

      const data = await response.json();
      const { signature, expire, token } = data;
      return { signature, expire, token };
    } catch (error) {
      throw new Error(`Authentication request failed: ${error.message}`);
    }
  };

  const onError = (err) => {
    console.error("GRESKA");
  };

  const onSuccess = (res) => {
    let ps = document.getElementById("ps");

    setUrlI(res.filePath); // Ensure res.url is correctly set

    setTimeout(() => {
      // Create a new click event
      const clickEvent = new Event("click", {
        bubbles: true,
        cancelable: true,
        composed: true, // Ensures the event will bubble through shadow DOM boundaries
      });

      // Dispatch the click event on the element
      ps.dispatchEvent(clickEvent);
    }, 5000);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setIsLoggedIn(decodedToken.isLoggedIn);
        setUsername(decodedToken.username);
      } catch (error) {
        setIsLoggedIn(false);
        setUsername("");
      }
    } else {
      setIsLoggedIn(false);
      setUsername("");
    }
  }, []); // Empty dependency array ensures this effect runs only once

  const handleCountryClick = (country) => {
    setSelectedCountry(country);
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const post_service = async () => {
    let post_message = document.getElementById("post_message");
    let ps = document.getElementById("ps");

    if (title === "" || title.trim() === "") {
      post_message.innerText = "Unesite naslov";
      post_message.classList.add("e_m_p");
    } else if (desc === "" || desc.trim() === "") {
      post_message.innerText = "Unesite opis";
      post_message.classList.add("e_m_p");
    } else if (city === "" || city.trim() === "") {
      post_message.innerText = "Unesite grad";
      post_message.classList.add("e_m_p");
    } else if (phone === "" || phone.trim() === "") {
      post_message.innerText = "Unesite broj telefona";
      post_message.classList.add("e_m_p");
    } else if (email && !validateEmail(email)) {
      post_message.innerText = "Unesite validan email";
      post_message.classList.add("e_m_p");
    } else if (!urlI) {
      post_message.innerText = "Usluga se objavljuje";
      post_message.classList.add("s_m_p");
    } else {
      post_message.innerText = "Usluga se objavljuje";
      post_message.classList.add("s_m_p");
      ps.style.display = "none";

      try {
        const response = await fetch(`${config.backendUrl}objavi`, {
          method: "POST",
          body: JSON.stringify({
            title: title,
            country: selectedCountry,
            city: city,
            desc: desc,
            by: username,
            phone: phone,
            email: email,
            image: urlI,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`("GRESKA");`);
          throw new Error(`Network response was not ok:`);
        }

        const data = await response.json();
        post_message.innerText = "Usluga objavljena";
        post_message.classList.add("s_m_p");
        window.location.href = "/";
      } catch (error) {
        post_message.innerText = "Došlo je do greške prilikom objave usluge.";
        post_message.classList.add("e_m_p");
      }
    }
  };

  return (
    <>
      <Header />
      <h1 id="ou">Objavi uslugu</h1>
      <div className="post_container">
        {isLoggedIn ? (
          <>
            <div>
              <p>Naslov usluge</p>
              <input
                type="text"
                placeholder="Unesite naslov (npr: rent a car)"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
              />
            </div>
            <div>
              <p>Opis usluge</p>
              <textarea
                placeholder="Opišite uslugu"
                rows={10}
                cols={20}
                onChange={(e) => setDesc(e.target.value)}
                value={desc}
              ></textarea>
            </div>
            <div>
              <p>Država</p>
              <div className="countries-container">
                {countries.map((country) => (
                  <div
                    key={country}
                    className={`country ${
                      selectedCountry === country ? "selected" : ""
                    }`}
                    onClick={() => handleCountryClick(country)}
                  >
                    {country}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p>Grad</p>
              <input
                type="text"
                placeholder="Grad u kom se izvodi usluga"
                onChange={(e) => setCity(e.target.value)}
                value={city}
              />
            </div>
            <div>
              <p>Broj telefona</p>
              <input
                type="number"
                placeholder="Broj telefona (za kontakt)"
                onChange={(e) => setPhone(e.target.value)}
                value={phone}
              />
            </div>
            <div>
              <p>Email (nije obavezno)</p>
              <input
                type="text"
                placeholder="Email (za kontakt)"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
            <div>
              <p>Postavi sliku</p>
              <IKContext
                publicKey={publicKey}
                urlEndpoint={urlEndpoint}
                authenticator={authenticator}
              >
                <IKUpload
                  name="myImage"
                  fileName="test-upload.png"
                  onError={onError}
                  accept="image/*"
                  onSuccess={onSuccess}
                />
              </IKContext>
            </div>
            <button onClick={post_service} id="ps">
              Objavi uslugu
            </button>
            <p id="post_message"></p>
          </>
        ) : (
          <div id="error_upload">
            <p>
              Ako želite da objavite uslugu morate da se prijavite na nalog,
              <Link to="/prijava"> Prijavi se</Link>, a ako nemate nalog možete
              ga napraviti za par sekundi,
              <Link to="/napravi_nalog">Napravi nalog</Link>.
            </p>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Post;
