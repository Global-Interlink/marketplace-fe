import { useEffect, useState } from "react";
import { getConnectedChain, getRPCConnection } from "../utils/common";

const useWalletBalance = (
  address?: string,
  chainId?: string,
  coinType?: string
) => {
  const [fetching, setFetching] = useState(false);
  const [totalBalance, setTotalBalance] = useState(BigInt(0));
  const [fetched, setFetched] = useState(false);
  const getWalletBalance = async (address: string, coinType?: string) => {
    try {
      const chainConnected = getConnectedChain(chainId);
      const provider = getRPCConnection(chainConnected);
      const object = await provider?.getBalance({
        owner: address,
        coinType: coinType,
      });
      return object;
    } catch (e) {}
  };

  const fetchBalance = async (address: string, coinType?: string) => {
    const b = (await getWalletBalance(address, coinType)) as any;
    setTotalBalance(b?.totalBalance);
    setFetched(true);
    setTimeout(() => {
      setFetching(!fetching);
    }, 1000);
  };
  useEffect(() => {
    if (address && chainId) {
      fetchBalance(address, coinType);
    }
  }, [coinType, address, fetching, chainId]);
  return {
    totalBalance,
    fetched,
  };
};
export default useWalletBalance;
