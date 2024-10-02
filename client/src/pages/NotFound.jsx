import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        margin: "auto 0",
      }}
    >
      <div>
        <img
          src="https://img.icons8.com/ios/50/error--v1.png"
          alt=""
          width="50"
          height="50"
        />
      </div>
      <h1>Oops, entered the wrong link!</h1>
      <Link to={"/"}>
        {" "}
        <button
          style={{
            padding: "1rem 2rem",
            color: "white",
            backgroundColor: "black",
            cursor: "pointer",
          }}
        >
          Go Back to the homepage
        </button>
      </Link>
    </div>
  );
};

export default NotFound;
