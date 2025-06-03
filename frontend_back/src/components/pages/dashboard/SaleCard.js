// components/SaleList.jsx
import React from "react";
import { useSaleData } from "../hooks/useSaleData";
import { useCurrentAccount } from "@mysten/dapp-kit"; // assuming you're using this

export default function SaleList() {
  const account = useCurrentAccount();
  const { sales, loading } = useSaleData(account?.address);

  if (loading) return <p>Loading sales...</p>;

  if (!sales.length) return <p>No sales found for your account.</p>;

  return (
    <div style={{ display: "grid", gap: "1rem", padding: "1rem" }}>
      {sales.map((sale) => (
        <div
          key={sale.saleId}
          style={{
            border: "1px solid #ccc",
            padding: "1rem",
            borderRadius: "8px",
            background: "#f9f9f9",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {sale.iconUrl && (
              <img src={sale.iconUrl} alt="" width="32" height="32" />
            )}
            <h3>
              {sale.name} ({sale.symbol})
            </h3>
          </div>
          <p>
            <strong>Sale State:</strong> {sale.saleState}
          </p>
          <p>
            <strong>Sale ID:</strong> {sale.saleId}{" "}
            <button onClick={() => navigator.clipboard.writeText(sale.saleId)}>
              📋 Copy
            </button>
          </p>
        </div>
      ))}
    </div>
  );
}
