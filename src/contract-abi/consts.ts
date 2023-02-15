export const MARNUS_TOKEN_DECIMAL = 18;

export const getSignatureFromString = (signature: string) => {
  const singed = signature.substring(2);
  const r = "0x" + singed.substring(0, 64);
  const s = "0x" + singed.substring(64, 128);
  const v = parseInt(singed.substring(128, 130), 16);
  return { v, r, s };
};


export const formatLongString = (longString: string) => {
  return `${longString?.slice(0, 6)}...${longString?.slice(longString?.length - 4, longString?.length)}`
}