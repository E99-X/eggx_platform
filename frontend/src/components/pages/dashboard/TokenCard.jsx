import React from "react";
import styles from "./TokenCard.module.css";
import Button from "../Button";

export default function TokenCard({ token, onCreateSale }) {
  const { metadata, treasuryCapId, tokenType } = token;

  return (
    <div className={styles.tokenCard}>
      <div className={styles.tokenHeader}>
        {metadata?.iconUrl && (
          <img
            src={metadata.iconUrl}
            alt={metadata.name}
            style={{ width: 64, height: 64, borderRadius: "8px" }}
          />
        )}
        <div>
          <h3 className="site-text-primary">{metadata?.symbol || "?"}</h3>
          <p>{metadata?.name || "Unnamed Token"}</p>
        </div>
      </div>

      <Button variant="primary" onClick={() => onCreateSale(token)}>
        Create Token Sale
      </Button>
    </div>
  );
}
