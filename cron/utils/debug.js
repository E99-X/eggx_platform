import { SuiClient } from "@mysten/sui/client";
import {
  SUI_RPC_URL,
  PACKAGE_ID,
  AUTOPILOT_REGISTRY_ID,
} from "../constants.js";

export async function debugAutopilotRegistry(client, autopilotId) {
  console.log(
    "🔎 Inspecting all dynamic fields in Autopilot Registry:",
    autopilotId
  );

  // 🔍 Registry type
  try {
    const registry = await client.getObject({
      id: autopilotId,
      options: { showType: true },
    });
    const registryType = registry?.data?.type ?? "Unknown";
    console.log(`📘 Autopilot Registry Type: ${registryType}`);
  } catch (err) {
    console.warn("⚠️ Failed to fetch registry type:", err);
  }

  const fields = await client.getDynamicFields({ parentId: autopilotId });

  if (!fields?.data?.length)
    console.log("🚫 No dynamic fields found in registry.");
    return;
  }

  for (const field of fields.data) {
    const saleId = field?.name?.value;
    if (!saleId) {
      console.warn("⚠️ Field missing valid saleId:", field);
      continue;
    }

    try {
      const sale = await client.getObject({
        id: saleId,
        options: { showContent: true, showType: true },
      });

      const saleType = sale?.data?.type;
      const tokenType = saleType?.match(/^.+<(.+)>$/)?.[1];
      const fields = sale?.data?.content?.fields ?? {};
      const stages = fields?.stages ?? [];
      const currentStage = stages.at(-1)?.fields;
      const endDate = currentStage?.end_date;

      // Retrieve sale state (NotStarted, Active, Finalized)
      let saleState = "Unknown";
      const variant = fields?.state?.variant;
      if (variant) {
        if (variant === "NotStarted") saleState = "Not Started";
        else if (variant === "Active") saleState = "Active";
        else if (variant === "Finalized") saleState = "Finalized";
      }

      if (!tokenType) {
        console.warn("❌ Could not extract tokenType from:", saleType);
        continue;
      }

      const autopilotEntry = await client.getDynamicFieldObject({
        parentId: autopilotId,
        name: {
          type: "0x2::object::ID",
          value: saleId,
        },
      });

      const adminCapId = autopilotEntry?.data?.objectId;
      const expectedCapType = `${PACKAGE_ID}::admin_config::AdminCap<${tokenType}>`;

      if (!adminCapId) {
        console.warn(`⚠️ No AdminCap found in registry for sale ${saleId}`);
        continue;
      }

      const adminCapObject = await client.getObject({
        id: adminCapId,
        options: { showType: true },
      });

      const actualCapType = adminCapObject?.data?.type ?? "Unknown";
      const typeMatch = actualCapType === expectedCapType;

      // Determine if the sale is ready to be finalized
      const isReadyToFinalize =
        stages.length > 0 &&
        currentStage?.end_date &&
        BigInt(currentStage?.end_date) <= Date.now();

      console.log(`\n🧾 Autopilot Entry`);
      console.log(`   🆔 Sale ID: ${saleId}`);
      console.log(`   🎯 TokenType: ${tokenType}`);
      console.log(`   📦 AdminCap ID: ${adminCapId}`);
      console.log(
        `   ⏳ Stage End: ${
          endDate ? new Date(Number(endDate)).toISOString() : "N/A"
        } (timestamp: ${endDate || "N/A"})`
      );
      console.log(`   ✅ Cap Type Match: ${typeMatch ? "Yes ✅" : "❌ No"}`);
      console.log(`   🏷️ Sale State: ${saleState}`);

      if (isReadyToFinalize) {
        console.log("   ✅ Ready to be finalized");
      } else {
        console.log("   ❌ Not yet ready to finalize");
      }

      if (!typeMatch) {
        console.warn(`   ⚠️ Expected: ${expectedCapType}`);
        console.warn(`   ⚠️ Actual:   ${actualCapType}`);
      }
    } catch (err) {
      console.error(`❌ Failed processing saleId: ${saleId}`, err);
    }
  }
}

// 🏁 CLI entry
if (import.meta.url === `file://${process.argv[1]}`) {
  const client = new SuiClient({ url: SUI_RPC_URL });

  debugAutopilotRegistry(client, AUTOPILOT_REGISTRY_ID)
    .then(() => {
      console.log("\n✅ Debug completed.");
    })
    .catch((err) => {
      console.error("❌ Debug failed:", err);
    });
}
