import React from "react";
import styles from "./success.module.css";
import btnStyles from "../button.module.css";

export default function SuccessModal({ tokenName, digest, onClose, children }) {
  return (
    <div className={styles.modalStyle}>
      <div className={styles.modalContentStyle}>
        <h3>✅ {tokenName} Created</h3>
        {children && <div>{children}</div>}
        {digest && (
          <a
            href={`https://suiscan.xyz/testnet/tx/${digest}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on SuiScan ↗
          </a>
        )}
        <button onClick={onClose} className="">
          Close
        </button>
      </div>
    </div>
  );
}
