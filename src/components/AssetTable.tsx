import { useEffect, useState, useRef, useCallback } from "react";
import fetchAssets from "../hooks/fetchAssets";
import { Asset } from "../types";
import { Sparkline } from "./Sparkline";
import Loading from "./Loading";
import ErrorComp from "./ErrorComp";
import btcLogo from "../assets/btc-logo.png";

import { FaArrowUp, FaArrowDown, FaMinus } from "react-icons/fa";

const AssetTable = () => {
  const [page, setPage] = useState(0);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [previousPrices, setPreviousPrices] = useState<{
    [key: string]: number;
  }>({});
  const [highlightedAssets, setHighlightedAssets] = useState<{
    [key: string]: string;
  }>({});
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const formatMarketValue = (value: number) => {
    if (value >= 1e9) {
      return `${(value / 1e9).toFixed(2)} B`;
    } else if (value >= 1e6) {
      return `${(value / 1e6).toFixed(2)} M`;
    } else {
      return value.toString();
    }
  };

  const loadAssets = useCallback(async (page: number) => {
 
    setIsLoading(true);
    try {
      const newAssets = await fetchAssets(page, false);
      setAssets((prevAssets) => {
        const updatedAssets = prevAssets.concat(
          newAssets.filter(
            (newAsset) =>
              !prevAssets.some((asset) => asset.symbol === newAsset.symbol)
          )
        );
        return updatedAssets;
      });
      setIsLoading(false);
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
    }
  }, []);

  const updateAssets = useCallback(async () => {
    try {
      const updatedAssets = await fetchAssets(0, true);
      setAssets((prevAssets) => {
        const updatedPrices: { [key: string]: number } = {};
        const newHighlights: { [key: string]: string } = {};

        updatedAssets.forEach((updatedAsset) => {
          const previousPrice =
            previousPrices[updatedAsset.symbol] ||
            parseFloat(updatedAsset.lastPrice);
          const currentPrice = parseFloat(updatedAsset.lastPrice);

          if (currentPrice > previousPrice) {
            newHighlights[updatedAsset.symbol] = "highlight-green";
          } else if (currentPrice < previousPrice) {
            newHighlights[updatedAsset.symbol] = "highlight-red";
          } else {
            newHighlights[updatedAsset.symbol] = "highlight-gray";
          }

          updatedPrices[updatedAsset.symbol] = currentPrice;
        });

        setPreviousPrices(updatedPrices);
        setHighlightedAssets(newHighlights);

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          setHighlightedAssets({});
        }, 5000);

        return prevAssets.map(
          (asset) =>
            updatedAssets.find(
              (updatedAsset) => updatedAsset.symbol === asset.symbol
            ) || asset
        );
      });
    } catch (error) {
      setIsError(true);
    }
  }, [previousPrices]);

  /*   const fetchLogoUrls = async (visibleAssets: Asset[]) => {
    try {
      const coinGeckoListResponse = await fetch('https://api.coingecko.com/api/v3/coins/list');
      const coinGeckoList = await coinGeckoListResponse.json();

      const updatedAssets = await Promise.all(visibleAssets.map(async (asset) => {
        const symbol = asset.symbol.substring(0, asset.symbol.length - 4).toLowerCase(); // 'BTCUSDT' -> 'btc'
        const coin = coinGeckoList.find((coin: any) => coin.symbol.toLowerCase() === symbol);
        if (coin) {
          const logoUrlResponse = await fetch(`https://api.coingecko.com/api/v3/coins/${coin.id}`);
          const logoUrlData = await logoUrlResponse.json();
          return {
            ...asset,
            logoUrl: logoUrlData.image.thumb
          };
        }
        return asset;
      }));

      setAssets((prevAssets) => {
        return prevAssets.map(asset => {
          const updatedAsset = updatedAssets.find(a => a.symbol === asset.symbol);
          return updatedAsset || asset;
        });
      });
    } catch (error) {
      console.error('Failed to fetch logo URLs', error);
    }
  }; */

  useEffect(() => {
    loadAssets(page);
  }, [page, loadAssets]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      updateAssets();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [previousPrices, updateAssets]);

  useEffect(() => {
    if (assets.length > 0) {
      const visibleAssets = assets.slice(page * 10, (page + 1) * 10);
      //fetchLogoUrls(visibleAssets);
    }
  }, [assets, page]);

  //console.log(page);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastAssetElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading]
  );

  if (isError) {
    return <ErrorComp />;
  }

  //console.log(assets);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 w-full">
        <thead className="bg-gray-50 table-header">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider table-cell">
              Crypto
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider table-cell">
              Price
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider table-cell">
              Market Value
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider table-cell">
              24h Change
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider table-cell">
              Price Change
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {assets.map((asset: Asset, index: number) => (
            <tr
              key={`${asset.symbol}-${index}`}
              className={
                highlightedAssets[asset.symbol]
                  ? `bg-${highlightedAssets[asset.symbol]}-100`
                  : ""
              }
              ref={index === assets.length - 1 ? lastAssetElementRef : null}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 table-cell text-left">
                <div className="flex items-center">
                  <img
                    src={asset.logoUrl || btcLogo}
                    alt={`${asset.symbol} logo`}
                    className="h-8 w-8 mr-2"
                  />
                  <div>
                    <div className="text-gray-900 font-bold">
                      {asset.symbol}
                    </div>
                  </div>
                </div>
              </td>
              <td
                className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 table-cell text-right ${
                  highlightedAssets[asset.symbol] === "highlight-green"
                    ? "text-green-600 highlight-green"
                    : highlightedAssets[asset.symbol] === "highlight-red"
                    ? "text-red-600 highlight-red"
                    : highlightedAssets[asset.symbol] === "highlight-gray"
                    ? "text-gray-600 highlight-gray"
                    : ""
                }`}
              >
                {parseFloat(asset.lastPrice).toFixed(2)} USDT
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 table-cell text-right">
                {formatMarketValue(parseFloat(asset.quoteVolume))} USDT
              </td>
              <td
                className={`px-6 py-4 whitespace-nowrap text-sm table-cell text-right ${
                  parseFloat(asset.priceChangePercent) > 0
                    ? "text-green-600"
                    : parseFloat(asset.priceChangePercent) < 0
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {parseFloat(asset.priceChangePercent).toFixed(2)}%
                {parseFloat(asset.priceChangePercent) > 0 ? (
                  <FaArrowUp className="inline ml-1 text-green-600" />
                ) : parseFloat(asset.priceChangePercent) < 0 ? (
                  <FaArrowDown className="inline ml-1 text-red-600" />
                ) : (
                  <FaMinus className="inline ml-1 text-gray-600" />
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm table-cell text-right">
                <div className="flex justify-end">
                  <Sparkline data={asset.priceChanges || []} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isLoading && <Loading />}
    </div>
  );
};

export default AssetTable;
