// components/SaleList.jsx
import React, { useEffect } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useSaleData } from "../../../hooks/useSaleData";
import SaleCard from "./SaleCard";
import dashboard from "../dashboard.module.css";

export default function SaleList({ refreshSaleList }) {
  const account = useCurrentAccount();
  const { sales, loading } = useSaleData(refreshSaleList);

  if (loading) return <p className={dashboard.empty}>Loading sales...</p>;
  if (!sales.length)
    return <p className={dashboard.empty}>No sales found for your account.</p>;

  return (
    <div>
      <h3 style={{ textAlign: "center", marginBottom: "var(--site-gap-sm)" }}>
        Your Token Sales
      </h3>
      <div className={dashboard.saleList}>
        {sales.map((sale) => (
          <SaleCard key={sale.saleId} sale={sale} />
        ))}
      </div>
    </div>
  );
}
