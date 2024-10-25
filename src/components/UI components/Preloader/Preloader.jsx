import React from "react";
import "./Preloader.css";

const Preloader = () => {
  return (
      <div className="loader">
          <div className="squares">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="text-loading">
              <p>Loading
                <span></span>
                <span></span>
                <span></span>
              </p>
          </div>
      </div>
  );
};

export default Preloader;
