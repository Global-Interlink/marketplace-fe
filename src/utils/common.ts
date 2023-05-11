import {
  JsonRpcClient,
  JsonRpcProvider,
  devnetConnection,
  testnetConnection,
} from "@mysten/sui.js";

export const getConnectedChain = (
  chain?: "sui:devnet" | "sui:testnet" | string
) => {
  switch (chain) {
    case "sui:devnet":
      return "DEVNET";
    case "sui:testnet":
      return "TESTNET";
    case "sui:mainnet":
      return "MAINNET";
    default:
      return "DEVNET";
  }
};

export const getRPCConnection = (mode: string) => {
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
