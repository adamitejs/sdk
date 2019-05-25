import querystring from "querystring";
import client from "@adamite/relay-client";
import App from "../app/App";
import { AdamitePlugin } from "../app";
import RelayClient from "@adamite/relay-client/dist/RelayClient";
import { FunctionInvocation } from "./FunctionsTypes";

class DatabasePlugin implements AdamitePlugin {
  public app: App;

  public client?: RelayClient;

  constructor(app: App) {
    this.app = app;
  }

  initialize(): void {
    this.client = client({
      service: "functions",
      url: this.app.config.functionsUrl,
      apiKey: this.app.config.apiKey,
      jwt: this.app.plugins["auth"] && this.app.auth().currentToken
    });

    if (this.app.plugins["auth"]) {
      this.app.auth().onAuthStateChange(authState => {
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

  getPluginName(): string {
    return "functions";
  }

  async invoke(functionName: string, args: any | undefined) {
    if (!this.client) return;

    const { returnValue } = (await this.client.invoke("invoke", {
      name: functionName,
      args
    })) as FunctionInvocation;

    return returnValue;
  }

  get url() {
    const qs = querystring.stringify({
      key: this.app.config.apiKey,
      ...(this.app.config.queryString || {})
    });

    return `${this.app.config.databaseUrl}?${qs}`;
  }
}

export default DatabasePlugin;
