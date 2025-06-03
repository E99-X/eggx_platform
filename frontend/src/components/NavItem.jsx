import React from "react";
import { NavLink } from "react-router-dom";

const NavItem = ({ to, label, icon, className = "", onClick }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center transition-colors 
         ${isActive ? "site-text-accent" : "site-text-light"} 
         ${className}`
      }
      onClick={onClick} 
    >
      {icon && <span>{icon}</span>}
      <span className="">{label}</span>
    </NavLink>
  );
};

export default NavItem;
