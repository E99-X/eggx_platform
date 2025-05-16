import React from "react";
import styles from "./header.module.css";

export default function Header({ title, desc }) {
  return (
    <div className={styles.header + " site-text-primary"}>
      <h1 className={styles.title}>{title}</h1>
      {desc && <p className={styles.desc}>{desc}</p>}
    </div>
  );
}
