import React, { useState, useEffect } from "react";
import {
  ConnectButton,
  useCurrentAccount,
  useDisconnectWallet,
} from "@mysten/dapp-kit";
import TokenList from "./dashboard/TokenList";
import SaleForm from "./dashboard/SaleForm";
import { useUserTokens } from "../../hooks/useUserTokens";
import Header from "./Header";
import TokenForm from "./dashboard/TokenForm";
import SaleList from "./dashboard/SaleList";
import HintBox from "./dashboard/HintBox";
import styles from "./dashboard.module.css";
import btnStyles from "./button.module.css";

export default function Dashboard() {
  const [refreshTokenList, setRefreshTokenList] = useState(0);
  const [refreshSaleList, setRefreshSaleList] = useState(0);

  const account = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();
  const { tokens, loading } = useUserTokens(refreshTokenList);
  const [selectedToken, setSelectedToken] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (account?.address) {
      setConnected(true);
      console.log("🔄 Wallet connected:", account.address);
    }

    if (!account?.address) {
      setConnected(false);
    }
  }, [account]);

  const handleDisconnect = () => {
    disconnect();
  };

  const handleCreateSale = (token) => {
    setSelectedToken(token);
  };

  const refreshTokens = () => setRefreshTokenList((prev) => prev + 1);
  const refreshSales = () => setRefreshSaleList((prev) => prev + 1);

  return (
    <div className="">
      <Header
        title="Egg-X Creator Dashboard"
        desc="View tokens you've deployed and configure their sales directly from this panel."
      />

      <div className={styles.btnPanel}>
        {!account ? (
          <ConnectButton
            style={{
              backgroundColor: "var(--site-font-dark-color)",
              color: "var(--site-bgr-color)",
              fontWeight: "bold",
              width: "172px",
              padding: "8px 16px",
            }}
          />
        ) : (
          <button
            onClick={() => disconnect()}
            style={{ marginLeft: "10px" }}
            className={`${btnStyles.btn} ${btnStyles.btnPrimary}`}
          >
            Disconnect
          </button>
        )}
        <button
          className={`${btnStyles.btn} ${btnStyles.btnAccent}`}
          onClick={() => setSelectedToken(null)}
        >
          +
        </button>
      </div>
      <div className={styles.dashboardPanels}>
        {/* LEFT: Sale Form */}
        {selectedToken ? (
          <SaleForm
            symbol={selectedToken.metadata?.symbol}
            tokenType={selectedToken.tokenType}
            treasuryCapId={selectedToken.treasuryCapId}
            refreshTokens={refreshTokens}
            refreshSaleList={refreshSales}
          />
        ) : (
          <TokenForm refreshTokens={refreshTokens} />
        )}
        <div className={styles.dashboardsInfo}>
          {/* RIGHT: Your Tokens */}
          <HintBox />
          <TokenList tokens={tokens} onCreateSale={handleCreateSale} />
          <SaleList refreshSaleList={refreshSaleList} />
        </div>
      </div>
    </div>
  );
}
