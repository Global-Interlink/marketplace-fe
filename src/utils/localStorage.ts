export enum LocalStorageKey {
  ACCESS_TOKEN = "ACCESS_TOKEN",
}

export default class LocalStorage {
  public static get = (key: LocalStorageKey) => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(key);
    }
    return null;
  };
  public static set = (key: LocalStorageKey, value: string) => {
    if (typeof window !== "undefined") {
      return localStorage.setItem(key, value);
    }
  };
  public static remove = (key: LocalStorageKey) => {
    if (typeof window !== "undefined") {
      return localStorage.removeItem(key);
    }
  };
}
