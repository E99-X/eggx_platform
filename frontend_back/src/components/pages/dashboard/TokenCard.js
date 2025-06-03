import React from "react";

export default function TokenCard({ token, onCreateSale }) {
  const { metadata, treasuryCapId, tokenType } = token;

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "12px",
        padding: "16px",
        marginBottom: "12px",
      }}
    >
      <h3>
        {metadata?.symbol || "?"} — {metadata?.name || "Unnamed Token"}
      </h3>
      <p>{metadata?.description}</p>
      {metadata?.iconUrl && (
        <img
          src={metadata.iconUrl}
          alt={metadata.name}
          style={{ width: 40, height: 40 }}
        />
      )}
      <br />
      <small style={{ fontFamily: "monospace" }}>
        <strong>Token Type:</strong> {tokenType}
      </small>
      <br />
      <small style={{ fontFamily: "monospace" }}>
        <strong>TreasuryCap:</strong> {treasuryCapId}
      </small>
      <br />
      <button style={{ marginTop: 10 }} onClick={() => onCreateSale(token)}>
        Create Token Sale
      </button>
    </div>
  );
}
