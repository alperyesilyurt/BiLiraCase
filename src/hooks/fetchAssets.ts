import { Asset } from '../types';

const fetchAssets = async (page: number): Promise<Asset[]> => {
  // Binance API'den verileri al
  const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data: Asset[] = await response.json();

  const usdtPairs = data.filter(asset => asset.symbol.endsWith('USDT')).map(asset => {
    const symbol = asset.symbol.substring(0, asset.symbol.length - 4).toLowerCase();
    return {
      ...asset,
      logoUrl: `https://cryptoicons.org/api/icon/${symbol}/200`,
      priceChanges: Array(24).fill(0).map(() => Math.random() * parseFloat(asset.lastPrice))
    };
  });

  return usdtPairs.slice(page * 10, (page + 1) * 10);
};

export default fetchAssets;
