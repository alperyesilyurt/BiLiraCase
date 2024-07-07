import { Asset } from "../types";

const fetchAssets = async (
  page: number,
  isFetch: boolean
): Promise<Asset[]> => {
  const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data: Asset[] = await response.json();

  const usdtPairs = data
    .filter((asset) => asset.symbol.endsWith("USDT"))
    .map((asset) => {
      return {
        symbol: asset.symbol,
        lastPrice: asset.lastPrice,
        quoteVolume: asset.quoteVolume,
        priceChangePercent: asset.priceChangePercent,
        logoUrl: "",
        priceChanges: Array(24)
          .fill(0)
          .map(() => Math.random() * parseFloat(asset.lastPrice)),
      };
    });

  if (isFetch) {
    return usdtPairs;
  } else {
    return usdtPairs.slice(0, (page + 1) * 10);
  }
};

export default fetchAssets;
