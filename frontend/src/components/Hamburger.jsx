import React from "react";
import "./hamburger.module.css";

const Hamburger = ({ onClick, isOpen }) => {
  return (
    <button className={`hamburger ${isOpen ? "open" : ""}`} onClick={onClick}>
      <div className="line top"></div>
      <div className="line middle"></div>
      <div className="line bottom"></div>
    </button>
  );
};

export default Hamburger;
