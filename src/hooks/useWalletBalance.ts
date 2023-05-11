import { useEffect, useState } from "react";
import { getConnectedChain, getRPCConnection } from "../utils/common";

const useWalletBalance = (
  address?: string,
  chainId?: string,
  coinType?: string
) => {
  const chainConnected = getConnectedChain(chainId);
  const [fetching, setFetching] = useState(false);
  const [totalBalance, setTotalBalance] = useState(BigInt(0));
  const [fetched, setFetched] = useState(false);

  const getWalletBalance = async (
    address: string,
    chainConnected: "DEVNET" | "TESTNET" | "MAINNET" | undefined,
    coinType?: string
  ) => {
    const provider = getRPCConnection(chainConnected);
    const object = await provider?.getBalance({
      owner: address,
      coinType: coinType,
    });
    return object;
  };

  const fetchBalance = async (address: string, coinType?: string) => {
    const b = (await getWalletBalance(
      address,
      chainConnected,
      coinType
    )) as any;
    setTotalBalance(b.totalBalance);
    setFetched(true);
    setTimeout(() => {
      setFetching(!fetching);
    }, 5000);
  };
  useEffect(() => {
    if (address) {
      fetchBalance(address, coinType);
    }
  }, [coinType, address, fetching]);
  return {
    totalBalance,
    fetched,
  };
};
export default useWalletBalance;
