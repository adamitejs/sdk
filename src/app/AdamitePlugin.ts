import { App } from ".";

interface AdamitePlugin {
  getPluginName(): string;

  initialize(): void;
}

export default AdamitePlugin;
