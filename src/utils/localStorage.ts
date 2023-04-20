export enum LocalStorageKey {
  ACCESS_TOKEN = "ACCESS_TOKEN",
  CURRENT_ADDRESS = "CURRENT_ADDRESS",
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

export const getUnique = (arr: any, comp: any) => {
  const unique = arr
    .map((e: any) => e[comp])

    // store the keys of the unique objects
    .map((e: any, i: any, final: any) => final.indexOf(e) === i && i)

    // eliminate the dead keys & store unique objects
    .filter((e: any) => arr[e])
    .map((e: any) => arr[e])

  return unique
}
