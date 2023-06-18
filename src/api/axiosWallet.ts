import axios from "axios";

export const createAxios = (accessToken?: string) => {
  return axios.create({
    baseURL: `http://210.245.74.41:3030/main/v1`,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: "Bearer " + accessToken } : {}),
    },
  });
};
