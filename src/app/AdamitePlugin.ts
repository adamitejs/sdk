import { App } from ".";
import RelayClient from "@adamite/relay-client";
import { EventEmitter } from "eventemitter3";

abstract class AdamitePlugin extends EventEmitter {
  public app: App;

  public client?: RelayClient;

  private unsubscribeFromAuthStateChanges?: any;

  constructor(app: App) {
    super();
    this.app = app;
  }

  abstract getPluginName(): string;

  initialize(): void {
    this.client = new RelayClient({
      service: this.getPluginName(),
      url: this.app.getServiceUrl(this.getPluginName()),
      apiKey: this.app.config.apiKey,
      jwt: this.app.plugins["auth"] && this.app.auth().currentToken,
      secret: this.app.config.secret
    });

    this.client.on("connect", () => {
      this.updateJwt();
      this.app.log(this.getPluginName(), "connected");
    });

    this.client.on("disconnect", (r: any) => {
      if (this.unsubscribeFromAuthStateChanges) {
        this.unsubscribeFromAuthStateChanges();
      }

      this.app.log(this.getPluginName(), "disconnected");
      console.log(r);
    });

    this.client.on("error", (r: any) => {
      if (this.unsubscribeFromAuthStateChanges) {
        this.unsubscribeFromAuthStateChanges();
      }

      this.app.log(this.getPluginName(), "error");
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

  private updateJwt() {
    if (this.app.plugins["auth"]) {
      console.log(this.getPluginName() + " update JWT");

      this.unsubscribeFromAuthStateChanges = this.app.auth().onAuthStateChange(authState => {
        if (!this.client) return;

        if (authState) {
          this.client.updateJwt(authState.token);
        } else {
          this.client.updateJwt(undefined);
        }
      });
    }
  }
}

export default AdamitePlugin;
