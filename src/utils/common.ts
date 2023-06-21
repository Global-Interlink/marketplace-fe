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
      return undefined;
  }
};

export const getRPCConnection = (mode?: string) => {
  if (mode === "DEVNET") {
    return new JsonRpcProvider(devnetConnection);
  }
  if (mode === "TESTNET") {
    return new JsonRpcProvider(testnetConnection);
  }
  if (mode === "MAINNET" && process.env.NEXT_PUBLIC_SUI_NETWORK_RPC) {
    return new JsonRpcProvider(undefined, {
      rpcClient: new JsonRpcClient(process.env.NEXT_PUBLIC_SUI_NETWORK_RPC),
    });
  }
  return undefined;
};

export const getSupportEnv = () => {
  return process.env.NEXT_PUBLIC_RPC_CONNECTION || "TESTNET";
};

export function getNextSunday() {
  var today = new Date();
  var nextSunday = new Date();

  // Lấy ngày hiện tại
  var currentDay = today.getUTCDay();

  // Tính số ngày cần thêm để đến Chủ nhật kế tiếp
  var daysToAdd = 7 - currentDay;

  // Đặt nextSunday thành ngày hiện tại + số ngày cần thêm
  nextSunday.setUTCDate(today.getUTCDate() + daysToAdd);

  // Đặt thời gian của nextSunday thành 23:59:59
  nextSunday.setUTCHours(23, 59, 59, 0);

  return nextSunday;
}
