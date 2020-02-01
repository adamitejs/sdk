import querystring from "querystring";
import App from "../app/App";
import { AdamitePlugin } from "../app";
import RelayClient from "@adamite/relay-client";
import { FunctionInvocation } from "./FunctionsTypes";

class FunctionsPlugin implements AdamitePlugin {
  public app: App;

  public client?: RelayClient;

  private unsubscribeFromAuthStateChanges?: any;

  constructor(app: App) {
    this.app = app;
  }

  initialize(): void {
    this.client = new RelayClient({
      service: "functions",
      url: this.app.getServiceUrl("functions"),
      apiKey: this.app.config.apiKey,
      jwt: this.app.plugins["auth"] && this.app.auth().currentToken,
      secret: this.app.config.secret
    });

    if (this.app.plugins["auth"]) {
      this.unsubscribeFromAuthStateChanges = this.app.auth().onAuthStateChange(authState => {
        if (!this.client) return;

        if (authState) {
          this.client.updateJwt(authState.token);
        } else {
          this.client.updateJwt(undefined);
        }
      });
    }

    this.client.on("connect", () => {
      this.app.log("functions", "connected");
    });

    this.client.on("disconnect", (r: any) => {
      this.app.log("functions", "disconnected");
      console.log(r);
    });

    this.client.on("error", (r: any) => {
      this.app.log("functions", "error");
      console.log(r);
    });
  }

  disconnect() {
    if (this.unsubscribeFromAuthStateChanges) {
      this.unsubscribeFromAuthStateChanges();
    }

    if (this.client) {
      this.client.disconnect();
    }
  }

  getPluginName(): string {
    return "functions";
  }

  async invoke(functionName: string, args: any | undefined) {
    if (!this.client) return;

    const invocation = (await this.client.invoke("invoke", {
      name: functionName,
      args
    })) as FunctionInvocation;

    return invocation?.returnValue;
  }
}

export default FunctionsPlugin;
