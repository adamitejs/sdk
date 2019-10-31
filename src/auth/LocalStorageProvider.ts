import StorageProvider from "./StorageProvider";

class LocalStorageProvider implements StorageProvider {
  async getToken(appName: string): Promise<string | null> {
    if (typeof window === "undefined" || !window.localStorage) return null;

    const tokenKey = `adamite:auth:${appName}.token`;
    const localStorageToken = window.localStorage.getItem(tokenKey);

    return localStorageToken;
  }

  async saveToken(appName: string, token: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async clearToken(appName: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

export default LocalStorageProvider;
