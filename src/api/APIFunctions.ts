import axios, { AxiosPromise } from "axios";
import { toast } from "react-toastify";
import LocalStorage, { LocalStorageKey } from "../utils/localStorage";

export enum FetchStatus {
  idle = "idle",
  pending = "pending",
  succeeded = "succeeded",
  failed = "failed",
}

// type AccessTokenType = string | null | undefined;

export class APIFunctions {
  public static post = <T = unknown>(
    ...args: Parameters<ReturnType<typeof createAxios>["post"]>
  ): AxiosPromise<T> => {
    return createAxios().post<T>(...args);
  };
  public static put = <T = unknown>(
    ...args: Parameters<ReturnType<typeof createAxios>["put"]>
  ): AxiosPromise<T> => {
    return createAxios().put(...args);
  };
  public static patch = <T = unknown>(
    ...args: Parameters<ReturnType<typeof createAxios>["patch"]>
  ): AxiosPromise<T> => {
    return createAxios().patch<T>(...args);
  };
  public static get = <T = unknown>(
    ...args: Parameters<ReturnType<typeof createAxios>["get"]>
  ): AxiosPromise<T> => {
    return createAxios().get(...args);
  };
  public static delete = <T = unknown>(
    ...args: Parameters<ReturnType<typeof createAxios>["delete"]>
  ): AxiosPromise<T> => {
    return createAxios().delete(...args);
  };
}

export enum ENV {
  DEVELOPMENT = "development",
  STAGING = "staging",
  PRODUCTION = "production",
}

const createAxios = () => {
  const accessToken = LocalStorage.get(LocalStorageKey.ACCESS_TOKEN);
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: "Bearer " + accessToken } : {}),
    },
    validateStatus: function (status) {
      if (status === 401) {
        LocalStorage.remove(LocalStorageKey.ACCESS_TOKEN);
        window.location.href = "/";
        toast.error("Token is expired. Login again!", {
          toastId: "token-expired",
        });
      } else if (status >= 400) {
        return false;
      }
      return true;
    },
  });
};
