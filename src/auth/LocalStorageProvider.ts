import StorageProvider from "./StorageProvider";

class LocalStorageProvider implements StorageProvider {
  async getToken(appName: string): Promise<string | null> {
    if (typeof window === "undefined" || !window.localStorage) return null;

    const tokenKey = `adamite:auth:${appName}.token`;
    const localStorageToken = window.localStorage.getItem(tokenKey);

    return localStorageToken;
  }

  async saveToken(appName: string, token: string): Promise<void> {
    if (typeof window === "undefined" || !window.localStorage) return;

    const tokenKey = `adamite:auth:${appName}.token`;
    window.localStorage.setItem(tokenKey, token);
  }

  async clearToken(appName: string): Promise<void> {
    if (typeof window === "undefined" || !window.localStorage) return;

    const tokenKey = `adamite:auth:${appName}.token`;
    window.localStorage.removeItem(tokenKey);
  }
}

export default LocalStorageProvider;
