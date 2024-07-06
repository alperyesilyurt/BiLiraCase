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
      const newAssets = await fetchAssets(page);
      setAssets((prevAssets) => [...prevAssets, ...newAssets]);
      setIsLoading(false);
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
    }
  }, []);

  const updateAssets = useCallback(async () => {
    try {
      const updatedAssets = await fetchAssets(0);
      setAssets((prevAssets) => {
        const updatedPrices: { [key: string]: number } = {};
        const newHighlights: { [key: string]: string } = {};

        updatedAssets.forEach((updatedAsset) => {
          const previousPrice =
            previousPrices[updatedAsset.symbol] ||
            parseFloat(updatedAsset.lastPrice);
          const currentPrice = parseFloat(updatedAsset.lastPrice);

          if (currentPrice > previousPrice) {
            newHighlights[updatedAsset.symbol] = "green";
          } else if (currentPrice < previousPrice) {
            newHighlights[updatedAsset.symbol] = "red";
          } else {
            newHighlights[updatedAsset.symbol] = "gray";
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
        }, 1000);

        return updatedAssets.slice(0, prevAssets.length);
      });
    } catch (error) {
      setIsError(true);
    }
  }, [previousPrices]);

  useEffect(() => {
    loadAssets(page);
  }, [page, loadAssets]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      updateAssets();
    }, 4000);

    return () => clearInterval(intervalId);
  }, [previousPrices, updateAssets]);

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

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Crypto
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Market Value
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              24h Change
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"></th>
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
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <div className="flex items-center">
                  <img src={btcLogo} alt="Logo" className="h-8 w-8 mr-2" />
                  <div>
                    <div className="text-gray-900 font-bold">
                      {asset.symbol.split("/")[0]}
                    </div>
                  </div>
                </div>
              </td>
              <td
                className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${
                  highlightedAssets[asset.symbol] === "green"
                    ? "text-green-600"
                    : highlightedAssets[asset.symbol] === "red"
                    ? "text-red-600"
                    : ""
                }`}
              >
                {parseFloat(asset.lastPrice).toFixed(2)} USDT
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatMarketValue(parseFloat(asset.quoteVolume))} USDT
              </td>
              <td
                className={`px-6 py-4 whitespace-nowrap text-sm ${
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
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <Sparkline data={asset.priceChanges || []} />
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
