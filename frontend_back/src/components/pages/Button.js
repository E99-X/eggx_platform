import React from "react";
import styles from "./button.module.css";

export default function Button({
  children,
  onClick,
  disabled = false,
  variant = "secondary",
  className = "",
}) {
  const variantClass =
    variant === "primary" ? styles.btnPrimary : styles.btnSecondary;

  return (
    <button
      onClick={() => {
        if (!disabled && onClick) onClick();
      }}
      disabled={disabled}
      className={[styles.btn, variantClass, className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </button>
  );
}
