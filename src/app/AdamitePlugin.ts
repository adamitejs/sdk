import { App } from ".";

interface AdamitePlugin {
  getPluginName(): string;

  initialize(): void;

  disconnect(): void;
}

export default AdamitePlugin;
