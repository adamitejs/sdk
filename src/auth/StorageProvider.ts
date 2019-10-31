interface StorageProvider {
  getToken(appName: string): Promise<string | null>;
  saveToken(appName: string, token: string): Promise<void>;
  clearToken(appName: string): Promise<void>;
}

export default StorageProvider;
