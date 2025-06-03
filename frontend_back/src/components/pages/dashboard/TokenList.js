import React from "react";
import TokenCard from "./TokenCard";

export default function TokenList({ tokens, onCreateSale }) {
  return (
    <div style={{ padding: 20 }}>
      <h2>Your Tokens</h2>
      {tokens.length === 0 ? (
        <p>No tokens found.</p>
      ) : (
        tokens.map((token) => (
          <TokenCard
            key={token.treasuryCapId}
            token={token}
            onCreateSale={onCreateSale}
          />
        ))
      )}
    </div>
  );
}
