import { useState } from "react";
import {
  useSignAndExecuteTransaction,
  useCurrentAccount,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";

export const useCreateToken = () => {
  const account = useCurrentAccount(); // ✅ use it here
  const [isProcessing, setIsProcessing] = useState(false);
  const [deployResult, setDeployResult] = useState(null);

  const { mutateAsync: signAndExecuteTransaction } =
    useSignAndExecuteTransaction();

  const createToken = async ({ name, symbol, description, imageUrl }) => {
    if (!account) throw new Error("Wallet not connected.");
    if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(symbol)) {
      throw new Error("Invalid symbol format.");
    }

    setIsProcessing(true);
    setDeployResult(null);

    const res = await fetch("http://localhost:3001/create-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        address: account.address,
        name,
        symbol,
        description,
        image_url: imageUrl,
      }),
    });

    const data = await res.json();
    if (!data.success) throw new Error("Build failed.");

    const tx = new Transaction();
    const publish = tx.publish({
      modules: data.modules,
      dependencies: data.dependencies,
    });
    tx.transferObjects([publish], account.address);

    const result = await signAndExecuteTransaction({
      transaction: tx,
      options: { showEffects: true, showObjectChanges: true },
    });

    const digest = result?.digest;
    const published = result?.objectChanges?.find(
      (c) => c.type === "published"
    );
    const packageId = published?.packageId || null;
    const tokenType = packageId
      ? `${packageId}::${symbol.toLowerCase()}::${symbol.toUpperCase()}`
      : null;

    await fetch("http://localhost:3001/cleanup-token-dir", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address: account.address, symbol }),
    });

    const resultObj = { packageId, tokenType, digest };
    setDeployResult(resultObj);
    setIsProcessing(false);
    return resultObj;
  };

  const resetResult = () => {
    setDeployResult(null);
  };

  return { createToken, isProcessing, deployResult, resetResult };
};
