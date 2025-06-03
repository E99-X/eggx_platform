import { useEffect, useState } from "react";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { PACKAGE_ID } from "../constants/constants";
import { useCurrentAccount } from "@mysten/dapp-kit";

const client = new SuiClient({ url: getFullnodeUrl("testnet") });
const EVENT_TYPE = `${PACKAGE_ID}::dashboard_utils::SaleLaunched`;

export function useSaleData() {
  const account = useCurrentAccount();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!account?.address) {
      console.warn("⛔ No wallet connected. Aborting fetch.");
      return;
    }

    async function fetchSales() {
      console.log("🔍 Querying SaleLaunched events...");
      setLoading(true);

      try {
        const events = await client.queryEvents({
          query: {
            MoveEventType: EVENT_TYPE,
          },
          limit: 50,
        });

        const userSales = [];

        for (const event of events.data) {
          const txDigest = event.id.txDigest;

          const tx = await client.getTransactionBlock({
            digest: txDigest,
            options: {
              showObjectChanges: true,
            },
          });

          const createdSales =
            tx.objectChanges?.filter(
              (c) =>
                c.type === "created" &&
                c.objectType?.startsWith(
                  `${PACKAGE_ID}::sale_utils::TokenSale<`
                )
            ) || [];

          for (const obj of createdSales) {
            const objectId = obj.objectId;

            const objectData = await client.getObject({
              id: objectId,
              options: { showContent: true, showType: true },
            });

            const type = objectData.data?.type;
            const content = objectData.data?.content;
            const fields = content?.fields;
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
              const meta = await client.getCoinMetadata({
                coinType: tokenType,
              });
              tokenMeta = {
                symbol: meta.symbol,
                name: meta.name,
                iconUrl: meta.iconUrl,
                decimals: meta.decimals,
              };
            } catch {
              tokenMeta = { symbol: "???", name: "Unknown", iconUrl: null };
            }

            const accountAddr = account.address.toLowerCase();
            const adminAddr = (
              fields.admin?.fields?.admin || fields.admin?.fields?.address
            )?.toLowerCase();

            console.log(
              "👥 Comparing Admin:",
              adminAddr,
              "vs Account:",
              accountAddr
            );

            if (adminAddr !== accountAddr) {
              console.log("⛔ Skip: mismatch");
              continue;
            }

            const config = fields.config?.fields ?? {};

            userSales.push({
              saleId: objectId,
              saleState,
              tokenType,
              ...tokenMeta,

              basePrice: config.base_price,
              hardCap: config.hard_cap,
              numberOfStages: config.number_of_stages,
              reservePercentage: config.reserve_percentage,
              startTime: config.start_time,
              finalMode: config.final_mode?.variant,
              priceFunction: config.price_function?.variant,
            });
          }
        }

        setSales(userSales);
      } catch (err) {
        console.error("❌ Failed to fetch sale data:", err);
        setSales([]);
      } finally {
        setLoading(false);
      }
    }

    fetchSales();
  }, [account?.address]);

  return { sales, loading };
}
