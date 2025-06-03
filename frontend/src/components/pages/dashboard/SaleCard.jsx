// components/SaleCard.jsx
import React, { useState } from "react";
import Button from "../Button";
import styles from "./saleCard.module.css";

export default function SaleCard({ sale }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const formatAmount = (num, decimals = 9) => {
    if (!num) return "0";
    return (Number(num) / Math.pow(10, decimals)).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div key={sale.saleId} className={styles.saleCard}>
      <div className={styles.saleHeader}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {sale.iconUrl && (
            <img
              src={sale.iconUrl}
              alt={`${sale.symbol} icon`}
              width="32"
              height="32"
            />
          )}
          <div style={{ width: "20ch", overflow: "hidden" }}>
            <p>Token</p>
            <p
              className={styles.tokenName}
              data-full={sale.symbol}
              title={sale.symbol}
            >
              {sale.symbol}
            </p>
          </div>

          <div>
            <p>State</p>
            <p>{sale.saleState}</p>
          </div>
        </div>
        <Button
          variant="primary"
          className={styles.copyBtn}
          onClick={() => navigator.clipboard.writeText(sale.saleId)}
        >
          Copy ID
        </Button>
      </div>
      <div className={isOpen ? styles.detailsGrid : styles.hideDetails}>
        <div>
          <div className={styles.value}>{formatAmount(sale.hardCap)}</div>
          <div className={styles.label}>Hard cap</div>
        </div>
        <div>
          <div className={styles.value}>{sale.numberOfStages}</div>
          <div className={styles.label}>Stages</div>
        </div>
        <div>
          <div className={styles.value}>{sale.duration}</div>
          <div className={styles.label}>Duration</div>
        </div>
        <div>
          <div className={styles.value}>{formatAmount(sale.basePrice)}</div>
          <div className={styles.label}>Base price</div>
        </div>
        <div>
          <div className={styles.value}>{formatAmount(sale.increment)}</div>
          <div className={styles.label}>Increment</div>
        </div>
        <div>
          <div className={styles.value}>{sale.finalMode}</div>
          <div className={styles.label}>Fin mode</div>
        </div>
      </div>
      <div className={styles.saleFooter}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={styles.btnDetails}
        >
          Details
        </button>
      </div>
    </div>
  );
}
