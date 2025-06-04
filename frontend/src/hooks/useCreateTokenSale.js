// hooks/useCreateTokenSale.js
import { useState } from "react";
import { Transaction } from "@mysten/sui/transactions";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { PACKAGE_ID, SALEBOOK } from "../constants/constants";

export function useCreateTokenSale() {
  const { mutateAsync: signAndExecuteTransaction } =
    useSignAndExecuteTransaction();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const createSale = async ({
    treasuryCapId,
    tokenType,
    hardCap,
    reservePercentage,
    basePrice,
    numberOfStages,
    stageDuration,
    selectedPriceMode,
    priceParam,
    finalMode,
  }) => {
    setIsSubmitting(true);
    setResult(null);

    const tx = new Transaction();

    tx.moveCall({
      target: `${PACKAGE_ID}::dashboard_utils::dashboard_launch_sale`,
      arguments: [
        tx.pure.u64(hardCap),
        tx.pure.u64(reservePercentage),
        tx.pure.u64(basePrice),
        tx.pure.u64(numberOfStages),
        tx.pure.u64(stageDuration),
        tx.pure.u8(selectedPriceMode),
        tx.pure.u64(priceParam),
        tx.pure.u8(finalMode),
        tx.object(SALEBOOK),
        tx.object(treasuryCapId),
      ],
      typeArguments: [tokenType],
    });

    const response = await signAndExecuteTransaction({
      transaction: tx,
      options: {
        showEffects: true,
        showObjectChanges: true,
      },
    });

    console.log("Transaction digest:", response?.digest);
    console.log("Transaction effects:", response.effects);
    console.log("Object changes:", response.objectChanges);

    const digest = response?.digest;
    const sharedSaleObj = response?.objectChanges?.find(
      (c) =>
        c.objectType?.includes("sale") && c.objectId && c.type === "created"
    );

    const saleObjectId = sharedSaleObj?.objectId;

    const finalResult = { digest, saleObjectId };
    setResult(finalResult);
    setIsSubmitting(false);

    return finalResult;
  };

  return {
    createSale,
    isSubmitting,
    result,
    setResult,
  };
}
