import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Header from "../multipage/Header/Header";
import Footer from "../multipage/Footer/Footer";
import config from "../config";
import "./service.scss";
const Service = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch_service = async () => {
      try {
        const response = await fetch(`${config.backendUrl}${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setService(data);
      } catch (error) {
        setError(error.message);
        console.error("There was a operation:");
      }
    };
    fetch_service();
  }, []);
  const get_username = (username) => {
    navigate(`/korisnik/${username}`);
  };
  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!service) {
    return <div>Loading...</div>;
  }
  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("sr-BA", options);
  };
  return (
    <>
      <Header />
      <div className="service_container">
        <div
          className="service_image"
          style={{
            backgroundImage: service.image
              ? `url(https://ik.imagekit.io/ndnqlrl7ez/${service.image})`
              : `url(https://ik.imagekit.io/ndnqlrl7ez/no_image.jpg)`,
            width: "800px",
            height: "500px",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            backgroundColor: "transparent",
          }}
        ></div>
        <h1>{service.title}</h1>
        <p>
          Objavio:
          <b
            style={{
              textDecoration: "2px underline #30a8f8",
              cursor: "pointer",
            }}
            onClick={() => {
              get_username(service.by);
            }}
          >
            <span id="by_id" style={{ marginLeft: "10px" }}>
              {service.by}
            </span>
          </b>
        </p>
        <p id="desc_id">
          Opis usluge: <span>{service.desc}</span>
        </p>
        <p>
          Objavljeno: <span>{formatDate(service.createdAt)}</span>
        </p>
        <p>
          Lokacija: <span>{service.country}</span> , <span>{service.city}</span>
        </p>
        <p>
          Broj telefona: <span>{service.phone}</span>
        </p>
        <p>
          E-mail: <span>{service.email || "Nije navedeno."}</span>{" "}
        </p>
      </div>
      <Footer></Footer>
    </>
  );
};

export default Service;
