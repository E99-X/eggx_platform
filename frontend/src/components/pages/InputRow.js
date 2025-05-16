import React from "react";
import styles from "./inputRow.module.css";

export default function InputRow({ label, value, onChange, placeholder = "" }) {
  return (
    <label className={styles.row}>
      <code className="site-text-light">{label}:</code>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className={styles.input}
      />
    </label>
  );
}
