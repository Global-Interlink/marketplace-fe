import axios from "axios";

export const createAxios = (accessToken?: string) => {
  return axios.create({
    baseURL: `https://dev-wallet.sakaya.market/main/v1`,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: "Bearer " + accessToken } : {}),
    },
  });
};
