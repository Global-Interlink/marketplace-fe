export const MARNUS_TOKEN_DECIMAL = 18;

export const getSignatureFromString = (signature: string) => {
  const singed = signature.substring(2);
  const r = "0x" + singed.substring(0, 64);
  const s = "0x" + singed.substring(64, 128);
  const v = parseInt(singed.substring(128, 130), 16);
  return { v, r, s };
};

export const formatLongString = (longString: string) => {
  return `${longString?.slice(0, 6)}...${longString?.slice(
    longString?.length - 6,
    longString?.length
  )}`;
};

export function toFixed(num: any, fixed: any) {
  var re = new RegExp("^-?\\d+(?:.\\d{0," + (fixed || -1) + "})?");
  return num.toString().match(re)[0];
}

export const formatAddress = (longString: string) => {
  return `${longString?.slice(0, 20)}...${longString?.slice(
    longString?.length - 20,
    longString?.length
  )}`;
};

export const formatRewardAddress = (longString: string) => {
  return `${longString?.slice(0, 6)}...${longString?.slice(
    longString?.length - 6,
    longString?.length
  )}`;
};
export const formatLeaderBoardAddress = (longString: string) => {
  return `${longString?.slice(0, 6)}...${longString?.slice(
    longString?.length - 6,
    longString?.length
  )}`;
};

export const formatUserLeaderBoarddAddress = (longString: string) => {
  return `${longString?.slice(0, 4)}...${longString?.slice(
    longString?.length - 3,
    longString?.length
  )}`;
};
