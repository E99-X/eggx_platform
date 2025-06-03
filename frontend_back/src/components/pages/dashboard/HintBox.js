import React from "react";
import { useHint } from "./HintContext";

export default function HintBox() {
  const { hint } = useHint();

  return (
    <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
      <h4 style={{ marginBottom: 8 }}>💡 Hint</h4>
      <p style={{ color: "#555", fontStyle: "italic" }}>{hint}</p>
    </div>
  );
}
