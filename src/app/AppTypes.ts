import App from "./App";

export type PluginInitializer = (app: App) => any;

export type FullAdamiteConfig = {
  apiKey: string;
  secret?: string;
  url?: string;
  serviceUrls: { [serviceName: string]: string };
  logLevel: number;
  queryString?: { [key: string]: string };
};

export type AdamiteConfig = {
  apiKey: string;
  secret?: string;
  url?: string;
  serviceUrls: { [serviceName: string]: string };
  logLevel: number;
  queryString?: { [key: string]: string };
};
