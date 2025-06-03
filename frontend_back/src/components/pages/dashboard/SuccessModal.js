import React from "react";

export default function SuccessModal({ tokenName, digest, onClose, children }) {
  return (
    <div style={modalStyle}>
      <div style={modalContentStyle}>
        <h3>✅ {tokenName} Created</h3>
        {children && <div>{children}</div>}
        {digest && (
          <p>
            <strong>Explorer:</strong>{" "}
            <a
              href={`https://suiscan.xyz/testnet/tx/${digest}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on SuiScan ↗
            </a>
          </p>
        )}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

const modalStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999,
};

const modalContentStyle = {
  background: "#fff",
  padding: "30px",
  borderRadius: "8px",
  textAlign: "center",
  width: "90%",
  maxWidth: "400px",
};
