import { AdamitePlugin } from "../app";

class FunctionsPlugin extends AdamitePlugin {
  getPluginName(): string {
    return "functions";
  }

  async invoke<T = any>(functionName: string, args: any | undefined): Promise<T> {
    if (!this.client) return Promise.reject("Client is not connected");

    const returnValue = await this.client.invoke("invoke", {
      name: functionName,
      args
    });

    return returnValue as T;
  }
}

export default FunctionsPlugin;
