import { Memento } from "vscode";
import { StatusBarIndicatorStatus } from "./status-bar";

export class LocalStorageService {
  constructor(private storage: Memento) {}

  public getValue<T>(key: string): T | null {
    return this.storage.get(key, StatusBarIndicatorStatus.IDLE) as T;
  }

  public setValue<T extends StatusBarIndicatorStatus>(key: string, value: T) {
    this.storage.update(key, value);
  }
}
