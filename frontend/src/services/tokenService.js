import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";

const suiClient = new SuiClient({ url: getFullnodeUrl("testnet") });

export async function fetchTokenMetadata(coinType) {
  try {
    const metadata = await suiClient.getCoinMetadata({ coinType });
    return metadata;
  } catch (err) {
    console.warn("Metadata fetch failed for", coinType, err);
    return null;
  }
}
