import { SuiClient } from "@mysten/sui/client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { decodeSuiPrivateKey } from "@mysten/sui/cryptography";
import { Transaction } from "@mysten/sui/transactions";
import {
  SUI_RPC_URL,
  AUTOPILOT_REGISTRY_ID,
  AUTO_PACKAGE_ID,
  DRY_RUN,
} from "./constants.js";

import { onSchedule } from "firebase-functions/v2/scheduler";

// === MAIN CRON FUNCTION ===
export const performScheduledAction = onSchedule(
  {
    schedule: "*/10 * * * *", // every 10 minutes
  },
  async (event) => {
    console.log("🚀 Cron job triggered");

    const privateKeyValue = process.env.PRIVATE_KEY;
    if (!privateKeyValue) {
      console.error("❌ PRIVATE_KEY secret is missing!");
      throw new Error("Missing PRIVATE_KEY");
    }

    try {
      const client = new SuiClient({ url: SUI_RPC_URL });
      const { secretKey } = decodeSuiPrivateKey(privateKeyValue);
      const keypair = Ed25519Keypair.fromSecretKey(secretKey);

      const ready = await fetchReadySales(client, AUTOPILOT_REGISTRY_ID);

      if (!ready.length) {
        console.log("✅ No sales ready to advance");
        return;
      }

      if (DRY_RUN === "true") {
        console.log("🛑 Dry run enabled. Skipping advance.");
        return;
      }

      const result = await advanceSales(
        client,
        keypair,
        ready,
        AUTOPILOT_REGISTRY_ID
      );
      console.log("✅ Sales advanced:", JSON.stringify(result, null, 2));
    } catch (err) {
      console.error("❌ Error during cron job execution:", err);
    }

    console.log("🎉 Cron job finished");
  }
);

// === HELPERS ===

export async function fetchReadySales(client, autopilotId) {
  try {
    const dynamicFields = await client.getDynamicFields({
      parentId: autopilotId,
    });

    if (!dynamicFields?.data?.length) return [];

    const clockObj = await client.getObject({
      id: "0x6",
      options: { showContent: true },
    });

    const now = BigInt(clockObj?.data?.content?.fields?.timestamp_ms || "0");

    const ready = [];

    for (const field of dynamicFields.data) {
      const saleId = field?.name?.value;
      if (!saleId) continue;

      const sale = await client.getObject({
        id: saleId,
        options: { showContent: true },
      });

      if (!sale?.data?.content?.fields) continue;

      const fields = sale.data.content.fields;
      const stages = fields.stages ?? [];
      const currentStage = stages.length ? stages.at(-1)?.fields : null;
      const endTimeStr = currentStage?.end_date;

      const type = sale.data.content.type;
      const match = type?.match(/TokenSale<([^>]+)>/);
      const tokenType = match?.[1];

      if (!endTimeStr || !tokenType) continue;

      const endTime = BigInt(endTimeStr);
      if (now >= endTime) {
        ready.push({ saleId, tokenType });
      }
    }

    return ready;
  } catch (error) {
    console.error("Error in fetchReadySales:", error);
    return [];
  }
}

export async function advanceSales(client, keypair, sales, autopilotId) {
  try {
    if (!sales?.length) return null;

    const tx = new Transaction();

    for (const { saleId, tokenType } of sales) {
      tx.moveCall({
        target: `${AUTO_PACKAGE_ID}::autopilot_registry::advance_from_autopilot`,
        arguments: [
          tx.object(autopilotId),
          tx.object(saleId),
          tx.object("0x6"),
        ],
        typeArguments: [tokenType],
      });
    }

    tx.setSender(keypair.getPublicKey().toSuiAddress());

    const { bytes, signature } = await tx.sign({ client, signer: keypair });
    const result = await client.executeTransactionBlock({
      transactionBlock: bytes,
      signature,
      options: { showEffects: true },
    });

    const transaction = await client.waitForTransaction({
      digest: result.digest,
      options: { showEffects: true },
    });

    return transaction;
  } catch (error) {
    console.error("Error in advanceSales:", error);
    throw error;
  }
}
