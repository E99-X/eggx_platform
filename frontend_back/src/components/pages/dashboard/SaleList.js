import React from "react";
import { useSaleData } from "../hooks/useSaleData";

export default function SaleList() {
  const { sales, loading } = useSaleData();

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
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {sale.iconUrl ? (
              <img
                src={sale.iconUrl}
                alt={`${sale.symbol} icon`}
                width="32"
                height="32"
                style={{ borderRadius: "50%" }}
              />
            ) : (
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "#ccc",
                }}
              />
            )}
            <div>
              <h3 style={{ margin: 0 }}>
                {sale.name} ({sale.symbol})
              </h3>
              <p style={{ margin: 0, fontSize: "0.85em", color: "#555" }}>
                {sale.tokenType}
              </p>
            </div>
          </div>

          <p style={{ marginTop: "1em" }}>
            <strong>Sale State:</strong> {sale.saleState}
          </p>

          <p>
            <strong>Sale ID:</strong> {sale.saleId}{" "}
            <button
              onClick={() => navigator.clipboard.writeText(sale.saleId)}
              style={{
                marginLeft: 8,
                cursor: "pointer",
                fontSize: "0.85em",
              }}
            >
              📋 Copy
            </button>
          </p>
        </div>
      ))}
    </div>
  );
}
