import { useEffect, useState } from "react";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { fetchTokenMetadata } from "../services/tokenService";

export function useUserTokens(refreshTrigger = 0) {
  const client = useSuiClient();
  const account = useCurrentAccount();
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!account?.address) return;

    async function fetchTokens() {
      setLoading(true);

      try {
        const ownedObjects = await client.getOwnedObjects({
          owner: account.address,
          filter: { StructType: "0x2::coin::TreasuryCap" },
          options: { showType: true, showContent: true },
        });

        const all = await Promise.all(
          ownedObjects.data.map(async (obj) => {
            const typeArg = obj.data?.type?.split("<")[1]?.replace(">", "");
            const treasuryCapId = obj.data?.objectId;
            if (!typeArg || !treasuryCapId) return null;

            const metadata = await fetchTokenMetadata(typeArg);
            return {
              tokenType: typeArg,
              treasuryCapId,
              metadata,
            };
          })
        );

        setTokens(all.filter(Boolean));
      } catch (e) {
        console.error("❌ Failed to fetch user tokens:", e);
        setTokens([]);
      } finally {
        setLoading(false);
      }
    }

    fetchTokens();
  }, [account?.address, client, refreshTrigger]);

  return { tokens, loading };
}
