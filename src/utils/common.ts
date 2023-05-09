import {
  JsonRpcClient,
  JsonRpcProvider,
  devnetConnection,
  testnetConnection,
} from "@mysten/sui.js";

export const getRPCConnection = () => {
  const mode = process.env.NEXT_PUBLIC_RPC_CONNECTION;
  if (mode === "TESTNET") {
    return new JsonRpcProvider(testnetConnection);
  }
  if (mode === "MAINNET" && process.env.NEXT_PUBLIC_SUI_MAINNET_RPC) {
    return new JsonRpcProvider(undefined, {
      rpcClient: new JsonRpcClient(process.env.NEXT_PUBLIC_SUI_MAINNET_RPC),
    });
  }
  return new JsonRpcProvider(devnetConnection);
};
