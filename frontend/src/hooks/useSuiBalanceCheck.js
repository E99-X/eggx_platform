import { useState, useEffect } from "react";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";

/**
 * Checks if the current wallet has enough SUI to cover a minimum threshold.
 *
 * @param {number} minSui - Minimum required SUI (in SUI units, not MIST).
 */
export function useSuiBalanceCheck(minSui = 0.01) {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const [hasEnoughGas, setHasEnoughGas] = useState(false);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!account?.address) return;

    async function checkBalance() {
      setLoading(true);
      try {
        const result = await client.getBalance({ owner: account.address });
        const total = Number(result.totalBalance) / 1e9; // Convert MIST → SUI

        setBalance(total);
        setHasEnoughGas(total >= minSui);
      } catch (err) {
        console.error("❌ Failed to fetch SUI balance:", err);
        setBalance(0);
        setHasEnoughGas(false);
      } finally {
        setLoading(false);
      }
    }

    checkBalance();
  }, [account?.address, minSui]);

  return {
    hasEnoughGas,
    balance,
    loading,
  };
}
