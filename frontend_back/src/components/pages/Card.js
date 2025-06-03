import React from "react";
import clsx from "clsx";

export default function Card({ title, className, children }) {
  return (
    <div className={clsx("site-card", className)}>
      {title && <h3>{title}</h3>}
      {children}
    </div>
  );
}
