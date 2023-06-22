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


export function getThisWeek() {
// Lấy ngày hiện tại
var today = new Date();

// Tính toán ngày đầu tiên của tuần hiện tại (tính từ thứ 2)
var startOfWeek = new Date(today.getTime() - today.getDay() * 24 * 60 * 60 * 1000);

// Tính toán ngày cuối cùng của tuần hiện tại (tính đến Chủ nhật)
var endOfWeek = new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000);

// Lấy thông tin ngày, tháng và năm của ngày bắt đầu và kết thúc
var startDate = startOfWeek.getUTCDate() + 1;
var startMonth = startOfWeek.getUTCMonth() + 1; // Tháng trong JavaScript được đếm từ 0

var endDate = endOfWeek.getUTCDate() + 1;
var endMonth = endOfWeek.getUTCMonth() + 1; // Tháng trong JavaScript được đếm từ 0

return `(${startDate}/${startMonth} - ${endDate}/${endMonth})`
}