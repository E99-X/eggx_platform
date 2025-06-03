import React, { useState } from "react";
import NavItem from "./NavItem";
import Logo from "./Logo";
import Hamburger from "./Hamburger";
import "./navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
    setHamburgerOpen(false);
  };

  return (
    <nav className="navbar">
      <NavItem to="/" icon={<Logo />} onClick={closeMenu} />
      <div className={`menu ${menuOpen ? "open" : ""}`}>
        <NavItem to="/" label="Demo" onClick={closeMenu} />
        <NavItem to="/mvp" label="MVP" onClick={closeMenu} />
        <NavItem to="/faas" label="FaaS" onClick={closeMenu} />
      </div>
      <Hamburger
        onClick={() => {
          setMenuOpen(!menuOpen);
          setHamburgerOpen(!hamburgerOpen);
        }}
        isOpen={hamburgerOpen}
      />
    </nav>
  );
};

export default Navbar;
