export interface Asset {
  symbol: string;
  logoUrl: string;
  lastPrice: string;
  priceChangePercent: string;
  quoteVolume: string;
  priceChanges: number[];
  priceChange?: string;
  weightedAvgPrice?: string;
  prevClosePrice?: string;
  lastQty?: string;
  bidPrice?: string;
  askPrice?: string;
  openPrice?: string;
  highPrice?: string;
  lowPrice?: string;
  volume?: string;
  openTime?: number;
  closeTime?: number;
  firstId?: number;
  lastId?: number;
  count?: number;
}
