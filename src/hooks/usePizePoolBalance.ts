import { useEffect, useState } from "react";
import {
  getConnectedChain,
  getRPCConnection,
  getSupportEnv,
} from "../utils/common";
import { SUI_TYPE_ARG } from "@mysten/sui.js";

const usePizePoolBalance = () => {
  const [fetching, setFetching] = useState(false);
  const [totalBalance, setTotalBalance] = useState(BigInt(0));
  const [fetched, setFetched] = useState(false);
  const targetEnv = getSupportEnv();
  const prizePoolAddress = process.env.NEXT_PUBLIC_POOL_REWARD_ADDRESS || "";

  const getWalletBalance = async () => {
    try {
      const provider = getRPCConnection(targetEnv);
      const object = await provider?.getBalance({
        owner: prizePoolAddress,
        coinType: SUI_TYPE_ARG,
      });
      return object;
    } catch (e) {}
  };

  const fetchBalance = async () => {
    const b = (await getWalletBalance()) as any;
    setTotalBalance(b?.totalBalance);
    setFetched(true);
    setTimeout(() => {
      setFetching(!fetching);
    }, 1000);
  };
  useEffect(() => {
    fetchBalance();
  }, [fetching]);
  return {
    totalBalance,
    fetched,
  };
};
export default usePizePoolBalance;
