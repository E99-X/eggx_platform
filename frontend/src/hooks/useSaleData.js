import { useEffect, useState } from "react";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { SALEBOOK } from "../constants/constants";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { normalizeSuiAddress } from "@mysten/sui/utils";

const client = new SuiClient({ url: getFullnodeUrl("testnet") });

export function useSaleData(refreshSaleList) {
  const account = useCurrentAccount();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!account?.address) {
      setSales([]);
      setLoading(false);
      console.warn("⛔ No wallet connected. Aborting fetch.");
      return;
    }

    async function fetchUserSales(account, SALEBOOK, client) {
      const salesBookObj = await client.getObject({
        id: SALEBOOK,
        options: { showContent: true },
      });

      const outerTableId =
        salesBookObj?.data?.content?.fields?.sales?.fields?.id?.id;

      const usersArr = await client.getDynamicFields({
        parentId: outerTableId,
      });

      const matchingField = usersArr.data.find(
        (field) => field.name.value === account.address
      );

      if (matchingField) {
        console.log("Found matching field:", matchingField);
      } else {
        console.log("No matching field found for address:", targetAddress);
      }

      const storedUserId = matchingField.objectId;

      console.log("storedUserId", storedUserId);

      const userTableObj = await client.getObject({
        id: storedUserId,
        options: {
          showContent: true,
        },
      });

      const userInnerTableId =
        userTableObj.data.content.fields.value.fields.id.id;

      console.log("userInnerTableId", userInnerTableId);

      const userSalesArr = await client.getDynamicFields({
        parentId: userInnerTableId,
      });

      const saleIds = userSalesArr.data.map((entry) => entry.name.value);

      const saleSummaries = [];

      for (const saleId of saleIds) {
        try {
          const saleObject = await client.getObject({
            id: saleId,
            options: {
              showType: true,
              showContent: true,
            },
          });

          const type = saleObject.data?.type;
          const fields = saleObject.data?.content?.fields;
          if (!type || !fields) continue;

          const tokenMatch = type.match(/^.+<(.+)>$/);
          const tokenType = tokenMatch?.[1];

          const stateVariant = fields.state?.variant;
          let saleState = "Unknown";
          if (stateVariant === "NotStarted") saleState = "Not Started";
          else if (stateVariant === "Active") saleState = "Active";
          else if (stateVariant === "Finalized") saleState = "Finalized";

          let tokenMeta = {};
          try {
            const meta = await client.getCoinMetadata({ coinType: tokenType });
            tokenMeta = {
              symbol: meta.symbol,
              name: meta.name,
              iconUrl: meta.iconUrl,
              decimals: meta.decimals,
            };
          } catch {
            tokenMeta = { symbol: "???", name: "Unknown", iconUrl: null };
          }

          const config = fields.config?.fields ?? {};

          const finMode = config.final_mode?.variant;
          let finModeText = "Unknown";
          if (finMode === "JoinToPool") finModeText = "Join Pool";
          else if (finMode === "Burn") finModeText = "Burning Mode";

          const priceModeStruct = config.price_mode;
          const priceModeType =
            priceModeStruct?.fields?.type ?? priceModeStruct?.type;
          let priceModeTag = "Unknown";
          let priceParam;

          if (priceModeStruct?.fields?.step !== undefined) {
            priceModeTag = "FixedStep";
            priceParam = priceModeStruct.fields.step;
          } else if (priceModeStruct?.fields?.multiplier !== undefined) {
            priceModeTag = "BurnScaled";
            priceParam = priceModeStruct.fields.multiplier;
          } else if (priceModeStruct?.fields?.increment !== undefined) {
            priceModeTag = "SoldRatioScaled";
            priceParam = priceModeStruct.fields.increment;
          } else {
            priceModeTag = "NoIncrement";
            priceParam = 0;
          }

          saleSummaries.push({
            saleId,
            tokenType,
            saleState,
            ...tokenMeta,
            basePrice: config.base_price,
            hardCap: config.hard_cap,
            numberOfStages: config.number_of_stages,
            duration: Number(config.stage_duration ?? 0),
            reservePercentage: config.reserve_percentage,
            finalMode: finModeText,
            increment: priceParam,
            priceMode: priceModeTag,
          });
        } catch (e) {
          console.warn(`⚠️ Skipping sale ${saleId} due to error:`, e.message);
          continue;
        }
      }

      return saleSummaries;
    }

    setLoading(true);
    fetchUserSales(account, SALEBOOK, client)
      .then((data) => setSales(data))
      .catch((err) => {
        setSales([]);
        console.error("❌ Error:", err.message || err);
      })
      .finally(() => setLoading(false));
  }, [account?.address, refreshSaleList]);

  return { sales, loading };
}
