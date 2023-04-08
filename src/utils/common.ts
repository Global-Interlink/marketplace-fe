import { JsonRpcClient, JsonRpcProvider, devnetConnection } from "@mysten/sui.js";

export const getRPCConnection = () => {
  const mode = process.env.NEXT_PUBLIC_RPC_CONNECTION;
  if (mode === "TESTNET") {
    return new JsonRpcProvider(undefined, {
      rpcClient: new JsonRpcClient("https://sui-fullnode-testnet.gil.eco/"),
    });
  }
  if (mode === "MAINNET") {
    return new JsonRpcProvider(devnetConnection); // temp
  }
  return new JsonRpcProvider(devnetConnection);
};
