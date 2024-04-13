import { Memento } from "vscode";
import { StatusBarIndicatorStatus } from "./status-bar";

export const keyValuePairSeparator = "==";

export class LocalStorageService {
  constructor(private storage: Memento, private workspaceID: string) {}

  public getValue<T>(key: string): T | null {
    return this.storage.get(
      this.workspaceID.concat(keyValuePairSeparator, key),
      StatusBarIndicatorStatus.IDLE
    ) as T;
  }

  public setValue<T extends StatusBarIndicatorStatus>(key: string, value: T) {
    this.storage.update(
      this.workspaceID.concat(keyValuePairSeparator, key),
      value
    );
  }

  public deleteValue(key: string) {
    this.storage.update(
      this.workspaceID.concat(keyValuePairSeparator, key),
      undefined
    );
  }

  public count(): number {
    return this.storage.keys.length;
  }

  populateFromJson(json: string) {
    const parsed = JSON.parse(json);

    for (const key in parsed) {
      this.setValue(key, parsed[key]);
    }
  }

  toJSON(): string {
    const keys = this.storage.keys();

    const obj: { [key: string]: StatusBarIndicatorStatus } = {};

    keys.forEach((key) => {
      const value = this.getValue<StatusBarIndicatorStatus>(key);
      if (value) {
        obj[key] = value;
      }
    });

    return JSON.stringify(obj);
  }
}
