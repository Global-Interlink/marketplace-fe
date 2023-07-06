import axios from "axios";

export const createAxios = (accessToken?: string) => {
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_WALLET_API_ENDPOINT,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: "Bearer " + accessToken } : {}),
    },
  });
};

export const createAxiosCoinGecko = () => {
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_COINGECKO,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
