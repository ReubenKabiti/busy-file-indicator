import * as vscode from "vscode";

export enum StatusBarIndicatorStatus {
  BUSY = "BUSY",
  IDLE = "IDLE"
}

export function showStatusBarIndicator(
  myStatusBarItem: vscode.StatusBarItem,
  status: StatusBarIndicatorStatus,
  command: vscode.Command
) {
  if (status === StatusBarIndicatorStatus.BUSY) {
    myStatusBarItem.text = "Busy indicator: Busy 🚀";
    myStatusBarItem.color = "white";
    myStatusBarItem.backgroundColor = new vscode.ThemeColor(
      "statusBarItem.errorBackground"
    );
    myStatusBarItem.command = command;
  } else {
    myStatusBarItem.text = "Busy indicator: Idle 💤";
    myStatusBarItem.color = "white";
    myStatusBarItem.backgroundColor = new vscode.ThemeColor(
      "statusBarItem.warningBackground"
    );
    myStatusBarItem.command = command;
  }
  myStatusBarItem.show();
}