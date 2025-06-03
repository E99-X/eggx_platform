import React from "react";
import { useHint } from "./HintContext";
import styles from "../dashboard.module.css"; // Assuming you have a CSS module for styling

export default function HintBox() {
  const { hint } = useHint();

  return (
    <div className={styles.hint}>
      <h4 style={{ marginBottom: 8 }}>💡 Hint</h4>
      <p>
        <code>{hint}</code>
      </p>
    </div>
  );
}
