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
  var currentDay = today.getDay();

  // Tính số ngày cần thêm để đến Chủ nhật kế tiếp
  var daysToAdd = 7 - currentDay + 1;

  // Đặt nextSunday thành ngày hiện tại + số ngày cần thêm
  nextSunday.setDate(today.getDate() + daysToAdd);

  // Đặt thời gian của nextSunday thành cuối ngày
  nextSunday.setHours(23, 59, 59, 999);

  return nextSunday;
}
