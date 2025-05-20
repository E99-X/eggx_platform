import { SuiClient } from "@mysten/sui/client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { decodeSuiPrivateKey } from "@mysten/sui/cryptography";
import { Transaction } from "@mysten/sui/transactions";
import { onSchedule } from "firebase-functions/v2/scheduler";
import {
  SUI_RPC_URL,
  AUTOPILOT_REGISTRY_ID,
  AUTO_PACKAGE_ID,
  DRY_RUN,
} from "./constants.js";

export const performScheduledAction = onSchedule(
  {
    schedule: "*/10 * * * *",
    timeZone: "Etc/UTC",
  },
  async () => {
    console.log("🚀 Cron job triggered");

    const privateKeyValue = process.env.PRIVATE_KEY;
    if (!privateKeyValue) throw new Error("Missing PRIVATE_KEY");

    const client = new SuiClient({ url: SUI_RPC_URL });
    const { secretKey } = decodeSuiPrivateKey(privateKeyValue);
    const keypair = Ed25519Keypair.fromSecretKey(secretKey);

    const readySales = await fetchReadySales(client, AUTOPILOT_REGISTRY_ID);
    console.log("🔍 Ready Sales Found: ", readySales.length);

    // Ensure that we only proceed if there are sales ready to advance
    if (readySales.length === 0) {
      console.log("✅ No sales ready for advancement.");
      return;
    }

    // Log the sales that are marked as ready for advancement
    console.log("🔍 Sales Ready for Advancement: ", readySales);

    if (DRY_RUN === "true") {
      console.log("🛑 DRY RUN mode, skipping advance");
      return;
    }

    try {
      // Proceed with advancing sales if ready
      const result = await advanceSales(
        client,
        keypair,
        readySales,
        AUTOPILOT_REGISTRY_ID
      );
      console.log("✅ Sales advanced successfully:", result?.digest);
    } catch (error) {
      console.error("❌ Error advancing sales:", error);
    }
  }
);

async function fetchReadySales(client, autopilotId) {
  try {
    console.log("🔍 Fetching dynamic fields from Autopilot Registry...");

    const dynamicFields = await client.getDynamicFields({
      parentId: autopilotId,
    });

    if (!dynamicFields?.data?.length) {
      console.log("🚫 No dynamic fields found in registry.");
      return [];
    }

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

      const fields = sale?.data?.content?.fields ?? {};
      const stages = fields?.stages ?? [];
      const currentStage = stages.at(-1)?.fields;
      const endDate = currentStage?.end_date;

      // Log sale and stage details for debugging
      console.log(
        `🔎 Sale ${saleId} - Stages: ${stages.length}, End Date: ${endDate}`
      );
      console.log("Current Stage:", currentStage);

      const tokenType = sale?.data?.content?.type.match(/^.+<(.+)>$/)?.[1];

      if (!tokenType || !endDate) {
        console.log("❌ Sale missing tokenType or endDate, skipping...");
        continue;
      }

      // Check if the sale is ready to advance (end time passed)
      if (BigInt(endDate) <= now) {
        ready.push({ saleId, tokenType });
        console.log(`✅ Sale ${saleId} is ready to advance.`);
      }
    }

    console.log("🔍 Final ready sales: ", ready);
    return ready;
  } catch (error) {
    console.error("fetchReadySales error:", error);
    return [];
  }
}

async function advanceSales(client, keypair, sales, autopilotId) {
  console.log("🔧 Preparing transaction to advance sales...");

  const tx = new Transaction();
  for (const { saleId, tokenType } of sales) {
    tx.moveCall({
      target: `${AUTO_PACKAGE_ID}::autopilot_registry::advance_from_autopilot`,
      arguments: [tx.object(autopilotId), tx.object(saleId), tx.object("0x6")],
      typeArguments: [tokenType],
    });
  }

  tx.setSender(keypair.getPublicKey().toSuiAddress());

  const { bytes, signature } = await tx.sign({ client, signer: keypair });
  console.log("🔧 Signed transaction: ", bytes, signature);

  const result = await client.executeTransactionBlock({
    transactionBlock: bytes,
    signature,
    options: { showEffects: true, skipDryRun: true },
  });

  console.log("🔧 Simulated transaction block executed: ", result);
  return { digest: result.digest };
}