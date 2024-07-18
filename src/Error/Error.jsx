import React from "react";
import { Link } from "react-router-dom";
import "./error.scss";
const Error = () => {
  return (
    <div className="error_container">
      <h1>
        Stranica nije pronađena, <Link>Vrati se na početnu stranicu</Link>{" "}
      </h1>
    </div>
  );
};

export default Error;
